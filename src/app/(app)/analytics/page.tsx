'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2, TrendingUp, CalendarDays, Activity } from 'lucide-react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts'
import { subDays, format, parseISO } from 'date-fns'

export default function AnalyticsPage() {
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [chartData, setChartData] = useState<{ date: string; displayDate: string; hours: number }[]>([])
    const [stats, setStats] = useState({ total: 0, average: 0, bestDay: { ds: '', val: 0 } })

    useEffect(() => {
        fetchAnalytics()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const fetchAnalytics = async () => {
        try {
            setLoading(true)
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            // Get last 7 days boundary
            const sevenDaysAgo = format(subDays(new Date(), 6), 'yyyy-MM-dd')

            const { data, error } = await supabase
                .from('daily_logs')
                .select('date, hours_studied')
                .eq('user_id', user.id)
                .gte('date', sevenDaysAgo)

            if (error) throw error

            // Aggregate data for the last 7 days
            const grouped: Record<string, number> = {}

            // Initialize the last 7 days with 0 hours
            for (let i = 6; i >= 0; i--) {
                const d = format(subDays(new Date(), i), 'yyyy-MM-dd')
                grouped[d] = 0
            }

            data?.forEach((log) => {
                const d = log.date;
                if (grouped[d] !== undefined) {
                    grouped[d] += Number(log.hours_studied)
                }
            })

            const finalData = Object.entries(grouped).map(([date, hours]) => ({
                date,
                displayDate: format(parseISO(date), 'EEE'), // Short day name e.g., 'Mon'
                hours: Number(hours.toFixed(1))
            }))

            setChartData(finalData)

            // Calculate stats
            const totalHours = finalData.reduce((acc, curr) => acc + curr.hours, 0)
            const avgHours = totalHours / 7
            const maxHoursDay = finalData.reduce((prev, current) => (prev.hours > current.hours) ? prev : current)

            setStats({
                total: Number(totalHours.toFixed(1)),
                average: Number(avgHours.toFixed(1)),
                bestDay: { ds: maxHoursDay.displayDate, val: maxHoursDay.hours }
            })

        } catch (error) {
            console.error('Error fetching analytics:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Weekly Analytics</h1>
                <p className="text-zinc-400 mt-1">Visualize your last 7 days of effort.</p>
            </div>

            {loading ? (
                <div className="flex justify-center p-20">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                </div>
            ) : (
                <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/50 p-6 backdrop-blur-xl">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-zinc-400">7-Day Total</p>
                                    <p className="text-2xl font-bold text-white">{stats.total} <span className="text-sm font-normal text-zinc-500">hours</span></p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/50 p-6 backdrop-blur-xl">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold">
                                    <Activity className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-zinc-400">Daily Average</p>
                                    <p className="text-2xl font-bold text-white">{stats.average} <span className="text-sm font-normal text-zinc-500">hrs/day</span></p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/50 p-6 backdrop-blur-xl">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 font-bold">
                                    <CalendarDays className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-zinc-400">Best Day</p>
                                    <p className="text-2xl font-bold text-white">{stats.bestDay.ds || '-'} <span className="text-sm font-normal text-zinc-500 text-green-500">({stats.bestDay.val}h)</span></p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="rounded-3xl border border-zinc-800/50 bg-zinc-900/50 p-8 shadow-xl backdrop-blur-xl">
                        <h2 className="text-xl font-bold text-white mb-8">Study Hours Over Time</h2>
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                                    <XAxis
                                        dataKey="displayDate"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#a1a1aa', fontSize: 13 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#a1a1aa', fontSize: 13 }}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#27272a', opacity: 0.4 }}
                                        contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px', color: '#fff' }}
                                        itemStyle={{ color: '#818cf8', fontWeight: 600 }}
                                        labelStyle={{ color: '#a1a1aa', marginBottom: '4px' }}
                                    />
                                    <Bar
                                        dataKey="hours"
                                        name="Hours Studied"
                                        fill="#6366f1"
                                        radius={[6, 6, 0, 0]}
                                        maxBarSize={60}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
