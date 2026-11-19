// src/data/philosophy.ts

export interface ExclusionItem {
  name: string;
}

export interface PhilosophyData {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  badges: string[];
  exclusionsTitle: string;
  exclusionsEyebrow: string;
  exclusions: ExclusionItem[];
  labImage: {
    src: string;
    alt: string;
  
    caption: string;
  };
}

export const philosophyData: PhilosophyData = {
  eyebrow: 'Our Philosophy',
  title: 'Science in service of nature.',
  paragraphs: [
    'At Kshithija Enterprises, we believe that effective skincare doesn’t require compromise. Every product begins with a botanical intention and ends only when it’s proven in a lab.',
    'Formulated in Mangaluru, our products draw on India’s rich tradition of plant-based wellness refined through modern clinical validation.',
  ],
  badges: [' Plant-Based', ' Lab Validated', ' Mangaluru'],
  exclusionsTitle: 'What We Never Use',
  exclusionsEyebrow: 'Zero Compromise Clean Beauty',
  exclusions: [
    { name: 'No Petroleum Jelly' },
    { name: 'No Mineral Oils' },
    { name: 'No Parabens' },
    { name: 'No Artificial Fragrances' },
    { name: 'No Silicones' },
    { name: 'No Synthetic Preservatives' },
  ],
  labImage: {
    src: '/images/philosophy-science.jpg',
    alt: 'Botanical Extraction in Laboratory Glassware',
 
    caption: 'Botanical Formulations · Lab Verified Quality',
  },
};

