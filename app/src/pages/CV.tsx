import React, { useEffect, useMemo, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Download, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProjects, useCertificates, useProfile, useExperience, useEducation } from '@/hooks/useData';
import { isSupabaseConfigured } from '@/lib/supabase';
import { trackContentView } from '@/lib/contentTracking';
import { sampleProjects, sampleCertificates, sampleExperience, sampleEducation } from '@/lib/sampleContent';
import type { Project, Certificate, Experience, Education } from '@/types';

const PERSONAL = {
  name: 'Gabriel R. Myeye',
  title:
    'Health Information Science | Data Analyst | Database Administrator | AI & Digital Health',
  email: 'gabrielthedatawizard@gmail.com',
  location: 'Dodoma, Tanzania',
  linkedin: 'https://www.linkedin.com/in/gabriel-myeye-361487307/',
  instagram: 'https://www.instagram.com/meulic/',
  whatsappNumber: '+255765578690',
  whatsappLink: 'https://wa.me/255765578690',
};

const SUMMARY =
  'Health Information Science student focused on building reliable, data-driven systems for digital health and decision support. Skilled in data cleaning, analysis, visualization, and database design/administration. Interested in ethical AI, automation, and practical innovation that improves workflows and outcomes. Strong communicator with a research mindset and a product-oriented approach.';

const outcomeForProject = (project: Pick<Project, 'title'>) => {
  const t = project.title.toLowerCase();
  if (t.includes('analytics')) {
    return 'Built an analytics workflow with dashboards and reporting to support health data review.';
  }
  if (t.includes('predictive') || t.includes('model')) {
    return 'Created an ML prototype and evaluation workflow to support risk/outbreak prediction experiments.';
  }
  if (t.includes('database') || t.includes('optimization')) {
    return 'Improved schema/indexing approach and data-quality checks to support faster, safer querying.';
  }
  if (t.includes('telemedicine') || t.includes('dashboard')) {
    return 'Delivered a monitoring dashboard to track sessions and engagement signals in near real time.';
  }
  return 'Delivered a working implementation with clear documentation and maintainable structure.';
};

