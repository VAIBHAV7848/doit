'use client'

import { useState, useEffect } from 'react'
import { WEEKLY_TIMETABLE } from '@/lib/constants'
import { Calendar, Sun, Moon, Target, BookOpen } from 'lucide-react'

export default function RoutinePage() {
    const [currentDay, setCurrentDay] = useState<string>('')
    const [currentTime, setCurrentTime] = useState<Date | null>(null)

    useEffect(() => {
        const today = new Date()
        setCurrentTime(today)

        const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
        setCurrentDay(days[today.getDay()])
    }, [])

    if (!currentDay || !currentTime) return null

    // Morning routing logic
    const getMorningRoutine = () => {
        if (currentDay === 'SUNDAY') {
            return {
                title: 'Sunday Special: 1 Full Backlog Mock',
                duration: 'Mock Test Duration',
                icon: Target,
                color: 'text-red-400',
                bg: 'bg-red-500/10',
                border: 'border-red-500/20'
            }
        }

        let subject = ''
        if (currentDay === 'MONDAY' || currentDay === 'THURSDAY') subject = 'Probability and Statistics'
        else if (currentDay === 'TUESDAY' || currentDay === 'FRIDAY') subject = 'Linear Algebra'
        else if (currentDay === 'WEDNESDAY' || currentDay === 'SATURDAY') subject = 'Discrete Mathematical Structures'

        return {
            title: `Backlog: ${subject}`,
            duration: '1.5 hours',
            icon: BookOpen,
            color: 'text-amber-400',
            bg: 'bg-amber-500/10',
            border: 'border-amber-500/20'
        }
    }

    // Evening logic
    const getEveningRoutine = () => {
        if (currentDay === 'SUNDAY') {
            return {
                title: 'Sunday Revision',
                subjects: ['General Revision'],
                duration: '2.0 hours',
                icon: BookOpen,
                color: 'text-purple-400',
                bg: 'bg-purple-500/10',
                border: 'border-purple-500/20'
            }
        }

        const todayClasses = WEEKLY_TIMETABLE[currentDay] || []

        // Extract subject names from the timetable strings (e.g. "09:00–11:00 Computer Networks" -> "Computer Networks")
        const subjectsToRevise = Array.from(new Set(
            todayClasses.map(cls => {
                const parts = cls.split(' ')
                return parts.slice(1).join(' ')
            }).filter(s => !s.toLowerCase().includes('lab')) // Usually we don't 'revise' lab immediately
        ))

        return {
            title: 'Class Revision',
            subjects: subjectsToRevise.length > 0 ? subjectsToRevise : ['No theory classes today. Focus on current projects.'],
            duration: '2.5 hours',
            icon: BookOpen,
            color: 'text-indigo-400',
            bg: 'bg-indigo-500/10',
            border: 'border-indigo-500/20'
        }
    }

    const morning = getMorningRoutine()
    const evening = getEveningRoutine()
    const classesToday = WEEKLY_TIMETABLE[currentDay] || []

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between border-b border-zinc-800/50 pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Smart Routine</h1>
                    <p className="text-zinc-400 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-indigo-400" />
                        {currentTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Morning Block */}
                <div className={`relative overflow-hidden rounded-3xl border ${morning.border} bg-zinc-900/50 p-8 shadow-2xl backdrop-blur-xl transition-all hover:-translate-y-1`}>
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Sun className="w-32 h-32" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className={`p-3 rounded-2xl ${morning.bg} ${morning.border} border`}>
                                <Sun className={`w-6 h-6 ${morning.color}`} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white tracking-tight">Morning Block</h2>
                                <p className={`text-sm font-medium ${morning.color}`}>{morning.duration}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-zinc-950/50 rounded-2xl p-6 border border-zinc-800/50">
                                <div className="flex items-start gap-4">
                                    <morning.icon className={`w-6 h-6 mt-1 flex-shrink-0 ${morning.color}`} />
                                    <div>
                                        <h3 className="text-lg font-semibold text-zinc-100">{morning.title}</h3>
                                        <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
                                            Focus deeply on this priority item. Make sure to complete relevant sections and clear pending doubts.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Evening Block */}
                <div className={`relative overflow-hidden rounded-3xl border ${evening.border} bg-zinc-900/50 p-8 shadow-2xl backdrop-blur-xl transition-all hover:-translate-y-1`}>
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Moon className="w-32 h-32" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className={`p-3 rounded-2xl ${evening.bg} ${evening.border} border`}>
                                <Moon className={`w-6 h-6 ${evening.color}`} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white tracking-tight">Evening Block</h2>
                                <p className={`text-sm font-medium ${evening.color}`}>{evening.duration}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-zinc-950/50 rounded-2xl p-6 border border-zinc-800/50">
                                <h3 className="text-lg font-semibold text-zinc-100 mb-4">{evening.title} subjects:</h3>
                                <ul className="space-y-3">
                                    {evening.subjects && evening.subjects.map((sub: string, i: number) => (
                                        <li key={i} className="flex items-center gap-3 text-zinc-300">
                                            <span className={`w-2 h-2 rounded-full ${evening.bg.replace('/10', '')} shadow-[0_0_8px_rgba(99,102,241,0.5)]`}></span>
                                            {sub}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* College Schedule */}
            <div className="mt-12 rounded-3xl border border-zinc-800/50 bg-zinc-900/50 p-8 shadow-xl backdrop-blur-xl">
                <h2 className="text-xl font-bold text-white mb-6">Today&apos;s Class Schedule</h2>
                {classesToday.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {classesToday.map((cls, i) => {
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
                        <p className="text-zinc-500">No classes scheduled for today. Make the most of your free time!</p>
                    </div>
                )}
            </div>

        </div>
    )
}
