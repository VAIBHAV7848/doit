import { login, signup } from './actions'

export default function LoginPage({
    searchParams,
}: {
    searchParams: { error: string }
}) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-zinc-950 text-zinc-100 selection:bg-indigo-500/30">
            <div className="w-full max-w-md space-y-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-10 shadow-2xl backdrop-blur-xl">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white">
                        Study Control System
                    </h2>
                    <p className="mt-2 text-sm text-zinc-400">
                        Sign in to manage your daily logs and routine.
                    </p>
                </div>

                {searchParams?.error && (
                    <div className="rounded-lg bg-red-500/10 p-4 text-center text-sm text-red-400 border border-red-500/20">
                        {searchParams.error}
                    </div>
                )}

                <form className="mt-8 space-y-6">
                    <div className="space-y-4 rounded-md shadow-sm">
                        <div>
                            <label htmlFor="email" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="relative block w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-zinc-300 placeholder-zinc-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-all"
                                placeholder="Email address"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="relative block w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-zinc-300 placeholder-zinc-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-all"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            formAction={login}
                            className="group relative flex w-full justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-900 transition-all duration-200"
                        >
                            Sign in
                        </button>
                        <button
                            formAction={signup}
                            className="group relative flex w-full justify-center rounded-xl bg-zinc-800 px-4 py-3 text-sm font-medium text-white hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-900 transition-all duration-200"
                        >
                            Sign up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
