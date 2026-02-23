import { createClient } from '@/lib/supabase/server'
import {
    CalendarCheck,
    ListTodo,
    TrendingUp,
    Clock,
} from 'lucide-react'

export default async function DashboardPage() {
    const supabase = createClient()

    // This helps grab the current user 
    const { data: { user } } = await supabase.auth.getUser()

    // Grab basic stats for the dashboard
    const { data: backlogData } = await supabase
        .from('backlog_tracker')
        .select('*')
        .eq('user_id', user?.id)

    const { data: logsData } = await supabase
        .from('daily_logs')
        .select('hours_studied')
        .eq('user_id', user?.id)

    const openBacklog = backlogData?.filter(b => b.status !== 'Completed').length || 0
    const completedBacklog = backlogData?.filter(b => b.status === 'Completed').length || 0
    const totalHours = logsData?.reduce((acc, log) => acc + Number(log.hours_studied), 0) || 0

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
                    <p className="text-zinc-400 mt-1">Welcome back. Here&apos;s what&apos;s happening today.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[
                    { name: 'Total Hours Studied', value: totalHours, icon: Clock, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                    { name: 'Open Backlogs', value: openBacklog, icon: ListTodo, color: 'text-amber-400', bg: 'bg-amber-400/10' },
                    { name: 'Completed Backlogs', value: completedBacklog, icon: CalendarCheck, color: 'text-green-400', bg: 'bg-green-400/10' },
                    { name: 'Weekly Target', value: '40h', icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-400/10' },
                ].map((stat) => (
                    <div
                        key={stat.name}
                        className="group relative overflow-hidden rounded-2xl bg-zinc-900/50 p-6 shadow-xl border border-zinc-800/50 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-zinc-700 hover:shadow-2xl"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                        <div className="relative flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-zinc-400">{stat.name}</p>
                                <p className="mt-2 text-3xl font-extrabold text-white">{stat.value}</p>
                            </div>
                            <div className={`rounded-xl p-3 ${stat.bg}`}>
                                <stat.icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-2xl bg-zinc-900/50 p-6 shadow-xl border border-zinc-800/50 backdrop-blur-xl">
                    <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
                    <div className="space-y-3 text-sm text-zinc-400">
                        <p>✨ Check your <a href="/routine" className="text-indigo-400 hover:underline hover:text-indigo-300">Smart Routine</a> for today&apos;s optimal study flow.</p>
                        <p>📝 Log your progress in <a href="/daily-log" className="text-indigo-400 hover:underline hover:text-indigo-300">Daily Logs</a>.</p>
                        <p>📚 Check off items from your <a href="/backlog" className="text-indigo-400 hover:underline hover:text-indigo-300">Backlog Tracker</a>.</p>
                    </div>
                </div>

                <div className="rounded-2xl bg-zinc-900/50 p-6 shadow-xl border border-zinc-800/50 backdrop-blur-xl flex items-center justify-center">
                    <div className="text-center">
                        <div className="inline-block p-4 rounded-full bg-indigo-500/10 mb-4">
                            <TrendingUp className="h-8 w-8 text-indigo-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Detailed Analytics</h3>
                        <p className="text-sm text-zinc-400 max-w-xs mx-auto mb-6">Explore the Weekly Analytics page to review your progress visualizations with interactive charts.</p>
                        <a href="/analytics" className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors border border-zinc-700 text-sm font-semibold">
                            View Charts
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
