import { ArrowLeft, Download, Maximize2, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, useMemo, type ReactNode } from "react";

const PDF_URL = "/dissertation-assets/Dissertation_YOLOv3_TYP.pdf";
const ASSETS = "/dissertation-assets";

const SECTIONS = [
  { id: "results", label: "Results" },
  { id: "abstract", label: "Abstract" },
  { id: "background", label: "Problem & data" },
  { id: "architecture", label: "Architecture" },
  { id: "training", label: "Training" },
  { id: "challenges", label: "Challenges" },
  { id: "conclusion", label: "Conclusion" },
] as const;

const RESULTS = [
  { value: "76%", label: "Precision", note: "training set" },
  { value: "65%", label: "Precision", note: "validation set" },
  { value: "0.91", label: "mAP", note: "at IoU 0.5" },
  { value: "1,638", label: "True positives", note: "detections" },
];

const prose = "max-w-[62ch] text-[1.0625rem] leading-[1.75] text-slate-700 dark:text-white/75";
const strong = "font-semibold text-slate-900 dark:text-white";
const h2 = "text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6";
const h3 = "text-lg font-semibold text-slate-900 dark:text-white mb-2";

const Section = ({ id, title, children }: { id: string; title: string; children: ReactNode }) => (
  <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-20 lg:scroll-mt-10">
    <h2 id={`${id}-title`} className={h2}>
      {title}
    </h2>
    {children}
  </section>
);

interface FigureProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: ReactNode;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
}

// Click-to-enlarge figure. Native <dialog> provides Esc-to-close and focus trapping.
const Figure = ({
  src,
  alt,
  width,
  height,
  caption,
  className = "",
  imgClassName = "",
  eager,
}: FigureProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  return (
    <figure className={className}>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="group relative block w-full overflow-hidden rounded-xl border border-slate-300/70 dark:border-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        aria-label={`Enlarge image: ${alt}`}
      >
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={eager ? "eager" : "lazy"}
          className={`w-full h-auto ${imgClassName}`}
        />
        <span className="absolute right-2 bottom-2 flex items-center gap-1.5 rounded-md bg-slate-950/75 px-2 py-1 text-xs font-medium text-white opacity-90 transition-opacity group-hover:opacity-100">
          <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
          Enlarge
        </span>
      </button>
      <figcaption className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-white/60">
        {caption}
      </figcaption>
      <dialog
        ref={dialogRef}
        onClick={(e) => e.target === e.currentTarget && dialogRef.current?.close()}
        className="m-auto max-w-[96vw] max-h-[92vh] bg-transparent p-0 backdrop:bg-slate-950/85 backdrop:backdrop-blur-sm"
      >
        <img
          src={src}
          alt={alt}
          className="max-w-[96vw] max-h-[85vh] w-auto h-auto rounded-lg bg-white"
        />
        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          className="mt-3 mx-auto flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <X className="w-4 h-4" aria-hidden="true" />
          Close
        </button>
      </dialog>
    </figure>
  );
};

const PdfButton = ({ className = "" }: { className?: string }) => (
  <a
    href={PDF_URL}
    target="_blank"
    rel="noopener noreferrer"
    className={`inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 font-semibold text-brand-contrast shadow-[0_8px_20px_-8px_hsl(var(--brand)/0.6)] transition-colors hover:bg-brand-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background ${className}`}
  >
    <Download className="w-4 h-4" aria-hidden="true" />
    Read the full paper
    <span className="font-normal opacity-80">PDF, 1.2 MB</span>
  </a>
);

