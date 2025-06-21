
# Modern Portfolio Website

A responsive and modern portfolio website built with React and TypeScript, featuring a sleek glass-morphism design, animated UI components, and sections for showcasing projects, experience, and skills.

## Features

- 🎨 Modern glass-morphism design with animated elements
- 📱 Fully responsive layout
- 🚀 Optimized performance with Vite
- 💅 Styled with Tailwind CSS and shadcn/ui components
- 🎭 Custom animations and transitions
- 📂 Project showcase 
- 💼 Work experience timeline
- 🛠 Tech stack display
- 📞 Contact section with social links

## Getting Started

### Prerequisites

- Node.js v18+ - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Git

### Local Development

1. Clone the repository:
```sh
git clone https://github.com/Waleed2660/waleed2660.github.io.git
cd waleed2660.github.io
```

2. Install dependencies:
```sh
npm install
```

3. Start the development server:
```sh
npm run dev
```

The site will be available at `http://localhost:5173`

### Building for Production

To create an optimized production build:

```sh
npm run build
```

The build output will be in the `dist` directory.

### Deploying to GitHub Pages

1. Update the `base` property in `vite.config.ts` to match your repository name:
```ts
base: '/waleed2660.github.io/'
```

2. Build and deploy:
```sh
# Build the site
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## Technologies Used

- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** 
  - Tailwind CSS for utility classes
  - shadcn/ui for pre-built components
- **Animations:** Custom CSS animations and transitions
- **Deployment:** GitHub Pages

## Project Structure

- `/src/components/` - React components including sections
- `/src/components/ui/` - Reusable UI components from shadcn/ui
- `/public/` - Static assets like images and icons
- `/src/pages/` - Page components
- `/src/hooks/` - Custom React hooks
