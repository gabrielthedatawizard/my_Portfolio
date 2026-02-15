import { type ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Plus, Search, Edit2, Trash2, ExternalLink, Calendar, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import type { Certificate } from '../../types';
import { supabase } from '@/lib/supabase';

type CertificateFormValues = {
  title: string;
  issuer: string;
  issue_date: string;
  expiry_date: string;
  credential_url: string;
  media_url: string;
  tags: string;
  status: 'draft' | 'published';
};

const defaultFormValues: CertificateFormValues = {
  title: '',
  issuer: '',
  issue_date: '',
  expiry_date: '',
  credential_url: '',
  media_url: '',
  tags: '',
  status: 'published',
};

const mapCertificateToForm = (certificate: Certificate | null): CertificateFormValues => {
  if (!certificate) return defaultFormValues;
  return {
    title: certificate.title ?? '',
    issuer: certificate.issuer ?? '',
    issue_date: certificate.issue_date ?? '',
    expiry_date: certificate.expiry_date ?? '',
    credential_url: certificate.credential_url ?? '',
    media_url: certificate.media_url ?? '',
    tags: (certificate.tags ?? []).join(', '),
    status: certificate.status,
  };
};

const parseTags = (value: string) =>
  value
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);

const CertificatesManager = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);

  const loadCertificates = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .order('issue_date', { ascending: false });

      if (error) throw error;
      setCertificates((data ?? []) as Certificate[]);
    } catch (error) {
      console.error('Failed to load certificates:', error);
      toast.error('Failed to load certificates');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCertificates();
  }, [loadCertificates]);

  const filteredCertificates = useMemo(
    () =>
      certificates.filter(
        (cert) =>
          cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cert.issuer.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [certificates, searchQuery]
  );

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return;

    try {
      const { error } = await supabase.from('certificates').delete().eq('id', id);
      if (error) throw error;

      setCertificates((prev) => prev.filter((certificate) => certificate.id !== id));
      toast.success('Certificate deleted');
    } catch (error) {
      console.error('Failed to delete certificate:', error);
      toast.error('Failed to delete certificate');
    }
  };

  const handleEdit = (certificate: Certificate) => {
    setEditingCertificate(certificate);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingCertificate(null);
    setIsDialogOpen(true);
  };

  const handleSave = async (formValues: CertificateFormValues) => {
    setIsSaving(true);
    try {
      const payload = {
        title: formValues.title.trim(),
        issuer: formValues.issuer.trim(),
        issue_date: formValues.issue_date,
        expiry_date: formValues.expiry_date || null,
        credential_url: formValues.credential_url.trim() || null,
        media_url: formValues.media_url.trim() || null,
        tags: parseTags(formValues.tags),
        status: formValues.status,
      };

      if (editingCertificate) {
        const { data, error } = await supabase
          .from('certificates')
          .update(payload)
          .eq('id', editingCertificate.id)
          .select('*')
          .single();

        if (error) throw error;

        setCertificates((prev) =>
          prev.map((certificate) =>
            certificate.id === editingCertificate.id ? (data as Certificate) : certificate
          )
        );
        toast.success('Certificate updated');
      } else {
        const { data, error } = await supabase
          .from('certificates')
          .insert(payload)
          .select('*')
          .single();

        if (error) throw error;

        setCertificates((prev) => [data as Certificate, ...prev]);
        toast.success('Certificate created');
      }

      setIsDialogOpen(false);
      setEditingCertificate(null);
    } catch (error) {
      console.error('Failed to save certificate:', error);
      toast.error('Failed to save certificate');
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Certificates</h2>
          <p className="text-white/60">Manage your certifications and credentials</p>
        </div>
        <Button onClick={handleAdd} className="bg-electric hover:bg-electric-dark">
          <Plus className="h-4 w-4 mr-2" />
          Add Certificate
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search certificates..."
          className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30"
        />
      </div>

      {loading ? (
        <div className="text-white/60">Loading certificates...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCertificates.map((certificate) => (
            <div
              key={certificate.id}
              className="bg-charcoal-light border border-white/5 rounded-xl p-6 group hover:border-white/10 transition-colors"
            >
              {certificate.media_url && (
                <div className="mb-4 overflow-hidden rounded-lg border border-white/10 aspect-video">
                  <img
                    src={certificate.media_url}
                    alt={`${certificate.title} cover`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-white mb-1">{certificate.title}</h3>
                  <p className="text-sm text-electric">{certificate.issuer}</p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(certificate)}
                    className="p-2 text-white/40 hover:text-electric transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(certificate.id)}
                    className="p-2 text-white/40 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-white/60 mb-4">
                <Calendar className="h-4 w-4" />
                <span>Issued: {formatDate(certificate.issue_date)}</span>
                {certificate.expiry_date && (
                  <span className="text-white/40">. Expires: {formatDate(certificate.expiry_date)}</span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {(certificate.tags ?? []).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-white/5 text-white/70 border-0 text-xs"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              {certificate.credential_url && (
                <a
                  href={certificate.credential_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-electric hover:underline mt-4"
                >
                  <ExternalLink className="h-3 w-3" />
                  Verify Credential
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setEditingCertificate(null);
          }
          setIsDialogOpen(open);
        }}
      >
        <DialogContent className="max-w-lg bg-charcoal-light border-white/10 text-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCertificate ? 'Edit Certificate' : 'Add New Certificate'}
            </DialogTitle>
          </DialogHeader>
          <CertificateForm
            initialValues={mapCertificateToForm(editingCertificate)}
            saving={isSaving}
            onSave={handleSave}
            onCancel={() => {
              setIsDialogOpen(false);
              setEditingCertificate(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface CertificateFormProps {
  initialValues: CertificateFormValues;
  saving: boolean;
  onSave: (values: CertificateFormValues) => Promise<void>;
  onCancel: () => void;
}

const CertificateForm: React.FC<CertificateFormProps> = ({
  initialValues,
  saving,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<CertificateFormValues>(initialValues);
  const [uploadingImage, setUploadingImage] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFormData(initialValues);
  }, [initialValues]);

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file.');
      event.target.value = '';
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      toast.error('Image is too large. Maximum size is 8MB.');
      event.target.value = '';
      return;
    }

    setUploadingImage(true);
    try {
      const safeName = file.name.toLowerCase().replace(/[^a-z0-9.\-_]/g, '-');
      const filePath = `certificates/cover-${Date.now()}-${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-media')
        .upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('portfolio-media').getPublicUrl(filePath);
      setFormData((prev) => ({ ...prev, media_url: data.publicUrl }));
      toast.success('Certificate image uploaded');
    } catch (error) {
      console.error('Failed to upload certificate image:', error);
      toast.error('Failed to upload certificate image');
    } finally {
      setUploadingImage(false);
      event.target.value = '';
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-white/60 mb-2">Title</label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
          className="bg-white/5 border-white/10 text-white"
          required
        />
      </div>

      <div>
        <label className="block text-sm text-white/60 mb-2">Issuer</label>
        <Input
          value={formData.issuer}
          onChange={(e) => setFormData((prev) => ({ ...prev, issuer: e.target.value }))}
          className="bg-white/5 border-white/10 text-white"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-white/60 mb-2">Issue Date</label>
          <Input
            type="date"
            value={formData.issue_date}
            onChange={(e) => setFormData((prev) => ({ ...prev, issue_date: e.target.value }))}
            className="bg-white/5 border-white/10 text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-2">Expiry Date (optional)</label>
          <Input
            type="date"
            value={formData.expiry_date}
            onChange={(e) => setFormData((prev) => ({ ...prev, expiry_date: e.target.value }))}
            className="bg-white/5 border-white/10 text-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-white/60 mb-2">Credential URL</label>
        <Input
          value={formData.credential_url}
          onChange={(e) => setFormData((prev) => ({ ...prev, credential_url: e.target.value }))}
          className="bg-white/5 border-white/10 text-white"
          placeholder="https://..."
        />
      </div>

      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      <div>
        <label className="block text-sm text-white/60 mb-2">Cover Image URL</label>
        <div className="flex flex-col md:flex-row gap-3">
          <Input
            value={formData.media_url}
            onChange={(e) => setFormData((prev) => ({ ...prev, media_url: e.target.value }))}
            className="bg-white/5 border-white/10 text-white"
            placeholder="https://..."
          />
          <Button
            type="button"
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
            onClick={() => imageInputRef.current?.click()}
            disabled={uploadingImage}
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploadingImage ? 'Uploading...' : 'Upload Image'}
          </Button>
        </div>

        {formData.media_url && (
          <div className="mt-3 rounded-lg overflow-hidden border border-white/10 aspect-video">
            <img
              src={formData.media_url}
              alt="Certificate preview"
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm text-white/60 mb-2">Tags (comma-separated)</label>
        <Input
          value={formData.tags}
          onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
          className="bg-white/5 border-white/10 text-white"
          placeholder="Data Analytics, Cloud, AI"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={formData.status === 'published'}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, status: e.target.checked ? 'published' : 'draft' }))
          }
          className="w-4 h-4 rounded border-white/20 bg-white/5"
        />
        <span className="text-sm text-white/60">Published</span>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-electric hover:bg-electric-dark" disabled={saving}>
          {saving ? 'Saving...' : 'Save Certificate'}
        </Button>
      </div>
    </form>
  );
};

export default CertificatesManager;
