"""Fetches GitHub profile/repo stats and streak data, writing public/github-stats.json.

Run by .github/workflows/update-github-stats.yml (daily cron + manual dispatch).

Streak stats are computed by reading GitHub's public contribution calendar page
(github.com/users/<user>/contributions) rather than the GraphQL
contributionsCollection API. GraphQL only reports contributions visible to the
requesting token — for accounts used with an organization that restricts
third-party API access, that silently excludes org activity even for the
user's own token. The public profile page isn't subject to that restriction
and shows the same accurate, anonymized total (commit/PR/issue counts merged,
no repo names) that GitHub itself displays to visitors, provided the user has
"Include private contributions" enabled. This also avoids the flaky
third-party streak-stats.demolab.com service that broke the previous badge.
"""

import json
import os
import re
import urllib.request
from datetime import datetime, timedelta, timezone

USERNAME = 'Waleed2660'
PINNED_REPOS = ['springboot-learning-kit']


def get_json(url, headers):
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read())


def fetch_contribution_page(to_date=None):
    url = f'https://github.com/users/{USERNAME}/contributions'
    if to_date:
        url += f'?to={to_date}'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=20) as r:
        return r.read().decode('utf-8')


def parse_contribution_page(html):
    td_pattern = re.compile(r'<td[^>]*data-date="([0-9-]+)"[^>]*id="([a-zA-Z0-9-]+)"')
    tip_pattern = re.compile(r'for="([a-zA-Z0-9-]+)"[^>]*>([^<]*)</tool-tip>')
    id_to_date = {m.group(2): m.group(1) for m in td_pattern.finditer(html)}
    id_to_text = {m.group(1): m.group(2) for m in tip_pattern.finditer(html)}
    by_date = {}
    for _id, date in id_to_date.items():
        text = id_to_text.get(_id, '')
        m = re.match(r'(\d+) contributions?', text)
        by_date[date] = int(m.group(1)) if m else 0
    return by_date


def fetch_all_contribution_days(created_at):
    """Walks backwards window by window (each ~371 days) until before the
    account's creation date, merging all days by date."""
    created = datetime.strptime(created_at, '%Y-%m-%dT%H:%M:%SZ').replace(tzinfo=timezone.utc)
    now = datetime.now(timezone.utc)

    all_days = {}
    cursor = now
    first = True
    while True:
        html = fetch_contribution_page(None if first else cursor.strftime('%Y-%m-%d'))
        first = False
        days = parse_contribution_page(html)
        all_days.update(days)
        dates = sorted(days.keys())
        if not dates:
            break
        earliest = datetime.strptime(dates[0], '%Y-%m-%d').replace(tzinfo=timezone.utc)
        if earliest <= created:
            break
        cursor = earliest - timedelta(days=1)

    return all_days, created, now


def compute_streaks(all_days, now):
    sorted_dates = sorted(all_days.keys())

    longest = 0
    longest_start = longest_end = None
    current_run = 0
    run_start = None
    for date in sorted_dates:
        if all_days[date] > 0:
            if current_run == 0:
                run_start = date
            current_run += 1
            if current_run > longest:
                longest = current_run
                longest_start, longest_end = run_start, date
        else:
            current_run = 0

    # Current streak: walk backwards from the most recent day with data.
    # Today may have 0 contributions yet without breaking the streak, so
    # skip a trailing zero for "today" only.
    current_streak = 0
    current_start = current_end = None
    today_str = now.strftime('%Y-%m-%d')
    for date in reversed(sorted_dates):
        count = all_days[date]
        if count > 0:
            current_streak += 1
            if current_end is None:
                current_end = date
            current_start = date
        elif date == today_str:
            continue
        else:
            break

    return {
        'longest': longest,
        'longest_start': longest_start,
        'longest_end': longest_end,
        'current': current_streak,
        'current_start': current_start,
        'current_end': current_end,
    }


def compute_streak_stats(user):
    try:
        created_at = user.get('created_at', '2017-01-01T00:00:00Z')
        all_days, created, now = fetch_all_contribution_days(created_at)
        result = compute_streaks(all_days, now)
        return {
            'totalContributions': sum(all_days.values()),
            'since': created.strftime('%Y-%m-%d'),
            'currentStreak': result['current'],
            'currentStreakStart': result['current_start'],
            'currentStreakEnd': result['current_end'],
            'longestStreak': result['longest'],
            'longestStreakStart': result['longest_start'],
            'longestStreakEnd': result['longest_end'],
        }
    except Exception as e:
        print('Failed to compute streak stats:', e)
        return {'totalContributions': 0, 'currentStreak': 0, 'longestStreak': 0}


def compute_repo_stats(own_repos):
    stars = sum(r.get('stargazers_count', 0) for r in own_repos)

    lang_count = {}
    for r in own_repos:
        lang = r.get('language')
        if lang:
            lang_count[lang] = lang_count.get(lang, 0) + 1

    total = sum(lang_count.values()) or 1
    sorted_langs = sorted(lang_count.items(), key=lambda x: -x[1])[:5]
    languages = [
        {'name': l, 'percentage': round(c / total * 100)}
        for l, c in sorted_langs
    ]

    repo_stats = {
        r['name']: {'stars': r.get('stargazers_count', 0), 'forks': r.get('forks_count', 0)}
        for r in own_repos if r['name'] in PINNED_REPOS
    }

    return stars, languages, repo_stats


def main():
    token = os.environ['GH_TOKEN']
    headers = {'Authorization': f'token {token}', 'User-Agent': 'github-actions'}

    user = get_json(f'https://api.github.com/users/{USERNAME}', headers)
    repos = get_json(f'https://api.github.com/users/{USERNAME}/repos?per_page=100&sort=updated', headers)
    own_repos = [r for r in repos if not r.get('fork')]

    stars, languages, repo_stats = compute_repo_stats(own_repos)
    streak = compute_streak_stats(user)

    output = {
        'followers': user['followers'],
        'public_repos': user['public_repos'],
        'stars': stars,
        'repos': repo_stats,
        'languages': languages,
        'streak': streak,
    }

    with open('public/github-stats.json', 'w') as f:
        json.dump(output, f, indent=2)

    print('Written:', json.dumps(output, indent=2))


if __name__ == '__main__':
    main()
