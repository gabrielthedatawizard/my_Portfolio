import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, ExternalLink, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import type { Project } from '../types';
import { useProjects } from '@/hooks/useData';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { trackContentView } from '@/lib/contentTracking';

// Sample projects data
const sampleProjects: Project[] = [
  {
    id: '1',
    title: 'Health Data Analytics Platform',
    slug: 'health-data-analytics',
    summary: 'A comprehensive analytics platform for visualizing and analyzing healthcare data to improve patient outcomes.',
    content: 'This platform integrates multiple data sources including EHR systems, wearable devices, and lab results to provide a unified view of patient health. It features interactive dashboards, predictive analytics, and automated reporting.',
    problem: 'Healthcare providers struggled with fragmented data across multiple systems, making it difficult to get a comprehensive view of patient health.',
    approach: 'We designed a centralized data warehouse with ETL pipelines to consolidate data from various sources. Machine learning models were developed for risk prediction and anomaly detection.',
    tools: ['Python', 'PostgreSQL', 'React', 'TensorFlow', 'AWS'],
    tags: ['Data Analytics', 'Healthcare', 'AI/ML'],
    outcomes: 'Reduced data retrieval time by 70%, improved diagnostic accuracy by 25%, and enabled proactive care for high-risk patients.',
    featured: true,
    start_date: '2023-01-01',
    end_date: '2023-06-30',
    project_url: 'https://health-data-analytics-ai.vercel.app',
    github_url: 'https://github.com/gabrielthedatawizard',
    status: 'published',
  },
  {
    id: '2',
    title: 'TRIP — Tanzania Readmission Intelligence Platform',
    slug: 'trip-readmission-intelligence',
    summary: 'AI-powered platform that predicts 30-day hospital readmission risk, helping Tanzanian hospitals intervene early and improve patient outcomes.',
    content: "TRIP (Tanzania Readmission Intelligence Platform) is an AI-powered readmission prevention system for Tanzania's health system. It uses predictive analytics to identify patients at risk of 30-day hospital readmission, with interactive dashboards, patient-level risk views and exportable PDF reports for clinical and administrative teams. The platform was selected for presentation at the 3rd UDOM Scientific Conference on Health (USCHe 2026).",
    problem: 'Hospitals struggle to tell which discharged patients will bounce back within 30 days, driving preventable readmissions, crowded wards and wasted resources.',
    approach: 'Built an AI-driven risk-stratification workflow with interactive dashboards, patient-level risk views and one-click PDF exports so clinicians and managers can act on the predictions.',
    tools: ['React', 'Machine Learning', 'Data Visualization', 'PDF Reporting', 'Vercel'],
    tags: ['Machine Learning', 'Predictive Analytics', 'Digital Health'],
    outcomes: 'Live platform deployed on Vercel and serving real users; selected for presentation at the 3rd UDOM Scientific Conference on Health (USCHe 2026).',
    featured: true,
    start_date: '2026-01-01',
    project_url: 'https://patient-readmission-prediction-plat-red.vercel.app',
    github_url: 'https://github.com/gabrielthedatawizard',
    cover_url: '/screenshots/trip-logo.png',
    status: 'published',
  },
  {
    id: '3',
    title: 'Clinical Database Optimization',
    slug: 'clinical-database-optimization',
    summary: 'Redesigned and optimized a clinical database system, improving query performance and data integrity.',
    content: 'Complete overhaul of a legacy clinical database system, implementing modern data architecture patterns and optimization techniques.',
    problem: 'Slow query performance and data inconsistencies were affecting clinical decision-making and reporting.',
    approach: 'Normalized the database schema, implemented proper indexing strategies, and set up automated data quality checks.',
    tools: ['PostgreSQL', 'Redis', 'Python', 'Airflow'],
    tags: ['Database', 'SQL', 'Optimization'],
    outcomes: 'Query performance improved by 90%, data integrity issues reduced by 95%, and report generation time decreased from hours to minutes.',
    featured: true,
    start_date: '2023-06-01',
    end_date: '2023-09-30',
    github_url: 'https://github.com/gabrielthedatawizard',
    status: 'published',
  },
  {
    id: '4',
    title: 'Telemedicine Dashboard',
    slug: 'telemedicine-dashboard',
    summary: 'Real-time dashboard for monitoring telemedicine sessions and patient engagement metrics.',
    content: 'A comprehensive dashboard that provides real-time insights into telemedicine operations, patient engagement, and system performance.',
    problem: 'Healthcare administrators lacked visibility into telemedicine operations and patient engagement patterns.',
    approach: 'Built a real-time data pipeline using WebSockets and created intuitive visualizations for key metrics.',
    tools: ['React', 'Node.js', 'MongoDB', 'Socket.io', 'D3.js'],
    tags: ['Web Development', 'Real-time', 'Dashboard'],
    outcomes: 'Increased patient engagement by 40% and reduced no-show rates by 25% through data-driven interventions.',
    featured: false,
    start_date: '2023-09-01',
    end_date: '2023-12-31',
    github_url: 'https://github.com/gabrielthedatawizard',
    status: 'published',
  },
];

