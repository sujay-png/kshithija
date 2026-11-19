// src/data/cta.ts

export interface ContactItem {
  id: string;
  type: 'email' | 'phone' | 'address' | 'hours';
  label: string;
  value: string;
  href?: string;
  isExternal?: boolean;
}

export interface SocialLink {
  id: string;
  name: string;
  href: string;
  bgColor: string;
  ariaLabel: string;
}

export interface CtaData {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  description: string;
  contacts: ContactItem[];
  socialEyebrow: string;
  socials: SocialLink[];
  actionButtons: {
    call: {
      text: string;
      href: string;
    };
    directions: {
      text: string;
      href: string;
    };
    contactUs: {
      text: string;
      href: string;
    };
  };
}

export const ctaData: CtaData = {
  eyebrow: 'Get In Touch',
  title: 'We are here for you.',
  titleHighlight: '',
  description:
    'Experience authentic Ayurvedic botanical care. Have questions about our products or need tailored wellness recommendations? Connect with our Mangaluru center.',
  contacts: [
    {
      id: 'email',
      type: 'email',
      label: 'Email Address',
      value: 'kshithijamlr@gmail.com',
      href: 'mailto:kshithijamlr@gmail.com',
    },
    {
      id: 'phone',
      type: 'phone',
      label: 'Phone Number',
      value: '9482126493',
      href: 'tel:9482126493',
    },
    {
      id: 'address',
      type: 'address',
      label: 'Center Address',
      value: 'Punarnava Muliya Compound, Kodialguttu West Road, Mangaluru - 575003',
      href: 'https://maps.google.com/?q=Punarnava+Muliya+Compound+Kodialguttu+West+Road+Mangaluru+575003',
      isExternal: true,
    },
    {
      id: 'hours',
      type: 'hours',
      label: 'Working Hours',
      value: 'Mon-Fri: 10am-5pm | Sat: 10am-6pm, Sunday Closed',
    },
  ],
  socialEyebrow: 'FOLLOW ALONG',
  socials: [
    {
      id: 'facebook',
      name: 'Facebook',
      href: 'https://www.facebook.com/profile.php?id=61586351603569',
      bgColor: '#3b5998',
      ariaLabel: 'Follow Kshithija Enterprises on Facebook',
    },
    {
      id: 'youtube',
      name: 'YouTube',
      href: 'https://www.youtube.com/channel/UCgk_LtGh8dVXhY6nWM1rHdw',
      bgColor: '#cd201f',
      ariaLabel: 'Subscribe to Kshithija Enterprises on YouTube',
    },
    {
      id: 'instagram',
      name: 'Instagram',
      href: 'https://www.instagram.com/kshithijamlr?utm_source=ig_web_button_share_sheet&dlrf=ZDNlZDc0MzIxNw==',
      bgColor: '#be317b',
      ariaLabel: 'Follow Kshithija Enterprises on Instagram',
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/in/kshithija-enterprises-225a233a3/',
      bgColor: '#0077b5',
      ariaLabel: 'Connect with Kshithija Enterprises on LinkedIn',
    },
  ],
  actionButtons: {
    call: {
      text: '+91 9482126493',
      href: 'tel:9482126493',
    },
    directions: {
      text: 'Get Directions',
      href: 'https://maps.google.com/?q=Punarnava+Muliya+Compound+Kodialguttu+West+Road+Mangaluru+575003',
    },
    contactUs: {
      text: 'Contact Us',
      href: '/contact',
    },
  },
};
