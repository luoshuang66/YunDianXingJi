// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// 这里换成你自己Supabase项目的URL和anon key
const supabaseUrl = 'https://tiyxbmqaxnlrdrkvzuko.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpeXhibXFheG5scmRya3Z6dWtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NDI2MzcsImV4cCI6MjA5MjAxODYzN30.7R2Pze8qHEoKuw6lp5F8WL6ChHTWc4_Tc43sHrjGRS8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);