const Dissertation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [active, setActive] = useState<string>(SECTIONS[0].id);
  const progressRef = useRef<HTMLDivElement>(null);
  const chipRowRef = useRef<HTMLDivElement>(null);

  // Memoize particles to prevent recreation on every render
  const particles = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: `${15 + Math.random() * 10}s`,
        delay: `-${Math.random() * 20}s`,
      })),
    []
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    const previousTitle = document.title;
    document.title = "Detecting Landfill Sites through YOLOv3 | Waleed Tariq";
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => {
      clearTimeout(timer);
      document.title = previousTitle;
    };
  }, []);

  // Reading progress bar, written straight to the DOM to avoid re-rendering on scroll.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${ratio})`;
      // Active contents entry: the last section whose top has passed 30% of the viewport.
      let current: string = SECTIONS[0].id;
      for (const { id } of SECTIONS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.3) current = id;
      }
      setActive((prev) => (prev === current ? prev : current));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Keep the active chip in view in the horizontal mobile contents bar.
  useEffect(() => {
    const row = chipRowRef.current;
    const chip = row?.querySelector<HTMLElement>(`a[href="#${active}"]`);
    if (!row || !chip || row.scrollWidth <= row.clientWidth) return;
    const left = chip.offsetLeft - (row.clientWidth - chip.offsetWidth) / 2;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    row.scrollTo({ left, behavior: reduce ? "auto" : "smooth" });
  }, [active]);

  const tocLink = (id: string, label: string, mobile = false) => {
    const isActive = active === id;
    return (
      <a
        href={`#${id}`}
        aria-current={isActive ? "location" : undefined}
        className={
          mobile
            ? `shrink-0 rounded-full px-3 py-1.5 text-sm transition-colors ${
                isActive
                  ? "bg-brand text-brand-contrast font-semibold"
                  : "text-slate-600 dark:text-white/65 hover:text-slate-900 dark:hover:text-white"
              }`
            : `block border-l-2 py-1.5 pl-4 text-sm transition-colors ${
                isActive
                  ? "border-brand text-slate-900 dark:text-white font-semibold"
                  : "border-transparent text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white"
              }`
        }
      >
        {label}
      </a>
    );
  };

  return (
    <div className="min-h-screen relative">
      <div
        ref={progressRef}
        className="fixed top-0 left-0 right-0 z-50 h-[3px] origin-left bg-brand"
        style={{ transform: "scaleX(0)" }}
        aria-hidden="true"
      />

      {/* Ambient orbs — matches the vibrancy of the Home page background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-48 -left-48 w-[700px] h-[700px] rounded-full bg-brand/10 blur-[60px] md:blur-[120px] will-change-transform" />
        <div className="absolute -top-32 -right-64 w-[600px] h-[600px] rounded-full bg-blue-700/10 dark:bg-blue-700/20 blur-[50px] md:blur-[100px] will-change-transform" />
        <div className="absolute -bottom-64 -left-32 w-[600px] h-[600px] rounded-full bg-brand/8 dark:bg-brand/10 blur-[55px] md:blur-[110px] will-change-transform" />
      </div>
      {isVisible && (
        <div className="fixed inset-0 pointer-events-none opacity-30" aria-hidden="true">
          {particles.map((s) => (
            <div
              key={s.id}
              className="absolute w-1 h-1 bg-slate-300 dark:bg-white rounded-full will-change-transform"
              style={{
                left: s.left,
                top: s.top,
                animation: `twinkle ${s.duration} ease-in-out infinite ${s.delay}`,
              }}
            />
          ))}
        </div>
      )}

      <div
        className={`relative z-10 max-w-6xl mx-auto px-5 md:px-8 py-10 md:py-12 transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <button
          onClick={() => {
            // Go back to the homepage view the visitor came from; direct visitors land on Research.
            if ((location.state as { fromHome?: boolean } | null)?.fromHome) {
              navigate(-1);
            } else {
              navigate("/#research");
            }
          }}
          className="flex items-center gap-2 text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to Home</span>
        </button>

        {/* Header: title on the left, the model's own output on the right */}
        <header className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-center mb-14 md:mb-20">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold leading-[1.05] text-slate-900 dark:text-white mb-5">
              Detecting Landfill Sites through YOLOv3
            </h1>
            <p className="text-xl leading-snug text-slate-700 dark:text-white/75 mb-5 max-w-[36ch]">
              Using Satellite Imagery and Deep Learning for Environmental Protection
            </p>
            <p className="text-sm text-slate-600 dark:text-white/60 mb-8">
              BSc (Hons) Computer Science · Lancaster University · March 2022
            </p>
            <PdfButton />
            <ul
              className="mt-8 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600 dark:text-white/55"
              aria-label="Topics"
            >
              {[
                "YOLOv3",
                "Darknet",
                "Computer Vision",
                "Machine Learning",
                "Object Detection",
                "Satellite Imagery",
              ].map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </div>
          <Figure
            src={`${ASSETS}/2000_iterations.webp`}
            alt="Satellite image of an industrial site with bounding boxes drawn by the trained model around waste piles"
            width={715}
            height={455}
            eager
            className="lg:max-w-[715px] lg:justify-self-end w-full"
            caption="The trained model's detections after 2,000 iterations: each box marks a waste dump it found in the satellite image."
          />
        </header>

        {/* Mobile / tablet contents */}
        <nav
          aria-label="Contents"
          className="lg:hidden sticky top-[3px] z-40 -mx-5 md:-mx-8 mb-10 px-5 md:px-8 py-2 bg-background/85 backdrop-blur-md border-y border-slate-200 dark:border-white/10"
        >
          <div
            ref={chipRowRef}
            className="relative flex gap-1 overflow-x-auto [scrollbar-width:none]"
          >
            {SECTIONS.map(({ id, label }) => tocLink(id, label, true))}
          </div>
        </nav>

        <div className="lg:grid lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-14">
          <nav aria-label="Contents" className="hidden lg:block">
            <div className="sticky top-10">
              <p className="mb-3 pl-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-white/45">
                Contents
              </p>
              {SECTIONS.map(({ id, label }) => (
                <div key={id}>{tocLink(id, label)}</div>
              ))}
            </div>
          </nav>

          <main className="space-y-20 min-w-0">
            <Section id="results" title="Results">
              <dl className="grid grid-cols-2 md:grid-cols-4 max-w-3xl overflow-hidden rounded-2xl border border-slate-300/70 dark:border-white/10 divide-x divide-y md:divide-y-0 divide-slate-300/70 dark:divide-white/10">
                {RESULTS.map((r) => (
                  <div key={r.note} className="flex flex-col p-5 bg-white/60 dark:bg-white/[0.03]">
                    <dt className="order-2 text-sm font-medium text-slate-800 dark:text-white/85">
                      {r.label}
                    </dt>
                    <dd className="order-1 tabular mb-1 text-3xl font-bold text-slate-900 dark:text-white">
                      {r.value}
                    </dd>
                    <dd className="order-3 text-sm text-slate-600 dark:text-white/55">{r.note}</dd>
                  </div>
                ))}
              </dl>
              <p className={`${prose} mt-6`}>
                Precision is the share of the model's detections that were real waste dumps. It
                drops from 76% on the training data to 65% on images the model had not seen, while
                mean average precision (mAP) at an IoU threshold of 0.5 reached 0.91.
              </p>
            </Section>

            <Section id="abstract" title="Abstract">
              <div className={`${prose} space-y-5`}>
                <p>
                  Research in object detection in computer vision have grown exceptionally over the
                  last few years. The initial aim of this project was to put a machine learning
                  model in use to track down landfill sites using aerial data collected from
                  satellites. As environmental agencies across the world are struggling to keep up
                  with violations in the waste management industry, it has become a necessity to
                  have a system that can help track illegal landfill sites down to reduce
                  environmental damage.
                </p>
                <p>
                  This research outlines the architecture of YOLOv3 and how it is implemented to
                  detect landfill sites. It also evaluates the model's performance using industry
                  standard metrics. The results obtained from the model vary due to the complexity
                  of the target objects in dataset. All findings are concluded at the end of the
                  research alongside suggestions that can contribute towards achieving more accurate
                  detections.
                </p>
              </div>
            </Section>

            <Section id="background" title="Problem & data">
              <div className={`${prose} space-y-8`}>
                <div>
                  <h3 className={h3}>The problem</h3>
                  <p>
                    Britain's environment agency disclosed compensation costs for illegal waste
                    dumping reached <span className={strong}>£924 million</span> in 2018–2019, a{" "}
                    <span className={strong}>90% increase</span> since 2015. Traditional manual
                    monitoring methods proved time-consuming and inefficient.
                  </p>
                </div>
                <div>
                  <h3 className={h3}>The approach</h3>
                  <p>
                    Implemented YOLOv3, a 106-layer neural network powered by Darknet-53. The model
                    performs detection at <span className={strong}>three different scales</span>,
                    making it capable of identifying both large and small waste dumps.
                  </p>
                </div>
                <div>
                  <h3 className={h3}>The dataset</h3>
                  <p>
                    Collected high-resolution satellite imagery from Google Earth covering sites in{" "}
                    <span className={strong}>9 countries</span>: the UK, USA, Canada, South Korea,
                    China, Pakistan, Brazil, Nigeria, and India. Used LabelImg for precise
                    annotation with careful boundary detection.
                  </p>
                </div>
              </div>
            </Section>

            <Section id="architecture" title="Architecture">
              <p className={`${prose} mb-8`}>
                An image passes through four stages, from feature extraction to the final filtered
                boxes. The diagram shows the full 106-layer network and where each detection scale
                branches off.
              </p>

              <div className="overflow-x-auto pb-2 -mx-5 px-5 md:mx-0 md:px-0">
                <Figure
                  src={`${ASSETS}/yolov3_architecture.webp`}
                  alt="YOLOv3 network architecture showing 106 layers with three detection scales at layers 82, 94 and 106"
                  width={1320}
                  height={736}
                  className="min-w-[640px]"
                  imgClassName="bg-white p-3"
                  caption="YOLOv3 network architecture: a 106-layer convolutional network with multi-scale detection."
                />
              </div>

              <ol className="mt-12 max-w-[62ch] space-y-10">
                {[
                  {
                    title: "Darknet-53 backbone",
                    body: (
                      <>
                        <p>
                          A neural network framework written in C and CUDA with 53 convolutional
                          layers trained on ImageNet. In its published benchmarks it outperformed
                          ResNet-152 and other competitors in both speed and accuracy.
                        </p>
                        <p className="mt-3 text-sm text-slate-600 dark:text-white/60">
                          Published reference benchmark, not measured in this project:{" "}
                          <span className="tabular">1457 BFLOP/s, 78 FPS</span>.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: "Transfer learning",
                    body: (
                      <p>
                        Leveraged pre-trained weights from Darknet-53 trained on ImageNet,{" "}
                        <span className={strong}>significantly reducing training time</span> while
                        maintaining accuracy. The model adapted these weights to recognise patterns
                        specific to waste dumps in satellite imagery.
                      </p>
                    ),
                  },
                  {
                    title: "Detection at three scales",
                    body: (
                      <>
                        <p>
                          YOLOv3 performs predictions at three scales by downsampling images with
                          varying stride values. This enables detection of objects at various sizes:
                          from large landfills to smaller waste dumps.
                        </p>
                        <table className="tabular mt-4 text-sm">
                          <thead>
                            <tr className="text-left text-slate-600 dark:text-white/60">
                              <th className="pr-8 pb-1 font-medium">Layer</th>
                              <th className="pr-8 pb-1 font-medium">Stride</th>
                              <th className="pb-1 font-medium">Best for</th>
                            </tr>
                          </thead>
                          <tbody className="text-slate-800 dark:text-white/85">
                            <tr>
                              <td className="pr-8 py-0.5">82</td>
                              <td className="pr-8">32</td>
                              <td>Large sites</td>
                            </tr>
                            <tr>
                              <td className="pr-8 py-0.5">94</td>
                              <td className="pr-8">16</td>
                              <td>Medium sites</td>
                            </tr>
                            <tr>
                              <td className="pr-8 py-0.5">106</td>
                              <td className="pr-8">8</td>
                              <td>Small dumps</td>
                            </tr>
                          </tbody>
                        </table>
                      </>
                    ),
                  },
                  {
                    title: "Filtering with IoU and non-max suppression",
                    body: (
                      <p>
                        Used Intersection over Union (IoU), with a threshold of 0.5, and non-max
                        suppression to filter overlapping bounding boxes, ensuring only the most
                        confident predictions remain. This technique{" "}
                        <span className={strong}>reduced false positives</span> and improved
                        detection accuracy.
                      </p>
                    ),
                  },
                ].map((step, i) => (
                  <li key={step.title} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-3">
                    <span
                      className="tabular flex h-9 w-9 items-center justify-center rounded-full border border-brand/60 text-sm font-semibold text-brand"
                      aria-hidden="true"
                    >
                      {i + 1}
                    </span>
                    <div className="text-[1.0625rem] leading-[1.75] text-slate-700 dark:text-white/75">
                      <h3 className={`${h3} pt-1`}>{step.title}</h3>
                      {step.body}
                    </div>
                  </li>
                ))}
              </ol>
            </Section>

            <Section id="training" title="Training progression">
              <p className={`${prose} mb-8`}>
                At 200 iterations, the model was still learning to distinguish relevant features and
                generated an overwhelming number of bounding box predictions across the entire
                image. By 2,000 iterations, it had learned to identify waste dumps, filtering out
                false positives through non-max suppression and IoU thresholding.
              </p>

              <div className="grid gap-8 md:grid-cols-2">
                <Figure
                  src={`${ASSETS}/200_iterations.webp`}
                  alt="Model predictions at 200 iterations: thousands of overlapping bounding boxes cover the whole image"
                  width={565}
                  height={464}
                  caption={
                    <>
                      <span className={strong}>200 iterations.</span> The model predicted thousands
                      of potential objects, covering nearly the entire image with overlapping boxes.
                      The convolutional layers were still learning to extract meaningful features.
                    </>
                  }
                />
                <Figure
                  src={`${ASSETS}/2000_iterations.webp`}
                  alt="Model predictions at 2,000 iterations: a few boxes around actual waste piles"
                  width={715}
                  height={455}
                  caption={
                    <>
                      <span className={strong}>2,000 iterations.</span> Non-max suppression filtered
                      redundant boxes, and the model identified target objects while ignoring
                      similar-looking terrain features.
                    </>
                  }
                />
              </div>

              <p className={`${prose} mt-8`}>
                <span className={strong}>Key insight:</span> this progression shows the importance
                of adequate training iterations and how well YOLOv3's architecture learns complex
                patterns. Reducing false positives from thousands to a handful shows what deep
                learning can do when properly trained on domain-specific data.
              </p>
            </Section>

            <Section id="challenges" title="Challenges & key learnings">
              <div className="max-w-3xl divide-y divide-slate-300/70 dark:divide-white/10 border-y border-slate-300/70 dark:border-white/10">
                {[
                  {
                    title: "Quality of annotations",
                    problem:
                      "Waste piles were initially labelled without visible borders, so the model misclassified neighbouring mud piles as waste.",
                    fix: "Re-annotated the entire dataset with proper border visibility, which significantly improved accuracy. Data quality trumps quantity.",
                  },
                  {
                    title: "Training infrastructure",
                    problem:
                      "Models trained over several days on Google Colab NVIDIA GPUs. Larger 608×608 inputs improved small-object detection but frequently caused memory crashes on the shared infrastructure.",
                    fix: "Dynamic image scaling every 10 iterations, alternating between 416×416 and 608×608, to balance detection quality with the memory limits.",
                  },
                  {
                    title: "Dataset diversity",
                    problem:
                      "Waste dumps in developed countries (UK, USA) were well-contained and harder to detect, while developing countries (Pakistan, India, Brazil) provided more visible targets.",
                    fix: "Balanced the dataset between both types so the model generalises across different waste management practices.",
                  },
                ].map((c) => (
                  <div key={c.title} className="py-7">
                    <h3 className={`${h3} mb-4`}>{c.title}</h3>
                    <dl className="grid gap-4 sm:grid-cols-2 sm:gap-8 text-base leading-relaxed">
                      <div>
                        <dt className="mb-1 text-sm font-semibold text-slate-600 dark:text-white/55">
                          Problem
                        </dt>
                        <dd className="text-slate-700 dark:text-white/75">{c.problem}</dd>
                      </div>
                      <div>
                        <dt className="mb-1 text-sm font-semibold text-brand">What changed</dt>
                        <dd className="text-slate-700 dark:text-white/75">{c.fix}</dd>
                      </div>
                    </dl>
                  </div>
                ))}
              </div>
            </Section>

            <Section id="conclusion" title="Conclusion">
              <div className={`${prose} space-y-5`}>
                <p>
                  YOLOv3 proved to be a notoriously fast model compared to other industry-standard
                  object detection models, processing each image only once per iteration. The
                  project successfully demonstrated the viability of using machine learning to track
                  illegal landfill sites, potentially saving environmental agencies millions in
                  monitoring costs.
                </p>
                <p>
                  The findings clearly indicate the potential of such models to help fight waste
                  crime while avoiding both developed and undeveloped countries from investing
                  valuable financial resources into unnecessary labor. Transfer learning techniques
                  and well-annotated high-quality datasets are crucial for achieving excellent
                  results in satellite imagery analysis.
                </p>
              </div>

              <div className="mt-12 max-w-[62ch] rounded-2xl border border-slate-300/70 dark:border-white/10 bg-white/60 dark:bg-white/[0.03] p-6 md:p-8">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  Read the full dissertation
                </h3>
                <p className="text-slate-700 dark:text-white/70 mb-6">
                  The complete paper covers the dataset, evaluation method and every result in
                  detail.
                </p>
                <PdfButton />
              </div>
            </Section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dissertation;
