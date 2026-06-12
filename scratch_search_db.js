const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envPath = './.env.local';
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let value = match[2] || '';
    if (value.length > 0 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
      value = value.replace(/^"|"$|^'|'$/g, '');
    }
    env[key] = value;
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  // We can list all records of our main tables and search for "learning-hub"
  const tables = [
    'ld_page_sections',
    'ld_homepage_footer',
    'ld_homepage_insights',
    'ld_team',
    'ld_vision_mission',
    'ld_resources',
    'ld_course_pages',
    'main_hp_hero'
  ];

  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*');
      if (error) {
        console.error(`Error reading table ${table}:`, error.message);
        continue;
      }
      const str = JSON.stringify(data);
      if (str.includes('learning-hub')) {
        console.log(`Found "learning-hub" in table ${table}!`);
        // Find exact record
        data.forEach(row => {
          if (JSON.stringify(row).includes('learning-hub')) {
            console.log('Record:', row);
          }
        });
      }
    } catch (e) {
      console.error(`Exception reading table ${table}:`, e.message);
    }
  }
  console.log('Search completed.');
}

run();
