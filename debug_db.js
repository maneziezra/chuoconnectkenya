require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

supabase.from('student_profiles').select('*').then(({data: profiles}) => {
  console.log('Profiles:', JSON.stringify(profiles, null, 2));
});

supabase.from('courses').select('id, title, clusterGroup, minPoints').then(({data: courses}) => {
  console.log('Courses:', JSON.stringify(courses, null, 2));
});
