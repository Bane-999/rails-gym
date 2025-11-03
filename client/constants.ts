import { Exercise, Category } from './types';

// helper functions — keep these
const file = (name: string) => ({ name, isFolder: false });
const folder = (name: string, children: any[]) => ({ name, isFolder: true, children });

export const CATEGORIES = [
  { id: 'Validation',   label: 'Validations',  description: 'Model integrity constraints' },
  { id: 'Migration',    label: 'Migrations',    description: 'Schema changes & DDL' },
  { id: 'ActiveRecord', label: 'ActiveRecord',  description: 'Queries & Scopes' },
  { id: 'Associations', label: 'Associations',  description: 'Relations between models' },
];
