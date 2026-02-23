import { createClient } from '@/lib/supabase/server'


export async function POST(request: Request) {
    const supabase = createClient()
    await supabase.auth.signOut()

    const url = new URL('/login', request.url)
    return Response.redirect(url)
}
