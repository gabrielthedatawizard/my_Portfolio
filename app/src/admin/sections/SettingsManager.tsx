import { type ChangeEvent, useEffect, useRef, useState } from 'react';
import { User, Mail, MapPin, Link as LinkIcon, FileText, Save, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

type ProfileFormState = {
  name: string;
  headline: string;
  bio: string;
  location: string;
  email: string;
  website: string;
  linkedin: string;
  github: string;
  twitter: string;
  cv_url: string;
};

const defaultProfileState: ProfileFormState = {
  name: '',
  headline: '',
  bio: '',
  location: '',
  email: '',
  website: '',
  linkedin: '',
  github: '',
  twitter: '',
  cv_url: '',
};

const SettingsManager = () => {
  const [profileId, setProfileId] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileFormState>(defaultProfileState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingCv, setUploadingCv] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .limit(1);

        if (error) throw error;

        const latestProfile = (data ?? [])[0];
        if (latestProfile) {
          setProfileId(latestProfile.id);
          setProfile({
            name: latestProfile.name ?? '',
            headline: latestProfile.headline ?? '',
            bio: latestProfile.bio ?? '',
            location: latestProfile.location ?? '',
            email: latestProfile.email ?? '',
            website: latestProfile.website ?? '',
            linkedin: latestProfile.linkedin ?? '',
            github: latestProfile.github ?? '',
            twitter: latestProfile.twitter ?? '',
            cv_url: latestProfile.cv_url ?? '',
          });
        }
      } catch (error) {
        console.error('Failed to load profile settings:', error);
        toast.error('Failed to load profile settings');
      } finally {
        setLoading(false);
      }
    };

    void loadProfile();
  }, []);

  const handleSave = async () => {
    if (!profile.name.trim() || !profile.email.trim()) {
      toast.error('Name and email are required');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: profile.name.trim(),
        headline: profile.headline.trim(),
        bio: profile.bio.trim(),
        location: profile.location.trim(),
        email: profile.email.trim(),
        website: profile.website.trim() || null,
        linkedin: profile.linkedin.trim() || null,
        github: profile.github.trim() || null,
        twitter: profile.twitter.trim() || null,
        cv_url: profile.cv_url.trim() || null,
      };

      if (profileId) {
        const { error } = await supabase
          .from('profiles')
          .update(payload)
          .eq('id', profileId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('profiles')
          .insert(payload)
          .select('id')
          .single();
        if (error) throw error;
        setProfileId(data.id);
      }

      toast.success('Profile settings saved');
    } catch (error) {
      console.error('Failed to save profile settings:', error);
      toast.error('Failed to save profile settings');
    } finally {
      setSaving(false);
    }
  };

  const handleCvUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File is too large. Maximum size is 5MB.');
      event.target.value = '';
      return;
    }

    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !['pdf', 'doc', 'docx'].includes(extension)) {
      toast.error('Only PDF, DOC, and DOCX files are allowed.');
      event.target.value = '';
      return;
    }

    setUploadingCv(true);
    try {
      const filePath = `profile/cv-${Date.now()}.${extension}`;
      const { error: uploadError } = await supabase.storage
        .from('portfolio-media')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('portfolio-media').getPublicUrl(filePath);
      setProfile((prev) => ({ ...prev, cv_url: data.publicUrl }));
      toast.success('CV uploaded. Click Save Changes to publish.');
    } catch (error) {
      console.error('Failed to upload CV:', error);
      toast.error('CV upload failed. Check storage bucket configuration.');
    } finally {
      setUploadingCv(false);
      event.target.value = '';
    }
  };

  const updateField = (field: keyof ProfileFormState, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Settings</h2>
        <p className="text-white/60">Loading profile settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Settings</h2>
        <p className="text-white/60">Manage your profile and CV download settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-charcoal-light border border-white/5 rounded-xl p-6 space-y-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <User className="h-5 w-5 text-electric" />
            Profile Information
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-white/60 mb-2">Full Name</label>
              <Input
                value={profile.name}
                onChange={(e) => updateField('name', e.target.value)}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            <div>
              <label className="block text-sm text-white/60 mb-2">Headline</label>
              <Input
                value={profile.headline}
                onChange={(e) => updateField('headline', e.target.value)}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            <div>
              <label className="block text-sm text-white/60 mb-2">Bio</label>
              <textarea
                value={profile.bio}
                onChange={(e) => updateField('bio', e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white min-h-[120px]"
              />
            </div>

            <div>
              <label className="block text-sm text-white/60 mb-2">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input
                  value={profile.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-charcoal-light border border-white/5 rounded-xl p-6 space-y-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Mail className="h-5 w-5 text-electric" />
              Contact Information
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-2">Email</label>
                <Input
                  value={profile.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Website</label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                  <Input
                    value={profile.website}
                    onChange={(e) => updateField('website', e.target.value)}
                    className="pl-10 bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-charcoal-light border border-white/5 rounded-xl p-6 space-y-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <LinkIcon className="h-5 w-5 text-electric" />
              Social Links
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-2">LinkedIn</label>
                <Input
                  value={profile.linkedin}
                  onChange={(e) => updateField('linkedin', e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">GitHub</label>
                <Input
                  value={profile.github}
                  onChange={(e) => updateField('github', e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Twitter</label>
                <Input
                  value={profile.twitter}
                  onChange={(e) => updateField('twitter', e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-charcoal-light border border-white/5 rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <FileText className="h-5 w-5 text-electric" />
          Resume / CV
        </h3>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleCvUpload}
          className="hidden"
        />

        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 p-4 border border-dashed border-white/20 rounded-lg">
            <p className="text-white/40 text-sm">Upload a CV file or paste a public URL below</p>
            <p className="text-white/30 text-xs mt-1">PDF, DOC, DOCX up to 5MB</p>
            {profile.cv_url && (
              <a
                href={profile.cv_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-electric text-sm hover:underline break-all"
              >
                Current CV URL
              </a>
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingCv}
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploadingCv ? 'Uploading...' : 'Upload CV'}
          </Button>
        </div>

        <div>
          <label className="block text-sm text-white/60 mb-2">CV URL</label>
          <Input
            value={profile.cv_url}
            onChange={(e) => updateField('cv_url', e.target.value)}
            className="bg-white/5 border-white/10 text-white"
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-electric hover:bg-electric-dark px-8" disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};

export default SettingsManager;
