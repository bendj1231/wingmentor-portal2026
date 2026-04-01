// supabase/functions/calculate-program-progress/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

serve(async (req) => {
  const { user_id } = await req.json()
  
  if (!user_id) {
    return new Response(
      JSON.stringify({ error: 'user_id is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  try {
    // Fetch module progress
    const { data: modules, error: modulesError } = await supabase
      .from('module_progress')
      .select('*')
      .eq('user_id', user_id)
    
    if (modulesError) throw modulesError

    // Fetch exam results
    const { data: exams, error: examsError } = await supabase
      .from('pilot_exams')
      .select('*')
      .eq('user_id', user_id)
    
    if (examsError) throw examsError

    // Calculate module progress (40% weight)
    const totalModules = 3
    const completedModules = modules?.filter(m => m.status === 'completed').length ?? 0
    const inProgressModules = modules?.filter(m => m.status === 'in-progress').length ?? 0
    const moduleProgress = modules?.reduce((acc, m) => acc + (m.progress_percent || 0), 0) ?? 0
    const moduleAverage = modules?.length ? moduleProgress / modules.length : 0
    const moduleScore = (completedModules / totalModules) * 100 * 0.4 + 
                       (inProgressModules > 0 ? (moduleAverage / totalModules) * 0.1 : 0)

    // Calculate exam progress (35% weight)
    const totalExams = 2
    const passedExams = exams?.filter(e => e.status === 'passed').length ?? 0
    const examScore = (passedExams / totalExams) * 100 * 0.35

    // Calculate milestones/progression (25% weight)
    // Check for enrollment, first mentorship, module completions
    const { data: profile } = await supabase
      .from('profiles')
      .select('enrolled_programs, enrollment_agreement_timestamp')
      .eq('id', user_id)
      .single()
    
    const hasEnrollment = profile?.enrolled_programs?.includes('Foundational') ? 1 : 0
    const hasMentorship = modules?.some(m => m.status === 'completed' && m.module_id?.includes('module-01')) ? 1 : 0
    const milestoneScore = ((hasEnrollment + hasMentorship + (completedModules > 0 ? 1 : 0)) / 3) * 100 * 0.25

    // Calculate overall progress
    const overallProgress = Math.round(moduleScore + examScore + milestoneScore)

    // Get detailed breakdown
    const moduleDetails = modules?.map(m => ({
      id: m.module_id,
      title: m.module_title,
      status: m.status,
      progress: m.progress_percent,
      completed_at: m.completed_at
    })) ?? []

    const examDetails = exams?.map(e => ({
      id: e.id,
      name: e.exam_name,
      type: e.exam_type,
      status: e.status,
      score: e.score,
      passed_at: e.passed_at
    })) ?? []

    // Get program progression milestones
    const milestones = [
      {
        id: 'enrollment',
        title: 'Enrollment Complete',
        completed: hasEnrollment === 1,
        date: profile?.enrollment_agreement_timestamp || null
      },
      {
        id: 'module-01',
        title: 'Module 01 Passed',
        completed: modules?.some(m => m.module_id === 'foundation-module-01' && m.status === 'completed') ?? false,
        date: modules?.find(m => m.module_id === 'foundation-module-01' && m.status === 'completed')?.completed_at || null
      },
      {
        id: 'first-mentorship',
        title: 'First Mentorship Session',
        completed: hasMentorship === 1,
        date: null
      },
      {
        id: 'module-02-cert',
        title: 'Module 02 Certification',
        completed: modules?.some(m => m.module_id === 'foundation-module-02' && m.status === 'completed') ?? false,
        date: modules?.find(m => m.module_id === 'foundation-module-02' && m.status === 'completed')?.completed_at || null
      }
    ]

    return new Response(
      JSON.stringify({
        overall_progress: overallProgress,
        breakdown: {
          modules: {
            weight: 0.4,
            score: Math.round(moduleScore),
            completed: completedModules,
            total: totalModules,
            details: moduleDetails
          },
          exams: {
            weight: 0.35,
            score: Math.round(examScore),
            passed: passedExams,
            total: totalExams,
            details: examDetails
          },
          milestones: {
            weight: 0.25,
            score: Math.round(milestoneScore),
            completed: milestones.filter(m => m.completed).length,
            total: milestones.length,
            details: milestones
          }
        },
        stats: {
          exams_completed: passedExams,
          average_score: exams?.length 
            ? Math.round(exams.filter(e => e.score).reduce((acc, e) => acc + (e.score || 0), 0) / exams.filter(e => e.score).length)
            : 0,
          certifications: passedExams >= 2 ? 1 : 0
        }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
