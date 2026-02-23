'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Loader2 } from 'lucide-react'
import { CURRENT_SUBJECTS, BACKLOG_SUBJECTS } from '@/lib/constants'

export default function DailyLogPage() {
    const supabase = createClient()
    const [logs, setLogs] = useState<any[]>([]) // eslint-disable-line @typescript-eslint/no-explicit-any
    const [loading, setLoading] = useState(true)
    const [submitLoading, setSubmitLoading] = useState(false)

    // Form states
    const [subject, setSubject] = useState('')
    const [hours, setHours] = useState('')
    const [topic, setTopic] = useState('')
    const [notes, setNotes] = useState('')

    const allSubjects = [...CURRENT_SUBJECTS, ...BACKLOG_SUBJECTS]

    useEffect(() => {
        fetchLogs()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const fetchLogs = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('daily_logs')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setLogs(data || [])
        } catch (error) {
            console.error('Error fetching logs:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!subject || !hours) return

        try {
            setSubmitLoading(true)
            const newLog = {
                subject,
                hours_studied: parseFloat(hours),
                topic_covered: topic || null,
                notes: notes || null,
                date: new Date().toISOString().split('T')[0] // current date YYYY-MM-DD
            }

            const { error } = await supabase
                .from('daily_logs')
                .insert(newLog)

            if (error) throw error

            setSubject('')
            setHours('')
            setTopic('')
            setNotes('')
            fetchLogs()
        } catch (error) {
            console.error('Error inserting log:', error)
        } finally {
            setSubmitLoading(false)
        }
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Daily Logs</h1>
                <p className="text-zinc-400 mt-1">Track what you studied today.</p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Add Log Form */}
                <div className="lg:col-span-1 border border-zinc-800/50 bg-zinc-900/50 backdrop-blur-xl rounded-2xl p-6 shadow-xl h-fit">
                    <h2 className="text-lg font-bold text-white mb-6">New Study Session</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Subject *</label>
                            <select
                                required
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                            >
                                <option value="" disabled>Select subject</option>
                                {allSubjects.map((sub) => (
                                    <option key={sub} value={sub}>{sub}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Hours Studied *</label>
                            <input
                                type="number"
                                step="0.1"
                                min="0"
                                required
                                value={hours}
                                onChange={(e) => setHours(e.target.value)}
                                placeholder="e.g. 1.5"
                                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-300 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Topic Covered</label>
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="e.g. Backpropagation"
                                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-300 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Notes</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Any special remarks..."
                                rows={3}
                                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-300 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitLoading}
                            className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white hover:bg-indigo-500 transition-all disabled:opacity-50"
                        >
                            {submitLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
                            Save Log
                        </button>
                    </form>
                </div>

                {/* Logs List */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-lg font-bold text-white mb-2">Recent Logs</h2>
                    {loading ? (
                        <div className="flex justify-center p-10">
                            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="border border-dashed border-zinc-800 rounded-2xl p-10 text-center">
                            <p className="text-zinc-500">No study logs yet. Start tracking your progress today!</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {logs.map((log) => (
                                <div key={log.id} className="border border-zinc-800/50 bg-zinc-900/30 rounded-2xl p-5 hover:border-zinc-700 transition-all">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="font-semibold text-zinc-200">{log.subject}</h4>
                                            <p className="text-xs text-zinc-500 mt-0.5">{new Date(log.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                        </div>
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 text-sm font-medium border border-indigo-500/20">
                                            {log.hours_studied} hrs
                                        </span>
                                    </div>
                                    {log.topic_covered && (
                                        <p className="text-sm text-zinc-300 mt-3">Topic: <span className="text-zinc-400">{log.topic_covered}</span></p>
                                    )}
                                    {log.notes && (
                                        <p className="text-sm text-zinc-500 mt-2 bg-zinc-950/50 p-3 rounded-xl border border-zinc-800/50">{log.notes}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
