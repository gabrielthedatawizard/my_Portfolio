import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, ExternalLink, Calendar } from 'lucide-react';
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

const sampleCertificates: Certificate[] = [
  {
    id: '1',
    title: 'Google Data Analytics Professional Certificate',
    issuer: 'Google',
    issue_date: '2023-06-15',
    credential_url: 'https://coursera.org/verify/xxx',
    tags: ['Data Analytics', 'Google'],
    status: 'published',
  },
  {
    id: '2',
    title: 'AWS Certified Solutions Architect',
    issuer: 'Amazon Web Services',
    issue_date: '2023-09-20',
    expiry_date: '2026-09-20',
    credential_url: 'https://aws.amazon.com/verify',
    tags: ['Cloud', 'AWS'],
    status: 'published',
  },
];

const CertificatesManager = () => {
  const [certificates, setCertificates] = useState<Certificate[]>(sampleCertificates);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);

  const filteredCertificates = certificates.filter(
    (cert) =>
      cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.issuer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this certificate?')) {
      setCertificates(certificates.filter((c) => c.id !== id));
      toast.success('Certificate deleted');
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCertificates.map((certificate) => (
          <div
            key={certificate.id}
            className="bg-charcoal-light border border-white/5 rounded-xl p-6 group hover:border-white/10 transition-colors"
          >
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
                <span className="text-white/40">
                  · Expires: {formatDate(certificate.expiry_date)}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {certificate.tags.map((tag, i) => (
                <Badge
                  key={i}
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg bg-charcoal-light border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>
              {editingCertificate ? 'Edit Certificate' : 'Add New Certificate'}
            </DialogTitle>
          </DialogHeader>
          <CertificateForm
            certificate={editingCertificate}
            onSave={() => {
              setIsDialogOpen(false);
              toast.success(editingCertificate ? 'Certificate updated' : 'Certificate created');
            }}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface CertificateFormProps {
  certificate: Certificate | null;
  onSave: () => void;
  onCancel: () => void;
}

const CertificateForm: React.FC<CertificateFormProps> = ({ certificate, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: certificate?.title || '',
    issuer: certificate?.issuer || '',
    issue_date: certificate?.issue_date || '',
    expiry_date: certificate?.expiry_date || '',
    credential_url: certificate?.credential_url || '',
    tags: certificate?.tags?.join(', ') || '',
    status: certificate?.status || 'published',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-white/60 mb-2">Title</label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="bg-white/5 border-white/10 text-white"
          required
        />
      </div>

      <div>
        <label className="block text-sm text-white/60 mb-2">Issuer</label>
        <Input
          value={formData.issuer}
          onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
          className="bg-white/5 border-white/10 text-white"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-white/60 mb-2">Issue Date</label>
          <Input
            type="date"
            value={formData.issue_date}
            onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
            className="bg-white/5 border-white/10 text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-2">Expiry Date (optional)</label>
          <Input
            type="date"
            value={formData.expiry_date}
            onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
            className="bg-white/5 border-white/10 text-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-white/60 mb-2">Credential URL</label>
        <Input
          value={formData.credential_url}
          onChange={(e) => setFormData({ ...formData, credential_url: e.target.value })}
          className="bg-white/5 border-white/10 text-white"
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="block text-sm text-white/60 mb-2">Tags (comma-separated)</label>
        <Input
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          className="bg-white/5 border-white/10 text-white"
          placeholder="Data Analytics, Google"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={formData.status === 'published'}
          onChange={(e) =>
            setFormData({ ...formData, status: e.target.checked ? 'published' : 'draft' })
          }
          className="w-4 h-4 rounded border-white/20 bg-white/5"
        />
        <span className="text-sm text-white/60">Published</span>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-electric hover:bg-electric-dark">
          {certificate ? 'Update' : 'Create'} Certificate
        </Button>
      </div>
    </form>
  );
};

export default CertificatesManager;
