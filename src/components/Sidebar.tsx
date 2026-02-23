'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    CalendarCheck,
    ListTodo,
    TrendingUp,
    BrainCircuit,
    LogOut,
} from 'lucide-react'
import clsx from 'clsx'

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Daily Logs', href: '/daily-log', icon: CalendarCheck },
    { name: 'Backlog Tracker', href: '/backlog', icon: ListTodo },
    { name: 'Smart Routine', href: '/routine', icon: BrainCircuit },
    { name: 'Weekly Analytics', href: '/analytics', icon: TrendingUp },
]

export default function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="flex h-screen w-72 flex-col justify-between border-r border-zinc-800/50 bg-zinc-950/80 backdrop-blur-3xl">
            <div className="px-6 py-8">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        <BrainCircuit className="h-6 w-6" />
                    </div>
                    <h1 className="text-xl font-bold text-zinc-100 tracking-tight">Study Control</h1>
                </div>

                <nav className="mt-10 space-y-2">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={clsx(
                                    'group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                                    isActive
                                        ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                                        : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100'
                                )}
                            >
                                <item.icon className={clsx('h-5 w-5', isActive ? 'text-indigo-400' : 'text-zinc-500 group-hover:text-zinc-300')} />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>
            </div>

            <div className="p-6">
                <div className="text-xs text-zinc-600 text-center">
                    Study Control System v0.1.0
                </div>
            </div>
        </div>
    )
}
