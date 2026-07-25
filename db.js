const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Simple connectivity check against a real table in this project.
// Hostinger's Supabase wizard uses this file to detect and verify the connection.
async function testConnection() {
  const { data, error } = await supabase.from('rooms').select('*').limit(1);
  if (error) {
    console.error('Supabase connection test failed:', error.message);
  } else {
    console.log('Supabase connection successful. Sample data:', data);
  }
}

testConnection();

module.exports = supabase;
