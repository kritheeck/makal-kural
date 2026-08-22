import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateReferenceNumber(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `MK-${year}-${randomNum}`;
}

export function maskEmail(email?: string): string {
  if (!email || !email.includes('@')) return 'Protected User';
  const [user, domain] = email.split('@');
  if (user.length <= 2) return `${user[0]}*@${domain}`;
  const masked = user[0] + '*'.repeat(user.length - 2) + user[user.length - 1];
  return `${masked}@${domain}`;
}

export function maskPhone(phone?: string): string {
  if (!phone) return 'Protected';
  const clean = phone.replace(/[^0-9]/g, '');
  if (clean.length < 4) return '******';
  return '******' + clean.slice(-4);
}

export function formatDate(dateString?: string, locale: 'en' | 'ta' = 'en'): string {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString(locale === 'ta' ? 'ta-IN' : 'en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}

export function truncateText(text: string, maxLength: number = 100): string {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
