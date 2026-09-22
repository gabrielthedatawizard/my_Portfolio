import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { 
  Database, 
  Brain, 
  Activity, 
  LineChart, 
  Shield, 
  Cpu,
  ArrowUpRight 
} from 'lucide-react';

interface Service {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  features: string[];
}

const services: Service[] = [
  {
    id: 1,
    title: 'Health Data Analytics',
    description: 'Transform raw health data into actionable insights with advanced analytics and visualization.',
    icon: LineChart,
    color: 'from-blue-500 to-cyan-500',
    features: ['Predictive Modeling', 'Interactive Dashboards', 'Statistical Analysis'],
  },
  {
    id: 2,
    title: 'AI & Machine Learning',
    description: 'Implement intelligent systems that learn and adapt to improve healthcare outcomes.',
    icon: Brain,
    color: 'from-purple-500 to-pink-500',
    features: ['Deep Learning Models', 'NLP Processing', 'Computer Vision'],
  },
  {
    id: 3,
    title: 'Digital Health Solutions',
    description: 'End-to-end digital transformation for healthcare organizations and providers.',
    icon: Activity,
    color: 'from-emerald-500 to-teal-500',
    features: ['EHR Integration', 'Telemedicine', 'Health Apps'],
  },
  {
    id: 4,
    title: 'Database Architecture',
    description: 'Design and optimize robust database systems for healthcare data management.',
    icon: Database,
    color: 'from-orange-500 to-amber-500',
    features: ['Data Warehousing', 'ETL Pipelines', 'Performance Tuning'],
  },
  {
    id: 5,
    title: 'Data Security & Compliance',
    description: 'Ensure HIPAA compliance and implement enterprise-grade security measures.',
    icon: Shield,
    color: 'from-red-500 to-rose-500',
    features: ['HIPAA Compliance', 'Data Encryption', 'Access Control'],
  },
  {
    id: 6,
    title: 'Health Informatics',
    description: 'Bridge the gap between healthcare and information technology seamlessly.',
    icon: Cpu,
    color: 'from-indigo-500 to-violet-500',
    features: ['HL7 FHIR', 'Interoperability', 'System Integration'],
  },
];

