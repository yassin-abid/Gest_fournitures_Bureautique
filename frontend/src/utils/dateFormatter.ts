/**
 * Date Formatting Utilities
 */

import { format, formatDistance, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

export const formatDate = (date: string | Date, formatStr: string = 'dd/MM/yyyy'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr, { locale: fr });
};

export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, 'dd/MM/yyyy HH:mm');
};

export const formatTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'HH:mm', { locale: fr });
};

export const formatRelativeTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistance(dateObj, new Date(), { addSuffix: true, locale: fr });
};

export const formatMonth = (date: string | Date): string => {
  return formatDate(date, 'MMMM yyyy');
};

export const formatMonthShort = (date: string | Date): string => {
  return formatDate(date, 'MMM');
};
