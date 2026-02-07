import React, { useState, useRef } from 'react';
import { Award, ExternalLink, Calendar, Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import type { Certificate } from '../types';

// Sample certificates data
const sampleCertificates: Certificate[] = [
  {
    id: '1',
    title: 'Google Data Analytics Professional Certificate',
    issuer: 'Google',
    issue_date: '2023-06-15',
    credential_url: 'https://www.credly.com',
    tags: ['Data Analytics', 'SQL', 'Tableau'],
    status: 'published',
  },
  {
    id: '2',
    title: 'AWS Certified Solutions Architect',
    issuer: 'Amazon Web Services',
    issue_date: '2023-04-20',
    expiry_date: '2026-04-20',
    credential_url: 'https://www.credly.com',
    tags: ['Cloud', 'AWS', 'Architecture'],
    status: 'published',
  },
  {
    id: '3',
    title: 'TensorFlow Developer Certificate',
    issuer: 'Google',
    issue_date: '2023-08-10',
    credential_url: 'https://www.tensorflow.org',
    tags: ['Machine Learning', 'Python', 'TensorFlow'],
    status: 'published',
  },
  {
    id: '4',
    title: 'Health Informatics Certificate',
    issuer: 'Johns Hopkins University',
    issue_date: '2022-12-01',
    credential_url: 'https://coursera.org',
    tags: ['Healthcare', 'Informatics', 'Data'],
    status: 'published',
  },
  {
    id: '5',
    title: 'PostgreSQL Administration',
    issuer: 'PostgreSQL Global Development Group',
    issue_date: '2023-02-15',
    credential_url: 'https://www.postgresql.org',
    tags: ['Database', 'PostgreSQL', 'SQL'],
    status: 'published',
  },
  {
    id: '6',
    title: 'Python for Data Science',
    issuer: 'IBM',
    issue_date: '2022-10-20',
    credential_url: 'https://www.credly.com',
    tags: ['Python', 'Data Science', 'Pandas'],
    status: 'published',
  },
];

const CertificateCard: React.FC<{
  cert: Certificate;
  index: number;
  isInView: boolean;
  onClick: () => void;
}> = ({ cert, index, isInView, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      onClick={onClick}
      className="group relative bg-charcoal-light border border-white/5 rounded-2xl p-6 cursor-pointer overflow-hidden"
    >
      {/* Hover gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-electric/10 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      />

      {/* Icon with animation */}
      <motion.div 
        className="relative w-14 h-14 bg-electric/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-electric/20 transition-colors duration-300"
        whileHover={{ rotate: 10, scale: 1.1 }}
      >
        <Award className="h-7 w-7 text-electric" />
      </motion.div>

      {/* Content */}
      <div className="relative">
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-electric transition-colors duration-300">
          {cert.title}
        </h3>
        <p className="text-white/60 text-sm mb-4">{cert.issuer}</p>

        {/* Date */}
        <div className="flex items-center gap-2 text-white/40 text-sm mb-4">
          <Calendar className="h-4 w-4" />
          <span>{new Date(cert.issue_date).toLocaleDateString()}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {cert.tags.slice(0, 3).map((tag, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: index * 0.1 + 0.3 + i * 0.05 }}
            >
              <Badge
                variant="secondary"
                className="bg-white/5 text-white/60 border-0 text-xs group-hover:bg-electric/10 group-hover:text-electric/80 transition-colors duration-300"
              >
                {tag}
              </Badge>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Border glow on hover */}
      <div className="absolute inset-0 rounded-2xl border border-electric/0 group-hover:border-electric/20 transition-all duration-500 pointer-events-none" />
    </motion.div>
  );
};

const Certificates: React.FC = () => {
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={sectionRef}
      id="certificates"
      className="relative py-24 md:py-32 bg-charcoal overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-electric/5 to-transparent" />

      {/* Floating decorations */}
      <motion.div
        className="absolute top-40 right-20 w-96 h-96 bg-electric/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
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
            Credentials
          </motion.span>
          <motion.h2 
            className="text-section font-bold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Certifications & <span className="text-electric">Awards</span>
          </motion.h2>
          <motion.p 
            className="text-white/70 text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Professional certifications and achievements that validate expertise 
            in data analytics, healthcare technology, and cloud computing.
          </motion.p>
        </motion.div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleCertificates.map((cert, index) => (
            <CertificateCard
              key={cert.id}
              cert={cert}
              index={index}
              isInView={isInView}
              onClick={() => setSelectedCertificate(cert)}
            />
          ))}
        </div>

        {/* Achievement highlight */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-3 px-6 py-3 bg-electric/10 border border-electric/20 rounded-full"
            whileHover={{ scale: 1.05 }}
          >
            <Trophy className="h-5 w-5 text-electric" />
            <span className="text-white/80">15+ Professional Certifications</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Certificate Detail Modal */}
      <Dialog open={!!selectedCertificate} onOpenChange={() => setSelectedCertificate(null)}>
        <DialogContent className="max-w-lg bg-charcoal-light border-white/10 text-white">
          <AnimatePresence>
            {selectedCertificate && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                {/* Icon */}
                <motion.div 
                  className="w-20 h-20 bg-electric/10 rounded-2xl flex items-center justify-center mx-auto mb-6"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                >
                  <Award className="h-10 w-10 text-electric" />
                </motion.div>

                {/* Title */}
                <motion.h3 
                  className="text-2xl font-bold text-white mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {selectedCertificate.title}
                </motion.h3>
                <motion.p 
                  className="text-electric text-lg mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  {selectedCertificate.issuer}
                </motion.p>

                {/* Date */}
                <motion.div 
                  className="flex items-center justify-center gap-2 text-white/60 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Calendar className="h-4 w-4" />
                  <span>Issued: {new Date(selectedCertificate.issue_date).toLocaleDateString()}</span>
                </motion.div>

                {/* Tags */}
                <motion.div 
                  className="flex flex-wrap justify-center gap-2 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                >
                  {selectedCertificate.tags.map((tag, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                    >
                      <Badge
                        className="bg-electric/20 text-electric border-0"
                      >
                        {tag}
                      </Badge>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Credential Link */}
                {selectedCertificate.credential_url && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <motion.a
                      href={selectedCertificate.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-electric hover:bg-electric-dark text-white rounded-full transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ExternalLink className="h-4 w-4" />
                      Verify Credential
                    </motion.a>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Certificates;
