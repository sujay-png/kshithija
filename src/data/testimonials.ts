// src/data/testimonials.ts

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  title: string;
  quote: string;
  rating: number;
  initials: string;
  avatarBg: string;
  verified: boolean;
}

export const testimonialsData = {
  eyebrow: 'Customer Stories',
  title: 'Natural skin care products',
  titleItalic: 'Backed by real results',
  subtitle: 'Read authentic experiences from customers across Mangaluru and beyond who trust our plant-derived, chemical-free formulations.',
  testimonials: [
    {
      id: 'chethanchandra-bhat',
      name: 'Chethanchandra Bhat',
      role: 'Verified Buyer',
      location: 'Mangaluru',
      title: 'Soothing on skin without any side effects',
      quote: 'I have been using the organic products of Kshithija Enterprises, specially their skin cream. I found it very soothing on my skin without any side effects. I have no hesitation in recommending their products as they are organic and chemical free. ALL THE BEST.',
      rating: 5,
      initials: 'CB',
      avatarBg: 'bg-[#1c643b]',
      verified: true,
    },
    {
      id: 'linesh-ullal',
      name: 'Linesh Ullal',
      role: 'Hair Care User',
      location: 'Ullal',
      title: '100% natural & regaining hair growth',
      quote: '100% natural, very good product. I have tried it and I am regaining hair. Highly recommended for hair fall control!',
      rating: 5,
      initials: 'LU',
      avatarBg: 'bg-[#2d5a43]',
      verified: true,
    },
    {
      id: 'sandeep-baliga',
      name: 'Sandeep Baliga',
      role: 'Verified Customer',
      location: 'Mangaluru',
      title: 'Excellent chemical-free products',
      quote: 'Excellent products available. Truly 100% chemical free products that work gently and deliver healthy results.',
      rating: 5,
      initials: 'SB',
      avatarBg: 'bg-[#184e34]',
      verified: true,
    },
    {
      id: 'spandana-d',
      name: 'Spandana D',
      role: 'Skincare Customer',
      location: 'Karnataka',
      title: 'Helped me so much to clear my face',
      quote: 'Thank you so much for your product, it helped me so much to clear my face. My skin feels fresh, healthy and radiant.',
      rating: 5,
      initials: 'SD',
      avatarBg: 'bg-[#226343]',
      verified: true,
    },
    {
      id: 'rajendra-m',
      name: 'Rajendra M',
      role: 'Daily Skincare User',
      location: 'Mangaluru',
      title: 'Very soothing and truly effective',
      quote: 'Very soothing and truly effective. The creams are very soothing and deliver great results day after day.',
      rating: 5,
      initials: 'RM',
      avatarBg: 'bg-[#0f3d26]',
      verified: true,
    },
    {
      id: 'ananya-k',
      name: 'Ananya K',
      role: 'Wellness Enthusiast',
      location: 'Mangaluru',
      title: 'Purest organic formulations in the region',
      quote: 'From their raw forest honey to their moisturizing skin cream, you can immediately tell everything is formulated with pure botanical ingredients and zero compromises.',
      rating: 5,
      initials: 'AK',
      avatarBg: 'bg-[#2b6b4b]',
      verified: true,
    },
  ],
};