const defaultFilterTags = ['All', 'Data Analytics', 'Machine Learning', 'Database', 'Web Development', 'Healthcare'];

// Project image component with hover effects
// Shows the real cover photo when one is available (Supabase project_media
// cover or the project's `cover_url`), otherwise the gradient placeholder.
const ProjectImage: React.FC<{ project: Project; cover?: string }> = ({ project, cover }) => {
  const imageRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 20;
    const y = (e.clientY - rect.top - rect.height / 2) / 20;
    setMousePosition({ x, y });
  };

  return (
    <motion.div
      ref={imageRef}
      className="aspect-video bg-gradient-to-br from-electric/20 to-purple-500/20 relative overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePosition({ x: 0, y: 0 });
      }}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${-mousePosition.y}deg) rotateY(${mousePosition.x}deg) scale3d(1.02, 1.02, 1.02)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transition: 'transform 0.3s ease-out',
      }}
    >
      {/* Dynamic gradient background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-electric/30 to-purple-500/30"
        animate={{
          background: isHovered
            ? 'radial-gradient(circle at ' + (50 + mousePosition.x * 2) + '% ' + (50 + mousePosition.y * 2) + '%, rgba(42,107,255,0.4), rgba(147,51,234,0.2))'
            : 'linear-gradient(to bottom right, rgba(42,107,255,0.2), rgba(147,51,234,0.2))',
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Real cover photo when available */}
      {cover && (
        <img
          src={cover}
          alt={`${project.title} screenshot`}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500"
          style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
        />
      )}

      {/* Project initial letter (placeholder when no photo) */}
      {!cover && (
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span 
          className="text-6xl font-bold text-white/10"
          animate={{
            scale: isHovered ? 1.2 : 1,
            opacity: isHovered ? 0.05 : 0.1,
          }}
          transition={{ duration: 0.4 }}
        >
          {project.title[0]}
        </motion.span>
      </div>
      )}

      {/* Overlay on hover */}
      <motion.div 
        className="absolute inset-0 bg-electric/80 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.span 
          className="text-white font-medium flex items-center gap-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ 
            y: isHovered ? 0 : 20, 
            opacity: isHovered ? 1 : 0 
          }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          View Case Study <ArrowUpRight className="h-5 w-5" />
        </motion.span>
      </motion.div>

      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.1) 45%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.1) 55%, transparent 60%)',
          transform: `translateX(${isHovered ? '100%' : '-100%'})`,
          transition: 'transform 0.6s ease-out',
        }}
      />
    </motion.div>
  );
};

