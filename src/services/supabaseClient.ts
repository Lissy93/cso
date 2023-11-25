import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'XXX'
const supabaseKey = 'XXX';
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;
