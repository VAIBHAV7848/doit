'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Loader2, CheckCircle2, Clock, Inbox } from 'lucide-react'
import { BACKLOG_SUBJECTS, BacklogStatus, BacklogPriority } from '@/lib/constants'
import clsx from 'clsx'

export default function BacklogPage() {
    const supabase = createClient()
    const [items, setItems] = useState<any[]>([]) // eslint-disable-line @typescript-eslint/no-explicit-any
    const [loading, setLoading] = useState(true)
    const [submitLoading, setSubmitLoading] = useState(false)
    const [filter, setFilter] = useState<BacklogStatus | 'All'>('All')

    // Form states
    const [subject, setSubject] = useState('')
    const [topic, setTopic] = useState('')
    const [status, setStatus] = useState<BacklogStatus>('Pending')
    const [priority, setPriority] = useState<BacklogPriority>('Medium')
    const [targetDate, setTargetDate] = useState('')

    useEffect(() => {
        fetchItems()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const fetchItems = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('backlog_tracker')
                .select('*')
                .order('priority', { ascending: false }) // Very simple order, could be improved based on actual enums
                .order('target_date', { ascending: true })

            if (error) throw error
            setItems(data || [])
        } catch (error) {
            console.error('Error fetching backlogs:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!subject || !topic) return

        try {
            setSubmitLoading(true)
            const newItem = {
                subject,
                topic,
                status,
                priority,
                target_date: targetDate || null,
            }

            const { error } = await supabase
                .from('backlog_tracker')
                .insert(newItem)

            if (error) throw error

            setSubject('')
            setTopic('')
            setStatus('Pending')
            setPriority('Medium')
            setTargetDate('')
            fetchItems()
        } catch (error) {
            console.error('Error inserting backlog item:', error)
        } finally {
            setSubmitLoading(false)
        }
    }

    const updateStatus = async (id: string, newStatus: BacklogStatus) => {
        try {
            const { error } = await supabase
                .from('backlog_tracker')
                .update({ status: newStatus })
                .eq('id', id)

            if (error) throw error
            setItems((prev) => prev.map(item => item.id === id ? { ...item, status: newStatus } : item))
        } catch (error) {
            console.error('Error updating status:', error)
        }
    }

    const filteredItems = filter === 'All' ? items : items.filter((item) => item.status === filter)

    const getPriorityColor = (p: string) => {
        switch (p) {
            case 'High': return 'text-red-400 bg-red-400/10 border-red-500/20'
            case 'Medium': return 'text-amber-400 bg-amber-400/10 border-amber-500/20'
            case 'Low': return 'text-blue-400 bg-blue-400/10 border-blue-500/20'
            default: return 'text-zinc-400 bg-zinc-800 border-zinc-700'
        }
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Backlog Tracker</h1>
                    <p className="text-zinc-400 mt-1">Manage pending topics and prioritize efficiently.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Form Container */}
                <div className="lg:col-span-1 border border-zinc-800/50 bg-zinc-900/50 backdrop-blur-xl rounded-2xl p-6 shadow-xl h-fit">
                    <h2 className="text-lg font-bold text-white mb-6">Add Backlog Item</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Subject *</label>
                            <select
                                required
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-300 focus:border-indigo-500 transition-all focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                            >
                                <option value="" disabled>Select sub-topic</option>
                                {BACKLOG_SUBJECTS.map((sub) => (
                                    <option key={sub} value={sub}>{sub}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Topic *</label>
                            <input
                                type="text"
                                required
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="Missing lecture..."
                                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-300 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">Priority</label>
                                <select
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value as BacklogPriority)}
                                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as BacklogStatus)}
                                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Target Date</label>
                            <input
                                type="date"
                                value={targetDate}
                                onChange={(e) => setTargetDate(e.target.value)}
                                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-300 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitLoading}
                            className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white hover:bg-indigo-500 transition-all disabled:opacity-50"
                        >
                            {submitLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
                            Add to Backlog
                        </button>
                    </form>
                </div>

                {/* List Container */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex gap-2 pb-2 overflow-x-auto no-scrollbar border-b border-zinc-800">
                        {['All', 'Pending', 'In Progress', 'Completed'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setFilter(tab as any)} // eslint-disable-line @typescript-eslint/no-explicit-any
                                className={clsx(
                                    "px-4 py-2 rounded-t-xl text-sm font-medium transition-all",
                                    filter === tab
                                        ? "bg-indigo-500/10 text-indigo-400 border-b-2 border-indigo-500"
                                        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                                )}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="flex justify-center p-10">
                            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                        </div>
                    ) : filteredItems.length === 0 ? (
                        <div className="border border-dashed border-zinc-800 rounded-2xl p-10 text-center">
                            <p className="text-zinc-500">No matching backlog items found.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {filteredItems.map((item) => (
                                <div key={item.id} className="border border-zinc-800/50 bg-zinc-900/30 rounded-2xl p-5 hover:border-zinc-700 transition-all flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={clsx("text-xs font-semibold px-2 py-0.5 rounded-md border", getPriorityColor(item.priority))}>
                                                {item.priority}
                                            </span>
                                            <h4 className="font-semibold text-zinc-100">{item.topic}</h4>
                                        </div>
                                        <p className="text-sm text-zinc-400">{item.subject}</p>
                                        {item.target_date && (
                                            <p className="text-xs text-zinc-500 flex items-center gap-1 mt-2">
                                                <Clock className="w-3 h-3" />
                                                Target: {new Date(item.target_date).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        {item.status !== 'Pending' && (
                                            <button
                                                onClick={() => updateStatus(item.id, 'Pending')}
                                                className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-400 border border-zinc-700 transition-colors"
                                                title="Move to Pending"
                                            >
                                                <Inbox className="w-4 h-4" />
                                            </button>
                                        )}
                                        {item.status !== 'In Progress' && (
                                            <button
                                                onClick={() => updateStatus(item.id, 'In Progress')}
                                                className="px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-500 rounded-lg text-sm font-medium transition-colors"
                                            >
                                                Start
                                            </button>
                                        )}
                                        {item.status !== 'Completed' && (
                                            <button
                                                onClick={() => updateStatus(item.id, 'Completed')}
                                                className="px-3 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-500 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                                            >
                                                <CheckCircle2 className="w-4 h-4" /> Complete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
