import { format, formatDistanceToNow, isPast, isFuture, addHours } from 'date-fns';

// Format date for display
export const formatDate = (date, formatStr = 'PPP') => {
  if (!date) return '';
  return format(new Date(date), formatStr);
};

// Format time for display
export const formatTime = (date) => {
  if (!date) return '';
  return format(new Date(date), 'p');
};

// Format datetime for display
export const formatDateTime = (date) => {
  if (!date) return '';
  return format(new Date(date), 'PPP p');
};

// Get relative time (e.g., "2 hours ago")
export const getRelativeTime = (date) => {
  if (!date) return '';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

// Check if date is in the past
export const isDatePast = (date) => {
  if (!date) return false;
  return isPast(new Date(date));
};

// Check if date is in the future
export const isDateFuture = (date) => {
  if (!date) return false;
  return isFuture(new Date(date));
};

// Generate Jitsi room ID from interview ID
export const generateJitsiRoomId = (interviewId) => {
  return `jale-interview-${interviewId}`;
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number (basic)
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Calculate interview reminder times
export const getInterviewReminderTimes = (scheduledTime) => {
  const interviewDate = new Date(scheduledTime);
  return {
    reminder24h: addHours(interviewDate, -24),
    reminder1h: addHours(interviewDate, -1),
  };
};

// Get initials from name
export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Format currency
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Group items by key
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    (result[item[key]] = result[item[key]] || []).push(item);
    return result;
  }, {});
};
