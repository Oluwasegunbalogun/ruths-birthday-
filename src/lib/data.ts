import { Memory, UserMessage, QuizQuestion } from './types';

// Real memories with provided attachments
export const MEMORIES: Memory[] = [
  {
    id: 'm1',
    year: 'TEENAGE ERA',
    title: 'My Slay Queen 💅',
    description: 'Even back then, you were that girl. A vision of grace and beauty that only grew with time.',
    imageUrl: 'https://storage.googleapis.com/dala-prod-public-storage/attachments/880a0d03-0913-42ba-a21e-f1ef9a1fa28b/1776200286921_My_slay_queen_lol.jpg',
  },
  {
    id: 'm2',
    year: 'SCHOOL COMPLETION',
    title: 'B.Sc Sign Out 🎓',
    description: 'The culmination of hard work and late nights. A moment of pure pride as you closed one chapter to open the next.',
    imageUrl: 'https://storage.googleapis.com/dala-prod-public-storage/attachments/880a0d03-0913-42ba-a21e-f1ef9a1fa28b/1776200714188_schoool_sign_out.jpg',
  },
  {
    id: 'm3',
    year: '2021',
    title: '2021 — "Her 20th Birthday 🎂"',
    description: 'Stepping into adulthood with joy and radiance. A milestone year that celebrated the incredible woman you were becoming.',
    imageUrl: 'https://storage.googleapis.com/dala-prod-public-storage/attachments/880a0d03-0913-42ba-a21e-f1ef9a1fa28b/1776200121229_2021_birthday.jpg',
  },
  {
    id: 'm4',
    year: 'CONVOCATION',
    title: 'Convocation — "With Family 🎓❤️"',
    description: 'Shared success is the sweetest. Surrounded by the love of family on your most triumphant day.',
    imageUrl: 'https://storage.googleapis.com/dala-prod-public-storage/attachments/880a0d03-0913-42ba-a21e-f1ef9a1fa28b/1776200286920_Convocation_with_family.jpg',
  },
  {
    id: 'm5',
    year: 'NYSC',
    title: 'NYSC — "Service Completion 🇳🇬"',
    description: 'A journey of discipline and growth completed. Maturity looks so good on you.',
    imageUrl: 'https://storage.googleapis.com/dala-prod-public-storage/attachments/880a0d03-0913-42ba-a21e-f1ef9a1fa28b/1776200286922_NYSC_SIGN_OUT.jpg',
  },
  {
    id: 'f1',
    year: 'MOMENTS',
    title: 'Radiant Smiles',
    description: 'Capturing the essence of your laughter and the light you bring to every room.',
    imageUrl: 'https://storage.googleapis.com/dala-prod-public-storage/attachments/880a0d03-0913-42ba-a21e-f1ef9a1fa28b/1776200714187_RECENT_PICTURE_ONE.jpg',
  },
  {
    id: 'f2',
    year: 'MOMENTS',
    title: 'Quiet Reflections',
    description: 'In the stillness, your beauty shines even brighter. A soul as deep as it is kind.',
    imageUrl: 'https://storage.googleapis.com/dala-prod-public-storage/attachments/880a0d03-0913-42ba-a21e-f1ef9a1fa28b/1776200714181_RECENT_IMAGE_3.jpg',
  },
  {
    id: 'f3',
    year: 'MOMENTS',
    title: 'The Journey Ahead',
    description: 'Looking forward with courage and grace. Your story is just beginning.',
    imageUrl: 'https://storage.googleapis.com/dala-prod-public-storage/attachments/880a0d03-0913-42ba-a21e-f1ef9a1fa28b/1776200714182_RECENT_IMAGE_4.jpg',
  },
  {
    id: 'f4',
    year: 'MOMENTS',
    title: 'Cherished Bonds',
    description: 'Surrounded by laughter and friendship. Life is better with you in it.',
    imageUrl: 'https://storage.googleapis.com/dala-prod-public-storage/attachments/880a0d03-0913-42ba-a21e-f1ef9a1fa28b/1776200286926_RECENT_IMAGE_2.jpg',
  },
  {
    id: 'f5',
    year: 'MOMENTS',
    title: 'Inner Peace',
    description: 'A masterpiece in progress, finding beauty in every single day.',
    imageUrl: 'https://storage.googleapis.com/dala-prod-public-storage/attachments/880a0d03-0913-42ba-a21e-f1ef9a1fa28b/1776200807142_BK_GROUND.jpg',
  },
];

// Removing fictitious messages as requested
export const MESSAGES: UserMessage[] = [];

// Removing hardcoded quiz as requested (Guessing Game uses DB)
export const QUIZ: QuizQuestion[] = [];

export const GALLERY_IMAGES = [
  'https://storage.googleapis.com/dala-prod-public-storage/attachments/880a0d03-0913-42ba-a21e-f1ef9a1fa28b/1776200286921_My_slay_queen_lol.jpg',
  'https://storage.googleapis.com/dala-prod-public-storage/attachments/880a0d03-0913-42ba-a21e-f1ef9a1fa28b/1776200286922_NYSC_SIGN_OUT.jpg',
  'https://storage.googleapis.com/dala-prod-public-storage/attachments/880a0d03-0913-42ba-a21e-f1ef9a1fa28b/1776200121229_2021_birthday.jpg',
  'https://storage.googleapis.com/dala-prod-public-storage/attachments/880a0d03-0913-42ba-a21e-f1ef9a1fa28b/1776200286920_Convocation_with_family.jpg',
  'https://storage.googleapis.com/dala-prod-public-storage/attachments/880a0d03-0913-42ba-a21e-f1ef9a1fa28b/1776200286926_RECENT_IMAGE_2.jpg',
  'https://storage.googleapis.com/dala-prod-public-storage/attachments/880a0d03-0913-42ba-a21e-f1ef9a1fa28b/1776200714187_RECENT_PICTURE_ONE.jpg',
  'https://storage.googleapis.com/dala-prod-public-storage/attachments/880a0d03-0913-42ba-a21e-f1ef9a1fa28b/1776200714181_RECENT_IMAGE_3.jpg',
];