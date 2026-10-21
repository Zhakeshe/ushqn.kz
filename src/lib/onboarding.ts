import type { QueryClient } from '@tanstack/react-query'

/** Update the route guard before navigating, so a fresh user cannot bounce back. */
export async function syncOnboardingState(
  client: QueryClient,
  userId: string,
  completed: boolean,
) {
  const key = ['profile-guard', userId]
  await client.cancelQueries({ queryKey: key })
  client.setQueryData<{ isBanned: boolean; onboardingDone: boolean }>(
    key,
    (previous) =>
      previous ? { ...previous, onboardingDone: completed } : undefined,
  )
  await Promise.all([
    client.invalidateQueries({ queryKey: key }),
    client.invalidateQueries({ queryKey: ['onboarding-profile', userId] }),
  ])
}
