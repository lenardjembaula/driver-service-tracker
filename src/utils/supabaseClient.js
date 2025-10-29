import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nsbsuyllhfibxuyfzqnj.supabase.co';
const supabaseKey = 'sb_publishable_sPC9kUNZ4FCKQcjud98RcQ_Bw6q_65d';

export const supabase = createClient(supabaseUrl, supabaseKey);
