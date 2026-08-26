import { Buffer } from 'node:buffer'
import { PKPass } from 'npm:passkit-generator@3.4.0'
import { createClient } from 'npm:@supabase/supabase-js@2'

const appUrl = (Deno.env.get('APP_URL') ?? '').replace(/\/$/, '')
const allowedOrigin = appUrl || 'https://ushqn.kz'

function response(body: string, status: number, contentType = 'application/json') {
  return new Response(body, { status, headers: { 'Content-Type': contentType, 'Access-Control-Allow-Origin': allowedOrigin, 'Vary': 'Origin' } })
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return response('', 204)
  if (request.method !== 'POST') return response(JSON.stringify({ error: 'Method not allowed' }), 405)

  const passTypeIdentifier = Deno.env.get('APPLE_PASS_TYPE_IDENTIFIER')
  const teamIdentifier = Deno.env.get('APPLE_TEAM_IDENTIFIER')
  const signerCert = Deno.env.get('APPLE_PASS_SIGNER_CERT_PEM')
  const signerKey = Deno.env.get('APPLE_PASS_SIGNER_KEY_PEM')
  const wwdr = Deno.env.get('APPLE_WWDR_CERT_PEM')
  const icon = Deno.env.get('APPLE_PASS_ICON_PNG_BASE64')
  if (!appUrl || !passTypeIdentifier || !teamIdentifier || !signerCert || !signerKey || !wwdr || !icon) {
    return response(JSON.stringify({ error: 'Apple Wallet signing is not configured' }), 503)
  }

  const authorization = request.headers.get('Authorization')
  if (!authorization) return response(JSON.stringify({ error: 'Authentication required' }), 401)
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: authorization } } })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return response(JSON.stringify({ error: 'Authentication required' }), 401)

  const [{ data: profile }, { data: achievements }, { data: scores }] = await Promise.all([
    supabase.from('profiles').select('display_name,school_or_org,location').eq('id', user.id).single(),
    supabase.from('achievements').select('id').eq('user_id', user.id).eq('verification_status', 'verified'),
    supabase.from('user_category_scores').select('points').eq('user_id', user.id),
  ])
  const totalXp = (scores ?? []).reduce((sum, score) => sum + score.points, 0)
  const pass = new PKPass({}, { signerCert, signerKey, wwdr }, {
    formatVersion: 1,
    passTypeIdentifier,
    teamIdentifier,
    serialNumber: user.id,
    organizationName: 'USHQN',
    description: 'USHQN Student Passport',
    logoText: 'USHQN Student Passport',
    foregroundColor: 'rgb(255, 255, 255)',
    backgroundColor: 'rgb(15, 23, 42)',
    labelColor: 'rgb(191, 219, 254)',
    barcode: { format: 'PKBarcodeFormatQR', message: `USHQN:${user.id}`, messageEncoding: 'iso-8859-1', altText: user.id.slice(0, 8).toUpperCase() },
    generic: {
      primaryFields: [{ key: 'student', label: 'STUDENT', value: profile?.display_name ?? 'USHQN Member' }],
      secondaryFields: [{ key: 'school', label: 'SCHOOL', value: profile?.school_or_org ?? profile?.location ?? '—' }],
      auxiliaryFields: [{ key: 'verified', label: 'VERIFIED ACHIEVEMENTS', value: (achievements ?? []).length }, { key: 'xp', label: 'XP', value: totalXp }],
      backFields: [{ key: 'verify', label: 'Verification', value: `${appUrl}/passport` }],
    },
  })
  pass.addBuffer('icon.png', Buffer.from(icon, 'base64'))
  pass.addBuffer('icon@2x.png', Buffer.from(icon, 'base64'))
  const output = pass.getAsBuffer()
  return response(output, 200, 'application/vnd.apple.pkpass')
})
