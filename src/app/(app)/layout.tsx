import Sidebar from '@/components/Sidebar'

export default function AppLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex bg-zinc-950 text-zinc-100 min-h-screen font-sans selection:bg-indigo-500/30">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-10 animate-fade-in">
                <div className="mx-auto max-w-6xl">
                    {children}
                </div>
            </main>
        </div>
    )
}
