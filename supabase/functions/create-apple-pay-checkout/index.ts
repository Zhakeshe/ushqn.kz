import Stripe from 'npm:stripe@18.5.0'
import { createClient } from 'npm:@supabase/supabase-js@2'

const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY')
const stripePriceId = Deno.env.get('STRIPE_PRICE_ID')
const appUrl = (Deno.env.get('APP_URL') ?? '').replace(/\/$/, '')
const allowedOrigin = appUrl || 'https://ushqn.kz'

function response(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      'Vary': 'Origin',
    },
  })
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return response({ ok: true })
  if (request.method !== 'POST') return response({ error: 'Method not allowed' }, 405)
  if (!stripeSecret || !stripePriceId || !appUrl) return response({ error: 'Apple Pay is not configured' }, 503)

  const authorization = request.headers.get('Authorization')
  if (!authorization) return response({ error: 'Authentication required' }, 401)

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authorization } } },
  )
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return response({ error: 'Authentication required' }, 401)

  const stripe = new Stripe(stripeSecret)
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price: stripePriceId, quantity: 1 }],
    success_url: `${appUrl}/passport?payment=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/passport?payment=cancelled`,
    client_reference_id: user.id,
    customer_email: user.email,
    payment_method_types: ['card'],
    metadata: { user_id: user.id, source: 'ushqn_web' },
  })

  return response({ url: session.url })
})
