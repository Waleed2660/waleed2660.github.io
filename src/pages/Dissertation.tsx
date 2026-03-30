import { ArrowLeft, ExternalLink, Calendar, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";

const Dissertation = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  // Memoize particles to prevent recreation on every render
  const particles = useMemo(() => 
    Array.from({ length: 10 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: `${15 + Math.random() * 10}s`,
      delay: `-${Math.random() * 20}s`,
    })), []
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    // Trigger fade-in animation after a brief delay
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-slate-900/20 pointer-events-none" />

      {/* Floating particles effect - only render when visible */}
      {isVisible && (
        <div className="fixed inset-0 pointer-events-none opacity-30">
          {particles.map((s) => (
            <div
              key={s.id}
              className="absolute w-1 h-1 bg-white rounded-full will-change-transform"
              style={{
                left: s.left,
                top: s.top,
                animation: `twinkle ${s.duration} ease-in-out infinite ${s.delay}`,
            }}
          />
        ))}
        </div>
      )}

      <div className={`relative z-10 max-w-5xl mx-auto px-6 py-12 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        {/* Back button */}
        <button
          onClick={() => {
            // Use browser back if possible, otherwise go to research section
            if (window.history.length > 1) {
              window.history.back();
            } else {
              navigate("/#research");
            }
          }}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        {/* Header */}
        <div className="glass-strong rounded-3xl p-8 md:p-12 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="glass rounded-2xl p-4">
              <span className="text-4xl">🎓</span>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 text-glow">
                Detecting Landfill Sites through YOLOv3
              </h1>
              <p className="text-xl text-white/70 mb-4">
                Using Satellite Imagery and Deep Learning for Environmental Protection
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-white/50">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  March 2022
                </span>
                <span className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  BSc (Hons) Computer Science
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {["YOLOv3", "Darknet", "Computer Vision", "Machine Learning", "Object Detection", "Satellite Imagery"].map((tag) => (
              <span key={tag} className="glass rounded-xl px-3 py-1 text-white/80 text-xs">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Abstract */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Abstract</h2>
          <p className="text-white/70 leading-relaxed mb-4">
            Research in object detection in computer vision have grown exceptionally over the last few years. 
            The initial aim of this project was to put a machine learning model in use to track down landfill 
            sites using aerial data collected from satellites. As environmental agencies across the world are 
            struggling to keep up with violations in the waste management industry, it has become a necessity 
            to have a system that can help track illegal landfill sites down to reduce environmental damage.
          </p>
          <p className="text-white/70 leading-relaxed">
            This research outlines the architecture of YOLOv3 and how it is implemented to detect landfill sites. 
            It also evaluates the model's performance using industry standard metrics. The results obtained from the 
            model vary due to the complexity of the target objects in dataset. All findings are concluded at the end 
            of the research alongside suggestions that can contribute towards achieving more accurate detections.
          </p>
        </div>

        {/* Key Findings */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">Key Findings & Methodology</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass rounded-2xl p-6 border-l-4 border-blue-400/50 hover:border-blue-400 transition-all hover:scale-[1.02] duration-300">
              <div className="flex items-start gap-4 mb-3">
                <div className="glass rounded-xl p-3 bg-blue-500/10">
                  <span className="text-3xl">🚨</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">The Problem</h3>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-4xl font-bold text-blue-300">£924M</span>
                    <span className="text-white/50 text-sm">in damages (2018-2019)</span>
                  </div>
                </div>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">
                Britain's environment agency disclosed compensation costs for illegal waste dumping reached £924 Million 
                — a staggering <span className="text-orange-300 font-semibold">90% increase</span> since 2015. Traditional 
                manual monitoring methods proved time-consuming and inefficient.
              </p>
            </div>

            <div className="glass rounded-2xl p-6 border-l-4 border-green-400/50 hover:border-green-400 transition-all hover:scale-[1.02] duration-300">
              <div className="flex items-start gap-4 mb-3">
                <div className="glass rounded-xl p-3 bg-green-500/10">
                  <span className="text-3xl">🎯</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">The Solution</h3>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-4xl font-bold text-green-300">106</span>
                    <span className="text-white/50 text-sm">layer neural network</span>
                  </div>
                </div>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">
                Implemented YOLOv3 powered by Darknet-53. The model performs detection at <span className="text-green-300 font-semibold">three 
                different scales</span>, making it capable of identifying both large and small waste dumps with remarkable accuracy.
              </p>
            </div>

            <div className="glass rounded-2xl p-6 border-l-4 border-purple-400/50 hover:border-purple-400 transition-all hover:scale-[1.02] duration-300">
              <div className="flex items-start gap-4 mb-3">
                <div className="glass rounded-xl p-3 bg-purple-500/10">
                  <span className="text-3xl">🌍</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">Dataset Preparation</h3>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-4xl font-bold text-purple-300">9</span>
                    <span className="text-white/50 text-sm">countries sampled</span>
                  </div>
                </div>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">
                Collected high-resolution satellite imagery from Google Earth covering sites in the UK, USA, 
                Canada, South Korea, China, Pakistan, Brazil, Nigeria, and India. Used <span className="text-purple-300 font-semibold">LabelImg</span> for 
                precise annotation with careful boundary detection.
              </p>
            </div>

            <div className="glass rounded-2xl p-6 border-l-4 border-yellow-400/50 hover:border-yellow-400 transition-all hover:scale-[1.02] duration-300">
              <div className="flex items-start gap-4 mb-3">
                <div className="glass rounded-xl p-3 bg-yellow-500/10">
                  <span className="text-3xl">📊</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">Model Performance</h3>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-4xl font-bold text-yellow-300">76%</span>
                    <span className="text-white/50 text-sm">precision achieved</span>
                  </div>
                </div>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">
                Achieved 76% precision on training data and 65% on validation dataset. Mean Average Precision 
                (mAP) of <span className="text-yellow-300 font-semibold">0.91</span> for IoU threshold of 0.5, with <span className="text-yellow-300 font-semibold">1,638 
                true positive</span> detections successfully identified.
              </p>
            </div>
          </div>
        </div>

        {/* Technical Highlights */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">Technical Architecture</h2>
          
          {/* Architecture Diagram */}
          <div className="glass rounded-2xl overflow-hidden mb-8 hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/10 px-4 py-3 border-b border-white/5">
              <h3 className="text-white font-semibold">YOLOv3 Network Architecture</h3>
              <p className="text-white/50 text-xs mt-1">106-layer convolutional neural network with multi-scale detection</p>
            </div>
            <div className="p-4 bg-white/90">
              <img 
                src="/dissertation/yolov3_architecture.webp" 
                alt="YOLOv3 Network Architecture showing 106 layers with three detection scales"
                className="w-full rounded-lg"
                loading="lazy"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="glass rounded-2xl p-6 hover:bg-white/10 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">⚡</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">Darknet-53 Backbone</h3>
                  <div className="flex flex-wrap gap-4 mb-3">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-blue-300">1457</span>
                      <span className="text-white/50 text-xs">BFLOP/s</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-blue-300">78</span>
                      <span className="text-white/50 text-xs">FPS</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-blue-300">53</span>
                      <span className="text-white/50 text-xs">Conv layers</span>
                    </div>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Neural network framework written in <span className="text-blue-300 font-semibold">C and CUDA</span> with 53 convolutional 
                    layers trained on ImageNet. Outperformed ResNet-152 and other competitors in both speed and accuracy.
                  </p>
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-6 hover:bg-white/10 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">🔍</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">Multi-Scale Detection</h3>
                  <div className="flex flex-wrap gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="px-2 py-1 bg-green-500/10 rounded text-green-300 text-xs font-mono">Layer 82</div>
                      <span className="text-white/40 text-xs">Stride 32</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="px-2 py-1 bg-green-500/10 rounded text-green-300 text-xs font-mono">Layer 94</div>
                      <span className="text-white/40 text-xs">Stride 16</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="px-2 py-1 bg-green-500/10 rounded text-green-300 text-xs font-mono">Layer 106</div>
                      <span className="text-white/40 text-xs">Stride 8</span>
                    </div>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed">
                    YOLOv3 performs predictions at <span className="text-green-300 font-semibold">three scales</span> by downsampling images with 
                    varying stride values. This enables detection of objects at various sizes — from large landfills to smaller waste dumps.
                  </p>
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-6 hover:bg-white/10 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">🔄</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">Transfer Learning</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="glass px-3 py-1 rounded-lg">
                      <span className="text-purple-300 font-semibold text-sm">ImageNet</span>
                      <span className="text-white/40 text-xs mx-2">→</span>
                      <span className="text-purple-300 font-semibold text-sm">Satellite Data</span>
                    </div>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Leveraged pre-trained weights from Darknet-53 trained on ImageNet, <span className="text-purple-300 font-semibold">significantly 
                    reducing training time</span> while maintaining accuracy. The model adapted these weights to recognize patterns 
                    specific to waste dumps in satellite imagery.
                  </p>
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-6 hover:bg-white/10 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">🎯</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">Non-Max Suppression & IoU</h3>
                  <div className="flex flex-wrap gap-3 mb-3">
                    <div className="glass px-3 py-1 rounded-lg border border-orange-500/20">
                      <span className="text-orange-300 text-xs font-semibold">IoU Threshold: 0.5</span>
                    </div>
                    <div className="glass px-3 py-1 rounded-lg border border-orange-500/20">
                      <span className="text-orange-300 text-xs font-semibold">NMS Applied</span>
                    </div>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Used Intersection over Union (IoU) and non-max suppression to filter overlapping bounding boxes, 
                    ensuring only the most confident predictions remain. This technique <span className="text-orange-300 font-semibold">reduced false 
                    positives</span> and improved detection accuracy dramatically.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Training Progression Visualization */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">Training Progression</h2>
          
          <p className="text-white/70 leading-relaxed mb-6">
            The visual comparison below demonstrates the remarkable difference in model performance between early 
            and later training stages. At 200 iterations, the model was still learning to distinguish relevant 
            features and generated an overwhelming number of bounding box predictions across the entire image. 
            By 2,000 iterations, the model had effectively learned to identify waste dumps with precision, 
            filtering out false positives through non-max suppression and IoU thresholding.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* 200 Iterations */}
            <div className="glass rounded-2xl overflow-hidden hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <div className="bg-gradient-to-r from-red-500/20 to-orange-500/10 px-4 py-3 border-b border-white/5">
                <h3 className="text-white font-semibold">Early Training (200 Iterations)</h3>
                <p className="text-white/50 text-xs mt-1">Excessive bounding box predictions</p>
              </div>
              <div className="p-4">
                <img 
                  src="/dissertation/200_iterations.webp" 
                  alt="Model predictions at 200 iterations showing excessive bounding boxes"
                  className="w-full rounded-lg"
                  loading="lazy"
                />
                <p className="text-white/60 text-xs mt-3 leading-relaxed">
                  At this early stage, the model predicted thousands of potential objects, covering nearly the 
                  entire image with overlapping bounding boxes. The convolutional layers were still learning 
                  to extract meaningful features from satellite imagery.
                </p>
              </div>
            </div>

            {/* 2000 Iterations */}
            <div className="glass rounded-2xl overflow-hidden hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <div className="bg-gradient-to-r from-green-500/20 to-blue-500/10 px-4 py-3 border-b border-white/5">
                <h3 className="text-white font-semibold">Refined Model (2,000 Iterations)</h3>
                <p className="text-white/50 text-xs mt-1">Accurate waste dump detection</p>
              </div>
              <div className="p-4">
                <img 
                  src="/dissertation/2000_iterations.webp" 
                  alt="Model predictions at 2000 iterations showing accurate detection"
                  className="w-full rounded-lg"
                  loading="lazy"
                />
                <p className="text-white/60 text-xs mt-3 leading-relaxed">
                  After 2,000 iterations, the model achieved precise detection of actual waste dumps. Non-max 
                  suppression successfully filtered redundant boxes, and the model correctly identified target 
                  objects while ignoring similar-looking terrain features.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 glass rounded-2xl p-4 border-l-2 border-blue-400/30">
            <p className="text-white/70 text-sm leading-relaxed">
              <span className="font-semibold text-white">Key Insight:</span> This progression illustrates the 
              critical importance of adequate training iterations and the effectiveness of YOLOv3's architecture 
              in learning complex patterns. The model's ability to reduce false positives from thousands to just 
              a handful demonstrates the power of deep learning when properly trained on domain-specific data.
            </p>
          </div>
        </div>

        {/* Challenges & Learnings */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">Challenges & Key Learnings</h2>
          
          <div className="space-y-4">
            <div className="glass rounded-2xl p-6 border-l-4 border-red-400/50 hover:border-red-400 transition-all hover:scale-[1.01] duration-300">
              <div className="flex items-start gap-4">
                <div className="glass rounded-xl p-3 bg-red-500/10 flex-shrink-0">
                  <span className="text-2xl">📝</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-3 text-lg">Quality of Annotations</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="px-2 py-1 bg-red-500/10 rounded text-red-300 text-xs font-semibold">
                      Critical Learning
                    </div>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Initially, waste piles were labeled incorrectly without visible borders, causing the model to 
                    misclassify neighboring mud piles as waste. <span className="text-red-300 font-semibold">Re-annotating the entire 
                    dataset</span> with proper border visibility led to significant improvements in accuracy — proving that 
                    data quality trumps quantity.
                  </p>
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-6 border-l-4 border-orange-400/50 hover:border-orange-400 transition-all hover:scale-[1.01] duration-300">
              <div className="flex items-start gap-4">
                <div className="glass rounded-xl p-3 bg-orange-500/10 flex-shrink-0">
                  <span className="text-2xl">⚖️</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-3 text-lg">Training Infrastructure & Constraints</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <div className="px-2 py-1 bg-orange-500/10 rounded text-orange-300 text-xs font-semibold">
                      Google Colab
                    </div>
                    <div className="px-2 py-1 bg-orange-500/10 rounded text-orange-300 text-xs font-semibold">
                      NVIDIA GPU
                    </div>
                    <div className="px-2 py-1 bg-orange-500/10 rounded text-orange-300 text-xs font-semibold">
                      Days of Training
                    </div>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed mb-3">
                    Models were trained over <span className="text-orange-300 font-semibold">several days on Google Colab</span> using NVIDIA GPUs. 
                    Larger network image sizes (608×608) improved small object detection but frequently caused <span className="text-orange-300 font-semibold">memory 
                    crashes</span> on the shared infrastructure.
                  </p>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Implemented <span className="text-orange-300 font-semibold">dynamic image scaling</span> every 10 iterations (alternating between 416×416 and 608×608) 
                    to balance detection quality with computational constraints — a practical compromise for cloud-based training environments.
                  </p>
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-6 border-l-4 border-blue-400/50 hover:border-blue-400 transition-all hover:scale-[1.01] duration-300">
              <div className="flex items-start gap-4">
                <div className="glass rounded-xl p-3 bg-blue-500/10 flex-shrink-0">
                  <span className="text-2xl">🌏</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-3 text-lg">Dataset Diversity</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <div className="px-2 py-1 bg-blue-500/10 rounded">
                      <span className="text-blue-300 text-xs">Developed: Well-contained</span>
                    </div>
                    <div className="px-2 py-1 bg-blue-500/10 rounded">
                      <span className="text-blue-300 text-xs">Developing: Visible targets</span>
                    </div>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Waste dumps in developed countries (UK, USA) were well-contained and harder to detect, while 
                    developing countries (Pakistan, India, Brazil) provided more visible targets. <span className="text-blue-300 font-semibold">Balancing 
                    the dataset</span> between both types was crucial for generalization across different waste management practices globally.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Conclusion */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Conclusion</h2>
          <p className="text-white/70 leading-relaxed mb-4">
            YOLOv3 proved to be a notoriously fast model compared to other industry-standard object detection 
            models, processing each image only once per iteration. The project successfully demonstrated the 
            viability of using machine learning to track illegal landfill sites, potentially saving environmental 
            agencies millions in monitoring costs.
          </p>
          <p className="text-white/70 leading-relaxed">
            The findings clearly indicate the potential of such models to help fight waste crime while avoiding 
            both developed and undeveloped countries from investing valuable financial resources into unnecessary 
            labor. Transfer learning techniques and well-annotated high-quality datasets are crucial for achieving 
            excellent results in satellite imagery analysis.
          </p>
        </div>

        {/* Download Link */}
        <div className="text-center py-8">
          <p className="text-white/60 mb-6 text-lg">Want to read the full dissertation?</p>
          <a
            href="/dissertation/Dissertation_YOLOv3_TYP.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 glass rounded-xl px-8 py-4 text-white hover:text-blue-300 hover:bg-white/10 hover:scale-105 transition-all"
          >
            <ExternalLink className="w-5 h-5" />
            Download Full Paper (PDF)
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dissertation;
