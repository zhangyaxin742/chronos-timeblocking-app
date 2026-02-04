import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const authHeader = req.headers.get('Authorization')!
    const { data: { user } } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401 
      })
    }

    // Fetch all user data
    const [profile, categories, timeblocks, tasks] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('categories').select('*').eq('user_id', user.id),
      supabase.from('timeblocks').select('*').eq('user_id', user.id),
      supabase.from('tasks').select('*').eq('user_id', user.id)
    ])

    const exportData = {
      exported_at: new Date().toISOString(),
      user: {
        id: user.id,
        email: user.email,
        profile: profile.data
      },
      categories: categories.data,
      timeblocks: timeblocks.data,
      tasks: tasks.data
    }

    return new Response(
      JSON.stringify(exportData, null, 2),
      { 
        headers: { 
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="chronos-export-${new Date().toISOString().split('T')[0]}.json"`
        } 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    )
  }
})