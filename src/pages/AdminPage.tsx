import React, { useState, useEffect, useRef } from 'react';
import type { Project, AspectRatio, ProjectCategory, ShowreelConfig } from '../data/projects';
import { showreelData } from '../data/projects';
import {
  Lock,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  Star,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Upload,
  Check,
  AlertCircle,
  Key,
  RefreshCw,
  Search,
  ExternalLink,
  HelpCircle,
  Film,
  Image as ImageIcon,
  Layers,
  Play,
  Save,
  Clock,
  LayoutGrid
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  // Authentication states
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('samyak_admin_token'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Main Section Navigation: Projects Archive vs Showreel Showcase
  const [mainSection, setMainSection] = useState<'projects' | 'showreel'>('projects');

  // Projects & library states
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'video' | 'motion' | 'graphic' | 'featured' | 'drafts'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Showreel Showcase states
  const [showreel, setShowreel] = useState<ShowreelConfig>(showreelData);
  const [isSavingShowreel, setIsSavingShowreel] = useState(false);
  const [isLoadingShowreel, setIsLoadingShowreel] = useState(false);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [projectMediaType, setProjectMediaType] = useState<'video' | 'image' | 'mixed'>('video');

  // Upload progress state
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState('');

  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Input refs for file uploads
  const videoFileInputRef = useRef<HTMLInputElement | null>(null);
  const posterFileInputRef = useRef<HTMLInputElement | null>(null);
  const thumbnailFileInputRef = useRef<HTMLInputElement | null>(null);
  const stillFileInputRef = useRef<HTMLInputElement | null>(null);
  const showreelVideoInputRef = useRef<HTMLInputElement | null>(null);
  const showreelPosterInputRef = useRef<HTMLInputElement | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Inspect and validate image dimensions (1x1 to 4000x4000 pixels)
  const inspectImageFile = (file: File): Promise<{ width: number; height: number; naturalRatio: string }> => {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        if (width < 1 || height < 1) {
          reject(new Error('Invalid image dimensions.'));
          return;
        }
        if (width > 4000 || height > 4000) {
          reject(new Error(`Image dimensions (${width} × ${height}px) exceed the 4000 × 4000px maximum limit. Please upload an image within 4000 × 4000px.`));
          return;
        }
        resolve({ width, height, naturalRatio: `${width}/${height}` });
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image file. Supported formats: JPG, PNG, WebP, AVIF, GIF.'));
      };
      img.src = url;
    });
  };

  // Check auth session
  useEffect(() => {
    if (token) {
      fetch('/api/admin', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((r) => r.json())
        .then((data) => {
          if (!data.authenticated) {
            handleLogout();
          }
        })
        .catch(() => {
          // If offline, assume token valid
        });
    }
  }, [token]);

  // Load all projects including drafts
  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch('/api/projects?all=true', { headers });
      const data = await res.json();
      if (data.success && Array.isArray(data.projects)) {
        setProjects(data.projects);
      }
    } catch (err) {
      console.error('[Admin] Error loading projects:', err);
      showToast('Error loading live projects. Check backend server.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Load Showreel settings
  const loadShowreel = async () => {
    setIsLoadingShowreel(true);
    try {
      const res = await fetch('/api/showreel');
      const data = await res.json();
      if (data.success && data.showreel) {
        setShowreel(data.showreel);
      }
    } catch (err) {
      console.error('[Admin] Error loading showreel:', err);
    } finally {
      setIsLoadingShowreel(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadProjects();
      loadShowreel();
    }
  }, [token]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email, password })
      });
      const data = await res.json();

      if (res.ok && data.success && data.token) {
        localStorage.setItem('samyak_admin_token', data.token);
        setToken(data.token);
        showToast('Authenticated as Administrator.');
      } else {
        setLoginError(data.error || 'Invalid administrator email or password.');
      }
    } catch {
      setLoginError('Could not connect to authentication API.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('samyak_admin_token');
    setToken(null);
    setProjects([]);
  };

  // Save Main Showreel Changes (TASK 1)
  const handleSaveShowreel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showreel.title.trim()) {
      showToast('Showreel title is required.', 'error');
      return;
    }

    setIsSavingShowreel(true);
    try {
      const res = await fetch('/api/showreel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(showreel)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Showreel configuration updated successfully!');
        if (data.showreel) setShowreel(data.showreel);
      } else {
        showToast(data.error || 'Failed to update showreel.', 'error');
      }
    } catch {
      showToast('Network error saving showreel.', 'error');
    } finally {
      setIsSavingShowreel(false);
    }
  };

  // Handle Create / Edit Project (TASK 2)
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.title?.trim()) {
      showToast('Project title is required.', 'error');
      return;
    }

    // Video is optional for image-only projects
    const isImageOnly = projectMediaType === 'image';
    if (!isImageOnly && !editingProject.video && !editingProject.poster && !editingProject.thumbnail) {
      showToast('Please provide either a video or an image poster for this project.', 'error');
      return;
    }

    try {
      const isEditing = Boolean(editingProject.id);
      const url = isEditing ? `/api/projects?id=${editingProject.id}` : '/api/projects';
      const method = isEditing ? 'PUT' : 'POST';

      const payload = {
        ...editingProject,
        mediaType: projectMediaType,
        video: isImageOnly ? '' : (editingProject.video || ''),
        poster: editingProject.poster || editingProject.thumbnail || '/projects/project-01/poster.jpg',
        thumbnail: editingProject.thumbnail || editingProject.poster || '/projects/project-01/poster.jpg'
      };

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(isEditing ? 'Project updated successfully.' : 'New project created.');
        setIsModalOpen(false);
        setEditingProject(null);
        await loadProjects();
      } else {
        showToast(data.error || 'Failed to save project.', 'error');
      }
    } catch {
      showToast('Error saving project.', 'error');
    }
  };

  // Handle Delete Project
  const handleDeleteConfirm = async (id: string) => {
    try {
      const res = await fetch(`/api/projects?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Project removed from archive.');
        setIsDeletingId(null);
        await loadProjects();
      } else {
        showToast(data.error || 'Failed to delete project.', 'error');
      }
    } catch {
      showToast('Error deleting project.', 'error');
    }
  };

  // Toggle Featured status
  const handleToggleFeatured = async (p: Project) => {
    try {
      const res = await fetch(`/api/projects?id=${p.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ featured: !p.featured })
      });
      if (res.ok) {
        showToast(`Featured status toggled for ${p.title}.`);
        await loadProjects();
      }
    } catch {
      showToast('Failed to toggle featured status.', 'error');
    }
  };

  // Toggle Published status
  const handleTogglePublished = async (p: Project) => {
    try {
      const res = await fetch(`/api/projects?id=${p.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ published: !p.published })
      });
      if (res.ok) {
        showToast(`Publication status changed to ${!p.published ? 'Published' : 'Draft'}.`);
        await loadProjects();
      }
    } catch {
      showToast('Failed to toggle publication status.', 'error');
    }
  };

  // Reorder (Move Up / Down)
  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const reordered = [...projects];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    const orderedIds = reordered.map((p) => p.id);
    try {
      const res = await fetch('/api/projects', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ orderedIds })
      });
      if (res.ok) {
        showToast('Project order updated.');
        await loadProjects();
      }
    } catch {
      showToast('Failed to update project order.', 'error');
    }
  };

  // Universal Media Uploader (Video, Poster, Thumbnail, Still Gallery, Showreel Video, Showreel Poster)
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    targetField: 'video' | 'poster' | 'thumbnail' | 'still' | 'showreel-video' | 'showreel-poster'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = targetField === 'poster' || targetField === 'thumbnail' || targetField === 'still' || targetField === 'showreel-poster';

    // 1. Validate image dimensions if uploading an image (TASK 2B: 1x1 to 4000x4000 pixels)
    let naturalRatio = '';
    let imageWidth = 0;
    let imageHeight = 0;
    if (isImage) {
      try {
        const dimensions = await inspectImageFile(file);
        imageWidth = dimensions.width;
        imageHeight = dimensions.height;
        naturalRatio = dimensions.naturalRatio;
      } catch (validationErr: any) {
        showToast(validationErr.message || 'Image validation failed.', 'error');
        e.target.value = '';
        return;
      }
    }

    // 2. File size validation (50 MB limit for Supabase storage)
    if (file.size > 50 * 1024 * 1024) {
      showToast(
        `File size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds the 50 MB limit. Please compress the file or enter an external URL.`,
        'error'
      );
      e.target.value = '';
      return;
    }

    setIsUploadingMedia(true);
    setUploadProgressText(`Authorizing upload for ${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)...`);

    try {
      // 1. Request short-lived signed upload URL from backend
      const signRes = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'get-signed-url',
          filename: file.name,
          contentType: file.type || 'application/octet-stream'
        })
      });

      const signData = await signRes.json();
      let publicAssetUrl = '';

      if (signRes.ok && signData.success && signData.signedUrl) {
        setUploadProgressText(`Uploading ${file.name}... 0%`);

        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('PUT', signData.signedUrl);
          xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const percent = Math.round((event.loaded / event.total) * 100);
              setUploadProgressText(`Uploading ${file.name}... ${percent}%`);
            }
          };

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve();
            } else {
              reject(new Error(`Storage rejected upload (HTTP ${xhr.status}): ${xhr.responseText || xhr.statusText}`));
            }
          };

          xhr.onerror = () => reject(new Error('Network connection error occurred during file upload.'));
          xhr.ontimeout = () => reject(new Error('Upload request timed out. Please check your connection.'));
          xhr.send(file);
        });

        publicAssetUrl = signData.publicUrl;
      } else {
        // Fallback for smaller files if direct storage signing is unavailable
        if (file.size < 4 * 1024 * 1024) {
          setUploadProgressText(`Processing upload for ${file.name}...`);
          const reader = new FileReader();
          publicAssetUrl = await new Promise<string>((resolve, reject) => {
            reader.onload = async () => {
              try {
                const dataUrl = reader.result as string;
                const fallbackRes = await fetch('/api/upload', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                  },
                  body: JSON.stringify({
                    filename: file.name,
                    contentType: file.type,
                    dataUrl
                  })
                });
                const fallbackData = await fallbackRes.json();
                if (fallbackRes.ok && fallbackData.success && fallbackData.url) {
                  resolve(fallbackData.url);
                } else {
                  reject(new Error(fallbackData.error || 'Server upload failed.'));
                }
              } catch (err) {
                reject(err);
              }
            };
            reader.onerror = () => reject(new Error('Failed to read file locally.'));
            reader.readAsDataURL(file);
          });
        } else {
          throw new Error(signData.error || 'Direct Supabase upload required for files larger than 4 MB.');
        }
      }

      // Attach public URL safely based on targetField
      if (targetField === 'video') {
        setEditingProject((prev) => ({
          ...prev,
          video: publicAssetUrl
        }));
        showToast('Project video uploaded successfully.');
      } else if (targetField === 'poster') {
        setEditingProject((prev) => ({
          ...prev,
          poster: publicAssetUrl,
          thumbnail: prev?.thumbnail || publicAssetUrl,
          imageWidth,
          imageHeight,
          aspectRatio: naturalRatio || prev?.aspectRatio || '16/9'
        }));
        showToast(`Poster artwork uploaded (${imageWidth} × ${imageHeight}px). Natural ratio set.`);
      } else if (targetField === 'thumbnail') {
        setEditingProject((prev) => ({
          ...prev,
          thumbnail: publicAssetUrl
        }));
        showToast('Dedicated grid thumbnail updated.');
      } else if (targetField === 'still') {
        setEditingProject((prev) => {
          const currentStills = prev?.caseStudy?.stills || [];
          return {
            ...prev,
            caseStudy: {
              ...(prev?.caseStudy || {
                role: ['Creative'],
                challenge: '',
                concept: '',
                motionSystem: '',
                results: ''
              }),
              stills: [...currentStills, publicAssetUrl]
            }
          };
        });
        showToast('Gallery image added to project.');
      } else if (targetField === 'showreel-video') {
        setShowreel((prev) => ({
          ...prev,
          video: publicAssetUrl
        }));
        showToast('Showreel video uploaded successfully.');
      } else if (targetField === 'showreel-poster') {
        setShowreel((prev) => ({
          ...prev,
          poster: publicAssetUrl
        }));
        showToast('Showreel poster image uploaded.');
      }
    } catch (err: any) {
      console.error('[Upload Failed]', err);
      showToast(err.message || 'Error uploading file.', 'error');
    } finally {
      setIsUploadingMedia(false);
      setUploadProgressText('');
      e.target.value = '';
    }
  };

  // Remove gallery still image
  const handleRemoveStill = (indexToRemove: number) => {
    setEditingProject((prev) => {
      const currentStills = prev?.caseStudy?.stills || [];
      return {
        ...prev,
        caseStudy: {
          ...(prev?.caseStudy || {
            role: ['Creative'],
            challenge: '',
            concept: '',
            motionSystem: '',
            results: ''
          }),
          stills: currentStills.filter((_, idx) => idx !== indexToRemove)
        }
      };
    });
  };

  // Handle Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'change-password',
          currentPassword,
          newPassword
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPasswordSuccess('Password successfully updated. Keep your new password secure.');
        setCurrentPassword('');
        setNewPassword('');
        setTimeout(() => setIsPasswordModalOpen(false), 2000);
      } else {
        setPasswordError(data.error || 'Failed to update password.');
      }
    } catch {
      setPasswordError('Error connecting to password update endpoint.');
    }
  };

  // Open modal for new project
  const handleAddNew = () => {
    setProjectMediaType('video');
    setEditingProject({
      title: '',
      category: 'Video Editing',
      subCategory: 'Commercial',
      year: new Date().getFullYear().toString(),
      client: '',
      description: '',
      video: '',
      poster: '/projects/project-01/poster.jpg',
      thumbnail: '',
      aspectRatio: '16/9',
      featured: false,
      published: true,
      tags: ['Video Editing'],
      caseStudy: {
        role: ['Video Editor'],
        challenge: '',
        concept: '',
        motionSystem: '',
        results: '',
        stills: [],
        credits: [{ role: 'Editor', name: 'Samyak Mahajan' }]
      }
    });
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleEdit = (p: Project) => {
    const isImage = !p.video && Boolean(p.poster);
    setProjectMediaType(isImage ? 'image' : 'video');
    setEditingProject({ ...p });
    setIsModalOpen(true);
  };

  // KPI Calculations
  const totalCount = projects.length;
  const publishedCount = projects.filter((p) => p.published !== false).length;
  const draftsCount = projects.filter((p) => p.published === false).length;
  const featuredCount = projects.filter((p) => p.featured === true).length;

  // Filtered projects for library view
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      searchQuery === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'video') return p.category.toLowerCase().includes('video');
    if (activeTab === 'motion') return p.category.toLowerCase().includes('motion');
    if (activeTab === 'graphic') return p.category.toLowerCase().includes('graphic');
    if (activeTab === 'featured') return p.featured === true;
    if (activeTab === 'drafts') return p.published === false;

    return true;
  });

  // --------------------------------------------------------------------------
  // RENDER: LOGIN VIEW (If not authenticated)
  // --------------------------------------------------------------------------
  if (!token) {
    return (
      <div className="min-h-screen bg-[#F5F4F0] flex items-center justify-center p-6 font-creato">
        <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-[#ECEBE7] border border-black/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
          <div className="w-12 h-12 rounded-2xl bg-[#171717] text-white flex items-center justify-center mb-6 shadow-sm">
            <Lock className="w-6 h-6" />
          </div>

          <span className="text-[11px] font-creato uppercase tracking-[0.2em] text-[#9A9185] block mb-1">
            PORTFOLIO ADMINISTRATION
          </span>
          <h1 className="text-2xl sm:text-3xl font-creato font-semibold text-[#171717]">
            Sign In to CMS
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#686764] leading-relaxed">
            Manage your video showcases, edit your homepage Showreel, upload graphic design artworks, and publish projects without touching code.
          </p>

          {loginError && (
            <div className="mt-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-[11px] font-creato uppercase tracking-wider text-[#686764] mb-1.5">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full px-4 py-3 rounded-xl bg-white border border-black/[0.08] text-sm text-[#171717] focus:outline-none focus:border-black/40 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-creato uppercase tracking-wider text-[#686764] mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 rounded-xl bg-white border border-black/[0.08] text-sm text-[#171717] focus:outline-none focus:border-black/40 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 rounded-xl bg-[#171717] text-white hover:bg-black font-creato font-medium text-xs uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-2 cursor-pointer"
            >
              {isLoggingIn ? 'Authenticating...' : 'Sign In to Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // RENDER: DASHBOARD VIEW (Authenticated)
  // --------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#F5F4F0] text-[#171717] font-creato pt-20 pb-24">
      {/* Toast Notification */}
      {toastMsg && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl text-xs font-creato font-medium shadow-xl flex items-center gap-2.5 transition-all ${
            toastMsg.type === 'error'
              ? 'bg-red-600 text-white'
              : 'bg-[#171717] text-white border border-white/10'
          }`}
        >
          {toastMsg.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <Check className="w-4 h-4 text-emerald-400" />}
          <span>{toastMsg.text}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="w-full border-b border-black/[0.08] bg-[#ECEBE7] py-4 px-6 sm:px-10 lg:px-16">
        <div className="max-w-[1500px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-semibold tracking-tight text-[#171717]">
              Samyak Mahajan CMS
            </span>
            <span className="text-xs text-[#9A9185]">/</span>
            <span className="text-xs text-[#686764]">Production Backend Live</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                loadProjects();
                loadShowreel();
              }}
              disabled={isLoading || isLoadingShowreel}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-black/[0.08] text-xs text-[#171717] hover:bg-black/5 transition-colors disabled:opacity-50 cursor-pointer"
              title="Refresh project & showreel data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading || isLoadingShowreel ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-black/[0.08] text-xs text-[#171717] hover:bg-black/5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Live Website</span>
            </a>

            <button
              type="button"
              onClick={() => setIsPasswordModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-black/[0.08] text-xs text-[#171717] hover:bg-black/5 transition-colors cursor-pointer"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Change Password</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#171717] text-white hover:bg-black text-xs transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16 pt-8">
        {/* Main Section Navigation Switcher (Projects Library vs Showreel Showcase) */}
        <div className="flex items-center gap-3 mb-8">
          <button
            type="button"
            onClick={() => setMainSection('projects')}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              mainSection === 'projects'
                ? 'bg-[#171717] text-white shadow-sm ring-1 ring-black'
                : 'bg-[#ECEBE7] text-[#686764] hover:text-[#171717] hover:bg-black/5 border border-black/[0.06]'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Projects Archive ({projects.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setMainSection('showreel')}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              mainSection === 'showreel'
                ? 'bg-[#171717] text-white shadow-sm ring-1 ring-black'
                : 'bg-[#ECEBE7] text-[#686764] hover:text-[#171717] hover:bg-black/5 border border-black/[0.06]'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>Main Showreel Manager ({showreel.title})</span>
            {showreel.visible === false && (
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-800">
                Hidden
              </span>
            )}
          </button>
        </div>

        {/* ==================================================================== */}
        {/* VIEW 1: PROJECTS ARCHIVE & LIBRARY                                  */}
        {/* ==================================================================== */}
        {mainSection === 'projects' && (
          <>
            {/* KPI Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
              <div className="p-5 sm:p-6 rounded-2xl bg-[#ECEBE7] border border-black/[0.06] shadow-sm">
                <span className="text-[11px] font-creato uppercase tracking-wider text-[#9A9185] block mb-1">
                  Total Projects
                </span>
                <span className="text-3xl sm:text-4xl font-semibold text-[#171717] block">
                  {totalCount}
                </span>
                <span className="text-xs text-[#686764] mt-1 block">In local & cloud archive</span>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl bg-[#ECEBE7] border border-black/[0.06] shadow-sm">
                <span className="text-[11px] font-creato uppercase tracking-wider text-[#9A9185] block mb-1">
                  Published Live
                </span>
                <span className="text-3xl sm:text-4xl font-semibold text-emerald-700 block">
                  {publishedCount}
                </span>
                <span className="text-xs text-[#686764] mt-1 block">Visible to portfolio visitors</span>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl bg-[#ECEBE7] border border-black/[0.06] shadow-sm">
                <span className="text-[11px] font-creato uppercase tracking-wider text-[#9A9185] block mb-1">
                  Private Drafts
                </span>
                <span className="text-3xl sm:text-4xl font-semibold text-amber-700 block">
                  {draftsCount}
                </span>
                <span className="text-xs text-[#686764] mt-1 block">Hidden from public view</span>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl bg-[#ECEBE7] border border-black/[0.06] shadow-sm">
                <span className="text-[11px] font-creato uppercase tracking-wider text-[#9A9185] block mb-1">
                  Featured on Home
                </span>
                <span className="text-3xl sm:text-4xl font-semibold text-[#171717] block">
                  {featuredCount}
                </span>
                <span className="text-xs text-[#686764] mt-1 block">Preserves 3 flagship showcases</span>
              </div>
            </div>

            {/* Action & Filter Strip */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-black/[0.08]">
              {/* Category Tabs */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer ${
                    activeTab === 'all' ? 'bg-[#171717] text-white' : 'bg-[#ECEBE7] text-[#686764] hover:text-[#171717]'
                  }`}
                >
                  All ({projects.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('video')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer ${
                    activeTab === 'video' ? 'bg-[#171717] text-white' : 'bg-[#ECEBE7] text-[#686764] hover:text-[#171717]'
                  }`}
                >
                  Video Editing
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('motion')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer ${
                    activeTab === 'motion' ? 'bg-[#171717] text-white' : 'bg-[#ECEBE7] text-[#686764] hover:text-[#171717]'
                  }`}
                >
                  Motion Graphics
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('graphic')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer ${
                    activeTab === 'graphic' ? 'bg-[#171717] text-white' : 'bg-[#ECEBE7] text-[#686764] hover:text-[#171717]'
                  }`}
                >
                  Graphic Design
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('featured')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer ${
                    activeTab === 'featured' ? 'bg-[#171717] text-white' : 'bg-[#ECEBE7] text-[#686764] hover:text-[#171717]'
                  }`}
                >
                  ★ Featured ({featuredCount})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('drafts')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer ${
                    activeTab === 'drafts' ? 'bg-[#171717] text-white' : 'bg-[#ECEBE7] text-[#686764] hover:text-[#171717]'
                  }`}
                >
                  Drafts ({draftsCount})
                </button>
              </div>

              {/* Search & Add New Project */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-[#9A9185]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search projects..."
                    className="pl-8 pr-3 py-1.5 rounded-lg bg-white border border-black/[0.08] text-xs text-[#171717] focus:outline-none focus:border-black/40 w-48 sm:w-56"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddNew}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#171717] text-white hover:bg-black text-xs font-semibold uppercase tracking-wider transition-colors shrink-0 shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Project</span>
                </button>
              </div>
            </div>

            {/* Project Library Table / List */}
            <div className="rounded-2xl bg-[#ECEBE7] border border-black/[0.08] overflow-hidden shadow-sm">
              <div className="divide-y divide-black/[0.06]">
                {filteredProjects.length === 0 ? (
                  <div className="py-16 text-center text-xs text-[#686764]">
                    No projects found. Click "Add New Project" above to create one.
                  </div>
                ) : (
                  filteredProjects.map((p, idx) => (
                    <div
                      key={p.id}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#E6E5E0] transition-colors"
                    >
                      {/* Left: Thumbnail & Main Info */}
                      <div className="flex items-start sm:items-center gap-4">
                        {/* Thumbnail Preview */}
                        <div className="w-20 h-14 rounded-lg overflow-hidden bg-black/10 shrink-0 border border-black/[0.08]">
                          <img
                            src={p.thumbnail || p.poster || '/projects/project-01/poster.jpg'}
                            alt={p.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-[#171717]">{p.title}</span>
                            {p.featured && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#171717] text-white text-[10px] font-medium">
                                <Star className="w-2.5 h-2.5 fill-current" />
                                <span>Featured #{idx + 1}</span>
                              </span>
                            )}
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                                p.published !== false
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {p.published !== false ? 'Published' : 'Draft'}
                            </span>
                            {!p.video && (
                              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-medium flex items-center gap-1">
                                <ImageIcon className="w-2.5 h-2.5" />
                                <span>Image Artwork</span>
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-[#686764]">
                            <span className="font-medium text-[#171717]">{p.client || 'Commission'}</span>
                            <span>·</span>
                            <span>{p.category}</span>
                            <span>·</span>
                            <span className="px-1.5 py-0.5 bg-black/[0.04] rounded text-[11px] font-mono">
                              {p.aspectRatio}
                            </span>
                            <span>·</span>
                            <span>{p.year}</span>
                            {p.caseStudy?.stills && p.caseStudy.stills.length > 0 && (
                              <>
                                <span>·</span>
                                <span className="text-emerald-700 font-medium">
                                  +{p.caseStudy.stills.length} stills
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-1.5 self-end sm:self-center">
                        {/* Reorder Buttons */}
                        <button
                          type="button"
                          onClick={() => handleMoveOrder(idx, 'up')}
                          disabled={idx === 0}
                          title="Move Up in order"
                          className="p-1.5 rounded-lg bg-white border border-black/[0.06] text-[#686764] hover:text-[#171717] hover:bg-black/5 disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveOrder(idx, 'down')}
                          disabled={idx === projects.length - 1}
                          title="Move Down in order"
                          className="p-1.5 rounded-lg bg-white border border-black/[0.06] text-[#686764] hover:text-[#171717] hover:bg-black/5 disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>

                        {/* Toggle Featured */}
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(p)}
                          title={p.featured ? 'Remove from Homepage Featured' : 'Feature on Homepage (Top 3)'}
                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                            p.featured
                              ? 'bg-amber-100 border-amber-300 text-amber-800'
                              : 'bg-white border-black/[0.06] text-[#686764] hover:text-amber-600'
                          }`}
                        >
                          <Star className="w-3.5 h-3.5" />
                        </button>

                        {/* Toggle Published */}
                        <button
                          type="button"
                          onClick={() => handleTogglePublished(p)}
                          title={p.published !== false ? 'Unpublish to Draft' : 'Publish Live'}
                          className="p-1.5 rounded-lg bg-white border border-black/[0.06] text-[#686764] hover:text-[#171717] hover:bg-black/5 cursor-pointer"
                        >
                          {p.published !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>

                        {/* Edit Project */}
                        <button
                          type="button"
                          onClick={() => handleEdit(p)}
                          title="Edit project details"
                          className="p-1.5 rounded-lg bg-white border border-black/[0.06] text-[#686764] hover:text-[#171717] hover:bg-black/5 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Project */}
                        <button
                          type="button"
                          onClick={() => setIsDeletingId(p.id)}
                          title="Delete project"
                          className="p-1.5 rounded-lg bg-white border border-black/[0.06] text-red-600 hover:bg-red-50 hover:border-red-200 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Beginner-Friendly Instructions Card */}
            <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-[#ECEBE7] border border-black/[0.08] shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <HelpCircle className="w-5 h-5 text-[#171717]" />
                <h3 className="text-base font-semibold text-[#171717]">
                  Beginner-Friendly Portfolio Guide
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#686764] leading-relaxed">
                <div>
                  <span className="font-semibold text-[#171717] block mb-1">1. Video & Image Projects:</span>
                  You can now create both <strong>Video Projects</strong> and standalone <strong>Image Artworks / Posters</strong> (like Travis Scott Liquid Typography). Images are displayed in their natural portrait or landscape proportions without distortion.
                </div>
                <div>
                  <span className="font-semibold text-[#171717] block mb-1">2. Main Showreel Manager:</span>
                  Switch to the <strong>"Main Showreel Manager"</strong> tab above to edit your homepage Showreel title (e.g. <em>SHOWREEL / 2026</em>), upload a new video file, or update description and poster.
                </div>
                <div>
                  <span className="font-semibold text-[#171717] block mb-1">3. Direct Cloud Persistence:</span>
                  All updates save directly to Supabase and show immediately on your live website without touching code, editing SQL, or waiting for code redeployments!
                </div>
              </div>
            </div>
          </>
        )}

        {/* ==================================================================== */}
        {/* VIEW 2: DEDICATED SHOWREEL MANAGEMENT (TASK 1)                      */}
        {/* ==================================================================== */}
        {mainSection === 'showreel' && (
          <div className="space-y-8">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#ECEBE7] border border-black/[0.08] shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-black/[0.08] gap-4 mb-8">
                <div>
                  <span className="text-[11px] font-creato uppercase tracking-[0.2em] text-[#9A9185] block mb-1">
                    HOMEPAGE FLAGSHIP SHOWCASE
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-semibold text-[#171717]">
                    Main Showreel Management
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-[#686764]">
                    Customize the showreel title card, video file, duration, and poster displayed on the homepage.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSaveShowreel}
                  disabled={isSavingShowreel || isUploadingMedia}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#171717] text-white hover:bg-black text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-50 shrink-0 shadow-sm cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingShowreel ? 'Saving Showreel...' : 'Save Showreel Changes'}</span>
                </button>
              </div>

              {/* Form & Live Preview Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left: Form Controls (7 cols) */}
                <form onSubmit={handleSaveShowreel} className="lg:col-span-7 space-y-5">
                  {/* Title & Eyebrow */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-creato uppercase tracking-wider text-[#686764] mb-1.5 font-medium">
                        Showreel Title Card *
                      </label>
                      <input
                        type="text"
                        required
                        value={showreel.title}
                        onChange={(e) => setShowreel({ ...showreel, title: e.target.value })}
                        placeholder="e.g. SHOWREEL / 2026"
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-black/[0.08] text-sm text-[#171717] focus:outline-none focus:border-black/40"
                      />
                      <span className="text-[10px] text-[#9A9185] mt-1 block">
                        Changes the prominent heading on the live homepage.
                      </span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-creato uppercase tracking-wider text-[#686764] mb-1.5 font-medium">
                        Eyebrow Label
                      </label>
                      <input
                        type="text"
                        value={showreel.eyebrow || '02 / SHOWCASE'}
                        onChange={(e) => setShowreel({ ...showreel, eyebrow: e.target.value })}
                        placeholder="e.g. 02 / SHOWCASE"
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-black/[0.08] text-sm text-[#171717] focus:outline-none focus:border-black/40"
                      />
                      <span className="text-[10px] text-[#9A9185] mt-1 block">
                        Section counter label above the title.
                      </span>
                    </div>
                  </div>

                  {/* Duration & Visibility Toggle */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-creato uppercase tracking-wider text-[#686764] mb-1.5 font-medium">
                        Video Duration Display
                      </label>
                      <div className="relative">
                        <Clock className="w-3.5 h-3.5 absolute left-3.5 top-3 text-[#9A9185]" />
                        <input
                          type="text"
                          value={showreel.duration}
                          onChange={(e) => setShowreel({ ...showreel, duration: e.target.value })}
                          placeholder="01:24"
                          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-black/[0.08] text-sm text-[#171717] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-creato uppercase tracking-wider text-[#686764] mb-1.5 font-medium">
                        Visibility Status
                      </label>
                      <label className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-black/[0.08] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={showreel.visible !== false}
                          onChange={(e) => setShowreel({ ...showreel, visible: e.target.checked })}
                          className="w-4 h-4 rounded text-black focus:ring-0 cursor-pointer"
                        />
                        <span className="text-xs font-medium text-[#171717]">
                          {showreel.visible !== false ? 'Visible on Homepage' : 'Hidden from Public Website'}
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Short Description */}
                  <div>
                    <label className="block text-[11px] font-creato uppercase tracking-wider text-[#686764] mb-1.5 font-medium">
                      Description (Under Video)
                    </label>
                    <textarea
                      rows={3}
                      value={showreel.description}
                      onChange={(e) => setShowreel({ ...showreel, description: e.target.value })}
                      placeholder="A curated edit of commercial direction, dynamic motion graphics..."
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-black/[0.08] text-xs text-[#171717] focus:outline-none resize-none leading-relaxed"
                    />
                  </div>

                  {/* Showreel Video Upload & URL */}
                  <div className="p-5 rounded-2xl bg-white border border-black/[0.08] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#171717] flex items-center gap-2">
                        <Film className="w-4 h-4 text-emerald-600" />
                        <span>Showreel Video File</span>
                      </span>
                      {showreel.video && (
                        <button
                          type="button"
                          onClick={() => setShowreel({ ...showreel, video: '' })}
                          className="text-[11px] text-red-600 hover:underline"
                        >
                          Clear Video
                        </button>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        value={showreel.video}
                        onChange={(e) => setShowreel({ ...showreel, video: e.target.value })}
                        placeholder="Video URL (e.g. /reel/showreel.mp4 or Supabase URL)"
                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#F5F4F0] border border-black/[0.08] text-xs text-[#171717] focus:outline-none font-mono"
                      />
                      <input
                        ref={showreelVideoInputRef}
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'showreel-video')}
                      />
                      <button
                        type="button"
                        onClick={() => showreelVideoInputRef.current?.click()}
                        disabled={isUploadingMedia}
                        className="px-4 py-2.5 rounded-xl bg-[#171717] text-white hover:bg-black text-xs font-medium flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Video</span>
                      </button>
                    </div>

                    <div className="text-[11px] text-[#9A9185]">
                      Supported formats: MP4, WebM, QuickTime. Files up to 50 MB upload directly to Supabase Storage.
                    </div>
                  </div>

                  {/* Showreel Poster Upload & URL */}
                  <div className="p-5 rounded-2xl bg-white border border-black/[0.08] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#171717] flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-blue-600" />
                        <span>Showreel Poster / Thumbnail Image</span>
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        value={showreel.poster}
                        onChange={(e) => setShowreel({ ...showreel, poster: e.target.value })}
                        placeholder="Poster image URL (e.g. /reel/showreel-poster.jpg)"
                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#F5F4F0] border border-black/[0.08] text-xs text-[#171717] focus:outline-none font-mono"
                      />
                      <input
                        ref={showreelPosterInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/avif"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'showreel-poster')}
                      />
                      <button
                        type="button"
                        onClick={() => showreelPosterInputRef.current?.click()}
                        disabled={isUploadingMedia}
                        className="px-4 py-2.5 rounded-xl bg-[#171717] text-white hover:bg-black text-xs font-medium flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Poster</span>
                      </button>
                    </div>

                    <div className="text-[11px] text-[#9A9185]">
                      Supports JPG, PNG, WebP, AVIF up to 4000 × 4000 pixels.
                    </div>
                  </div>

                  {uploadProgressText && isUploadingMedia && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 animate-pulse flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>{uploadProgressText}</span>
                    </div>
                  )}

                  <div className="pt-4 flex items-center justify-end">
                    <button
                      type="submit"
                      disabled={isSavingShowreel || isUploadingMedia}
                      className="px-8 py-3 rounded-xl bg-[#171717] text-white hover:bg-black text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-50 shadow-sm flex items-center gap-2 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSavingShowreel ? 'Saving Changes...' : 'Save Showreel Changes'}</span>
                    </button>
                  </div>
                </form>

                {/* Right: Interactive Dark Live Preview (5 cols, matches public design) */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-creato uppercase tracking-wider text-[#9A9185] font-semibold">
                      Live Frontend Preview
                    </span>
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        showreel.visible !== false
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {showreel.visible !== false ? 'Live on Site' : 'Currently Hidden'}
                    </span>
                  </div>

                  {/* Dark Mockup Card mirroring public ReelSection.tsx */}
                  <div className="p-6 rounded-3xl bg-[#0D0D0D] text-white border border-white/10 shadow-xl space-y-4">
                    <div>
                      <span className="text-[10px] font-creato uppercase tracking-[0.2em] text-[#9A9185] block mb-1">
                        {showreel.eyebrow || '02 / SHOWCASE'}
                      </span>
                      <h3 className="text-xl font-creato font-semibold text-white tracking-tight">
                        {showreel.title || 'SHOWREEL / 2026'}
                      </h3>
                    </div>

                    <div className="w-full h-px bg-white/10" />

                    {/* Video Player Preview */}
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/60 border border-white/10 flex items-center justify-center">
                      {showreel.video ? (
                        <video
                          src={showreel.video}
                          poster={showreel.poster}
                          controls
                          playsInline
                          preload="metadata"
                          className="w-full h-full object-cover"
                        />
                      ) : showreel.poster ? (
                        <img
                          src={showreel.poster}
                          alt="Showreel Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center text-xs text-white/40 flex flex-col items-center gap-2">
                          <Play className="w-6 h-6 text-white/30" />
                          <span>No video uploaded yet</span>
                        </div>
                      )}

                      {/* Duration Tag overlay */}
                      {showreel.duration && (
                        <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono text-white/90 border border-white/10 pointer-events-none">
                          {showreel.duration}
                        </div>
                      )}
                    </div>

                    {/* Description preview */}
                    <p className="text-xs text-white/60 font-creato leading-relaxed">
                      {showreel.description || 'A curated edit of commercial direction, dynamic motion graphics, kinetic typography, and post-production finishing.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* MODAL: ADD / EDIT PROJECT (TASK 2)                                     */}
      {/* ---------------------------------------------------------------------- */}
      {isModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#ECEBE7] rounded-3xl border border-black/[0.1] shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-black/[0.08] mb-6">
              <div>
                <span className="text-[11px] font-creato uppercase tracking-wider text-[#9A9185]">
                  {editingProject.id ? 'Edit Existing' : 'Create New'}
                </span>
                <h2 className="text-xl font-semibold text-[#171717]">
                  {editingProject.id ? editingProject.title : 'Add New Portfolio Project'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#171717] hover:bg-black/5 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-5">
              {/* Media Type Selector (Video Project vs Standalone Image Artwork) */}
              <div className="p-4 rounded-2xl bg-white border border-black/[0.08]">
                <label className="block text-[11px] font-creato uppercase tracking-wider text-[#686764] mb-2 font-medium">
                  Project Asset Type *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setProjectMediaType('video')}
                    className={`py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                      projectMediaType === 'video'
                        ? 'bg-[#171717] text-white border-black shadow-sm'
                        : 'bg-[#F5F4F0] text-[#686764] border-black/[0.06] hover:text-[#171717]'
                    }`}
                  >
                    <Film className="w-3.5 h-3.5" />
                    <span>Video Project</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setProjectMediaType('image');
                      if (editingProject.aspectRatio === '16/9') {
                        setEditingProject({ ...editingProject, aspectRatio: '4/3' });
                      }
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                      projectMediaType === 'image'
                        ? 'bg-[#171717] text-white border-black shadow-sm'
                        : 'bg-[#F5F4F0] text-[#686764] border-black/[0.06] hover:text-[#171717]'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Image Artwork</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProjectMediaType('mixed')}
                    className={`py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                      projectMediaType === 'mixed'
                        ? 'bg-[#171717] text-white border-black shadow-sm'
                        : 'bg-[#F5F4F0] text-[#686764] border-black/[0.06] hover:text-[#171717]'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Mixed Media</span>
                  </button>
                </div>
              </div>

              {/* Title & Client */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-creato uppercase tracking-wider text-[#686764] mb-1 font-medium">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProject.title || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    placeholder="e.g. Travis Scott — Liquid Typography"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/[0.08] text-xs text-[#171717] focus:outline-none focus:border-black/40"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-creato uppercase tracking-wider text-[#686764] mb-1 font-medium">
                    Client / Spec
                  </label>
                  <input
                    type="text"
                    value={editingProject.client || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })}
                    placeholder="e.g. Editorial Artwork, Tour Spec"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/[0.08] text-xs text-[#171717] focus:outline-none focus:border-black/40"
                  />
                </div>
              </div>

              {/* Discipline, Sub-Category & Aspect Ratio */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-creato uppercase tracking-wider text-[#686764] mb-1 font-medium">
                    Discipline *
                  </label>
                  <select
                    value={editingProject.category || 'Video Editing'}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as ProjectCategory })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-black/[0.08] text-xs text-[#171717] focus:outline-none"
                  >
                    <option value="Video Editing">Video Editing</option>
                    <option value="Motion Graphics">Motion Graphics</option>
                    <option value="Graphic Design">Graphic Design</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-creato uppercase tracking-wider text-[#686764] mb-1 font-medium">
                    Sub-Category
                  </label>
                  <input
                    type="text"
                    value={editingProject.subCategory || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, subCategory: e.target.value })}
                    placeholder="e.g. Poster Design, Commercial"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/[0.08] text-xs text-[#171717] focus:outline-none"
                  >
                  </input>
                </div>

                <div>
                  <label className="block text-[11px] font-creato uppercase tracking-wider text-[#686764] mb-1 font-medium">
                    Display Aspect Ratio *
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={editingProject.aspectRatio || '16/9'}
                      onChange={(e) => setEditingProject({ ...editingProject, aspectRatio: e.target.value as AspectRatio })}
                      placeholder="16/9 or 794/1123"
                      className="w-full px-3 py-2.5 rounded-xl bg-white border border-black/[0.08] text-xs font-mono text-[#171717] focus:outline-none"
                    />
                    <select
                      value={['16/9', '9/16', '4/3', '1/1', '2.39/1'].includes(editingProject.aspectRatio || '') ? editingProject.aspectRatio : 'custom'}
                      onChange={(e) => {
                        if (e.target.value !== 'custom') {
                          setEditingProject({ ...editingProject, aspectRatio: e.target.value as AspectRatio });
                        }
                      }}
                      className="px-2 py-2.5 rounded-xl bg-white border border-black/[0.08] text-xs text-[#171717]"
                    >
                      <option value="16/9">16:9</option>
                      <option value="9/16">9:16</option>
                      <option value="4/3">4:3</option>
                      <option value="1/1">1:1</option>
                      <option value="2.39/1">2.39:1</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-creato uppercase tracking-wider text-[#686764] mb-1 font-medium">
                  Card Description (Short & punchy)
                </label>
                <textarea
                  rows={2}
                  value={editingProject.description || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  placeholder="Cinematic typography poster exploring liquid metal reflections..."
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-black/[0.08] text-xs text-[#171717] focus:outline-none resize-none"
                />
              </div>

              {/* Media: Main Video (Optional for Image Artworks) */}
              {projectMediaType !== 'image' && (
                <div className="p-4 rounded-2xl bg-white border border-black/[0.08] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-creato uppercase tracking-wider font-semibold text-[#171717] flex items-center gap-1.5">
                      <Film className="w-3.5 h-3.5" />
                      <span>Video Media Source</span>
                    </span>
                    {editingProject.video && (
                      <button
                        type="button"
                        onClick={() => setEditingProject({ ...editingProject, video: '' })}
                        className="text-[11px] text-red-600 hover:underline cursor-pointer"
                      >
                        Remove Video
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={editingProject.video || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, video: e.target.value })}
                      placeholder="Video URL (e.g. /projects/project-02/video.mp4 or Supabase URL)"
                      className="flex-1 px-3.5 py-2 rounded-xl bg-[#F5F4F0] border border-black/[0.08] text-xs text-[#171717] focus:outline-none font-mono"
                    />
                    <input
                      ref={videoFileInputRef}
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'video')}
                    />
                    <button
                      type="button"
                      onClick={() => videoFileInputRef.current?.click()}
                      disabled={isUploadingMedia}
                      className="px-4 py-2 rounded-xl bg-[#171717] text-white hover:bg-black text-xs font-medium flex items-center justify-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Video File</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Media: Main Poster / Original Artwork (TASK 2) */}
              <div className="p-4 rounded-2xl bg-white border border-black/[0.08] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-creato uppercase tracking-wider font-semibold text-[#171717] flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Main Artwork / Poster Image *</span>
                  </span>
                  {editingProject.imageWidth && editingProject.imageHeight && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/5 text-[#171717]">
                      {editingProject.imageWidth} × {editingProject.imageHeight} px
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={editingProject.poster || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, poster: e.target.value })}
                    placeholder="Poster image URL (e.g. /projects/project-01/poster.jpg)"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-[#F5F4F0] border border-black/[0.08] text-xs text-[#171717] focus:outline-none font-mono"
                  />
                  <input
                    ref={posterFileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'poster')}
                  />
                  <button
                    type="button"
                    onClick={() => posterFileInputRef.current?.click()}
                    disabled={isUploadingMedia}
                    className="px-4 py-2 rounded-xl bg-[#171717] text-white hover:bg-black text-xs font-medium flex items-center justify-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image</span>
                  </button>
                </div>
                <div className="text-[11px] text-[#9A9185]">
                  Supports 1 × 1 up to 4000 × 4000 px. Automatically calculates natural aspect ratio (e.g. 794/1123 portrait).
                </div>
              </div>

              {/* Media: Dedicated Grid Thumbnail (TASK 2E) */}
              <div className="p-4 rounded-2xl bg-white border border-black/[0.08] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-creato uppercase tracking-wider font-semibold text-[#171717] block">
                      Dedicated Grid Thumbnail (Optional)
                    </span>
                    <span className="text-[10px] text-[#9A9185]">
                      Overrides card thumbnail in the grid without altering original poster.
                    </span>
                  </div>
                  {editingProject.thumbnail && editingProject.thumbnail !== editingProject.poster && (
                    <button
                      type="button"
                      onClick={() => setEditingProject({ ...editingProject, thumbnail: editingProject.poster })}
                      className="text-[11px] text-red-600 hover:underline cursor-pointer"
                    >
                      Reset to Poster
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={editingProject.thumbnail || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, thumbnail: e.target.value })}
                    placeholder="Leave empty to use main poster as grid thumbnail"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-[#F5F4F0] border border-black/[0.08] text-xs text-[#171717] focus:outline-none font-mono"
                  />
                  <input
                    ref={thumbnailFileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'thumbnail')}
                  />
                  <button
                    type="button"
                    onClick={() => thumbnailFileInputRef.current?.click()}
                    disabled={isUploadingMedia}
                    className="px-4 py-2 rounded-xl bg-white border border-black/[0.1] text-[#171717] hover:bg-black/5 text-xs font-medium flex items-center justify-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Thumbnail</span>
                  </button>
                </div>
              </div>

              {/* Media: Additional Images / Stills Gallery (TASK 2F) */}
              <div className="p-4 rounded-2xl bg-white border border-black/[0.08] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-creato uppercase tracking-wider font-semibold text-[#171717] flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Additional Images & Stills Gallery ({editingProject.caseStudy?.stills?.length || 0})</span>
                  </span>
                  <input
                    ref={stillFileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'still')}
                  />
                  <button
                    type="button"
                    onClick={() => stillFileInputRef.current?.click()}
                    disabled={isUploadingMedia}
                    className="px-3 py-1.5 rounded-lg bg-black/5 hover:bg-black/10 text-xs font-medium text-[#171717] flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Gallery Image</span>
                  </button>
                </div>

                {editingProject.caseStudy?.stills && editingProject.caseStudy.stills.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-2">
                    {editingProject.caseStudy.stills.map((stillUrl, sIdx) => (
                      <div key={sIdx} className="relative aspect-square rounded-xl overflow-hidden bg-black/5 group border border-black/[0.06]">
                        <img src={stillUrl} alt={`Still ${sIdx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveStill(sIdx)}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs opacity-90 hover:opacity-100 cursor-pointer shadow-sm"
                          title="Remove image"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-[11px] text-[#9A9185] py-1">
                    No additional images added yet. Click "+ Add Gallery Image" above to attach extra artwork or process stills.
                  </div>
                )}
              </div>

              {uploadProgressText && isUploadingMedia && (
                <div className="text-xs text-emerald-700 animate-pulse font-medium">
                  {uploadProgressText}
                </div>
              )}

              {/* Toggles: Featured & Published */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#171717]">
                  <input
                    type="checkbox"
                    checked={editingProject.featured || false}
                    onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-black focus:ring-0 cursor-pointer"
                  />
                  <span>Feature in Homepage Top Showcases (★)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#171717]">
                  <input
                    type="checkbox"
                    checked={editingProject.published !== false}
                    onChange={(e) => setEditingProject({ ...editingProject, published: e.target.checked })}
                    className="w-4 h-4 rounded text-black focus:ring-0 cursor-pointer"
                  />
                  <span>Publish Live (Uncheck to keep Private Draft)</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-black/[0.08] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white border border-black/[0.08] text-xs font-medium text-[#686764] hover:text-[#171717] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingMedia}
                  className="px-6 py-2.5 rounded-xl bg-[#171717] text-white hover:bg-black text-xs font-semibold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                >
                  {isUploadingMedia ? 'Uploading Media...' : 'Save Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* MODAL: DELETE CONFIRMATION                                             */}
      {/* ---------------------------------------------------------------------- */}
      {isDeletingId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#ECEBE7] rounded-3xl border border-black/[0.1] shadow-2xl p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-[#171717]">
              Confirm Project Deletion
            </h3>
            <p className="text-xs text-[#686764] leading-relaxed">
              Are you sure you want to remove this project from your portfolio archive? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsDeletingId(null)}
                className="px-4 py-2 rounded-xl bg-white border border-black/[0.08] text-xs text-[#686764] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteConfirm(isDeletingId)}
                className="px-5 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 text-xs font-semibold cursor-pointer"
              >
                Delete Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* MODAL: CHANGE PASSWORD                                                 */}
      {/* ---------------------------------------------------------------------- */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#ECEBE7] rounded-3xl border border-black/[0.1] shadow-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.08]">
              <h3 className="text-lg font-semibold text-[#171717]">
                Change Administrator Password
              </h3>
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            {passwordError && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs">
                {passwordError}
              </div>
            )}
            {passwordSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-medium">
                {passwordSuccess}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4 pt-2">
              <div>
                <label className="block text-[11px] font-creato uppercase text-[#686764] mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/[0.08] text-xs text-[#171717] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-creato uppercase text-[#686764] mb-1">
                  New Password (min 8 chars)
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/[0.08] text-xs text-[#171717] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white border border-black/[0.08] text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#171717] text-white hover:bg-black text-xs font-semibold cursor-pointer"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
