import { useRef } from 'react';
import { Download, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, useReducedMotion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { useProfile } from '@/hooks/useData';

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { animationsEnabled, reducedMotion, resolvedTheme } = useTheme();
  const { data: profileData } = useProfile();
  const prefersReducedMotion = useReducedMotion();
  const isLight = resolvedTheme === 'light';
  const shouldAnimate = animationsEnabled && !reducedMotion && !prefersReducedMotion;

  const scrollToProjects = () => {
    const element = document.querySelector('#projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDownloadCv = async () => {
    const cvUrl = profileData?.[0]?.cv_url || '/cv.pdf';

    try {
      const response = await fetch(cvUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch CV file');
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = 'Gabriel-Myeye-CV.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error('CV download fallback triggered:', error);
      window.open(cvUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const initialMotionState = shouldAnimate ? 'hidden' : 'visible';
  const marqueeText = `Hi, I\u2019m Gabriel R. Myeye`;

  // Premium, subtle entrance motion. Staggers: title -> role -> body -> CTAs -> stats.
  const cardVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  const contentVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.08, delayChildren: 0.12 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  const photoVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <section
      id="home"
      ref={heroRef}
      className={`relative min-h-screen overflow-hidden ${isLight ? 'bg-[#f7f7f7]' : 'bg-[#0b0f19]'}`}
    >
      {/* Soft, neutral background to match the card-driven hero */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className={`absolute inset-0 bg-gradient-to-b ${
            isLight ? 'from-white via-[#f7f7f7] to-white' : 'from-[#0b0f19] via-[#070a12] to-[#0b0f19]'
          }`}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1200px] items-center px-6 sm:px-8 lg:px-16 py-20">
        <motion.div
          initial={initialMotionState}
          animate="visible"
          variants={cardVariants}
          className={`w-full overflow-hidden rounded-[32px] border shadow-[0_18px_60px_rgba(2,6,23,0.08)] ${
            isLight ? 'border-slate-200/80 bg-white' : 'border-white/10 bg-white/5'
          }`}
        >
          <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-14">
            {/* Left: circular portrait + moving back text */}
            <div className="relative flex items-center justify-center lg:justify-start">
              <div className="relative isolate">
                {/* Animated back text (must remain behind the portrait) */}
                <div aria-hidden className="pointer-events-none absolute inset-0 z-0 flex items-center overflow-hidden">
                  <motion.div
                    className={`flex w-max items-center gap-14 whitespace-nowrap text-[clamp(48px,8vw,120px)] font-semibold tracking-[-0.03em] ${
                      isLight ? 'text-slate-900' : 'text-white'
                    } opacity-[0.08]`}
                    animate={shouldAnimate ? { x: ['0%', '-50%'] } : undefined}
                    transition={
                      shouldAnimate
                        ? { duration: 18, repeat: Infinity, ease: 'linear' }
                        : undefined
                    }
                  >
                    <span>{marqueeText}</span>
                    <span aria-hidden="true">{marqueeText}</span>
                  </motion.div>
                </div>

                <motion.div
                  initial={initialMotionState}
                  animate="visible"
                  variants={photoVariants}
                  whileHover={shouldAnimate ? { y: -4, scale: 1.01 } : undefined}
                  transition={{ type: 'spring', stiffness: 240, damping: 22 }}
                  className="relative z-10"
                >
                  {/* Subtle gradient ring + soft shadow */}
                  <div
                    className={`rounded-full p-[2px] ${
                      isLight
                        ? 'bg-gradient-to-tr from-[#2563eb]/55 via-slate-200 to-white'
                        : 'bg-gradient-to-tr from-[#60a5fa]/35 via-white/10 to-white/0'
                    } shadow-[0_30px_80px_rgba(2,6,23,0.12)]`}
                  >
                    <div
                      className={`rounded-full overflow-hidden ${isLight ? 'bg-white' : 'bg-[#0b0f19]'}`}
                      style={{ width: 'clamp(220px, 28vw, 420px)', height: 'clamp(220px, 28vw, 420px)' }}
                    >
                      <img
                        src="/portrait.jpg"
                        alt="Gabriel R. Myeye"
                        className="h-full w-full object-cover"
                        style={{ objectPosition: '50% 22%' }}
                        loading="eager"
                        decoding="async"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Tiny dotted micro-element (premium, minimal) */}
                <div
                  aria-hidden
                  className={`pointer-events-none absolute -bottom-6 -left-6 hidden h-24 w-24 rounded-2xl opacity-60 sm:block ${
                    isLight
                      ? "bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.45)_1px,transparent_1px)]"
                      : "bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.5)_1px,transparent_1px)]"
                  } bg-[length:10px_10px]`}
                />
              </div>
            </div>

            {/* Right: text + CTAs + quick metrics */}
            <motion.div
              variants={contentVariants}
              initial={initialMotionState}
              animate="visible"
              className="flex flex-col justify-center"
            >
              <motion.h1
                variants={itemVariants}
                className={`text-[clamp(2.1rem,4.5vw,3.6rem)] font-semibold tracking-tight ${
                  isLight ? 'text-slate-950' : 'text-white'
                }`}
              >
                Hi, I{'\u2019'}m Gabriel R. Myeye
              </motion.h1>

              <motion.div variants={itemVariants} className="mt-5 flex items-center gap-3">
                <span aria-hidden className="h-2 w-2 rounded-full bg-[#2563eb]" />
                <span aria-hidden className={`h-px w-10 ${isLight ? 'bg-slate-200' : 'bg-white/20'}`} />
                <p className={`text-base sm:text-lg font-light ${isLight ? 'text-slate-700' : 'text-white/75'}`}>
                  Health Information Scientist & Data Innovator
                </p>
              </motion.div>

              <motion.p
                variants={itemVariants}
                className={`mt-4 max-w-xl text-sm sm:text-base leading-relaxed ${
                  isLight ? 'text-slate-600' : 'text-white/55'
                }`}
              >
                Transforming healthcare through data science, AI, and digital health solutions.
              </motion.p>

              <motion.div variants={itemVariants} className="mt-8 flex flex-wrap gap-3">
                <Button
                  onClick={scrollToProjects}
                  size="lg"
                  aria-label="View projects"
                  className={`rounded-full bg-[#2563eb] px-6 py-6 text-base text-white transition-colors hover:bg-[#1d4ed8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 ${
                    isLight ? 'focus-visible:ring-offset-white' : 'focus-visible:ring-offset-[#0b0f19]'
                  }`}
                >
                  <Briefcase className="mr-2 h-5 w-5" />
                  View Projects
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  aria-label="Download CV"
                  onClick={handleDownloadCv}
                  className={`rounded-full px-6 py-6 text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 ${
                    isLight
                      ? 'border-slate-300 bg-transparent text-slate-900 hover:bg-slate-50 hover:border-slate-400 focus-visible:ring-offset-white'
                      : 'border-white/15 bg-transparent text-white hover:bg-white/5 hover:border-white/25 focus-visible:ring-offset-[#0b0f19]'
                  }`}
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download CV
                </Button>
              </motion.div>

              <motion.div variants={itemVariants} className="mt-10 grid grid-cols-3 gap-3 sm:gap-4">
                {[
                  { value: '5+', label: 'Years Experience' },
                  { value: '20+', label: 'Projects' },
                  { value: '15+', label: 'Certifications' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className={`rounded-2xl border px-4 py-4 ${
                      isLight ? 'border-slate-200 bg-slate-50' : 'border-white/10 bg-white/5'
                    }`}
                  >
                    <div className={`text-xl sm:text-2xl font-semibold ${isLight ? 'text-slate-950' : 'text-white'}`}>
                      {stat.value}
                    </div>
                    <div
                      className={`mt-1 text-[11px] uppercase tracking-[0.18em] ${
                        isLight ? 'text-slate-500' : 'text-white/45'
                      }`}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
