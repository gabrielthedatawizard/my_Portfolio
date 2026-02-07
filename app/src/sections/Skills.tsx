import React, { useState, useRef } from 'react';
import { Database, Brain, Activity, Code, BarChart3, Wrench, Users } from 'lucide-react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

interface SkillCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  skills: string[];
  color: string;
}

const skillCategories: SkillCategory[] = [
  {
    id: 'data_bi',
    name: 'Data & BI',
    icon: BarChart3,
    description: 'Data analysis, visualization, and business intelligence',
    skills: ['Python', 'R', 'Pandas', 'NumPy', 'Tableau', 'Power BI', 'Excel', 'SPSS', 'Data Visualization'],
    color: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    id: 'databases',
    name: 'Databases',
    icon: Database,
    description: 'Database design, administration, and optimization',
    skills: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQL', 'Database Design', 'ETL', 'Data Warehousing'],
    color: 'from-green-500/20 to-emerald-500/20',
  },
  {
    id: 'ai_ml',
    name: 'AI & Machine Learning',
    icon: Brain,
    description: 'Machine learning models and AI applications',
    skills: ['TensorFlow', 'Scikit-learn', 'Keras', 'PyTorch', 'NLP', 'Computer Vision', 'Predictive Modeling', 'Deep Learning'],
    color: 'from-purple-500/20 to-pink-500/20',
  },
  {
    id: 'digital_health',
    name: 'Digital Health',
    icon: Activity,
    description: 'Healthcare technology and health informatics',
    skills: ['HL7 FHIR', 'EHR Systems', 'Health Informatics', 'Clinical Data', 'Telemedicine', 'Medical Imaging', 'HIPAA Compliance'],
    color: 'from-red-500/20 to-orange-500/20',
  },
  {
    id: 'programming',
    name: 'Programming',
    icon: Code,
    description: 'Software development and web technologies',
    skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'HTML/CSS', 'Git', 'REST APIs', 'GraphQL'],
    color: 'from-yellow-500/20 to-amber-500/20',
  },
  {
    id: 'tools',
    name: 'Tools & Platforms',
    icon: Wrench,
    description: 'Development and deployment tools',
    skills: ['Docker', 'AWS', 'Google Cloud', 'Linux', 'Jupyter', 'VS Code', 'Postman', 'Figma'],
    color: 'from-indigo-500/20 to-violet-500/20',
  },
  {
    id: 'research',
    name: 'Research Methods',
    icon: BarChart3,
    description: 'Scientific research and analytical methods',
    skills: ['Statistical Analysis', 'Research Design', 'Literature Review', 'Academic Writing', 'Data Collection', 'Hypothesis Testing'],
    color: 'from-teal-500/20 to-cyan-500/20',
  },
  {
    id: 'soft_skills',
    name: 'Soft Skills',
    icon: Users,
    description: 'Professional and interpersonal skills',
    skills: ['Problem Solving', 'Communication', 'Teamwork', 'Project Management', 'Critical Thinking', 'Adaptability'],
    color: 'from-rose-500/20 to-pink-500/20',
  },
];

const Skills: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>(skillCategories[0].id);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const currentCategory = skillCategories.find(c => c.id === activeCategory);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const skillBadgeVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative py-24 md:py-32 bg-charcoal overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-electric/5 to-transparent" />

      {/* Floating decorations */}
      <motion.div
        className="absolute top-20 left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -20, 0],
        }}
        transition={{
          duration: 8,
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
            Expertise
          </motion.span>
          <motion.h2 
            className="text-section font-bold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Skills & <span className="text-electric">Technologies</span>
          </motion.h2>
          <motion.p 
            className="text-white/70 text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            A comprehensive toolkit spanning data science, healthcare technology, 
            and software development.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Category Tabs */}
          <motion.div 
            className="lg:col-span-4 space-y-2"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            {skillCategories.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;
              return (
                <motion.button
                  key={category.id}
                  variants={itemVariants}
                  onClick={() => setActiveCategory(category.id)}
                  whileHover={{ x: 8 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 text-left relative overflow-hidden ${
                    isActive
                      ? 'bg-electric/10 border-electric/50'
                      : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                  }`}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-electric"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                  
                  <motion.div 
                    className={`p-2 rounded-lg transition-colors duration-300 ${
                      isActive ? 'bg-electric/20' : 'bg-white/5'
                    }`}
                    animate={isActive ? { rotate: [0, 10, -10, 0] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon className={`h-5 w-5 transition-colors duration-300 ${
                      isActive ? 'text-electric' : 'text-white/60'
                    }`} />
                  </motion.div>
                  <div>
                    <h3 className={`font-medium transition-colors duration-300 ${
                      isActive ? 'text-white' : 'text-white/70'
                    }`}>
                      {category.name}
                    </h3>
                    <p className="text-sm text-white/50 truncate">
                      {category.description}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>

          {/* Skills Display */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {currentCategory && (
                <motion.div
                  key={currentCategory.id}
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.98 }}
                  transition={{ duration: 0.4,  }}
                  className="bg-charcoal-light border border-white/5 rounded-2xl p-8"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <motion.div 
                      className={`p-3 rounded-xl bg-gradient-to-br ${currentCategory.color}`}
                      initial={{ scale: 0.8, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    >
                      <currentCategory.icon className="h-6 w-6 text-white" />
                    </motion.div>
                    <div>
                      <motion.h3 
                        className="text-2xl font-bold text-white"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        {currentCategory.name}
                      </motion.h3>
                      <motion.p 
                        className="text-white/60"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 }}
                      >
                        {currentCategory.description}
                      </motion.p>
                    </div>
                  </div>

                  <motion.div 
                    className="flex flex-wrap gap-3"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {currentCategory.skills.map((skill, index) => (
                      <motion.span
                        key={index}
                        variants={skillBadgeVariants}
                        whileHover={{ 
                          scale: 1.1, 
                          backgroundColor: 'rgba(42, 107, 255, 0.15)',
                          borderColor: 'rgba(42, 107, 255, 0.4)',
                          color: '#2A6BFF',
                        }}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white/80 cursor-default transition-all duration-300"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
