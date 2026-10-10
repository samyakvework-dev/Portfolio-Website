import React, { useState, useEffect, useRef } from 'react';
import type { Project, AspectRatio, ProjectCategory } from '../data/projects';
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
  HelpCircle
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  // Authentication states
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('samyak_admin_token'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Projects & library states
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'video' | 'motion' | 'graphic' | 'featured' | 'drafts'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);

  // Upload progress state
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState('');

  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const videoFileInputRef = useRef<HTMLInputElement | null>(null);
  const posterFileInputRef = useRef<HTMLInputElement | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 3500);
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

  useEffect(() => {
    if (token) {
      loadProjects();
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
    } catch (err: any) {
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

  // Handle Create / Edit Project
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.title) {
      showToast('Project title is required.', 'error');
      return;
    }

    try {
      const isEditing = Boolean(editingProject.id);
      const url = isEditing ? `/api/projects?id=${editingProject.id}` : '/api/projects';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editingProject)
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

  // Handle File Upload (Video or Poster)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: 'video' | 'poster') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingMedia(true);
    setUploadProgressText(`Uploading ${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)...`);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;

        const res = await fetch('/api/upload', {
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

        const data = await res.json();
        if (res.ok && data.success && data.url) {
          showToast(`${targetField === 'video' ? 'Video' : 'Thumbnail'} uploaded successfully.`);
          setEditingProject((prev) => ({
            ...prev,
            [targetField]: data.url,
            ...(targetField === 'poster' ? { thumbnail: data.url } : {})
          }));
        } else {
          showToast(data.error || 'Upload failed.', 'error');
        }
        setIsUploadingMedia(false);
        setUploadProgressText('');
      };

      reader.onerror = () => {
        showToast('Failed to read file for upload.', 'error');
        setIsUploadingMedia(false);
      };

      reader.readAsDataURL(file);
    } catch (err: any) {
      showToast(err.message || 'Error uploading file.', 'error');
      setIsUploadingMedia(false);
    }
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
    setEditingProject({
      title: '',
      category: 'Video Editing',
      subCategory: 'Commercial',
      year: new Date().getFullYear().toString(),
      client: '',
      description: '',
      video: '',
      poster: '/projects/project-01/poster.jpg',
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
        credits: [{ role: 'Editor', name: 'Samyak Mahajan' }]
      }
    });
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleEdit = (p: Project) => {
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
          {/* Monogram */}
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
            Manage your video showcases, upload media, adjust categories, and publish projects without touching code.
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
              className="w-full py-3.5 rounded-xl bg-[#171717] text-white hover:bg-black font-creato font-medium text-xs uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-2"
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
              onClick={loadProjects}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-black/[0.08] text-xs text-[#171717] hover:bg-black/5 transition-colors disabled:opacity-50"
              title="Refresh project data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-black/[0.08] text-xs text-[#171717] hover:bg-black/5 transition-colors"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Change Password</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#171717] text-white hover:bg-black text-xs transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16 pt-8">
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
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-colors ${
                activeTab === 'all' ? 'bg-[#171717] text-white' : 'bg-[#ECEBE7] text-[#686764] hover:text-[#171717]'
              }`}
            >
              All ({projects.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('video')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-colors ${
                activeTab === 'video' ? 'bg-[#171717] text-white' : 'bg-[#ECEBE7] text-[#686764] hover:text-[#171717]'
              }`}
            >
              Video Editing
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('motion')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-colors ${
                activeTab === 'motion' ? 'bg-[#171717] text-white' : 'bg-[#ECEBE7] text-[#686764] hover:text-[#171717]'
              }`}
            >
              Motion Graphics
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('graphic')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-colors ${
                activeTab === 'graphic' ? 'bg-[#171717] text-white' : 'bg-[#ECEBE7] text-[#686764] hover:text-[#171717]'
              }`}
            >
              Graphic Design
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('featured')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-colors ${
                activeTab === 'featured' ? 'bg-[#171717] text-white' : 'bg-[#ECEBE7] text-[#686764] hover:text-[#171717]'
              }`}
            >
              ★ Featured ({featuredCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('drafts')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-colors ${
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#171717] text-white hover:bg-black text-xs font-semibold uppercase tracking-wider transition-colors shrink-0 shadow-sm"
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
                        src={p.poster || p.thumbnail || '/projects/project-01/poster.jpg'}
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
                      className="p-1.5 rounded-lg bg-white border border-black/[0.06] text-[#686764] hover:text-[#171717] hover:bg-black/5 disabled:opacity-30"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveOrder(idx, 'down')}
                      disabled={idx === projects.length - 1}
                      title="Move Down in order"
                      className="p-1.5 rounded-lg bg-white border border-black/[0.06] text-[#686764] hover:text-[#171717] hover:bg-black/5 disabled:opacity-30"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    {/* Toggle Featured */}
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(p)}
                      title={p.featured ? 'Remove from Homepage Featured' : 'Feature on Homepage (Top 3)'}
                      className={`p-1.5 rounded-lg border transition-colors ${
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
                      className="p-1.5 rounded-lg bg-white border border-black/[0.06] text-[#686764] hover:text-[#171717] hover:bg-black/5"
                    >
                      {p.published !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>

                    {/* Edit Project */}
                    <button
                      type="button"
                      onClick={() => handleEdit(p)}
                      title="Edit project details"
                      className="p-1.5 rounded-lg bg-white border border-black/[0.06] text-[#686764] hover:text-[#171717] hover:bg-black/5"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete Project */}
                    <button
                      type="button"
                      onClick={() => setIsDeletingId(p.id)}
                      title="Delete project"
                      className="p-1.5 rounded-lg bg-white border border-black/[0.06] text-red-600 hover:bg-red-50 hover:border-red-200"
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
              Beginner-Friendly Workflow Guide
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#686764] leading-relaxed">
            <div>
              <span className="font-semibold text-[#171717] block mb-1">1. Adding a New Video Project:</span>
              Click <strong>"Add New Project"</strong> above. Enter the title, select your discipline (Video Editing, Motion Graphics, Graphic Design), choose the aspect ratio (16:9 for landscape, 9:16 for vertical), and click <strong>"Upload Video"</strong> or enter a video URL.
            </div>
            <div>
              <span className="font-semibold text-[#171717] block mb-1">2. Homepage Featured Showcases:</span>
              The top 3 featured showcases on your homepage are controlled by the <strong>★ Star</strong> button. The first 3 projects marked with the Star appear on your Homepage in their exact order.
            </div>
            <div>
              <span className="font-semibold text-[#171717] block mb-1">3. Instant Publishing:</span>
              Toggle between <strong>Published</strong> (live on the website) and <strong>Draft</strong> (private) anytime. Changes save persistently and appear immediately without writing code or redeploying!
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* MODAL: ADD / EDIT PROJECT                                              */}
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
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#171717] hover:bg-black/5"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-5">
              {/* Title & Client */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-creato uppercase tracking-wider text-[#686764] mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProject.title || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    placeholder="e.g. Nike — Kinetic Energy Campaign"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/[0.08] text-xs text-[#171717] focus:outline-none focus:border-black/40"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-creato uppercase tracking-wider text-[#686764] mb-1">
                    Client / Brand
                  </label>
                  <input
                    type="text"
                    value={editingProject.client || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })}
                    placeholder="e.g. Nike Running"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/[0.08] text-xs text-[#171717] focus:outline-none focus:border-black/40"
                  />
                </div>
              </div>

              {/* Category & Aspect Ratio */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-creato uppercase tracking-wider text-[#686764] mb-1">
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
                  <label className="block text-[11px] font-creato uppercase tracking-wider text-[#686764] mb-1">
                    Sub-Category
                  </label>
                  <input
                    type="text"
                    value={editingProject.subCategory || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, subCategory: e.target.value })}
                    placeholder="e.g. Commercial, Kinetic Type"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/[0.08] text-xs text-[#171717] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-creato uppercase tracking-wider text-[#686764] mb-1">
                    Aspect Ratio *
                  </label>
                  <select
                    value={editingProject.aspectRatio || '16/9'}
                    onChange={(e) => setEditingProject({ ...editingProject, aspectRatio: e.target.value as AspectRatio })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-black/[0.08] text-xs text-[#171717] focus:outline-none"
                  >
                    <option value="16/9">16:9 (Landscape Video)</option>
                    <option value="9/16">9:16 (Vertical Mobile Reel)</option>
                    <option value="4/3">4:3 (Artwork / Classic)</option>
                    <option value="1/1">1:1 (Square)</option>
                    <option value="2.39/1">2.39:1 (Cinemascope)</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-creato uppercase tracking-wider text-[#686764] mb-1">
                  Card Description (Short & punchy)
                </label>
                <textarea
                  rows={2}
                  value={editingProject.description || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  placeholder="High-velocity editorial pacing and sound-reactive typographics..."
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-black/[0.08] text-xs text-[#171717] focus:outline-none resize-none"
                />
              </div>

              {/* Media: Video File or URL */}
              <div className="p-4 rounded-2xl bg-white border border-black/[0.08] space-y-3">
                <span className="text-[11px] font-creato uppercase tracking-wider font-semibold text-[#171717] block">
                  Video Media Source
                </span>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={editingProject.video || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, video: e.target.value })}
                    placeholder="Enter Video URL (e.g. /projects/project-02/video.mp4 or https://...)"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-[#F5F4F0] border border-black/[0.08] text-xs text-[#171717] focus:outline-none"
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
                    className="px-4 py-2 rounded-xl bg-[#171717] text-white hover:bg-black text-xs font-medium flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Video File</span>
                  </button>
                </div>
                {uploadProgressText && isUploadingMedia && (
                  <div className="text-xs text-emerald-700 animate-pulse">
                    {uploadProgressText}
                  </div>
                )}
              </div>

              {/* Media: Thumbnail / Poster */}
              <div className="p-4 rounded-2xl bg-white border border-black/[0.08] space-y-3">
                <span className="text-[11px] font-creato uppercase tracking-wider font-semibold text-[#171717] block">
                  Thumbnail / Poster Image
                </span>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={editingProject.poster || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, poster: e.target.value, thumbnail: e.target.value })}
                    placeholder="Poster image URL (e.g. /projects/project-01/poster.jpg)"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-[#F5F4F0] border border-black/[0.08] text-xs text-[#171717] focus:outline-none"
                  />
                  <input
                    ref={posterFileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/svg+xml"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'poster')}
                  />
                  <button
                    type="button"
                    onClick={() => posterFileInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl bg-[#171717] text-white hover:bg-black text-xs font-medium flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image</span>
                  </button>
                </div>
              </div>

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
                  className="px-5 py-2.5 rounded-xl bg-white border border-black/[0.08] text-xs font-medium text-[#686764] hover:text-[#171717]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#171717] text-white hover:bg-black text-xs font-semibold uppercase tracking-wider"
                >
                  Save Project
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
                className="px-4 py-2 rounded-xl bg-white border border-black/[0.08] text-xs text-[#686764]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteConfirm(isDeletingId)}
                className="px-5 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 text-xs font-semibold"
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
                className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-xs"
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
                  className="px-4 py-2 rounded-xl bg-white border border-black/[0.08] text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#171717] text-white hover:bg-black text-xs font-semibold"
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
