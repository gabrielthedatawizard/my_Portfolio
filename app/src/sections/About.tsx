import { useRef, useEffect } from 'react';
import { Target, Lightbulb, Shield, TrendingUp } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const values = [
    {
      icon: Target,
      title: 'Impact-Driven',
      description: 'Every project aims to create measurable improvements in healthcare outcomes.',
    },
    {
      icon: Shield,
      title: 'Reliability First',
      description: 'Building systems that healthcare professionals can trust with patient data.',
    },
    {
      icon: Lightbulb,
      title: 'Clarity in Complexity',
      description: 'Transforming complex health data into actionable, understandable insights.',
    },
    {
      icon: TrendingUp,
      title: 'Continuous Growth',
      description: 'Always learning and adapting to new technologies and methodologies.',
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
      },
    },
  };

  // Counter animation for stats
  const StatCounter = ({ end, suffix = '' }: { end: number; suffix?: string }) => {
    const ref = useRef<HTMLSpanElement>(null);
    const isStatInView = useInView(ref, { once: true });

    useEffect(() => {
      if (!isStatInView || !ref.current) return;

      const obj = { value: 0 };
      gsap.to(obj, {
        value: end,
        duration: 2,
        ease: 'power2.out',
        onUpdate: () => {
          if (ref.current) {
            ref.current.textContent = Math.floor(obj.value).toString() + suffix;
          }
        },
      });
    }, [isStatInView, end]);

    return <span ref={ref}>0{suffix}</span>;
  };

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-24 md:py-32 bg-charcoal overflow-hidden"
    >
      {/* Animated background elements */}
      <motion.div 
        className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-electric/5 to-transparent"
        initial={{ opacity: 0, x: 100 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1.2,  }}
      />

      {/* Floating decorative shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-electric/5 rounded-full blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"
          animate={{
            x: [0, -20, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column - Vertical Text */}
          <motion.div 
            className="lg:col-span-3 relative"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8,  }}
          >
            <div className="lg:sticky lg:top-32">
              <motion.span 
                className="text-sm text-electric uppercase tracking-widest mb-4 block"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                About Me
              </motion.span>
              <motion.div 
                className="hidden lg:block vertical-text text-4xl font-bold text-white/10 tracking-tight h-[400px]"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 1, delay: 0.4 }}
              >
                I am a Health Information Scientist
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column - Content */}
          <div className="lg:col-span-9 space-y-12">
            {/* Main Description */}
            <motion.div 
              className="space-y-6"
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
            >
              <motion.h2 
                className="text-section font-bold text-white leading-tight"
                variants={itemVariants}
              >
                Transforming Health Data into{' '}
                <span className="text-electric">Actionable Insights</span>
              </motion.h2>
              <motion.div 
                className="space-y-4 text-white/70 text-lg leading-relaxed max-w-3xl"
                variants={containerVariants}
              >
                <motion.p variants={itemVariants}>
                  I am a Health Information Scientist and Data Analyst with expertise in 
                  Digital Health Innovation. My work sits at the intersection of healthcare, 
                  data science, and artificial intelligence.
                </motion.p>
                <motion.p variants={itemVariants}>
                  With a strong foundation in database administration and data analytics, 
                  I specialize in designing and implementing health information systems that 
                  improve patient outcomes and streamline healthcare operations.
                </motion.p>
                <motion.p variants={itemVariants}>
                  My passion lies in leveraging AI and machine learning to solve complex 
                  healthcare challenges, from predictive analytics for disease prevention 
                  to intelligent automation of clinical workflows.
                </motion.p>
              </motion.div>
            </motion.div>

            {/* What I'm Optimizing For */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.h3 
                className="text-xl font-semibold text-white"
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                What I'm Optimizing For
              </motion.h3>
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
              >
                {values.map((value, index) => (
                  <motion.div
                    key={index}
                    variants={cardVariants}
                    whileHover={{ 
                      y: -8,
                      transition: { duration: 0.3 }
                    }}
                    className="group p-6 bg-white/[0.02] border border-white/5 rounded-xl hover:border-electric/30 transition-all duration-500 cursor-default relative overflow-hidden"
                  >
                    {/* Hover glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-electric/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="flex items-start gap-4 relative z-10">
                      <motion.div 
                        className="p-3 bg-electric/10 rounded-lg group-hover:bg-electric/20 transition-colors duration-300"
                        whileHover={{ rotate: 5, scale: 1.1 }}
                      >
                        <value.icon className="h-6 w-6 text-electric" />
                      </motion.div>
                      <div>
                        <h4 className="font-semibold text-white mb-2 group-hover:text-electric transition-colors duration-300">
                          {value.title}
                        </h4>
                        <p className="text-sm text-white/60 leading-relaxed">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div 
              className="flex flex-wrap gap-8 pt-6 border-t border-white/5"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {[
                { value: 5, suffix: '+', label: 'Years Experience' },
                { value: 20, suffix: '+', label: 'Projects Completed' },
                { value: 15, suffix: '+', label: 'Certifications' },
                { value: 50, suffix: '+', label: 'Skills Mastered' },
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <div className="text-3xl font-bold text-electric">
                    <StatCounter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm text-white/60">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
