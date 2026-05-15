import { Category } from './types';

export const CATEGORIES: { label: string; value: Category; icon: string; imagePath?: string }[] = [
  { label: 'Céréales', value: 'céréales', icon: '🌾', imagePath: '/assets/cereale.jpg' },
  { label: 'Tubercules', value: 'tubercules', icon: '🍠', imagePath: '/assets/tubercule.jpg' },
  { label: 'Fruits', value: 'fruits', icon: '🍍', imagePath: '/assets/fruit.jpg' },
  { label: 'Légumes', value: 'légumes', icon: '🥬', imagePath: '/assets/legume.jpg' },
  { label: 'Semences', value: 'semences', icon: '🌱', imagePath: '/assets/semence.jpg' },
];

export const CAMEROON_CITIES = [
  'Douala',
  'Yaoundé',
  'Bafoussam',
  'Garoua',
  'Bertoua',
  'Bamenda',
  'Kribi'
];
