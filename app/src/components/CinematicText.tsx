import React, { useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

interface CinematicTextProps {
  text: string;
  className?: string;
  delay?: number;
  type?: 'word' | 'letter' | 'line';
  highlightWords?: string[];
  highlightClassName?: string;
}

// Letter by letter animation with cinematic effect
const letterVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 50,
    rotateX: -90,
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      delay: i * 0.03,
      duration: 0.5,
      ease: [0.215, 0.61, 0.355, 1],
    },
  }),
};

// Word by word animation
const wordVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    filter: 'blur(10px)',
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.215, 0.61, 0.355, 1],
    },
  }),
};

// Line reveal with mask
const lineVariants: Variants = {
  hidden: { 
    clipPath: 'inset(0 100% 0 0)',
  },
  visible: {
    clipPath: 'inset(0 0% 0 0)',
    transition: {
      duration: 0.8,
      ease: [0.77, 0, 0.175, 1],
    },
  },
};



const CinematicText: React.FC<CinematicTextProps> = ({
  text,
  className = '',
  delay = 0,
  type = 'letter',
  highlightWords = [],
  highlightClassName = 'text-electric',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const { animationsEnabled, reducedMotion } = useTheme();

  const shouldAnimate = animationsEnabled && !reducedMotion;

  // Split text based on type
  const getContent = () => {
    if (type === 'letter') {
      return text.split('').map((char, i) => {
        const isSpace = char === ' ';
        const isHighlighted = highlightWords.some(word => 
          text.toLowerCase().includes(word.toLowerCase()) &&
          text.toLowerCase().indexOf(word.toLowerCase()) <= i &&
          i < text.toLowerCase().indexOf(word.toLowerCase()) + word.length
        );

        return (
          <motion.span
            key={i}
            custom={i + delay * 10}
            initial={shouldAnimate ? 'hidden' : 'visible'}
            animate={isInView ? 'visible' : 'hidden'}
            variants={letterVariants}
            className={`inline-block ${isSpace ? '' : ''} ${isHighlighted ? highlightClassName : ''}`}
            style={{ 
              willChange: 'transform, opacity',
              transformStyle: 'preserve-3d',
            }}
          >
            {isSpace ? '\u00A0' : char}
          </motion.span>
        );
      });
    }

    if (type === 'word') {
      return text.split(' ').map((word, i) => {
        const isHighlighted = highlightWords.includes(word);
        
        return (
          <motion.span
            key={i}
            custom={i + delay * 5}
            initial={shouldAnimate ? 'hidden' : 'visible'}
            animate={isInView ? 'visible' : 'hidden'}
            variants={wordVariants}
            className={`inline-block mr-[0.25em] ${isHighlighted ? highlightClassName : ''}`}
          >
            {word}
          </motion.span>
        );
      });
    }

    // Line type
    return (
      <motion.span
        initial={shouldAnimate ? 'hidden' : 'visible'}
        animate={isInView ? 'visible' : 'hidden'}
        variants={lineVariants}
        className="block"
      >
        {text}
      </motion.span>
    );
  };

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      {getContent()}
    </div>
  );
};

// Specialized component for "Hi, I'm" style greetings
export const GreetingText: React.FC<{
  greeting: string;
  name: string;
  tagline?: string;
  className?: string;
}> = ({ greeting, name, tagline, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { animationsEnabled, reducedMotion } = useTheme();
  const shouldAnimate = animationsEnabled && !reducedMotion;

  return (
    <div ref={ref} className={className}>
      {/* Greeting - slides up with blur */}
      <motion.div
        initial={shouldAnimate ? { opacity: 0, y: 30, filter: 'blur(10px)' } : {}}
        animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-white/60 text-lg md:text-xl mb-2"
      >
        {greeting}
      </motion.div>

      {/* Name - letter by letter with 3D rotation */}
      <div className="perspective-1000">
        <h1 className="text-hero font-bold text-white tracking-tight">
          {name.split('').map((char, i) => (
            <motion.span
              key={i}
              initial={shouldAnimate ? { 
                opacity: 0, 
                y: 100,
                rotateX: -90,
              } : {}}
              animate={isInView ? { 
                opacity: 1, 
                y: 0,
                rotateX: 0,
              } : {}}
              transition={{
                duration: 0.6,
                delay: 0.4 + i * 0.04,
                ease: [0.215, 0.61, 0.355, 1],
              }}
              className={`inline-block ${char === ' ' ? '' : ''} ${i > name.indexOf(' ') ? 'text-electric' : ''}`}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </h1>
      </div>

      {/* Tagline - word by word fade */}
      {tagline && (
        <motion.p
          initial={shouldAnimate ? { opacity: 0, y: 20 } : {}}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-lg md:text-xl text-white/70 mt-4 max-w-2xl"
        >
          {tagline}
        </motion.p>
      )}

      {/* Decorative line */}
      <motion.div
        initial={shouldAnimate ? { scaleX: 0 } : {}}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="w-24 h-1 bg-gradient-to-r from-electric to-purple-500 mt-6 origin-left"
      />
    </div>
  );
};

// Scramble text effect for tech/data feel
export const ScrambleText: React.FC<{
  text: string;
  className?: string;
  delay?: number;
}> = ({ text, className = '', delay = 0 }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const { animationsEnabled, reducedMotion } = useTheme();
  const [displayText, setDisplayText] = React.useState(text);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  React.useEffect(() => {
    if (!isInView || !animationsEnabled || reducedMotion) {
      setDisplayText(text);
      return;
    }

    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      if (iteration >= text.length) {
        clearInterval(interval);
      }

      iteration += 1 / 2;
    }, 30);

    return () => clearInterval(interval);
  }, [isInView, text, animationsEnabled, reducedMotion]);

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ delay, duration: 0.3 }}
      className={`font-mono ${className}`}
    >
      {displayText}
    </motion.span>
  );
};

export default CinematicText;
