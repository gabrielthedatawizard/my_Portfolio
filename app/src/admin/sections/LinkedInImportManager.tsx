import React, { useState, useRef, useCallback } from 'react';
import {
  Linkedin,
  Upload,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Award,
  Briefcase,
  GraduationCap,
  Zap,
  User,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import {
  extractLinkedInZip,
  readCSVFile,
  parseLinkedInCSVFiles,
} from '@/lib/linkedinImport';
import type {
  LinkedInImportResult,
  LinkedInImportMode,
  LinkedInImportSummary,
} from '@/types';
import type { Certificate, Skill, Experience, Education } from '@/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type Step = 'instructions' | 'upload' | 'preview' | 'importing' | 'done';

interface SectionToggle {
  certifications: boolean;
  skills: boolean;
  experience: boolean;
  education: boolean;
  profile: boolean;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const StepIndicator: React.FC<{ current: Step }> = ({ current }) => {
  const steps: { id: Step; label: string }[] = [
    { id: 'instructions', label: 'Guide' },
    { id: 'upload', label: 'Upload' },
    { id: 'preview', label: 'Preview' },
    { id: 'importing', label: 'Import' },
    { id: 'done', label: 'Done' },
  ];
  const currentIdx = steps.findIndex((s) => s.id === current);

  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((step, idx) => (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                idx < currentIdx
                  ? 'bg-green-500 text-white'
                  : idx === currentIdx
                  ? 'bg-[#0077B5] text-white ring-2 ring-[#0077B5]/30'
                  : 'bg-white/10 text-white/40'
              }`}
            >
              {idx < currentIdx ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
            </div>
            <span
              className={`text-xs mt-1 ${
                idx === currentIdx ? 'text-white' : 'text-white/40'
              }`}
            >
              {step.label}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div
              className={`flex-1 h-0.5 mb-5 transition-all duration-500 ${
                idx < currentIdx ? 'bg-green-500' : 'bg-white/10'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const SectionToggleRow: React.FC<{
  icon: React.ElementType;
  label: string;
  count?: number;
  enabled: boolean;
  onToggle: () => void;
}> = ({ icon: Icon, label, count, enabled, onToggle }) => (
  <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${enabled ? 'bg-[#0077B5]/20' : 'bg-white/5'}`}>
        <Icon className={`h-4 w-4 ${enabled ? 'text-[#0077B5]' : 'text-white/40'}`} />
      </div>
      <div>
        <p className={`text-sm font-medium ${enabled ? 'text-white' : 'text-white/50'}`}>{label}</p>
        {count !== undefined && (
          <p className="text-xs text-white/40">{count} record{count !== 1 ? 's' : ''} found</p>
        )}
      </div>
    </div>
    <button onClick={onToggle} className="text-white/60 hover:text-white transition-colors">
      {enabled ? (
        <ToggleRight className="h-6 w-6 text-[#0077B5]" />
      ) : (
        <ToggleLeft className="h-6 w-6 text-white/30" />
      )}
    </button>
  </div>
);

const PreviewTable: React.FC<{
  title: string;
  icon: React.ElementType;
  rows: string[][];
  headers: string[];
}> = ({ title, icon: Icon, rows, headers }) => {
  if (rows.length === 0) return null;
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="h-4 w-4 text-[#0077B5]" />
        <h4 className="text-sm font-semibold text-white">{title}</h4>
        <Badge className="bg-[#0077B5]/20 text-[#0077B5] border-0 text-xs">{rows.length}</Badge>
      </div>
      <div className="overflow-x-auto rounded-lg border border-white/10">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-white/5">
              {headers.map((h) => (
                <th key={h} className="px-3 py-2 text-left text-white/60 font-medium whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, 5).map((row, i) => (
              <tr key={i} className="border-t border-white/5">
                {row.map((cell, j) => (
                  <td key={j} className="px-3 py-2 text-white/70 max-w-[200px] truncate">
                    {cell || '—'}
                  </td>
                ))}
              </tr>
            ))}
            {rows.length > 5 && (
              <tr className="border-t border-white/5">
                <td colSpan={headers.length} className="px-3 py-2 text-white/30 italic">
                  ...and {rows.length - 5} more
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const LinkedInImportManager: React.FC = () => {
  const [step, setStep] = useState<Step>('instructions');
  const [importMode, setImportMode] = useState<LinkedInImportMode>('merge');
  const [parsed, setParsed] = useState<LinkedInImportResult | null>(null);
  const [summary, setSummary] = useState<LinkedInImportSummary | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sections, setSections] = useState<SectionToggle>({
    certifications: true,
    skills: true,
    experience: true,
    education: true,
    profile: true,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const csvFilesRef = useRef<Record<string, string>>({});

  // -------------------------------------------------------------------------
  // File handling
  // -------------------------------------------------------------------------

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    setUploadError(null);
    setIsProcessing(true);

    const fileArray = Array.from(files);

    try {
      // Case 1: Single ZIP file
      const zipFile = fileArray.find((f) =>
        f.name.toLowerCase().endsWith('.zip')
      );
      if (zipFile) {
        const result = await extractLinkedInZip(zipFile);
        setParsed(result);
        setSections({
          certifications: result.certifications.length > 0,
          skills: result.skills.length > 0,
          experience: result.experience.length > 0,
          education: result.education.length > 0,
          profile: Object.keys(result.profile).length > 0,
        });
        setStep('preview');
        return;
      }

      // Case 2: Individual CSV files
      const csvFiles = fileArray.filter((f) =>
        f.name.toLowerCase().endsWith('.csv')
      );
      if (csvFiles.length > 0) {
        const contents: Record<string, string> = {};
        await Promise.all(
          csvFiles.map(async (f) => {
            contents[f.name] = await readCSVFile(f);
          })
        );
        csvFilesRef.current = contents;
        const result = parseLinkedInCSVFiles(contents);
        setParsed(result);
        setSections({
          certifications: result.certifications.length > 0,
          skills: result.skills.length > 0,
          experience: result.experience.length > 0,
          education: result.education.length > 0,
          profile: Object.keys(result.profile).length > 0,
        });
        setStep('preview');
        return;
      }

      setUploadError('Please upload a LinkedIn data export ZIP file or CSV files.');
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : 'Failed to process file. Please try again.'
      );
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0) {
        void handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        void handleFiles(e.target.files);
      }
    },
    [handleFiles]
  );

  // -------------------------------------------------------------------------
  // Import to Supabase
  // -------------------------------------------------------------------------

  const handleImport = async () => {
    if (!parsed) return;
    setStep('importing');
    const errors: string[] = [];
    let certificationsImported = 0;
    let skillsImported = 0;
    let experienceImported = 0;
    let educationImported = 0;
    let profileUpdated = false;

    try {
      // Helper to upsert rows
      const upsertBatch = async <T extends Record<string, unknown>>(
        table: string,
        rows: T[],
        mode: LinkedInImportMode
      ): Promise<number> => {
        if (rows.length === 0) return 0;
        if (mode === 'replace') {
          // Delete all existing then insert
          await supabase.from(table).delete().neq('id', 'impossible-id');
        }
        const { error } = await supabase.from(table).upsert(
          rows.map(({ _order: _o, ...rest }) => rest) as T[],
          { onConflict: 'id' }
        );
        if (error) {
          errors.push(`${table}: ${error.message}`);
          return 0;
        }
        return rows.length;
      };

      // Certifications
      if (sections.certifications && parsed.certifications.length > 0) {
        certificationsImported = await upsertBatch(
          'certificates',
          parsed.certifications as unknown as Record<string, unknown>[],
          importMode
        );
      }

      // Skills
      if (sections.skills && parsed.skills.length > 0) {
        skillsImported = await upsertBatch(
          'skills',
          parsed.skills as unknown as Record<string, unknown>[],
          importMode
        );
      }

      // Experience
      if (sections.experience && parsed.experience.length > 0) {
        experienceImported = await upsertBatch(
          'experience',
          parsed.experience as unknown as Record<string, unknown>[],
          importMode
        );
      }

      // Education
      if (sections.education && parsed.education.length > 0) {
        educationImported = await upsertBatch(
          'education',
          parsed.education as unknown as Record<string, unknown>[],
          importMode
        );
      }

      // Profile (upsert into first profile row)
      if (sections.profile && Object.keys(parsed.profile).length > 0) {
        const { data: existing } = await supabase
          .from('profiles')
          .select('id')
          .limit(1);
        const existingId = (existing?.[0] as { id: string } | undefined)?.id;
        const payload = {
          ...parsed.profile,
          updated_at: new Date().toISOString(),
        };
        if (existingId) {
          const { error } = await supabase
            .from('profiles')
            .update(payload)
            .eq('id', existingId);
          if (error) errors.push(`profile: ${error.message}`);
          else profileUpdated = true;
        } else {
          const { error } = await supabase.from('profiles').insert({
            ...payload,
            email: parsed.profile.email ?? '',
            name: parsed.profile.name ?? '',
          });
          if (error) errors.push(`profile: ${error.message}`);
          else profileUpdated = true;
        }
      }

      setSummary({
        certificationsImported,
        skillsImported,
        experienceImported,
        educationImported,
        profileUpdated,
        errors,
      });
      setStep('done');

      if (errors.length === 0) {
        toast.success('LinkedIn data imported successfully!');
      } else {
        toast.warning(`Import completed with ${errors.length} error(s)`);
      }
    } catch (err) {
      errors.push(err instanceof Error ? err.message : 'Unknown error');
      setSummary({
        certificationsImported,
        skillsImported,
        experienceImported,
        educationImported,
        profileUpdated,
        errors,
      });
      setStep('done');
      toast.error('Import encountered errors');
    }
  };

  const resetWizard = () => {
    setStep('instructions');
    setParsed(null);
    setSummary(null);
    setUploadError(null);
    csvFilesRef.current = {};
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 rounded-xl bg-[#0077B5]/20">
            <Linkedin className="h-5 w-5 text-[#0077B5]" />
          </div>
          <h2 className="text-2xl font-bold text-white">LinkedIn Import</h2>
        </div>
        <p className="text-white/60">
          Sync your certifications, skills, experience, and profile from LinkedIn
        </p>
      </div>

      {/* Step indicator */}
      <StepIndicator current={step} />

      {/* Step content */}
      <AnimatePresence mode="wait">
        {/* ---- STEP 1: Instructions ---- */}
        {step === 'instructions' && (
          <motion.div
            key="instructions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-[#0077B5]/10 border border-[#0077B5]/20 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-400" />
                How LinkedIn Integration Works
              </h3>
              <p className="text-white/70 text-sm mb-4">
                LinkedIn does not provide an open API for certifications or skills to
                individual developers. Instead, we use LinkedIn's{' '}
                <strong className="text-white">official data export</strong> — a secure, ToS-compliant
                method to get your full profile data.
              </p>
              <ol className="space-y-3 text-sm text-white/70">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#0077B5]/30 text-[#0077B5] flex items-center justify-center text-xs font-bold">1</span>
                  <span>
                    Go to{' '}
                    <a
                      href="https://www.linkedin.com/mypreferences/d/download-my-data"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0077B5] underline inline-flex items-center gap-1"
                    >
                      LinkedIn → Settings → Data Privacy → Get a copy of your data
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#0077B5]/30 text-[#0077B5] flex items-center justify-center text-xs font-bold">2</span>
                  <span>Select <strong className="text-white">"Download larger data archive"</strong> and request your data. LinkedIn will email you a ZIP file (usually within minutes to a few hours).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#0077B5]/30 text-[#0077B5] flex items-center justify-center text-xs font-bold">3</span>
                  <span>Once downloaded, upload the ZIP file here. We'll automatically extract and import your <strong className="text-white">Certifications, Skills, Experience, Education</strong>, and <strong className="text-white">Profile</strong> data.</span>
                </li>
              </ol>
            </div>

            {/* What gets imported */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: Award, label: 'Certifications', desc: 'From Certifications.csv' },
                { icon: Zap, label: 'Skills', desc: 'From Skills.csv — auto-categorized' },
                { icon: Briefcase, label: 'Experience', desc: 'From Positions.csv' },
                { icon: GraduationCap, label: 'Education', desc: 'From Education.csv' },
                { icon: User, label: 'Profile', desc: 'Name, headline, bio, location' },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="bg-charcoal-light border border-white/5 rounded-xl p-4 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[#0077B5]/10 flex-shrink-0">
                    <Icon className="h-4 w-4 text-[#0077B5]" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{label}</p>
                    <p className="text-white/40 text-xs">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <Button
                onClick={() => setStep('upload')}
                className="bg-[#0077B5] hover:bg-[#006097] text-white gap-2"
              >
                I have my data export ready
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* ---- STEP 2: Upload ---- */}
        {step === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Dropzone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
                isDragging
                  ? 'border-[#0077B5] bg-[#0077B5]/10'
                  : 'border-white/20 hover:border-[#0077B5]/50 hover:bg-[#0077B5]/5'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".zip,.csv"
                multiple
                onChange={handleFileInput}
                className="hidden"
              />
              {isProcessing ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-12 w-12 text-[#0077B5] animate-spin" />
                  <p className="text-white/60">Processing your LinkedIn data...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <motion.div
                    animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
                    className="p-4 rounded-2xl bg-[#0077B5]/10"
                  >
                    <Upload className="h-10 w-10 text-[#0077B5]" />
                  </motion.div>
                  <div>
                    <p className="text-white font-medium text-lg">
                      Drop your LinkedIn export here
                    </p>
                    <p className="text-white/50 text-sm mt-1">
                      Upload the ZIP archive or individual CSV files
                    </p>
                    <p className="text-white/30 text-xs mt-2">
                      Supports: LinkedInDataExport_*.zip or individual CSV files
                    </p>
                  </div>
                </div>
              )}
            </div>

            {uploadError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
              >
                <XCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-400 font-medium text-sm">Upload Error</p>
                  <p className="text-red-300/70 text-sm">{uploadError}</p>
                </div>
              </motion.div>
            )}

            {/* Import mode selector */}
            <div className="bg-charcoal-light border border-white/5 rounded-xl p-5">
              <h4 className="text-white font-medium mb-3 text-sm">Import Mode</h4>
              <div className="grid grid-cols-2 gap-3">
                {(['merge', 'replace'] as LinkedInImportMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setImportMode(mode)}
                    className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                      importMode === mode
                        ? 'border-[#0077B5] bg-[#0077B5]/10'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <p className={`font-medium text-sm capitalize ${importMode === mode ? 'text-white' : 'text-white/60'}`}>
                      {mode}
                    </p>
                    <p className="text-xs text-white/40 mt-1">
                      {mode === 'merge'
                        ? 'Keep existing data, add new records (recommended)'
                        : 'Delete all existing records and replace with LinkedIn data'}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setStep('instructions')}
                className="border-white/20 text-white hover:bg-white/10 gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
            </div>
          </motion.div>
        )}

        {/* ---- STEP 3: Preview ---- */}
        {step === 'preview' && parsed && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Warnings */}
            {parsed.warnings.length > 0 && (
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                <p className="text-yellow-400 font-medium text-sm mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" /> Some files were not found
                </p>
                <ul className="space-y-1">
                  {parsed.warnings.map((w, i) => (
                    <li key={i} className="text-yellow-300/70 text-xs">• {w}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Section toggles */}
            <div className="bg-charcoal-light border border-white/5 rounded-xl p-5">
              <h4 className="text-white font-medium mb-4">Choose what to import</h4>
              <SectionToggleRow
                icon={Award}
                label="Certifications"
                count={parsed.certifications.length}
                enabled={sections.certifications}
                onToggle={() => setSections((s) => ({ ...s, certifications: !s.certifications }))}
              />
              <SectionToggleRow
                icon={Zap}
                label="Skills"
                count={parsed.skills.length}
                enabled={sections.skills}
                onToggle={() => setSections((s) => ({ ...s, skills: !s.skills }))}
              />
              <SectionToggleRow
                icon={Briefcase}
                label="Experience"
                count={parsed.experience.length}
                enabled={sections.experience}
                onToggle={() => setSections((s) => ({ ...s, experience: !s.experience }))}
              />
              <SectionToggleRow
                icon={GraduationCap}
                label="Education"
                count={parsed.education.length}
                enabled={sections.education}
                onToggle={() => setSections((s) => ({ ...s, education: !s.education }))}
              />
              <SectionToggleRow
                icon={User}
                label="Profile"
                count={Object.keys(parsed.profile).filter(
                  (k) => parsed.profile[k as keyof typeof parsed.profile]
                ).length}
                enabled={sections.profile}
                onToggle={() => setSections((s) => ({ ...s, profile: !s.profile }))}
              />
            </div>

            {/* Data Previews */}
            <div className="bg-charcoal-light border border-white/5 rounded-xl p-5">
              <h4 className="text-white font-medium mb-4">Data Preview (first 5 rows each)</h4>

              {sections.certifications && (
                <PreviewTable
                  title="Certifications"
                  icon={Award}
                  headers={['Title', 'Issuer', 'Issue Date', 'Tags']}
                  rows={parsed.certifications.map((c: Certificate) => [
                    c.title,
                    c.issuer,
                    c.issue_date,
                    c.tags.join(', '),
                  ])}
                />
              )}

              {sections.skills && (
                <PreviewTable
                  title="Skills"
                  icon={Zap}
                  headers={['Name', 'Category']}
                  rows={parsed.skills.map((s: Skill) => [s.name, s.category])}
                />
              )}

              {sections.experience && (
                <PreviewTable
                  title="Experience"
                  icon={Briefcase}
                  headers={['Title', 'Organization', 'Start Date', 'Current']}
                  rows={parsed.experience.map((e: Experience) => [
                    e.title,
                    e.organization,
                    e.start_date,
                    e.current ? 'Yes' : 'No',
                  ])}
                />
              )}

              {sections.education && (
                <PreviewTable
                  title="Education"
                  icon={GraduationCap}
                  headers={['School', 'Program', 'Degree', 'End Date']}
                  rows={parsed.education.map((e: Education) => [
                    e.school,
                    e.program,
                    e.degree ?? '',
                    e.end_date ?? 'Present',
                  ])}
                />
              )}

              {sections.profile && Object.keys(parsed.profile).length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="h-4 w-4 text-[#0077B5]" />
                    <h4 className="text-sm font-semibold text-white">Profile</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(parsed.profile)
                      .filter(([, v]) => v)
                      .map(([key, value]) => (
                        <div key={key} className="bg-white/5 rounded-lg p-3">
                          <p className="text-white/40 text-xs capitalize">{key.replace('_', ' ')}</p>
                          <p className="text-white text-sm truncate">{String(value)}</p>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setStep('upload')}
                className="border-white/20 text-white hover:bg-white/10 gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={() => void handleImport()}
                className="bg-[#0077B5] hover:bg-[#006097] text-white gap-2"
                disabled={
                  !sections.certifications &&
                  !sections.skills &&
                  !sections.experience &&
                  !sections.education &&
                  !sections.profile
                }
              >
                <Upload className="h-4 w-4" />
                Import to Portfolio
              </Button>
            </div>
          </motion.div>
        )}

        {/* ---- STEP 4: Importing (loading) ---- */}
        {step === 'importing' && (
          <motion.div
            key="importing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 gap-6"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 rounded-full border-4 border-[#0077B5]/20 border-t-[#0077B5]"
            />
            <div className="text-center">
              <p className="text-white font-medium text-lg">Importing your LinkedIn data...</p>
              <p className="text-white/50 text-sm mt-1">Writing to Supabase database</p>
            </div>
          </motion.div>
        )}

        {/* ---- STEP 5: Done ---- */}
        {step === 'done' && summary && (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className={`rounded-2xl p-6 border ${
              summary.errors.length === 0
                ? 'bg-green-500/10 border-green-500/20'
                : 'bg-yellow-500/10 border-yellow-500/20'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                {summary.errors.length === 0 ? (
                  <CheckCircle2 className="h-8 w-8 text-green-400" />
                ) : (
                  <AlertTriangle className="h-8 w-8 text-yellow-400" />
                )}
                <div>
                  <h3 className="text-white font-bold text-lg">
                    {summary.errors.length === 0 ? 'Import Successful!' : 'Import Complete with Warnings'}
                  </h3>
                  <p className="text-white/60 text-sm">
                    Your portfolio has been updated with LinkedIn data.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Certifications', count: summary.certificationsImported, icon: Award },
                  { label: 'Skills', count: summary.skillsImported, icon: Zap },
                  { label: 'Experience', count: summary.experienceImported, icon: Briefcase },
                  { label: 'Education', count: summary.educationImported, icon: GraduationCap },
                  {
                    label: 'Profile',
                    count: summary.profileUpdated ? 1 : 0,
                    icon: User,
                    custom: summary.profileUpdated ? 'Updated' : 'Skipped',
                  },
                ].map(({ label, count, icon: Icon, custom }) => (
                  <div key={label} className="bg-white/5 rounded-xl p-3 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#0077B5]/10">
                      <Icon className="h-4 w-4 text-[#0077B5]" />
                    </div>
                    <div>
                      <p className="text-xs text-white/50">{label}</p>
                      <p className="text-white font-semibold">{custom ?? `${count} imported`}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {summary.errors.length > 0 && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <p className="text-red-400 font-medium text-sm mb-2">Errors encountered:</p>
                <ul className="space-y-1">
                  {summary.errors.map((e, i) => (
                    <li key={i} className="text-red-300/70 text-xs">• {e}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={resetWizard}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                Import Again
              </Button>
              <Button
                onClick={() => window.open('/', '_blank')}
                className="bg-[#0077B5] hover:bg-[#006097] text-white gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                View Portfolio
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LinkedInImportManager;