const Projects: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const { data: projectsData, loading } = useProjects({ status: 'published' });
  const useSampleData = !isSupabaseConfigured;
  const projects = useSampleData ? sampleProjects : projectsData;

  // Cover photos uploaded via Admin → Projects are stored in `project_media`
  // (order 0 = cover). Fetch them so the public cards show real screenshots.
  const [covers, setCovers] = useState<Record<string, string>>({});
  useEffect(() => {
    if (useSampleData) return;
    let cancelled = false;
    (async () => {
      try {
        const { data } = await supabase
          .from('project_media')
          .select('project_id, image_url, order')
          .order('order', { ascending: true });
        if (cancelled) return;
        const map: Record<string, string> = {};
        ((data ?? []) as Array<{ project_id: string; image_url: string }>).forEach((entry) => {
          if (!map[entry.project_id] && entry.image_url) map[entry.project_id] = entry.image_url;
        });
        setCovers(map);
      } catch (error) {
        console.error('Failed to load project covers:', error);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [useSampleData]);

  const coverFor = (project: Project): string | undefined =>
    covers[project.id] ?? project.cover_url ?? undefined;

  const filterTags = useMemo(() => {
    if (useSampleData) return defaultFilterTags;
    const tagSet = new Set<string>();
    projectsData.forEach((project) => {
      (project.tags ?? []).forEach((tag) => {
        if (tag) tagSet.add(tag);
      });
    });
    return ['All', ...Array.from(tagSet)];
  }, [projectsData, useSampleData]);

  const filteredProjects = activeFilter === 'All'
    ? projects
    : projects.filter((project) => project.tags.includes(activeFilter));

  const handleOpenProject = (project: Project) => {
    setSelectedProject(project);
    trackContentView(`/projects/${project.slug}`);
  };

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

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative py-24 md:py-32 bg-charcoal overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-electric/5 via-transparent to-transparent" />

      {/* Floating decorations */}
      <motion.div
        className="absolute top-40 right-20 w-72 h-72 bg-electric/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div 
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div>
            <motion.span 
              className="text-sm text-electric uppercase tracking-widest mb-4 block"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Portfolio
            </motion.span>
            <motion.h2 
              className="text-section font-bold text-white"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Featured <span className="text-electric">Projects</span>
            </motion.h2>
          </div>

          {/* Filter Tags */}
          <motion.div 
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {filterTags.map((tag, index) => (
              <motion.button
                key={tag}
                onClick={() => setActiveFilter(tag)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                className={`px-4 py-2 text-sm rounded-full border transition-all duration-300 ${
                  activeFilter === tag
                    ? 'bg-electric border-electric text-white'
                    : 'bg-transparent border-white/20 text-white/70 hover:border-white/40'
                }`}
              >
                {tag}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeFilter}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: 20 }}
          >
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                onClick={() => handleOpenProject(project)}
                whileHover={{ y: -8 }}
                className="group relative bg-charcoal-light border border-white/5 rounded-2xl overflow-hidden cursor-pointer"
                style={{
                  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                }}
              >
                {/* Image with 3D hover effect */}
                <ProjectImage project={project} cover={coverFor(project)} />

                {/* Content */}
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.tags.slice(0, 3).map((tag, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="bg-white/5 text-white/70 border-0 text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-electric transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-white/60 text-sm line-clamp-2">
                    {project.summary}
                  </p>
                </div>

                {/* Hover border glow */}
                <div className="absolute inset-0 rounded-2xl border border-electric/0 group-hover:border-electric/30 transition-all duration-500 pointer-events-none" />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {!loading && filteredProjects.length === 0 && (
          <p className="text-center text-white/40 mt-8">No published projects yet.</p>
        )}

        {/* View All Button */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              size="lg"
              className="border-white/20 text-white hover:bg-white/10 rounded-full group relative overflow-hidden"
              asChild
            >
              <a
                href="https://github.com/gabrielthedatawizard"
                target="_blank"
                rel="noopener noreferrer"
              >
              <span className="relative z-10">View All Projects</span>
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-electric/20 to-purple-500/20"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.5 }}
              />
              <ArrowUpRight className="ml-2 h-5 w-5 relative z-10" />
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Project Detail Modal */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-3xl bg-charcoal-light border-white/10 text-white max-h-[90vh] overflow-y-auto">
          <AnimatePresence>
            {selectedProject && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Header Image */}
                <div className="aspect-video bg-gradient-to-br from-electric/20 to-purple-500/20 rounded-lg mb-6 flex items-center justify-center relative overflow-hidden">
                  {coverFor(selectedProject) ? (
                    <img
                      src={coverFor(selectedProject)}
                      alt={`${selectedProject.title} screenshot`}
                      className="absolute inset-0 h-full w-full object-cover object-top"
                    />
                  ) : (
                  <motion.span 
                    className="text-8xl font-bold text-white/10"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {selectedProject.title[0]}
                  </motion.span>
                  )}
                  
                  {/* Animated background */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-electric/10 to-purple-500/10"
                    animate={{
                      background: [
                        'radial-gradient(circle at 0% 0%, rgba(42,107,255,0.2), transparent 50%)',
                        'radial-gradient(circle at 100% 100%, rgba(147,51,234,0.2), transparent 50%)',
                        'radial-gradient(circle at 0% 0%, rgba(42,107,255,0.2), transparent 50%)',
                      ],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                </div>

                <DialogHeader>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedProject.tags.map((tag, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <Badge
                          className="bg-electric/20 text-electric border-0"
                        >
                          {tag}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                  <DialogTitle className="text-2xl font-bold text-white">
                    {selectedProject.title}
                  </DialogTitle>
                  <DialogDescription className="text-white/60">
                    {selectedProject.summary}
                  </DialogDescription>
                </DialogHeader>

                <motion.div 
                  className="space-y-6 mt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {/* Problem */}
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">The Problem</h4>
                    <p className="text-white/70">{selectedProject.problem}</p>
                  </div>

                  {/* Approach */}
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">My Approach</h4>
                    <p className="text-white/70">{selectedProject.approach}</p>
                  </div>

                  {/* Tools */}
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Tools & Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tools.map((tool, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 + i * 0.05 }}
                        >
                          <Badge
                            variant="outline"
                            className="border-white/20 text-white/80"
                          >
                            {tool}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Outcomes */}
                  <motion.div 
                    className="bg-electric/10 rounded-lg p-4"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h4 className="text-lg font-semibold text-electric mb-2">Results & Impact</h4>
                    <p className="text-white/80">{selectedProject.outcomes}</p>
                  </motion.div>

                  {/* Links */}
                  <div className="flex gap-4 pt-4">
                    {selectedProject.project_url && (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          className="bg-electric hover:bg-electric-dark text-white"
                          asChild
                        >
                          <a
                            href={selectedProject.project_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Live Demo
                          </a>
                        </Button>
                      </motion.div>
                    )}
                    {selectedProject.github_url && (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10"
                          asChild
                        >
                          <a
                            href={selectedProject.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Github className="mr-2 h-4 w-4" />
                            View Code
                          </a>
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Projects;
