import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface FloatingImage {
  id: number;
  src: string;
  alt: string;
  initialX: string;
  initialY: string;
  width: number;
  height: number;
  rotation: number;
  parallaxSpeed: number;
  floatDelay: number;
}

// Sample floating images - replace with actual project images
const floatingImagesData: FloatingImage[] = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop',
    alt: 'Health Data Analytics',
    initialX: '5%',
    initialY: '20%',
    width: 180,
    height: 240,
    rotation: -8,
    parallaxSpeed: 0.3,
    floatDelay: 0,
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    alt: 'Data Visualization',
    initialX: '75%',
    initialY: '15%',
    width: 200,
    height: 150,
    rotation: 6,
    parallaxSpeed: 0.5,
    floatDelay: 0.5,
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
    alt: 'AI Machine Learning',
    initialX: '85%',
    initialY: '60%',
    width: 160,
    height: 200,
    rotation: -5,
    parallaxSpeed: 0.4,
    floatDelay: 1,
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400&h=300&fit=crop',
    alt: 'Database Systems',
    initialX: '2%',
    initialY: '65%',
    width: 190,
    height: 140,
    rotation: 4,
    parallaxSpeed: 0.35,
    floatDelay: 1.5,
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
    alt: 'Digital Health',
    initialX: '15%',
    initialY: '85%',
    width: 150,
    height: 200,
    rotation: -3,
    parallaxSpeed: 0.45,
    floatDelay: 2,
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    alt: 'Analytics Dashboard',
    initialX: '70%',
    initialY: '75%',
    width: 170,
    height: 130,
    rotation: 7,
    parallaxSpeed: 0.25,
    floatDelay: 2.5,
  },
];

const FloatingImageItem: React.FC<{ image: FloatingImage; mouseX: any; mouseY: any }> = ({
  image,
  mouseX,
  mouseY,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  
  // Smooth spring physics for mouse following
  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);
  const rotate = useSpring(0, { damping: 20, stiffness: 100 });

  useEffect(() => {
    const handleMouseMove = () => {
      const mouseXVal = mouseX.get();
      const mouseYVal = mouseY.get();
      
      // Calculate offset based on parallax speed
      const offsetX = (mouseXVal - 0.5) * image.parallaxSpeed * 100;
      const offsetY = (mouseYVal - 0.5) * image.parallaxSpeed * 100;
      
      x.set(offsetX);
      y.set(offsetY);
      rotate.set((mouseXVal - 0.5) * 10 * image.parallaxSpeed);
    };

    const unsubscribeX = mouseX.on('change', handleMouseMove);
    const unsubscribeY = mouseY.on('change', handleMouseMove);

    return () => {
      unsubscribeX();
      unsubscribeY();
    };
  }, [mouseX, mouseY, image.parallaxSpeed, x, y, rotate]);

  return (
    <motion.div
      ref={ref}
      className="absolute hidden lg:block"
      style={{
        left: image.initialX,
        top: image.initialY,
        width: image.width,
        height: image.height,
        x,
        y,
        rotate,
        zIndex: 1,
      }}
      initial={{ 
        opacity: 0, 
        scale: 0.8,
        y: 50,
      }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        y: 0,
        rotate: image.rotation,
      }}
      transition={{
        duration: 1,
        delay: image.floatDelay * 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {/* Floating animation wrapper */}
      <motion.div
        animate={{
          y: [0, -15, 0],
          rotate: [image.rotation, image.rotation + 2, image.rotation],
        }}
        transition={{
          duration: 4 + Math.random() * 2,
          repeat: Infinity,
          delay: image.floatDelay,
          ease: 'easeInOut',
        }}
        className="w-full h-full"
      >
        {/* Image container with glass effect */}
        <div className="relative w-full h-full group cursor-pointer">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#2A6BFF]/30 to-purple-500/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Border gradient */}
          <div className="absolute -inset-[1px] bg-gradient-to-br from-white/20 to-white/5 rounded-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Image */}
          <div className="relative w-full h-full rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm">
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-white text-sm font-medium truncate">{image.alt}</p>
              </div>
            </div>
          </div>

          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const FloatingImages: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      mouseX.set(x);
      mouseY.set(y);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [mouseX, mouseY]);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      {floatingImagesData.map((image) => (
        <FloatingImageItem
          key={image.id}
          image={image}
          mouseX={mouseX}
          mouseY={mouseY}
        />
      ))}

      {/* Ambient particles */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-[#2A6BFF]/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default FloatingImages;
