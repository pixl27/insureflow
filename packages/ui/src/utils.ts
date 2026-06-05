import { type ClassValue, clsx } from 'clsx';
import { type ClassNameValue, twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
