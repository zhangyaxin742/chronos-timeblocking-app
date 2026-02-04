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

    const { timeblock_id, target_date, target_time, include_tasks } = await req.json()

    // Get original timeblock
    const { data: original, error: fetchError } = await supabase
      .from('timeblocks')
      .select('*, tasks(*)')
      .eq('id', timeblock_id)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !original) {
      return new Response(JSON.stringify({ error: 'Timeblock not found' }), { 
        status: 404 
      })
    }

    // Calculate new end time based on original duration
    const durationMs = original.duration_minutes * 60 * 1000
    const startDate = new Date(`${target_date}T${target_time}`)
    const endDate = new Date(startDate.getTime() + durationMs)
    const endTime = endDate.toTimeString().slice(0, 8)

    // Create duplicate timeblock
    const { data: newTimeblock, error: createError } = await supabase
      .from('timeblocks')
      .insert({
        user_id: user.id,
        category_id: original.category_id,
        title: original.title,
        date: target_date,
        start_time: target_time,
        end_time: endTime,
        status: 'scheduled'
      })
      .select()
      .single()

    if (createError) throw createError

    // Optionally duplicate tasks
    let duplicatedTasks = []
    if (include_tasks && original.tasks?.length > 0) {
      const tasksToInsert = original.tasks.map((task: any) => ({
        user_id: user.id,
        timeblock_id: newTimeblock.id,
        category_id: task.category_id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        estimated_minutes: task.estimated_minutes,
        sort_order: task.sort_order,
        is_completed: false
      }))

      const { data: newTasks, error: taskError } = await supabase
        .from('tasks')
        .insert(tasksToInsert)
        .select()

      if (taskError) throw taskError
      duplicatedTasks = newTasks
    }

    return new Response(
      JSON.stringify({ 
        timeblock: newTimeblock,
        tasks: duplicatedTasks
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
