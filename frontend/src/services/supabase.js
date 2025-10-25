import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in your .env.local file');
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

// Helper functions for real-time subscriptions
export const subscribeToApplications = (callback) => {
  return supabase
    .channel('applications')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'applications' }, callback)
    .subscribe();
};

export const subscribeToInterviews = (callback) => {
  return supabase
    .channel('interviews')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'interviews' }, callback)
    .subscribe();
};

export default supabase;
