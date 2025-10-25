// Constants for the application

export const APPLICATION_STATUS = {
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  INTERVIEW_SCHEDULED: 'interview_scheduled',
  INTERVIEWED: 'interviewed',
  HIRED: 'hired',
  REJECTED: 'rejected',
};

export const INTERVIEW_STATUS = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show',
};

export const INTERVIEW_DECISION = {
  HIRE: 'hire',
  MAYBE: 'maybe',
  REJECT: 'reject',
};

export const JOB_STATUS = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  CLOSED: 'closed',
};

export const LANGUAGES = {
  EN: 'en',
  ES: 'es',
};

export const LANGUAGE_LABELS = {
  en: 'English',
  es: 'Español',
};

// Match score thresholds
export const MATCH_SCORE = {
  EXCELLENT: 80,
  GOOD: 60,
  POOR: 0,
};

// Get match score badge color
export const getMatchScoreColor = (score) => {
  if (score >= MATCH_SCORE.EXCELLENT) return 'green';
  if (score >= MATCH_SCORE.GOOD) return 'yellow';
  return 'red';
};

// Get match score label
export const getMatchScoreLabel = (score) => {
  if (score >= MATCH_SCORE.EXCELLENT) return 'Excellent Match';
  if (score >= MATCH_SCORE.GOOD) return 'Good Match';
  return 'Poor Match';
};

// Status badge colors
export const STATUS_COLORS = {
  [APPLICATION_STATUS.SUBMITTED]: 'blue',
  [APPLICATION_STATUS.UNDER_REVIEW]: 'yellow',
  [APPLICATION_STATUS.INTERVIEW_SCHEDULED]: 'purple',
  [APPLICATION_STATUS.INTERVIEWED]: 'indigo',
  [APPLICATION_STATUS.HIRED]: 'green',
  [APPLICATION_STATUS.REJECTED]: 'red',
};

// Status labels
export const STATUS_LABELS = {
  [APPLICATION_STATUS.SUBMITTED]: 'Submitted',
  [APPLICATION_STATUS.UNDER_REVIEW]: 'Under Review',
  [APPLICATION_STATUS.INTERVIEW_SCHEDULED]: 'Interview Scheduled',
  [APPLICATION_STATUS.INTERVIEWED]: 'Interviewed',
  [APPLICATION_STATUS.HIRED]: 'Hired',
  [APPLICATION_STATUS.REJECTED]: 'Rejected',
};
