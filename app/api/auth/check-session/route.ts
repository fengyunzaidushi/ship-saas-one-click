import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const supabase = await createClient()
        
        // First get the session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
            return NextResponse.json({ error: sessionError.message }, { status: 401 })
        }

        if (!session) {
            return NextResponse.json({ user: null })
        }

        // Verify the user with getUser()
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError) {
            return NextResponse.json({ error: userError.message }, { status: 401 })
        }

        return NextResponse.json({ user })
        
    } catch (error) {
        console.error('Check session error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
} 