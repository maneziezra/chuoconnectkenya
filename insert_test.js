require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  const { data, error } = await supabase
    .from('universities')
    .upsert([
      {
        id: 'test_uni',
        name: 'Test University',
        type: 'public',
        description: 'Test',
        location: 'Test Location',
        founded_year: 2026,
        students_count: 1000,
        image: '/images/universities/default.jpg',
        logo: '/images/universities/default-logo.png',
        popular_courses: ['Computer Science'],
        facilities: ['Library'],
        admission_requirements: ['KCSE C+']
      }
    ]);
  
  if (error) {
    console.error('Insert failed:', error);
  } else {
    console.log('Insert succeeded:', data);
  }
}

run();
