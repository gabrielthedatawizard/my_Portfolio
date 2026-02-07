import { useRef, useEffect } from 'react';
import { ArrowDown, Download, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const { animationsEnabled, reducedMotion } = useTheme();
  const shouldAnimate = animationsEnabled && !reducedMotion;

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Parallax for image - moves slower than scroll
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 1.1]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], ['0%', '-10%']);

  // Smooth spring for mouse parallax
  const springConfig = { damping: 30, stiffness: 100 };
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 15;
      const y = (e.clientY / window.innerHeight - 0.5) * 15;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const scrollToProjects = () => {
    const element = document.querySelector('#projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.3 },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 80, rotateX: -90 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        delay: i * 0.04,
        duration: 0.8,
        ease: [0.215, 0.61, 0.355, 1] as const,
      },
    }),
  };

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.215, 0.61, 0.355, 1] as const },
    },
  };

  const nameText = "Gabriel R. Myeye";
  const firstName = "Gabriel R.";
  const lastName = "Myeye";

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen bg-[#0a0a0c] overflow-hidden"
    >
      {/* Deep gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0c] via-[#0f0f12] to-[#0a0a0c]" />

      {/* Animated ambient glow */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-[#1a365d]/20 rounded-full blur-[150px]"
          animate={shouldAnimate ? {
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          } : {}}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] bg-[#2a4a7c]/15 rounded-full blur-[120px]"
          animate={shouldAnimate ? {
            x: [0, -30, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          } : {}}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Subtle noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Main content container */}
      <motion.div 
        className="relative z-10 min-h-screen flex items-center"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        <div className="w-full max-w-[1800px] mx-auto px-6 sm:px-8 lg:px-16 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[80vh]">
            
            {/* Left content - Typography */}
            <div className="lg:col-span-6 xl:col-span-5 relative z-20 order-2 lg:order-1">
              <motion.div
                variants={containerVariants}
                initial={shouldAnimate ? 'hidden' : 'visible'}
                animate="visible"
                className="space-y-6"
              >
                {/* Greeting */}
                <motion.p
                  variants={fadeUpVariants}
                  className="text-white/50 text-sm uppercase tracking-[0.3em] font-light"
                >
                  Hi, I&apos;m
                </motion.p>

                {/* Main name - Large editorial typography */}
                <div className="space-y-0">
                  <h1 className="text-[clamp(3rem,8vw,7rem)] font-bold leading-[0.9] tracking-tight">
                    <span className="block overflow-hidden">
                      {firstName.split('').map((char, i) => (
                        <motion.span
                          key={`first-${i}`}
                          custom={i}
                          variants={letterVariants}
                          className="inline-block text-white"
                          style={{ transformOrigin: 'bottom' }}
                        >
                          {char === ' ' ? '\u00A0' : char}
                        </motion.span>
                      ))}
                    </span>
                    <span className="block overflow-hidden mt-2">
                      {lastName.split('').map((char, i) => (
                        <motion.span
                          key={`last-${i}`}
                          custom={i + firstName.length}
                          variants={letterVariants}
                          className="inline-block text-[#3b82f6]"
                          style={{ transformOrigin: 'bottom' }}
                        >
                          {char}
                        </motion.span>
                      ))}
                    </span>
                  </h1>
                </div>

                {/* Role/Tagline */}
                <motion.div
                  variants={fadeUpVariants}
                  className="pt-4"
                >
                  <p className="text-white/70 text-lg md:text-xl font-light max-w-md leading-relaxed">
                    Health Information Scientist & Data Innovator
                  </p>
                  <p className="text-white/40 text-sm mt-3 max-w-sm">
                    Transforming healthcare through data science, AI, and digital health solutions.
                  </p>
                </motion.div>

                {/* CTAs */}
                <motion.div
                  variants={fadeUpVariants}
                  className="flex flex-wrap gap-4 pt-6"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={scrollToProjects}
                      size="lg"
                      className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-8 py-6 text-base rounded-full group relative overflow-hidden"
                    >
                      <motion.span
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.6 }}
                      />
                      <Briefcase className="mr-2 h-5 w-5 relative z-10" />
                      <span className="relative z-10">View Projects</span>
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-white/20 text-white hover:bg-white/5 hover:border-white/30 px-8 py-6 text-base rounded-full bg-transparent"
                      asChild
                    >
                      <a href="/cv.pdf" download>
                        <Download className="mr-2 h-5 w-5" />
                        Download CV
                      </a>
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Stats row */}
                <motion.div
                  variants={fadeUpVariants}
                  className="flex gap-8 pt-8 border-t border-white/10 mt-8"
                >
                  {[
                    { value: '5+', label: 'Years Experience' },
                    { value: '20+', label: 'Projects' },
                    { value: '15+', label: 'Certifications' },
                  ].map((stat, i) => (
                    <div key={i}>
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                      <div className="text-xs text-white/40 uppercase tracking-wider">{stat.label}</div>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            </div>

            {/* Right content - Portrait Image */}
            <div className="lg:col-span-6 xl:col-span-7 relative order-1 lg:order-2 h-[50vh] lg:h-[85vh]">
              <motion.div
                ref={imageRef}
                className="absolute inset-0 lg:-right-20"
                initial={shouldAnimate ? { opacity: 0, scale: 1.1 } : {}}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.2, ease: [0.215, 0.61, 0.355, 1] }}
                style={shouldAnimate ? { y: imageY, scale: imageScale } : {}}
              >
                {/* Image container with complex masking */}
                <div className="relative w-full h-full">
                  
                  {/* Main portrait image */}
                  <motion.div
                    className="absolute inset-0"
                    style={shouldAnimate ? { x: mouseX, y: mouseY } : {}}
                    transition={{ type: 'spring', stiffness: 50, damping: 30 }}
                  >
                    <img
                      src="/portrait.jpg"
                      alt="Gabriel R. Myeye"
                      className="w-full h-full object-cover object-top"
                      style={{
                        maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%), linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%), linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)',
                        maskComposite: 'intersect',
                        WebkitMaskComposite: 'source-in',
                      }}
                    />
                  </motion.div>

                  {/* Soft gradient overlay - top fade */}
                  <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0c] via-transparent to-transparent opacity-60" />
                  
                  {/* Soft gradient overlay - bottom fade */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent opacity-80" />
                  
                  {/* Left side fade for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c] via-[#0a0a0c]/50 to-transparent opacity-70" />

                  {/* Subtle blue rim light effect */}
                  <motion.div
                    className="absolute right-0 top-1/4 bottom-1/4 w-32 bg-gradient-to-l from-[#3b82f6]/10 to-transparent"
                    animate={shouldAnimate ? {
                      opacity: [0.3, 0.6, 0.3],
                    } : {}}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  />

                  {/* Breathing scale animation container */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    animate={shouldAnimate ? {
                      scale: [1, 1.02, 1],
                    } : {}}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </div>
              </motion.div>

              {/* Floating accent elements */}
              <motion.div
                className="absolute top-20 right-20 w-2 h-2 bg-[#3b82f6] rounded-full"
                animate={shouldAnimate ? {
                  y: [0, -10, 0],
                  opacity: [0.3, 0.8, 0.3],
                } : {}}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              />
              <motion.div
                className="absolute bottom-40 right-40 w-1 h-1 bg-white rounded-full"
                animate={shouldAnimate ? {
                  y: [0, -15, 0],
                  opacity: [0.2, 0.6, 0.2],
                } : {}}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
        initial={shouldAnimate ? { opacity: 0, y: 20 } : {}}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <span className="text-xs text-white/30 uppercase tracking-[0.3em]">Scroll</span>
        <motion.div
          animate={shouldAnimate ? { y: [0, 8, 0] } : {}}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown className="h-4 w-4 text-white/30" />
        </motion.div>
      </motion.div>

      {/* Vertical text accent */}
      <motion.div
        className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:block"
        initial={shouldAnimate ? { opacity: 0 } : {}}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span className="text-[10px] text-white/20 uppercase tracking-[0.5em] writing-mode-vertical"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
          Data & Health Innovation
        </span>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0a0a0c] to-transparent pointer-events-none z-10" />
    </section>
  );
};

export default Hero;
