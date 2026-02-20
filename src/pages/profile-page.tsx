import { Briefcase, Edit, Eye, EyeOff, GraduationCap, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { MobileBottomNav } from '../components/mobile-bottom-nav';
import { TopNavigation } from '../components/top-navigation';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useApp } from '../context/AppContext';

interface ProfileData {
  name: string;
  email: string;
  bio: string;
  school: string;
  degree: string;
  year: string;
  location: string;
  linkedin: string;
  twitter: string;
  github: string;
  website: string;
  skills: string[];
  interests: string[];
  targetCompanies: string[];
}

export function ProfilePage() {
  const { state } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    name: '',
    email: '',
    bio: '',
    school: '',
    degree: '',
    year: '',
    location: '',
    linkedin: '',
    twitter: '',
    github: '',
    website: '',
    skills: [],
    interests: [],
    targetCompanies: [],
  });

  // Load profile from API
  useEffect(() => {
    const loadProfile = async () => {
      if (state.currentUser?.userId) {
        try {
          const response = await api.user.get();
          const data = response.data as any;
          if (data.profile) {
            setProfile({
              name: data.profile.name || state.currentUser?.name || '',
              email: data.profile.email || state.currentUser?.email || '',
              bio: data.profile.bio || '',
              school: data.profile.school || '',
              degree: data.profile.degree || '',
              year: data.profile.year || '',
              location: data.profile.location || '',
              linkedin: data.profile.linkedin || '',
              twitter: data.profile.twitter || '',
              github: data.profile.github || '',
              website: data.profile.website || '',
              skills: data.profile.skills || [],
              interests: data.profile.interests || [],
              targetCompanies: data.profile.targetCompanies || [],
            });
          }
        } catch (error) {
          console.error('Failed to load profile:', error);
        }
      }
    };
    loadProfile();
  }, [state.currentUser]);

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '??';
  };

  // Count filled fields
  const getCompletionPercentage = () => {
    const fields = [
      profile.bio, profile.school, profile.degree, profile.year,
      profile.location, profile.linkedin, profile.twitter, profile.github,
      profile.website, profile.skills.length, profile.interests.length, profile.targetCompanies.length
    ];
    const filled = fields.filter(f => f && (Array.isArray(f) ? f.length > 0 : f.length > 0)).length;
    return Math.round((filled / fields.length) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation />
      <div className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-500">Manage how you appear to others</p>
          </div>
          <Button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? <><EyeOff className="w-4 h-4 mr-2" /> Preview</> : <><Edit className="w-4 h-4 mr-2" /> Edit Profile</>}
          </Button>
        </div>

        {/* Profile Completion */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Profile Completion</span>
              <span className="text-sm text-gray-500">{getCompletionPercentage()}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-[#3182CE] h-2 rounded-full transition-all" 
                style={{ width: `${getCompletionPercentage()}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {isEditing ? (
          /* EDIT MODE */
          <Card>
            <CardHeader>
              <CardTitle>Edit Your Profile</CardTitle>
              <CardDescription>Fill in your details to help others find and connect with you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input 
                    value={profile.name} 
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    placeholder="Your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input 
                    value={profile.email} 
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea 
                  value={profile.bio} 
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  placeholder="Tell others about yourself, your goals, and what you're looking for..."
                  rows={4}
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>School/University</Label>
                  <Input 
                    value={profile.school} 
                    onChange={(e) => setProfile({...profile, school: e.target.value})}
                    placeholder="MIT, Stanford, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Degree</Label>
                  <Input 
                    value={profile.degree} 
                    onChange={(e) => setProfile({...profile, degree: e.target.value})}
                    placeholder="Computer Science"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Year</Label>
                  <Input 
                    value={profile.year} 
                    onChange={(e) => setProfile({...profile, year: e.target.value})}
                    placeholder="Junior, Senior, Graduate"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Location</Label>
                <Input 
                  value={profile.location} 
                  onChange={(e) => setProfile({...profile, location: e.target.value})}
                  placeholder="Boston, MA"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>LinkedIn URL</Label>
                  <Input 
                    value={profile.linkedin} 
                    onChange={(e) => setProfile({...profile, linkedin: e.target.value})}
                    placeholder="linkedin.com/in/yourprofile"
                  />
                </div>
                <div className="space-y-2">
                  <Label>GitHub URL</Label>
                  <Input 
                    value={profile.github} 
                    onChange={(e) => setProfile({...profile, github: e.target.value})}
                    placeholder="github.com/yourusername"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Twitter/X URL</Label>
                  <Input 
                    value={profile.twitter} 
                    onChange={(e) => setProfile({...profile, twitter: e.target.value})}
                    placeholder="twitter.com/yourhandle"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Personal Website</Label>
                  <Input 
                    value={profile.website} 
                    onChange={(e) => setProfile({...profile, website: e.target.value})}
                    placeholder="yourwebsite.com"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-[#3182CE]">Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* PREVIEW MODE - How others see you */
          <div className="grid md:grid-cols-2 gap-6">
            {/* How Others See You */}
            <Card>
              <CardHeader className="bg-gradient-to-r from-[#3182CE] to-[#2c5282] text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  How Others See You
                </CardTitle>
                <CardDescription className="text-white/80">
                  This is your public profile that other users can view
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <Avatar className="w-24 h-24 mb-4">
                    <AvatarFallback className="text-2xl bg-[#3182CE] text-white">
                      {getInitials(profile.name)}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-bold">{profile.name || 'Your Name'}</h3>
                  <p className="text-gray-500">{profile.bio || 'No bio yet'}</p>
                </div>

                <div className="space-y-3 text-sm">
                  {profile.school && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <GraduationCap className="w-4 h-4" />
                      {profile.degree && <span>{profile.degree}</span>} at {profile.school}
                    </div>
                  )}
                  {profile.location && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      {profile.location}
                    </div>
                  )}
                  {profile.targetCompanies.length > 0 && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Briefcase className="w-4 h-4" />
                      Interested in: {profile.targetCompanies.join(', ')}
                    </div>
                  )}
                </div>

                {(profile.linkedin || profile.github || profile.twitter || profile.website) && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-center gap-4">
                      {profile.linkedin && (
                        <a href={`https://${profile.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-[#3182CE] hover:underline">
                          LinkedIn
                        </a>
                      )}
                      {profile.github && (
                        <a href={`https://${profile.github}`} target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:underline">
                          GitHub
                        </a>
                      )}
                      {profile.twitter && (
                        <a href={`https://${profile.twitter}`} target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:underline">
                          Twitter
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {profile.skills.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2 justify-center">
                    {profile.skills.map((skill, i) => (
                      <Badge key={i} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* How You See Yourself */}
            <Card>
              <CardHeader className="bg-gradient-to-r from-green-500 to-green-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <EyeOff className="w-5 h-5" />
                  Your View
                </CardTitle>
                <CardDescription className="text-white/80">
                  Private notes and additional information only you can see
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">🎯 Target Companies</h4>
                  {profile.targetCompanies.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {profile.targetCompanies.map((company, i) => (
                        <Badge key={i} className="bg-green-100 text-green-800">{company}</Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">No target companies added yet</p>
                  )}
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">💡 Interests</h4>
                  {profile.interests.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.map((interest, i) => (
                        <Badge key={i} variant="outline">{interest}</Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">No interests added yet</p>
                  )}
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">📝 Private Notes</h4>
                  <p className="text-gray-500 text-sm">
                    This section is only visible to you. Use it to track your application progress,
                    private notes about companies, or anything else you want to remember.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      </div>
      <MobileBottomNav />
    </div>
  );
}
