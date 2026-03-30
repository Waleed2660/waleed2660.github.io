import { ExternalLink, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ResearchSection = () => {
  const navigate = useNavigate();

  return (
    <section className="flex items-center justify-center px-6 py-24 relative z-20">
      <div className="max-w-6xl w-full">
        <h2 className="text-4xl md:text-6xl font-bold text-center mb-4 text-glow relative">
          Research & Academia
        </h2>
        <p className="text-center text-white/50 mb-16 text-lg">
          Exploring the intersection of AI, computer vision, and real-world problems
        </p>

        <div 
          className="glass-strong rounded-3xl overflow-hidden hover:bg-white/10 hover:scale-[1.02] transition-all duration-500 group cursor-pointer"
          onClick={() => navigate("/dissertation")}
        >
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/10 px-8 py-5 flex flex-wrap items-center justify-between gap-4 border-b border-white/5">
            <div className="flex items-center gap-4">
              <div className="glass rounded-2xl p-3">
                <span className="text-3xl">🎓</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white group-hover:text-blue-300 transition-colors">
                  BSc Dissertation Project
                </h3>
                <p className="text-white/50 text-sm mt-0.5 italic">
                  Lancaster University • Computer Science • 2022
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-blue-300">
              <span>Read More</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div className="p-8 grid lg:grid-cols-2 gap-8">
            {/* Left: Content */}
            <div className="flex flex-col gap-6">
              <div>
                <h4 className="text-xl font-bold text-white mb-3">
                  Detecting Landfill Sites through YOLOv3
                </h4>
                <p className="text-white/50 text-sm mb-2 italic">
                  Using Satellite Imagery and Deep Learning
                </p>
                <p className="text-white/70 leading-relaxed text-sm">
                  Built a machine learning model using YOLOv3 and Darknet-53 to automatically detect illegal 
                  landfill sites from satellite imagery. The project addressed a real-world problem where 
                  environmental agencies struggle to monitor waste crime, which cost the UK £924 million in 
                  damages between 2018-2019.
                </p>
              </div>

              <div>
                <h5 className="text-white/60 text-xs uppercase tracking-widest font-semibold mb-3">
                  Key Achievements
                </h5>
                <ul className="space-y-2 text-sm text-white/70">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>Achieved 76% precision on training data with 0.91 mAP score</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>Collected and annotated high-resolution satellite imagery from 9 countries</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>Implemented transfer learning with 106-layer convolutional neural network</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>Multi-scale detection at three different resolutions for varying object sizes</span>
                  </li>
                </ul>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {["YOLOv3", "Darknet", "Computer Vision", "CNN", "Object Detection", "Python", "CUDA", "Machine Learning"].map((tag) => (
                  <span key={tag} className="glass rounded-xl px-3 py-1 text-white/80 text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Visual highlight */}
            <div className="flex flex-col gap-4">
              <div className="glass rounded-2xl p-6 h-full flex flex-col justify-center">
                <h5 className="text-white/60 text-xs uppercase tracking-widest font-semibold mb-4">
                  Research Impact
                </h5>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="glass rounded-lg p-2 mt-1">
                      <span className="text-xl">🌍</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold mb-1">Environmental Protection</p>
                      <p className="text-white/60 text-xs">
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
                      <p className="text-white font-semibold mb-1">Real-Time Processing</p>
                      <p className="text-white/60 text-xs">
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
                      <p className="text-white font-semibold mb-1">High Accuracy</p>
                      <p className="text-white/60 text-xs">
                        Demonstrated strong performance with 1,638 true positive detections and 
                        effective handling of varied terrain and lighting conditions
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/dissertation");
                }}
                className="flex items-center justify-center gap-2 glass rounded-xl px-6 py-3 text-white/80 hover:text-blue-300 hover:bg-white/10 transition-all group/btn"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View Full Research Paper</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResearchSection;