const ServiceCard: React.FC<{ service: Service; index: number }> = ({ service, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { animationsEnabled, reducedMotion, resolvedTheme } = useTheme();
  const isLight = resolvedTheme === 'light';
  const shouldAnimate = animationsEnabled && !reducedMotion;

  // Mouse position for 3D tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics
  const springConfig = { damping: 20, stiffness: 300 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !shouldAnimate) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const Icon = service.icon;

  return (
    <motion.div
      ref={cardRef}
      initial={shouldAnimate ? { opacity: 0, y: 50 } : {}}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: shouldAnimate ? rotateX : 0,
        rotateY: shouldAnimate ? rotateY : 0,
        transformStyle: 'preserve-3d',
      }}
      className="relative group cursor-pointer"
    >
      {/* Card Container */}
      <div
        className={`relative h-full rounded-2xl p-6 overflow-hidden transition-all duration-500 ${
          isLight
            ? 'bg-white border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] group-hover:border-electric/30 group-hover:shadow-[0_12px_32px_rgba(42,107,255,0.08)]'
            : 'bg-charcoal-light border border-white/10 group-hover:border-white/20'
        }`}
      >
        
        {/* Animated gradient background on hover */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${service.color} transition-opacity duration-500`}
          initial={false}
          animate={{ opacity: isHovered ? (isLight ? 0.06 : 0.1) : 0 }}
        />

        {/* Glow effect */}
        <div
          className={`absolute -inset-px bg-gradient-to-r ${
            isLight
              ? 'from-transparent via-electric/10 to-transparent'
              : 'from-transparent via-white/5 to-transparent'
          } opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`}
        />

        {/* Content */}
        <div className="relative z-10" style={{ transform: 'translateZ(30px)' }}>
          {/* Icon */}
          <motion.div
            className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} p-0.5 mb-4`}
            whileHover={shouldAnimate ? { scale: 1.1, rotate: 5 } : {}}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <div
              className={`w-full h-full rounded-[10px] flex items-center justify-center transition-colors duration-300 ${
                isLight ? 'bg-white' : 'bg-charcoal-light'
              }`}
            >
              <Icon
                className={`h-6 w-6 transition-colors duration-300 ${
                  isLight
                    ? 'text-slate-800 group-hover:text-electric'
                    : 'text-white group-hover:text-electric'
                }`}
              />
            </div>
          </motion.div>

          {/* Title */}
          <h3
            className={`text-xl font-bold mb-2 transition-colors duration-300 ${
              isLight
                ? 'text-slate-900 group-hover:text-electric'
                : 'text-white group-hover:text-electric'
            }`}
          >
            {service.title}
          </h3>

          {/* Description */}
          <p
            className={`text-sm mb-4 line-clamp-2 transition-colors duration-300 ${
              isLight
                ? 'text-slate-600 group-hover:text-slate-800'
                : 'text-white/60 group-hover:text-white/80'
            }`}
          >
            {service.description}
          </p>

          {/* Features */}
          <div className="flex flex-wrap gap-2 mb-4">
            {service.features.map((feature, i) => (
              <span
                key={i}
                className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all duration-300 ${
                  isLight
                    ? 'bg-slate-100 text-slate-700 border border-slate-200/60 group-hover:border-electric/25 group-hover:bg-electric/5 group-hover:text-electric-dark'
                    : 'bg-white/5 text-white/50 border border-white/5 group-hover:border-white/10 group-hover:text-white/70'
                }`}
              >
                {feature}
              </span>
            ))}
          </div>

          {/* Learn more link */}
          <motion.div
            className={`flex items-center gap-2 text-sm font-semibold transition-all duration-300 ${
              isLight
                ? 'text-electric group-hover:text-electric-dark'
                : 'text-electric group-hover:text-electric-light'
            }`}
            initial={false}
            animate={{ x: isHovered ? 5 : 0 }}
          >
            <span>Learn more</span>
            <ArrowUpRight className="h-4 w-4" />
          </motion.div>
        </div>

        {/* Corner decoration */}
        <div
          className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl ${service.color} opacity-0 ${
            isLight ? 'group-hover:opacity-10' : 'group-hover:opacity-20'
          } transition-opacity duration-500 rounded-bl-full`}
        />

        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={false}
          animate={{
            background: isHovered
              ? isLight
                ? 'linear-gradient(105deg, transparent 40%, rgba(42,107,255,0.04) 45%, rgba(42,107,255,0.08) 50%, rgba(42,107,255,0.04) 55%, transparent 60%)'
                : 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 55%, transparent 60%)'
              : 'linear-gradient(105deg, transparent 40%, transparent 45%, transparent 50%, transparent 55%, transparent 60%)',
          }}
          transition={{ duration: 0.5 }}
          style={{
            transform: isHovered ? 'translateX(100%)' : 'translateX(-100%)',
          }}
        />
      </div>
    </motion.div>
  );
};

const ServiceCards: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === 'light';

  return (
    <section
      id="services"
      className={`relative py-24 md:py-32 overflow-hidden transition-colors duration-300 ${
        isLight ? 'bg-slate-50/70' : 'bg-charcoal'
      }`}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className={`absolute top-20 left-10 w-96 h-96 rounded-full blur-3xl ${
            isLight ? 'bg-electric/10' : 'bg-electric/5'
          }`}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className={`absolute bottom-20 right-10 w-80 h-80 rounded-full blur-3xl ${
            isLight ? 'bg-purple-500/10' : 'bg-purple-500/5'
          }`}
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            className="text-sm font-semibold text-electric uppercase tracking-widest mb-4 block"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            What I Do
          </motion.span>
          <motion.h2
            className={`text-section font-bold mb-6 transition-colors duration-300 ${
              isLight ? 'text-slate-950' : 'text-white'
            }`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Services & <span className="text-electric">Expertise</span>
          </motion.h2>
          <motion.p
            className={`text-lg transition-colors duration-300 ${
              isLight ? 'text-slate-600' : 'text-white/70'
            }`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Comprehensive solutions spanning data analytics, AI innovation, and digital health transformation.
          </motion.p>
        </motion.div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceCards;
