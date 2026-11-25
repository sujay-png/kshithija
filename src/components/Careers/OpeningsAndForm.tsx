'use client';

import { useState, type FormEvent } from 'react';

const jobOpenings = [
  {
    id: 'bde',
    title: 'Business Development Executive',
    type: '',
    location: '',
    badge: '',
    description:
      'Are you passionate about building relationships, driving growth, and creating new opportunities? If yes, a Business Development Executive (BDE) role is the perfect career path for you. At our organization, we believe in empowering individuals who are enthusiastic, goal-driven, and ready to make an impact in a fast-growing environment.',
  },
];

export default function OpeningsAndForm() {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const message = encodeURIComponent(
      `New Application Form:\nName: ${name}\nMobile: ${mobile}\nEmail: ${email}\nCity: ${city}\nPosition: Business Development Executive`
    );

    window.open(`https://wa.me/9482126493?text=${message}`, '_blank');

    const formData = new FormData(e.currentTarget);
    fetch('https://formsubmit.co/kjobsales@gmail.com', {
      method: 'POST',
      body: formData,
      headers: { Accept: 'application/json' },
    }).catch(() => {});

    setSubmitted(true);
  };

  return (
    <section id="vacancies" className="relative w-full bg-[#fbf9f4] py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#e8dfcf]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {jobOpenings.map((job) => (
              <article
                key={job.id}
                className={`bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-7 border transition-all duration-300 flex flex-col justify-between group hover:-translate-y-0.5 shadow-xs hover:shadow-lg ${
                  job.badge ? 'border-[#1c643b]/40 ring-1 ring-[#1c643b]/20 relative' : 'border-[#e8dfcf]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="inline-block text-[11px] font-semibold text-[#6d7e73] tracking-wide">
                      {job.type}
                    </span>
                    {job.badge && (
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-[#eaf4ed] text-[#1c643b] px-2 py-0.5 rounded-full border border-[#b8dfc4]">
                        ★ {job.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-[#082213] group-hover:text-[#1c643b] transition-colors mb-2 tracking-tight font-serif">
                    {job.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-[11px] text-[#1c643b] font-medium mb-3">
                    <span>{job.location}</span>
                  </div>

                  <p className="text-xs sm:text-[13px] text-[#55695b] leading-relaxed mb-6 font-normal">
                    {job.description}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="lg:col-span-5 sticky top-24">
            <div
              id="application-form-card"
              className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e8dfcf] shadow-xl relative transition-all duration-300"
            >
              <div className="w-full mb-6 text-center">
                <span className="inline-block w-full py-3 px-6 rounded-2xl bg-[#082213] text-white text-sm sm:text-base font-bold tracking-wide shadow-md">
                  Application Form
                </span>
              </div>

              {!submitted ? (
                <form id="myForm" onSubmit={handleSubmit} className="space-y-4">
                  <input type="hidden" name="_captcha" value="false" />
                  <input type="hidden" name="_subject" value="New Application Form Submission - Kshithija Enterprises" />

                  <div>
                    <label htmlFor="applicant-name" className="sr-only">Your Name</label>
                    <input
                      type="text"
                      id="applicant-name"
                      name="Name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Name*"
                      className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl bg-[#f7f5ef] border border-[#e8dfcf] text-[#082213] placeholder-[#8c9e92] focus:outline-none focus:ring-2 focus:ring-[#1c643b] focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="applicant-mobile" className="sr-only">Mobile Number</label>
                    <input
                      type="tel"
                      id="applicant-mobile"
                      name="Mobile Number"
                      required
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="Mobile Number*"
                      className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl bg-[#f7f5ef] border border-[#e8dfcf] text-[#082213] placeholder-[#8c9e92] focus:outline-none focus:ring-2 focus:ring-[#1c643b] focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="applicant-email" className="sr-only">Email Address</label>
                    <input
                      type="email"
                      id="applicant-email"
                      name="Email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address*"
                      className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl bg-[#f7f5ef] border border-[#e8dfcf] text-[#082213] placeholder-[#8c9e92] focus:outline-none focus:ring-2 focus:ring-[#1c643b] focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="applicant-city" className="sr-only">City</label>
                    <input
                      type="text"
                      id="applicant-city"
                      name="City"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City (e.g. Mangaluru, Udupi, Bengaluru)*"
                      className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl bg-[#f7f5ef] border border-[#e8dfcf] text-[#082213] placeholder-[#8c9e92] focus:outline-none focus:ring-2 focus:ring-[#1c643b] focus:bg-white transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    id="submit-btn"
                    className="w-full py-3.5 px-6 rounded-xl bg-[#e85438] hover:bg-[#d44327] active:scale-[0.98] text-white text-xs sm:text-sm font-bold tracking-wider uppercase transition-all shadow-md hover:shadow-lg cursor-pointer"
                  >
                    SEND APPLICATION
                  </button>
                </form>
              ) : (
                <div id="thankyou" className="mt-4 p-4 rounded-xl bg-[#eaf4ed] border border-[#b8dfc4] text-center">
                  <h4 className="text-sm font-bold text-[#082213]">✅ Thank you! Your form has been submitted.</h4>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
