'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';

export default function ContactUsClient() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    setSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      fetch('https://kshithija.in/wp-admin/admin-ajax.php', {
        method: 'POST',
        body: formData,
        mode: 'no-cors',
      }).catch(() => {});
    } catch {}

    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <>
      <section className="relative w-full bg-[#082213] py-12 sm:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden text-white">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#2ea843]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <nav aria-label="Breadcrumb" className="mb-3">
            <ol className="inline-flex items-center justify-center gap-2 text-xs sm:text-[13px] text-[#c0d6c7] bg-black/25 backdrop-blur-xs px-3.5 py-1 rounded-full border border-white/10">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li className="text-[#729c80]">/</li>
              <li className="font-semibold text-white tracking-wide" aria-current="page">Contact Us</li>
            </ol>
          </nav>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight mb-3">
            Get in Touch With Us
          </h1>
        </div>
      </section>

      <section className="relative w-full bg-[#fbf9f4] py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#e8dfcf]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-7">
              <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#e8dfcf] shadow-md">
                <div className="mb-6">
                  <span className="inline-block px-3.5 py-1 rounded-full bg-[#f4ede0] text-[#082213] text-[11px] font-bold tracking-widest uppercase border border-[#ded5c5] mb-2">
                    Send a Message
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#082213]">How Can We Help You?</h2>
                  <p className="text-xs sm:text-sm text-[#5a6e61] mt-1">
                    Fill in the form below and our team will get back to you promptly.
                  </p>
                </div>

                <iframe
                  name="wp_form_target"
                  id="wp_form_target"
                  className="hidden"
                  style={{ display: 'none', width: 0, height: 0, border: 0 }}
                  title="WP Form Target"
                />

                {!submitted ? (
                  <form
                    id="contact-form"
                    action="https://kshithija.in/wp-admin/admin-ajax.php"
                    method="POST"
                    target="wp_form_target"
                    onSubmit={handleSubmit}
                    className="space-y-4 sm:space-y-5"
                  >
                    <input type="hidden" name="action" value="elementor_pro_forms_send_form" />
                    <input type="hidden" name="post_id" value="782" />
                    <input type="hidden" name="form_id" value="6789792" />
                    <input type="hidden" name="referer_title" value="Natural Products - Contact kshithija Enterprises" />
                    <input type="hidden" name="queried_id" value="782" />
                    <input
                      type="hidden"
                      name="form_fields[field_5fa3091]"
                      value={`Subject: ${subject}\nPhone: ${phone}\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-xs font-semibold text-[#082213] mb-1.5">
                          Your Name <span className="text-[#c25e30]">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="form_fields[name]"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter your full name"
                          className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl bg-[#f7f5ef] border border-[#e8dfcf] text-[#082213] placeholder-[#8c9e92] focus:outline-none focus:ring-2 focus:ring-[#1c643b] focus:bg-white transition-all"
                        />
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-xs font-semibold text-[#082213] mb-1.5">
                          Phone Number <span className="text-[#c25e30]">*</span>
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="form_fields[phone]"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 94821 26493"
                          className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl bg-[#f7f5ef] border border-[#e8dfcf] text-[#082213] placeholder-[#8c9e92] focus:outline-none focus:ring-2 focus:ring-[#1c643b] focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="email" className="block text-xs font-semibold text-[#082213] mb-1.5">
                          Your Email Address <span className="text-[#c25e30]">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="form_fields[email]"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl bg-[#f7f5ef] border border-[#e8dfcf] text-[#082213] placeholder-[#8c9e92] focus:outline-none focus:ring-2 focus:ring-[#1c643b] focus:bg-white transition-all"
                        />
                      </div>

                      <div>
                        <label htmlFor="subject" className="block text-xs font-semibold text-[#082213] mb-1.5">
                          Subject <span className="text-[#c25e30]">*</span>
                        </label>
                        <input
                          type="text"
                          id="subject"
                          name="form_fields[subject]"
                          required
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          placeholder="Order inquiry, Product advice..."
                          className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl bg-[#f7f5ef] border border-[#e8dfcf] text-[#082213] placeholder-[#8c9e92] focus:outline-none focus:ring-2 focus:ring-[#1c643b] focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-xs font-semibold text-[#082213] mb-1.5">
                        Your Message <span className="text-[#c25e30]">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="form_fields[message]"
                        rows={5}
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="How can we assist you today? Tell us about your concern or requirement..."
                        className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl bg-[#f7f5ef] border border-[#e8dfcf] text-[#082213] placeholder-[#8c9e92] focus:outline-none focus:ring-2 focus:ring-[#1c643b] focus:bg-white transition-all resize-none"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#164e2d] hover:bg-[#0c3920] active:scale-95 text-white text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all shadow-md hover:shadow-lg cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <span>{submitting ? 'Sending Message...' : 'Send Message'}</span>
                        {!submitting && <span>→</span>}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="mt-6 p-6 sm:p-8 rounded-2xl bg-[#eaf4ed] border border-[#b8dfc4] text-center shadow-xs">
                    <div className="w-12 h-12 rounded-full bg-[#164e2d] text-white flex items-center justify-center mx-auto mb-3 text-xl shadow-xs">
                      ✓
                    </div>
                    <h3 className="text-base sm:text-lg font-serif font-bold text-[#082213]">Message Sent Successfully!</h3>
                    <p className="text-xs sm:text-sm text-[#2e593d] mt-2 max-w-md mx-auto leading-relaxed">
                      Thank you for contacting Kshithija Enterprises. Your email notification has been dispatched to our team, and we will get back to you shortly.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
