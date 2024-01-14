import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import { Database } from './supabase.types';

const supabaseUrl = 'https://yqxtngrhkrfnkhllxgru.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxeHRuZ3Joa3JmbmtobGx4Z3J1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDUxODc0NDQsImV4cCI6MjAyMDc2MzQ0NH0.cxmOA4rRQuJx0naFB3iAf6wFUXKSAdjd-Pf4JzGVBjc';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})