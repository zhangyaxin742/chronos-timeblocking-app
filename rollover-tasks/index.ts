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

    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

    // Find incomplete tasks from yesterday's timeblocks
    const { data: incompleteTasks, error } = await supabase
      .from('tasks')
      .select('id, title, timeblock_id, timeblocks!inner(date)')
      .eq('user_id', user.id)
      .eq('is_completed', false)
      .lt('timeblocks.date', today)

    if (error) throw error

    // Move tasks to backlog (unassign from timeblock)
    const taskIds = incompleteTasks?.map(t => t.id) || []
    
    if (taskIds.length > 0) {
      const { error: updateError } = await supabase
        .from('tasks')
        .update({ timeblock_id: null })
        .in('id', taskIds)

      if (updateError) throw updateError
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        rolled_over: taskIds.length 
      }),
      { headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    )
  }
})