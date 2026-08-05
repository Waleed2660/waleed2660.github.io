import { ExternalLink, ArrowRight, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Education {
  degree: string;
  institution: string;
  location: string;
  logo?: string;
  period: string;
  grade: string;
  modules: string[];
}

const educationHistory: Education[] = [
  {
    degree: "BSc (Hons) Computer Science",
    institution: "Lancaster University",
    location: "Lancaster, UK",
    logo: "/work_exp/lancaster-uni.webp",
    period: "Sep 2019 to Jun 2022",
    grade: "2:1",
    modules: [
      "Distributed auctioning system (Java RMI, active replication for reliability & availability)",
      "Led a team building an OpenGL-based 2D platform fighter game using SFML in Java",
      "Dissertation: ML model processing drone & satellite imagery to detect littering across the UK",
    ],
  },
  {
    degree: "Foundation Year in Computer Science",
    institution: "University of Manchester",
    location: "Manchester, UK",
    logo: "/work_exp/uom_logo.png",
    period: "Sep 2018 to Jun 2019",
    grade: "1st Class",
    modules: ["Mathematics with Mechanics", "Chemistry", "Physics", "Foundation Year Project"],
  },
];

const ResearchSection = () => {
  const navigate = useNavigate();

  return (
    <section className="flex items-center justify-center px-6 py-24 relative z-20">
      <div className="max-w-6xl w-full">
        <h2 className="text-4xl md:text-6xl font-bold text-center mb-4 text-glow relative">
          Research & Academia
        </h2>
        <p className="text-center text-slate-500 dark:text-white/50 mb-8 text-lg">
          Exploring the intersection of AI, computer vision, and real-world problems
        </p>

        {/* Education strip */}
        <div className="glass-strong rounded-2xl p-6 mb-8 border border-slate-200 dark:border-white/10 divide-y divide-slate-200 dark:divide-white/10">
          {educationHistory.map((edu, i) => (
            <div
              key={i}
              className={`${i > 0 ? 'pt-4 mt-4' : ''}`}
            >
              <div className="flex flex-wrap items-center gap-6">
                {edu.logo ? (
                  <img
                    src={edu.logo}
                    alt={`${edu.institution} logo`}
                    width="56"
                    height="56"
                    loading="lazy"
                    className="w-14 h-14 object-contain flex-shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center glass rounded-xl">
                    <GraduationCap className="w-7 h-7 text-slate-500 dark:text-white/50" />
                  </div>
                )}
                <div className="flex-1 min-w-[200px]">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {edu.degree}
                  </h3>
                  <p className="text-slate-500 dark:text-white/50 text-sm">{edu.institution}, {edu.location}</p>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <span className="text-slate-400 dark:text-white/40 text-sm font-medium whitespace-nowrap tabular-nums">
                    {edu.period}
                  </span>
                  <span className="text-slate-400 dark:text-white/30 text-xs whitespace-nowrap">
                    {edu.grade}
                  </span>
                </div>
              </div>

              {/* Relevant coursework / modules */}
              <div className="mt-3 pl-0 sm:pl-[80px]">
                <p className="text-slate-500 dark:text-white/40 text-xs uppercase tracking-widest font-semibold mb-2">
                  Relevant Coursework
                </p>
                {edu.modules.every((m) => m.length < 40) ? (
                  <div className="flex flex-wrap gap-2">
                    {edu.modules.map((mod, j) => (
                      <span
                        key={j}
                        className="glass rounded-lg px-3 py-1 text-slate-600 dark:text-white/70 text-xs"
                      >
                        {mod}
                      </span>
                    ))}
                  </div>
                ) : (
                  <ul className="space-y-1.5">
                    {edu.modules.map((mod, j) => (
                      <li key={j} className="flex items-start gap-2 text-slate-600 dark:text-white/70 text-sm leading-relaxed">
                        <span className="text-slate-400 dark:text-white/30 mt-1">•</span>
                        <span>{mod}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="glass-strong rounded-3xl overflow-hidden transition-all duration-500">
          <div
            className="bg-gradient-to-r from-blue-500/20 to-purple-500/10 px-8 py-5 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-white/5 cursor-pointer hover:bg-slate-900/[0.03] dark:hover:bg-white/5 transition-colors duration-300 group"
            onClick={() => navigate('/dissertation')}
          >
            <div className="flex items-center gap-4">
              <div className="glass rounded-2xl p-3">
                <span className="text-3xl">🎓</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                  BSc Dissertation Project
                </h3>
                <p className="text-slate-500 dark:text-white/50 text-sm mt-0.5 italic">
                  Lancaster University • Computer Science • 2022
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-300">
              <span>Read More</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div className="p-8 grid lg:grid-cols-2 gap-8">
            {/* Left: Content */}
            <div className="flex flex-col gap-6">
              <div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  Detecting Landfill Sites through YOLOv3
                </h4>
                <p className="text-slate-500 dark:text-white/50 text-sm mb-2 italic">
                  Using Satellite Imagery and Deep Learning
                </p>
                <p className="text-slate-600 dark:text-white/70 leading-relaxed text-sm">
                  Built a machine learning model using YOLOv3 and Darknet-53 to automatically detect illegal
                  landfill sites from satellite imagery. The project addressed a real-world problem where
                  environmental agencies struggle to monitor waste crime, which cost the UK £924 million in
                  damages between 2018-2019.
                </p>
              </div>

              <div>
                <h5 className="text-slate-500 dark:text-white/60 text-xs uppercase tracking-widest font-semibold mb-3">
                  Key Achievements
                </h5>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-white/70">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 dark:text-green-400 mt-0.5">✓</span>
                    <span>Achieved 76% precision on training data with 0.91 mAP score</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 dark:text-green-400 mt-0.5">✓</span>
                    <span>Collected and annotated high-resolution satellite imagery from 9 countries</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 dark:text-green-400 mt-0.5">✓</span>
                    <span>Implemented transfer learning with 106-layer convolutional neural network</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 dark:text-green-400 mt-0.5">✓</span>
                    <span>Multi-scale detection at three different resolutions for varying object sizes</span>
                  </li>
                </ul>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {['YOLOv3', 'Darknet', 'Computer Vision', 'CNN', 'Object Detection', 'Python', 'CUDA', 'Machine Learning'].map((tag) => (
                  <span key={tag} className="glass rounded-xl px-3 py-1 text-slate-700 dark:text-white/80 text-xs">
                    {tag}
                  </span>
                ))}
              </div>

              {/* View Full Paper button — left column */}
              <button
                onClick={() => navigate('/dissertation')}
                className="flex items-center justify-center gap-2 glass rounded-xl px-6 py-3 text-slate-700 dark:text-white/80 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-slate-900/5 dark:hover:bg-white/10 transition-all group/btn mt-auto"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View Full Research Paper</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Right: Image + Research Impact */}
            <div className="flex flex-col gap-4">
              <div className="glass rounded-2xl overflow-hidden">
                <img
                  src="/dissertation/drone_landfill_site.webp"
                  alt="Drone with mounted camera performing object detection over a landfill site"
                  width="1408"
                  height="768"
                  className="w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="glass rounded-2xl p-6 flex flex-col justify-center">
                <h5 className="text-slate-500 dark:text-white/60 text-xs uppercase tracking-widest font-semibold mb-4">
                  Research Impact
                </h5>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="glass rounded-lg p-2 mt-1">
                      <span className="text-xl">🌍</span>
                    </div>
                    <div>
                      <p className="text-slate-900 dark:text-white font-semibold mb-1">Environmental Protection</p>
                      <p className="text-slate-500 dark:text-white/60 text-xs">
                        Automated detection helps environmental agencies track illegal waste dumping,
                        reducing environmental damage and cleanup costs
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="glass rounded-lg p-2 mt-1">
                      <span className="text-xl">⚡</span>
                    </div>
                    <div>
                      <p className="text-slate-900 dark:text-white font-semibold mb-1">Real-Time Processing</p>
                      <p className="text-slate-500 dark:text-white/60 text-xs">
                        YOLOv3's single-pass detection makes it feasible to monitor large geographic
                        areas efficiently using satellite data
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="glass rounded-lg p-2 mt-1">
                      <span className="text-xl">🎯</span>
                    </div>
                    <div>
                      <p className="text-slate-900 dark:text-white font-semibold mb-1">High Accuracy</p>
                      <p className="text-slate-500 dark:text-white/60 text-xs">
                        Demonstrated strong performance with 1,638 true positive detections and
                        effective handling of varied terrain and lighting conditions
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResearchSection;
