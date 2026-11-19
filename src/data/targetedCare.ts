// src/data/targetedCare.ts

export interface TargetedConcern {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  iconType: 'acne' | 'dandruff' | 'dryness' | 'aging' | 'inflammation' | 'hair';
}

export const targetedCareData = {
  eyebrow: 'WHAT WE ADDRESS',
  title: 'Targeted care for',
  titleHighlight: 'real skin.',
  description: 'No single formula fits all. Our range is designed to meet specific skin and scalp concerns formulated precisely, never generically.',
  highlights: [
    'Pure Botanical Extracts',
    'Clinically Balanced Active Levels',
    'Zero Harsh Chemical Fillers',
  ],
  concerns: [
    {
      id: 'acne',
      name: 'Acne',
      subtitle: 'Blemish defense & oil balance',
      category: 'Clarifying',
      iconType: 'acne',
    },
    {
      id: 'dandruff',
      name: 'Dandruff',
      subtitle: 'Flake control & scalp purity',
      category: 'Purifying',
      iconType: 'dandruff',
    },
    {
      id: 'dryness',
      name: 'Dryness',
      subtitle: 'Deep lipid barrier moisture',
      category: 'Hydrating',
      iconType: 'dryness',
    },
    {
      id: 'aging',
      name: 'Aging',
      subtitle: 'Collagen & cellular renewal',
      category: 'Restorative',
      iconType: 'aging',
    },
    {
      id: 'inflammation',
      name: 'Inflammation',
      subtitle: 'Soothing barrier repair',
      category: 'Calming',
      iconType: 'inflammation',
    },
    {
      id: 'hair-scalp',
      name: 'Hair & Scalp',
      subtitle: 'Follicle strength & vitality',
      category: 'Nourishing',
      iconType: 'hair',
    },
  ] as TargetedConcern[],
};

