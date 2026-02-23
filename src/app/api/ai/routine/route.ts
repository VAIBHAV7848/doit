import { NextResponse } from 'next/server'
import { generateSmartRoutine } from '@/lib/ai'
import { createClient } from '@/lib/supabase/server'
import { WEEKLY_TIMETABLE } from '@/lib/constants'

export async function GET() {
    try {
        const supabase = createClient()

        // Fetch data for AI analysis
        const { data: backlog } = await supabase.from('backlog_tracker').select('*')
        const { data: logs } = await supabase.from('daily_logs').select('*')

        const routine = await generateSmartRoutine(backlog || [], logs || [], WEEKLY_TIMETABLE)

        return NextResponse.json(routine)
    } catch (error: any) {
        console.error('AI Routine Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
