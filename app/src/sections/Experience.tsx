import { useRef } from 'react';
import { Briefcase, GraduationCap, MapPin, Calendar } from 'lucide-react';
import { motion, useInView } from 'framer-motion';

interface ExperienceItem {
  id: string;
  title: string;
  organization: string;
  location: string;
  start_date: string;
  end_date?: string;
  current: boolean;
  description: string;
  highlights: string[];
}

interface EducationItem {
  id: string;
  school: string;
  program: string;
  degree: string;
  start_date: string;
  end_date?: string;
  current: boolean;
}

const experienceItems: ExperienceItem[] = [
  {
    id: '1',
    title: 'Health Data Analyst',
    organization: 'Digital Health Solutions Ltd',
    location: 'Nairobi, Kenya',
    start_date: '2022-03-01',
    current: true,
    description: 'Leading data analytics initiatives for healthcare clients, developing predictive models and building data pipelines.',
    highlights: [
      'Reduced patient readmission rates by 30% through predictive modeling',
      'Built ETL pipelines processing 1M+ records daily',
      'Led team of 5 data analysts',
    ],
  },
  {
    id: '2',
    title: 'Database Administrator',
    organization: 'Tech Health Systems',
    location: 'Nairobi, Kenya',
    start_date: '2020-06-01',
    end_date: '2022-02-28',
    current: false,
    description: 'Managed clinical databases, optimized query performance, and ensured data security compliance.',
    highlights: [
      'Improved query performance by 90%',
      'Implemented HIPAA-compliant data security measures',
      'Migrated legacy systems to modern cloud infrastructure',
    ],
  },
  {
    id: '3',
    title: 'Data Analyst Intern',
    organization: 'County Health Department',
    location: 'Mombasa, Kenya',
    start_date: '2019-01-01',
    end_date: '2019-12-31',
    current: false,
    description: 'Analyzed public health data and created reports for policy makers.',
    highlights: [
      'Developed dashboards for COVID-19 tracking',
      'Created automated reporting system',
    ],
  },
];

const educationItems: EducationItem[] = [
  {
    id: '1',
    school: 'University of Nairobi',
    program: 'Health Information Science',
    degree: 'Bachelor of Science',
    start_date: '2016-09-01',
    end_date: '2020-06-01',
    current: false,
  },
  {
    id: '2',
    school: 'Moringa School',
    program: 'Data Science Bootcamp',
    degree: 'Certificate',
    start_date: '2020-08-01',
    end_date: '2020-12-01',
    current: false,
  },
];

const TimelineCard: React.FC<{ 
  children: React.ReactNode; 
  index: number;
  isInView: boolean;
}> = ({ children, index, isInView }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50, y: 30 }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.15,
        
      }}
      whileHover={{ y: -4, transition: { duration: 0.3 } }}
      className="relative pl-8 border-l border-white/10 group"
    >
      {/* Timeline dot with pulse effect */}
      <motion.div 
        className="absolute left-0 top-0 w-2 h-2 bg-electric rounded-full -translate-x-[5px]"
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ delay: index * 0.15 + 0.3, type: 'spring', stiffness: 200 }}
      >
        <motion.div
          className="absolute inset-0 bg-electric rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: index * 0.2,
          }}
        />
      </motion.div>
      
      {/* Card content */}
      <div className="bg-charcoal-light border border-white/5 rounded-xl p-6 transition-all duration-300 group-hover:border-electric/20 group-hover:shadow-lg group-hover:shadow-electric/5">
        {children}
      </div>
    </motion.div>
  );
};

const Experience: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
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

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative py-24 md:py-32 bg-charcoal overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-electric/5 via-transparent to-electric/5" />

      {/* Floating decorations */}
      <motion.div
        className="absolute top-40 left-10 w-80 h-80 bg-electric/5 rounded-full blur-3xl"
        animate={{
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-40 right-10 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"
        animate={{
          y: [0, -20, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.span 
            className="text-sm text-electric uppercase tracking-widest mb-4 block"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Background
          </motion.span>
          <motion.h2 
            className="text-section font-bold text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Experience & <span className="text-electric">Education</span>
          </motion.h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Work Experience */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            <motion.h3 
              className="text-xl font-semibold text-white mb-8 flex items-center gap-3"
              variants={itemVariants}
            >
              <motion.div 
                className="p-2 bg-electric/10 rounded-lg"
                whileHover={{ rotate: 10, scale: 1.1 }}
              >
                <Briefcase className="h-5 w-5 text-electric" />
              </motion.div>
              Work Experience
            </motion.h3>

            <div className="space-y-8">
              {experienceItems.map((item, index) => (
                <TimelineCard key={item.id} index={index} isInView={isInView}>
                  <h4 className="text-lg font-semibold text-white mb-1">
                    {item.title}
                  </h4>
                  <p className="text-electric mb-3">{item.organization}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-white/50 mb-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {item.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(item.start_date).getFullYear()} - {item.current ? 'Present' : item.end_date ? new Date(item.end_date).getFullYear() : ''}
                    </span>
                  </div>

                  <p className="text-white/70 text-sm mb-4">{item.description}</p>

                  <ul className="space-y-2">
                    {item.highlights.map((highlight, i) => (
                      <motion.li 
                        key={i} 
                        className="text-sm text-white/50 flex items-start gap-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: index * 0.15 + 0.5 + i * 0.1 }}
                      >
                        <span className="text-electric mt-1">•</span>
                        {highlight}
                      </motion.li>
                    ))}
                  </ul>
                </TimelineCard>
              ))}
            </div>
          </motion.div>

          {/* Education */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            <motion.h3 
              className="text-xl font-semibold text-white mb-8 flex items-center gap-3"
              variants={itemVariants}
            >
              <motion.div 
                className="p-2 bg-electric/10 rounded-lg"
                whileHover={{ rotate: 10, scale: 1.1 }}
              >
                <GraduationCap className="h-5 w-5 text-electric" />
              </motion.div>
              Education
            </motion.h3>

            <div className="space-y-8">
              {educationItems.map((item, index) => (
                <TimelineCard key={item.id} index={index} isInView={isInView}>
                  <h4 className="text-lg font-semibold text-white mb-1">
                    {item.program}
                  </h4>
                  <p className="text-electric mb-1">{item.degree}</p>
                  <p className="text-white/60 text-sm mb-3">{item.school}</p>
                  
                  <div className="flex items-center gap-1 text-sm text-white/50">
                    <Calendar className="h-4 w-4" />
                    {new Date(item.start_date).getFullYear()} - {item.current ? 'Present' : item.end_date ? new Date(item.end_date).getFullYear() : ''}
                  </div>
                </TimelineCard>
              ))}
            </div>

            {/* Decorative connecting line for visual interest */}
            <motion.div
              className="hidden lg:block absolute left-1/2 top-48 bottom-48 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent"
              initial={{ scaleY: 0 }}
              animate={isInView ? { scaleY: 1 } : {}}
              transition={{ duration: 1.5, delay: 0.5 }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