const formatMonthYear = (value?: string | null) => {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

const formatRange = (start?: string | null, end?: string | null, current?: boolean) => {
  const from = formatMonthYear(start) || '—';
  const to = current ? 'Present' : formatMonthYear(end);
  return to ? `${from} – ${to}` : from;
};

const CV: React.FC = () => {
  const [searchParams] = useSearchParams();
  const useSampleData = !isSupabaseConfigured;
  const { data: projectData } = useProjects({ status: 'published' });
  const { data: certificateData } = useCertificates();
  const { data: profileData } = useProfile();
  const { data: experienceData } = useExperience();
  const { data: educationData } = useEducation();

  const projects = useMemo<Project[]>(() => {
    if (useSampleData) return sampleProjects as unknown as Project[];
    return projectData;
  }, [useSampleData, projectData]);

  const certificates = useMemo<Certificate[]>(() => {
    if (useSampleData) return sampleCertificates as unknown as Certificate[];
    return certificateData;
  }, [useSampleData, certificateData]);

  // Live profile with hardcoded fallback — admin edits in Settings now
  // flow into the CV instead of being invisible.
  const liveProfile = !useSampleData ? profileData[0] : undefined;
  const personal = {
    name: liveProfile?.name || PERSONAL.name,
    title: liveProfile?.headline || PERSONAL.title,
    email: liveProfile?.email || PERSONAL.email,
    location: liveProfile?.location || PERSONAL.location,
    linkedin: liveProfile?.linkedin || PERSONAL.linkedin,
    website: liveProfile?.website || null,
  };
  const summaryText =
    liveProfile?.bio && liveProfile.bio.length >= 40 ? liveProfile.bio : SUMMARY;

  const experience = useMemo<Array<Experience | (typeof sampleExperience)[number]>>(() => {
    if (useSampleData) return sampleExperience;
    return experienceData;
  }, [useSampleData, experienceData]);

  const education = useMemo<Array<Education | (typeof sampleEducation)[number]>>(() => {
    if (useSampleData) return sampleEducation;
    return educationData;
  }, [useSampleData, educationData]);

  const topProjects = useMemo(() => {
    const list = projects.filter(Boolean).slice(0, 5);
    return list.length > 0 ? list : [];
  }, [projects]);

  const topCertificates = useMemo(() => certificates.filter(Boolean).slice(0, 6), [certificates]);

  // Hiring-intent tracking: this page renders outside PublicLayout so the
  // global visitor tracker never fires here — log the view explicitly, and
  // log `/cv/download` whenever the print/PDF flow is triggered (once per mount).
  const downloadTracked = useRef(false);
  const trackDownload = () => {
    if (downloadTracked.current) return;
    downloadTracked.current = true;
    trackContentView('/cv/download');
  };

  useEffect(() => {
    trackContentView('/cv');
  }, []);

  useEffect(() => {
    const shouldDownload = searchParams.get('download') === '1';
    if (!shouldDownload) return;
    const id = window.setTimeout(() => {
      trackDownload();
      window.print();
    }, 250);
    return () => window.clearTimeout(id);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-white text-slate-950 px-4 py-8">
      <div className="mx-auto w-full max-w-[860px]">
        <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/" aria-label="Back to homepage">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <Button
            onClick={() => {
              trackDownload();
              window.print();
            }}
            className="rounded-full bg-[#2563eb] text-white hover:bg-[#1d4ed8] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2"
            aria-label="Download CV as PDF (opens print dialog)"
          >
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>

        <main className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm print:shadow-none print:border-transparent">
          {/* Header */}
          <header className="flex flex-col gap-2 border-b border-slate-200 pb-5">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">{personal.name}</h1>
            <p className="text-sm sm:text-base text-slate-700">{personal.title}</p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-700">
              <a href={`mailto:${personal.email}`} className="underline underline-offset-4">
                {personal.email}
              </a>
              <span>{personal.location}</span>
              <a href={personal.linkedin} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                LinkedIn
              </a>
              {personal.website && (
                <a href={personal.website} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                  Website
                </a>
              )}
              <a href={PERSONAL.instagram} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                Instagram
              </a>
              <a
                href={PERSONAL.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4"
                aria-label={`WhatsApp ${PERSONAL.whatsappNumber}`}
              >
                WhatsApp
              </a>
            </div>
          </header>

          {/* Summary */}
          <section className="mt-6">
            <h2 className="text-sm font-semibold tracking-[0.18em] uppercase text-slate-900">
              Professional Summary
            </h2>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-800">{summaryText}</p>
          </section>

          {/* Skills */}
          <section className="mt-8">
            <h2 className="text-sm font-semibold tracking-[0.18em] uppercase text-slate-900">
              Core Skills
            </h2>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-800">
              <div>
                <div className="font-medium text-slate-900">Data</div>
                <div className="mt-1">Cleaning, analysis, reporting, visualization</div>
              </div>
              <div>
                <div className="font-medium text-slate-900">Databases</div>
                <div className="mt-1">Schema design, SQL, administration fundamentals</div>
              </div>
              <div>
                <div className="font-medium text-slate-900">Digital Health</div>
                <div className="mt-1">HIS concepts, data quality, interoperability awareness</div>
              </div>
              <div>
                <div className="font-medium text-slate-900">AI / Automation</div>
                <div className="mt-1">Applied AI tools, workflow automation mindset</div>
              </div>
              <div>
                <div className="font-medium text-slate-900">Research</div>
                <div className="mt-1">Study design basics, evidence-based thinking, documentation</div>
              </div>
            </div>
          </section>

          {/* Work Experience */}
          <section className="mt-8">
            <h2 className="text-sm font-semibold tracking-[0.18em] uppercase text-slate-900">
              Work Experience
            </h2>
            <div className="mt-3 space-y-4">
              {experience.length === 0 ? (
                <p className="text-sm text-slate-700">Available on request.</p>
              ) : (
                experience.map((job) => (
                  <div key={`${job.organization}-${job.title}-${job.start_date}`} className="rounded-xl border border-slate-200 p-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-semibold text-slate-950">
                        {job.title} <span className="font-normal text-slate-600">· {job.organization}</span>
                      </h3>
                      <span className="text-xs text-slate-500">
                        {formatRange(job.start_date, job.end_date, job.current)}
                        {job.location ? ` · ${job.location}` : ''}
                      </span>
                    </div>
                    {job.description && (
                      <p className="mt-2 text-sm text-slate-800">{job.description}</p>
                    )}
                    {(job.highlights ?? []).length > 0 && (
                      <ul className="mt-2 list-disc pl-5 text-sm text-slate-800 space-y-1">
                        {(job.highlights ?? []).map((h, i) => (
                          <li key={i}>{h}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Projects */}
          <section className="mt-8">
            <h2 className="text-sm font-semibold tracking-[0.18em] uppercase text-slate-900">
              Selected Projects
            </h2>
            <div className="mt-3 space-y-4">
              {topProjects.length === 0 ? (
                <p className="text-sm text-slate-700">
                  Projects will appear here once loaded from the portfolio.
                </p>
              ) : (
                topProjects.map((p) => (
                  <div key={p.slug || p.title} className="rounded-xl border border-slate-200 p-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-semibold text-slate-950">{p.title}</h3>
                      <span className="text-xs text-slate-500">{(p.tools || []).slice(0, 6).join(' | ')}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-800">
                      {p.summary}
                    </p>
                    <p className="mt-2 text-sm text-slate-700">
                      <span className="font-medium text-slate-900">Outcome:</span> {outcomeForProject(p)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Education */}
          <section className="mt-8">
            <h2 className="text-sm font-semibold tracking-[0.18em] uppercase text-slate-900">
              Education
            </h2>
            <div className="mt-3 space-y-3">
              {education.length === 0 ? (
                <p className="text-sm text-slate-700">Available on request.</p>
              ) : (
                education.map((e) => (
                  <div key={`${e.school}-${e.program}-${e.start_date}`} className="rounded-xl border border-slate-200 p-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div className="font-semibold text-slate-950">{e.school}</div>
                      <span className="text-xs text-slate-500">
                        {formatRange(e.start_date, e.end_date, e.current)}
                      </span>
                    </div>
                    <div className="text-sm text-slate-800 mt-1">
                      {e.degree ? `${e.degree} — ` : ''}{e.program}
                    </div>
                    {e.details && (
                      <div className="text-sm text-slate-700 mt-1">{e.details}</div>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Certifications */}
          <section className="mt-8">
            <h2 className="text-sm font-semibold tracking-[0.18em] uppercase text-slate-900">
              Certifications
            </h2>
            <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-800">
              {topCertificates.length === 0 ? (
                <li className="text-slate-700">Available on request.</li>
              ) : (
                topCertificates.map((c) => (
                  <li key={`${c.issuer}-${c.title}`} className="rounded-xl border border-slate-200 p-3">
                    <div className="font-medium text-slate-950">{c.title}</div>
                    <div className="text-slate-700">{c.issuer}</div>
                  </li>
                ))
              )}
            </ul>
          </section>

          {/* Tools */}
          <section className="mt-8">
            <h2 className="text-sm font-semibold tracking-[0.18em] uppercase text-slate-900">
              Tools / Tech Stack
            </h2>
            <p className="mt-3 text-sm text-slate-800">
              Python, SQL, PostgreSQL, Excel, Power BI / Tableau (as needed), React, Git, Supabase fundamentals.
            </p>
          </section>

          {/* References */}
          <section className="mt-8">
            <h2 className="text-sm font-semibold tracking-[0.18em] uppercase text-slate-900">
              References
            </h2>
            <p className="mt-3 text-sm text-slate-800">Available on request.</p>
          </section>
        </main>
      </div>

      <style>{`
        @media print {
          @page { margin: 12mm; }
          html, body { background: #fff !important; }
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default CV;
