import { createClient } from '@supabase/supabase-js'
import { PortalClient } from '@/components/PortalClient'
import { InvalidToken } from '@/components/InvalidToken'
import { ExpiredToken } from '@/components/ExpiredToken'
import { Welcome } from '@/components/Welcome'
import { Loader2 } from 'lucide-react'

// Server-side Supabase client
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!url || !key) {
    throw new Error('Supabase environment variables are missing')
  }
  return createClient(url, key)
}

export default async function PortalPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams

  if (!token) {
    return <Welcome />
  }

  const supabase = getSupabase()

  // 1 & 2. Validate token (ignoring expiry for a moment to check existence)
  const { data: tokenMaterial, error: tokenError } = await supabase
    .from('materials')
    .select('*')
    .eq('portal_token', token)
    .single()

  // Invalid Token
  if (tokenError || !tokenMaterial) {
    return <InvalidToken />
  }

  // 3. Check if expired (compared to current server time)
  if (tokenMaterial.expires_at && new Date(tokenMaterial.expires_at) < new Date()) {
    return <ExpiredToken expiresAt={tokenMaterial.expires_at} />
  }

  const { show_id, artist_id } = tokenMaterial

  // 4. Fetch ALL materials for this show
  const { data: materials, error: matsError } = await supabase
    .from('materials')
    .select('*')
    .eq('show_id', show_id)
    .order('deadline', { ascending: true })

  // 5. Fetch show details
  const { data: show, error: showError } = await supabase
    .from('shows')
    .select('*')
    .eq('id', show_id)
    .single()

  // 6. Fetch artist details
  const { data: artist, error: artistError } = await supabase
    .from('artists')
    .select('*')
    .eq('id', artist_id)
    .single()

  // Error handling for data fetch
  if (matsError || showError || artistError || !show || !artist || !materials) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-white antialiased">
        <div className="text-center max-w-sm space-y-4">
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={24} />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Unable to load your documents</h2>
          <p className="text-gray-500 leading-relaxed">
            There was a problem connecting to our servers. Please refresh the page or contact your promoter directly.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-6 py-2 rounded-xl transition-all"
          >
            Refresh Page
          </button>
        </div>
      </div>
    )
  }

  // Everything valid - Render the Portal
  return (
    <PortalClient
      show={show}
      artist={artist}
      materials={materials}
      initialToken={token}
    />
  )
}

function AlertCircle({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  )
}
