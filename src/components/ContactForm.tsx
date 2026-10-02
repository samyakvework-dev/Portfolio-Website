import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';
import { InstagramIcon } from './Icons';

interface FormState {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
  general?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [referenceId, setReferenceId] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Please enter your name.';
    }

    if (!formData.email.trim() || !EMAIL_REGEX.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.message.trim() || formData.message.trim().length < 5) {
      newErrors.message = 'Please enter a message.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoading) return; // Prevent duplicate submissions

    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim()
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Unable to send your enquiry right now. Please try again later.');
      }

      // Success
      setIsSuccess(true);
      if (data.referenceId || data.submission?.id) {
        setReferenceId(String(data.referenceId || data.submission.id));
      }
      setFormData({ name: '', email: '', message: '' });
    } catch (err: any) {
      setErrors({
        general: err.message || 'Unable to send your enquiry right now. Please try again later.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      {/* Top Header */}
      <div className="mb-12 sm:mb-16">
        <span className="text-xs sm:text-sm font-mono uppercase tracking-widest text-[#FF6A00] block mb-3">
          GET IN TOUCH
        </span>
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.05]">
          Let's create<br />
          something that<br />
          <span className="text-[#FF6A00]">moves.</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Form */}
        <div className="lg:col-span-7 bg-[#161616] p-7 sm:p-9 rounded-[28px] border border-white/8 shadow-2xl relative overflow-hidden">
          {/* Subtle warm accent glow inside card */}
          <div 
            className="absolute top-0 right-0 w-64 h-64 bg-orange-600/5 rounded-full blur-3xl pointer-events-none" 
            aria-hidden="true"
          />

          {isSuccess ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Message sent.
              </h3>
              <p className="text-sm sm:text-base text-[#A1A1A1] max-w-md leading-relaxed">
                Thanks — I'll get back to you soon.
              </p>
              {referenceId && (
                <span className="text-[11px] font-mono text-white/30">
                  Reference #{referenceId}
                </span>
              )}
              <button
                type="button"
                onClick={() => setIsSuccess(false)}
                className="mt-6 px-6 py-2.5 rounded-full text-xs font-semibold bg-white/8 hover:bg-white/14 border border-white/10 text-white transition-all duration-200"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-6 relative z-10">
              {/* General error message */}
              {errors.general && (
                <div 
                  role="alert"
                  className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs sm:text-sm"
                >
                  <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
                  <span>{errors.general}</span>
                </div>
              )}

              {/* Name Field */}
              <div className="space-y-2">
                <label 
                  htmlFor="contact-name" 
                  className="block text-xs font-mono uppercase tracking-wider text-white/70"
                >
                  Name <span className="text-[#FF6A00]">*</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, name: e.target.value }));
                    if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
                  }}
                  placeholder="Your Name"
                  disabled={isLoading}
                  className={`w-full px-4 py-3.5 rounded-2xl bg-[#111111] text-white placeholder-white/20 text-sm border transition-all duration-200 focus:outline-none ${
                    errors.name
                      ? 'border-red-500/60 focus:ring-2 focus:ring-red-500/30'
                      : 'border-white/8 focus:border-[#FF6A00]/50 focus:ring-2 focus:ring-[#FF6A00]/20'
                  }`}
                  aria-invalid={errors.name ? 'true' : 'false'}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name && (
                  <p id="name-error" className="text-xs text-red-400 pl-1">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label 
                  htmlFor="contact-email" 
                  className="block text-xs font-mono uppercase tracking-wider text-white/70"
                >
                  Email <span className="text-[#FF6A00]">*</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, email: e.target.value }));
                    if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                  }}
                  placeholder="your.email@example.com"
                  disabled={isLoading}
                  className={`w-full px-4 py-3.5 rounded-2xl bg-[#111111] text-white placeholder-white/20 text-sm border transition-all duration-200 focus:outline-none ${
                    errors.email
                      ? 'border-red-500/60 focus:ring-2 focus:ring-red-500/30'
                      : 'border-white/8 focus:border-[#FF6A00]/50 focus:ring-2 focus:ring-[#FF6A00]/20'
                  }`}
                  aria-invalid={errors.email ? 'true' : 'false'}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="text-xs text-red-400 pl-1">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Message Field */}
              <div className="space-y-2">
                <label 
                  htmlFor="contact-message" 
                  className="block text-xs font-mono uppercase tracking-wider text-white/70"
                >
                  Message <span className="text-[#FF6A00]">*</span>
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  value={formData.message}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, message: e.target.value }));
                    if (errors.message) setErrors(prev => ({ ...prev, message: undefined }));
                  }}
                  placeholder="Tell me about your project, timeline, and vision..."
                  disabled={isLoading}
                  className={`w-full px-4 py-3.5 rounded-2xl bg-[#111111] text-white placeholder-white/20 text-sm border transition-all duration-200 focus:outline-none resize-none ${
                    errors.message
                      ? 'border-red-500/60 focus:ring-2 focus:ring-red-500/30'
                      : 'border-white/8 focus:border-[#FF6A00]/50 focus:ring-2 focus:ring-[#FF6A00]/20'
                  }`}
                  aria-invalid={errors.message ? 'true' : 'false'}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                />
                {errors.message && (
                  <p id="message-error" className="text-xs text-red-400 pl-1">
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-6 rounded-2xl bg-[#FF6A00] hover:bg-[#ff7b1a] text-black font-semibold text-sm tracking-tight transition-all duration-300 shadow-[0_10px_30px_rgba(255,106,0,0.25)] hover:shadow-[0_12px_35px_rgba(255,106,0,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Contact Details (ONLY on Contact page) */}
        <div className="lg:col-span-5 space-y-8 lg:pt-4">
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Direct Communication
            </h2>
            <p className="text-sm text-[#A1A1A1] leading-relaxed">
              Available for freelance commissions, creative direction, commercial video editing, and motion design collaborations worldwide.
            </p>
          </div>

          <div className="space-y-4">
            {/* Email Contact Card */}
            <a
              href="mailto:samyakvework@gmail.com"
              className="group flex items-center gap-4 p-5 rounded-[22px] bg-[#161616] hover:bg-[#1f1f1f] border border-white/8 hover:border-white/16 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80 group-hover:text-[#FF6A00] group-hover:border-[#FF6A00]/40 transition-colors">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[11px] font-mono uppercase text-[#A1A1A1] block">
                  Email
                </span>
                <span className="text-sm sm:text-base font-medium text-white truncate block group-hover:text-[#FF6A00] transition-colors">
                  samyakvework@gmail.com
                </span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
            </a>

            {/* Instagram Contact Card */}
            <a
              href="https://www.instagram.com/sam7archives"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 p-5 rounded-[22px] bg-[#161616] hover:bg-[#1f1f1f] border border-white/8 hover:border-white/16 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80 group-hover:text-[#FF6A00] group-hover:border-[#FF6A00]/40 transition-colors">
                <InstagramIcon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[11px] font-mono uppercase text-[#A1A1A1] block">
                  Instagram
                </span>
                <span className="text-sm sm:text-base font-medium text-white truncate block group-hover:text-[#FF6A00] transition-colors">
                  @sam7archives
                </span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
            </a>
          </div>

          {/* Response Time Badge */}
          <div className="p-5 rounded-[22px] bg-white/4 border border-white/6 flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
            <div className="text-xs text-[#A1A1A1]">
              <strong className="text-white font-medium block">Current Availability: Open</strong>
              Typical response time within 24 hours.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
