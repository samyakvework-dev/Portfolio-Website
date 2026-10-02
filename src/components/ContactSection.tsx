import React, { useState } from 'react';
import { siteConfig } from '../data/site';
import { ArrowUpRight, ArrowRight, Check, Copy, Send } from 'lucide-react';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const ContactSection: React.FC = () => {
  const [copied, setCopied] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(siteConfig.contactEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || trimmedName.length < 2) {
      setErrorMsg('Please enter your name (at least 2 characters).');
      return;
    }

    if (!trimmedEmail || !EMAIL_REGEX.test(trimmedEmail)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (!trimmedMessage || trimmedMessage.length < 5) {
      setErrorMsg('Please provide a brief project description (at least 5 characters).');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: trimmedName, 
          email: trimmedEmail, 
          message: trimmedMessage 
        }),
      });

      let data: any = null;
      const contentType = res.headers.get('content-type') || '';

      if (contentType.includes('application/json')) {
        try {
          data = await res.json();
        } catch {
          data = null;
        }
      }

      if (!res.ok || !data || !data.success) {
        const fallbackError = data?.error || (res.status >= 500
          ? 'Unable to send your enquiry right now. Please try again later.'
          : 'Failed to send inquiry. Please check the fields and try again.');
        throw new Error(fallbackError);
      }

      setIsSent(true);
      if (data.referenceId || data.submission?.id) {
        setReferenceId(String(data.referenceId || data.submission.id));
      }
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to send your enquiry right now. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <section
      id="contact"
      className="w-full py-28 md:py-40 lg:py-48 max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16 border-t border-black/[0.08] bg-[#F5F4F0]"
    >
      {/* Top Label */}
      <span className="text-xs font-creato uppercase tracking-[0.2em] text-[#9A9185] block mb-6">
        05 / COLLABORATION
      </span>

      {/* Massive Finale Typography */}
      <div className="mb-16 sm:mb-24 max-w-5xl">
        <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-creato font-semibold tracking-[-0.04em] text-[#171717] leading-[1.02]">
          LET'S MAKE<br />
          SOMETHING<br />
          <span className="font-editorial font-normal text-[#9A9185]">MOVE.</span>
        </h2>

        {/* Elegant Typographic "LET'S CREATE →" CTA */}
        <div className="mt-8">
          <a
            href={`mailto:${siteConfig.contactEmail}`}
            className="group inline-flex items-center gap-3 text-2xl sm:text-3xl lg:text-4xl font-creato font-medium text-[#171717] hover:text-black transition-all"
          >
            <span className="relative pb-1">
              LET'S CREATE
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#171717] transition-all duration-300 group-hover:w-full" />
            </span>
            <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 transition-transform duration-300 group-hover:translate-x-2 text-[#171717]" />
          </a>
        </div>
      </div>

      {/* Primary Communication Channel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
        <div className="lg:col-span-7 space-y-10">
          <div>
            <span className="text-xs font-creato uppercase tracking-[0.16em] text-[#9A9185] block mb-2">
              Direct Communication
            </span>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="text-2xl sm:text-4xl lg:text-5xl font-creato font-medium tracking-tight text-[#171717] hover:text-black transition-colors underline decoration-black/20 underline-offset-8"
              >
                {siteConfig.contactEmail}
              </a>
              <button
                type="button"
                onClick={handleCopyEmail}
                aria-label="Copy email address"
                className="p-3 rounded-full bg-black/5 hover:bg-black/10 text-[#171717] transition-all"
              >
                {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            {copied && (
              <span className="text-xs font-creato text-emerald-600 mt-2 block animate-in fade-in">
                Email copied to clipboard.
              </span>
            )}
          </div>

          {/* Social Presence Grid — STRICTLY Configured Handles Only (No Behance, Vimeo, LinkedIn) */}
          <div>
            <span className="text-xs font-creato uppercase tracking-[0.16em] text-[#9A9185] block mb-4">
              Studio Networks
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
              {siteConfig.socials.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-5 rounded-xl bg-[#ECEBE7] hover:bg-black/[0.06] border border-black/[0.05] transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-creato font-medium text-[#171717] group-hover:text-black">
                      {social.label}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-[#9A9185] group-hover:text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                  <span className="text-xs text-[#686764] mt-1.5 block truncate font-creato">
                    {social.handle}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Direct Inquiry Drawer */}
        <div className="lg:col-span-5 bg-[#ECEBE7] p-8 sm:p-10 rounded-2xl sm:rounded-3xl border border-black/[0.06] shadow-[0_16px_36px_rgba(0,0,0,0.03)]">
          <div className="flex items-baseline justify-between mb-6 pb-3 border-b border-black/[0.06]">
            <h3 className="text-lg font-creato font-medium text-[#171717]">
              Direct Inquiry
            </h3>
            <span className="text-xs font-creato text-[#686764]">
              Response within 24h
            </span>
          </div>

          {isSent ? (
            <div className="py-8 text-center space-y-3 animate-in fade-in">
              <span className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-sm font-bold">
                ✓
              </span>
              <h4 className="text-lg font-creato font-medium text-[#171717]">Inquiry Dispatched</h4>
              <p className="text-sm font-creato text-[#686764] max-w-xs mx-auto leading-relaxed">
                Thank you. Your message has been received. I will review your project parameters and respond shortly.
              </p>
              {referenceId && (
                <span className="text-[11px] font-mono text-[#9A9185] block">
                  Reference #{referenceId}
                </span>
              )}
              <button
                type="button"
                onClick={() => setIsSent(false)}
                className="mt-4 text-xs font-creato text-black underline underline-offset-4 cursor-pointer"
              >
                Send Another Note
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="text-xs font-creato text-red-600 bg-red-50 p-2.5 rounded-lg">
                  {errorMsg}
                </div>
              )}

              <div>
                <label htmlFor="inquiry-name" className="text-xs font-creato uppercase tracking-wider text-[#686764] block mb-1">
                  Name
                </label>
                <input
                  id="inquiry-name"
                  type="text"
                  disabled={isSubmitting}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name / Studio"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white text-sm font-creato text-[#171717] border border-black/[0.06] focus:outline-none focus:ring-1 focus:ring-black disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label htmlFor="inquiry-email" className="text-xs font-creato uppercase tracking-wider text-[#686764] block mb-1">
                  Email
                </label>
                <input
                  id="inquiry-email"
                  type="email"
                  disabled={isSubmitting}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white text-sm font-creato text-[#171717] border border-black/[0.06] focus:outline-none focus:ring-1 focus:ring-black disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label htmlFor="inquiry-message" className="text-xs font-creato uppercase tracking-wider text-[#686764] block mb-1">
                  Project Brief
                </label>
                <textarea
                  id="inquiry-message"
                  rows={4}
                  disabled={isSubmitting}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Scope, deliverables, timeline..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white text-sm font-creato text-[#171717] border border-black/[0.06] focus:outline-none focus:ring-1 focus:ring-black resize-none disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 rounded-xl bg-[#171717] hover:bg-black text-white font-creato font-medium text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Dispatching...</span>
                  </>
                ) : (
                  <>
                    <span>Send Inquiry</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
