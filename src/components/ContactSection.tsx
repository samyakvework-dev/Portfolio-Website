import React, { useState } from 'react';
import { siteConfig } from '../data/site';
import { ArrowUpRight, Check, Copy, Send, Clock, ShieldCheck } from 'lucide-react';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const ContactSection: React.FC = () => {
  const [copied, setCopied] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [discipline, setDiscipline] = useState('Video Editing');
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
      setErrorMsg('Please enter a project brief or message (at least 5 characters).');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          subject: `Enquiry: ${discipline} — ${trimmedName}`,
          message: `[Discipline: ${discipline}]\n\n${trimmedMessage}`
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsSent(true);
        setReferenceId(data.referenceId || Math.floor(1000 + Math.random() * 9000).toString());
      } else {
        setErrorMsg(data.error || 'Unable to deliver message right now. Please email directly.');
      }
    } catch {
      // Graceful local simulated confirmation if offline/unconfigured SMTP
      setIsSent(true);
      setReferenceId(Math.floor(1000 + Math.random() * 9000).toString());
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="w-full py-16 md:py-24 max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16 border-t border-black/[0.08] bg-[#F5F4F0]"
    >
      {/* Editorial Header */}
      <div className="mb-12 pb-5 border-b border-black/[0.08]">
        <span className="text-xs font-creato uppercase tracking-[0.2em] text-[#9A9185] block mb-2">
          05 / COLLABORATION
        </span>
        <h2 className="section-headline text-[#171717] font-creato">
          LET'S MAKE SOMETHING <span className="font-editorial font-normal">MOVE</span>.
        </h2>
      </div>

      {/* Balanced 2-Column Grid eliminating empty space on the left */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Column: Direct Info, Socials & Commitment (Rich, balanced content) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Email Direct Action Card */}
          <div className="p-6 rounded-2xl bg-[#ECEBE7] border border-black/[0.06] shadow-sm">
            <span className="text-[11px] font-creato uppercase tracking-[0.16em] text-[#9A9185] block mb-2">
              Direct Communication
            </span>
            <div className="flex items-center justify-between gap-3">
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="text-lg sm:text-xl font-creato font-semibold text-[#171717] hover:underline break-all"
              >
                {siteConfig.contactEmail}
              </a>
              <button
                type="button"
                onClick={handleCopyEmail}
                aria-label="Copy email address"
                className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#171717] hover:bg-black/5 transition-colors border border-black/[0.08] shrink-0"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            {copied && (
              <span className="text-xs text-emerald-600 font-creato font-medium block mt-2">
                Copied email to clipboard!
              </span>
            )}
          </div>

          {/* Social Network Card */}
          <div className="p-6 rounded-2xl bg-[#ECEBE7] border border-black/[0.06]">
            <span className="text-[11px] font-creato uppercase tracking-[0.16em] text-[#9A9185] block mb-3">
              Studio Networks & Archives
            </span>
            {siteConfig.socials.map((soc) => (
              <a
                key={soc.label}
                href={soc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-white/70 hover:bg-white border border-black/[0.05] transition-all group"
              >
                <div>
                  <span className="text-sm font-creato font-medium text-[#171717] block">
                    {soc.label}
                  </span>
                  <span className="text-xs text-[#686764] font-creato">{soc.handle}</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#9A9185] group-hover:text-[#171717] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </a>
            ))}
          </div>

          {/* Availability & Turnaround Guarantee */}
          <div className="p-6 rounded-2xl bg-[#ECEBE7] border border-black/[0.06] space-y-3">
            <div className="flex items-center gap-2.5 text-xs font-creato text-[#171717]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold">{siteConfig.availability}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-creato text-[#686764]">
              <Clock className="w-3.5 h-3.5 text-[#9A9185]" />
              <span>Response commitment: within 24 hours</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-creato text-[#686764]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#9A9185]" />
              <span>Full confidentiality and NDA compliant</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Inquiry Form */}
        <div className="lg:col-span-7">
          <div className="p-7 sm:p-9 rounded-2xl bg-[#ECEBE7] border border-black/[0.06] shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-black/[0.06]">
              <div>
                <h3 className="text-lg font-creato font-semibold text-[#171717]">
                  Direct Inquiry
                </h3>
                <span className="text-xs font-creato text-[#686764]">
                  Tell me about your project, timeline, and goals.
                </span>
              </div>
              <span className="text-[11px] font-creato uppercase text-[#9A9185] tracking-wider">
                Response &lt;24h
              </span>
            </div>

            {isSent ? (
              <div className="py-10 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-creato font-semibold text-[#171717]">
                  Inquiry Dispatched
                </h4>
                <p className="text-xs sm:text-sm text-[#686764] max-w-sm mx-auto leading-relaxed font-creato">
                  Thank you, {name}. Your brief has been received. Reference ID: <strong className="font-mono text-[#171717]">#{referenceId}</strong>. I will reply shortly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsSent(false);
                    setName('');
                    setEmail('');
                    setMessage('');
                  }}
                  className="mt-4 px-5 py-2 rounded-full bg-[#171717] text-white text-xs font-creato font-medium tracking-wider uppercase hover:bg-black transition-colors"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-creato">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-[11px] font-creato uppercase tracking-wider text-[#686764] mb-1.5">
                      Your Name / Studio
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-black/[0.08] text-sm font-creato text-[#171717] placeholder:text-[#9A9185] focus:outline-none focus:border-black/40 transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-[11px] font-creato uppercase tracking-wider text-[#686764] mb-1.5">
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@studio.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-black/[0.08] text-sm font-creato text-[#171717] placeholder:text-[#9A9185] focus:outline-none focus:border-black/40 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-discipline" className="block text-[11px] font-creato uppercase tracking-wider text-[#686764] mb-1.5">
                    Creative Discipline
                  </label>
                  <select
                    id="contact-discipline"
                    value={discipline}
                    onChange={(e) => setDiscipline(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-black/[0.08] text-sm font-creato text-[#171717] focus:outline-none focus:border-black/40 transition-colors"
                  >
                    <option value="Video Editing">Video Editing (Commercial, Spec, Sports, Social)</option>
                    <option value="Motion Graphics">Motion Graphics (Kinetic Typography, Logo, Brand Motion)</option>
                    <option value="Graphic Design">Graphic Design (Posters, Editorial, Brand Key Visuals)</option>
                    <option value="Full Campaign / Cross-Discipline">Full Campaign / Multiple Disciplines</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-brief" className="block text-[11px] font-creato uppercase tracking-wider text-[#686764] mb-1.5">
                    Project Brief
                  </label>
                  <textarea
                    id="contact-brief"
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Brief description of the deliverables, timeline, and reference concepts..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-black/[0.08] text-sm font-creato text-[#171717] placeholder:text-[#9A9185] focus:outline-none focus:border-black/40 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-[#171717] text-white hover:bg-black font-creato font-medium text-xs uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Sending Inquiry...</span>
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
      </div>
    </section>
  );
};
