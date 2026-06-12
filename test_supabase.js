const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local manually
const envPath = path.join(__dirname, '.env.local');
console.log('Reading env from:', envPath);

let supabaseUrl = '';
let supabaseAnonKey = '';

try {
  const content = fs.readFileSync(envPath, 'utf8');
  const lines = content.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const parts = trimmed.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim();
      if (key === 'NEXT_PUBLIC_SUPABASE_URL') supabaseUrl = val;
      if (key === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') supabaseAnonKey = val;
    }
  }
} catch (e) {
  console.warn('Could not read .env.local file:', e.message);
}

// Fallback if not parsed
if (!supabaseUrl) supabaseUrl = 'https://yvsbrspvwovaocbbkmqg.supabase.co';

if (!supabaseAnonKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_ANON_KEY is not set in environment or file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('Connecting to Supabase at:', supabaseUrl);
  try {
    const { data, error, count } = await supabase
      .from('ld_page_sections')
      .select('*', { count: 'exact' });

    if (error) {
      console.error('Error fetching data from ld_page_sections:', error);
      return;
    }

    console.log('Connection successful!');
    console.log(`Found ${count} records in ld_page_sections.`);
    if (data && data.length > 0) {
      console.log('Section keys:', data.map(d => d.section_key));
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

testConnection();
