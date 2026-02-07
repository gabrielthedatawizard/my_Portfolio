import { useState } from 'react';
import { User, Mail, MapPin, Link as LinkIcon, FileText, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const SettingsManager = () => {
  const [profile, setProfile] = useState({
    name: 'Gabriel Myeye',
    headline: 'Health Information Scientist | Data Analyst | AI Enthusiast',
    bio: 'I specialize in transforming complex health data into actionable insights. With a background in Health Information Science and a passion for AI, I build reliable systems that improve healthcare outcomes.',
    location: 'Dar es Salaam, Tanzania',
    email: 'hello@gabrielmyeye.com',
    website: 'https://gabrielmyeye.com',
    linkedin: 'https://linkedin.com/in/gabrielmyeye',
    github: 'https://github.com/gabrielmyeye',
    twitter: 'https://twitter.com/gabrielmyeye',
  });

  const handleSave = () => {
    toast.success('Profile settings saved');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Settings</h2>
        <p className="text-white/60">Manage your profile and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Information */}
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
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            <div>
              <label className="block text-sm text-white/60 mb-2">Headline</label>
              <Input
                value={profile.headline}
                onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            <div>
              <label className="block text-sm text-white/60 mb-2">Bio</label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white min-h-[120px]"
              />
            </div>

            <div>
              <label className="block text-sm text-white/60 mb-2">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  className="pl-10 bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Social */}
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
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Website</label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                  <Input
                    value={profile.website}
                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
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
                  onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">GitHub</label>
                <Input
                  value={profile.github}
                  onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Twitter</label>
                <Input
                  value={profile.twitter}
                  onChange={(e) => setProfile({ ...profile, twitter: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CV Upload */}
      <div className="bg-charcoal-light border border-white/5 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-electric" />
          Resume / CV
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex-1 p-4 border border-dashed border-white/20 rounded-lg text-center">
            <p className="text-white/40 text-sm">Drag and drop your CV here, or click to browse</p>
            <p className="text-white/30 text-xs mt-1">PDF, DOCX up to 5MB</p>
          </div>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
            Upload
          </Button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-electric hover:bg-electric-dark px-8">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default SettingsManager;
