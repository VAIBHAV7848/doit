'use client'

import { useState, useEffect } from 'react'
import { WEEKLY_TIMETABLE } from '@/lib/constants'
import { Calendar, Sun, Moon, BrainCircuit, Activity, Loader2 } from 'lucide-react'

export default function RoutinePage() {
    const [currentDay, setCurrentDay] = useState<string>('')
    const [currentTime, setCurrentTime] = useState<Date | null>(null)
    const [aiRoutine, setAiRoutine] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const today = new Date()
        setCurrentTime(today)
        const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
        setCurrentDay(days[today.getDay()])
        fetchAiRoutine()
    }, [])

    const fetchAiRoutine = async () => {
        try {
            setLoading(true)
            const res = await fetch('/api/ai/routine')
            const data = await res.json()
            setAiRoutine(data)
        } catch (error) {
            console.error('Failed to fetch AI routine:', error)
        } finally {
            setLoading(false)
        }
    }

    if (!currentDay || !currentTime) return null

    const classesToday = WEEKLY_TIMETABLE[currentDay] || []

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between border-b border-zinc-800/50 pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">AI Smart Routine</h1>
                    <p className="text-zinc-400 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-indigo-400" />
                        {currentTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
                <button
                    onClick={fetchAiRoutine}
                    disabled={loading}
                    className="px-4 py-2 bg-indigo-600 rounded-xl text-sm font-medium hover:bg-indigo-500 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                    {loading ? <Activity className="w-4 h-4 animate-spin" /> : <BrainCircuit className="w-4 h-4" />}
                    Regenerate
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center p-20 space-y-4">
                    <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                    <p className="text-zinc-400 animate-pulse">AI is crafting your optimal study flow...</p>
                </div>
            ) : aiRoutine ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Morning */}
                    <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-3xl p-8 backdrop-blur-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <Sun className="w-6 h-6 text-amber-400" />
                            <h2 className="text-xl font-bold text-white">Morning</h2>
                        </div>
                        <p className="text-sm text-indigo-400 font-medium mb-2">{aiRoutine.morningBlock?.duration}</p>
                        <h3 className="text-lg font-semibold text-zinc-100 mb-3">{aiRoutine.morningBlock?.title}</h3>
                        <p className="text-sm text-zinc-400 leading-relaxed bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800/50">
                            {aiRoutine.morningBlock?.reasoning}
                        </p>
                    </div>

                    {/* Afternoon */}
                    <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-3xl p-8 backdrop-blur-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <Activity className="w-6 h-6 text-blue-400" />
                            <h2 className="text-xl font-bold text-white">Afternoon</h2>
                        </div>
                        <p className="text-sm text-indigo-400 font-medium mb-2">{aiRoutine.afternoonBlock?.duration}</p>
                        <h3 className="text-lg font-semibold text-zinc-100 mb-3">{aiRoutine.afternoonBlock?.title}</h3>
                        <p className="text-sm text-zinc-400 leading-relaxed bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800/50">
                            {aiRoutine.afternoonBlock?.reasoning}
                        </p>
                    </div>

                    {/* Evening */}
                    <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-3xl p-8 backdrop-blur-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <Moon className="w-6 h-6 text-purple-400" />
                            <h2 className="text-xl font-bold text-white">Evening</h2>
                        </div>
                        <p className="text-sm text-indigo-400 font-medium mb-2">{aiRoutine.eveningBlock?.duration}</p>
                        <h3 className="text-lg font-semibold text-zinc-100 mb-3">{aiRoutine.eveningBlock?.title}</h3>
                        <p className="text-sm text-zinc-400 leading-relaxed bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800/50">
                            {aiRoutine.eveningBlock?.reasoning}
                        </p>
                    </div>
                </div>
            ) : null}

            {/* College Schedule */}
            <div className="mt-12 rounded-3xl border border-zinc-800/50 bg-zinc-900/50 p-8 shadow-xl backdrop-blur-xl">
                <h2 className="text-xl font-bold text-white mb-6">Today&apos;s Class Schedule</h2>
                {classesToday.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {classesToday.map((cls: string, i: number) => {
                            const [time, ...subjectParts] = cls.split(' ')
                            const subject = subjectParts.join(' ')
                            return (
                                <div key={i} className="flex flex-col bg-zinc-950 rounded-2xl p-5 border border-zinc-800/50 justify-between">
                                    <p className="text-xs font-mono text-zinc-500 mb-2 bg-zinc-900 w-fit px-2 py-1 rounded-md border border-zinc-800">{time}</p>
                                    <p className="font-semibold text-zinc-200">{subject}</p>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="text-center p-8 bg-zinc-950 rounded-2xl border border-zinc-800/50">
                        <p className="text-zinc-500">No classes scheduled for today.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

