import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AppLayout } from './components/Layout'
import { AdminRoute } from './routes/AdminRoute'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { trackEvent } from './lib/analytics'

const LandingPage = lazy(() => import('./pages/LandingPage').then((m) => ({ default: m.LandingPage })))
const LoginPage = lazy(() => import('./pages/LoginPage').then((m) => ({ default: m.LoginPage })))
const RegisterPage = lazy(() => import('./pages/RegisterPage').then((m) => ({ default: m.RegisterPage })))
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage })))
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage').then((m) => ({ default: m.ResetPasswordPage })))
const PublicProfilePage = lazy(() => import('./pages/PublicProfilePage').then((m) => ({ default: m.PublicProfilePage })))
const OnboardingFlowPage = lazy(() => import('./pages/OnboardingFlowPage').then((m) => ({ default: m.OnboardingFlowPage })))
const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })))
const RoadmapPage = lazy(() => import('./pages/RoadmapPage').then((m) => ({ default: m.RoadmapPage })))
const PassportPage = lazy(() => import('./pages/PassportPage').then((m) => ({ default: m.PassportPage })))
const GamificationPage = lazy(() => import('./pages/GamificationPage').then((m) => ({ default: m.GamificationPage })))
const GrantsPage = lazy(() => import('./pages/GrantsPage').then((m) => ({ default: m.GrantsPage })))
const ParentAnalyticsPage = lazy(() => import('./pages/ParentAnalyticsPage').then((m) => ({ default: m.ParentAnalyticsPage })))
const ProfilePage = lazy(() => import('./pages/ProfilePage').then((m) => ({ default: m.ProfilePage })))
const RatingPage = lazy(() => import('./pages/RatingPage').then((m) => ({ default: m.RatingPage })))
const AchievementsPage = lazy(() => import('./pages/AchievementsPage').then((m) => ({ default: m.AchievementsPage })))
const ShowcasePage = lazy(() => import('./pages/ShowcasePage').then((m) => ({ default: m.ShowcasePage })))
const JobsPage = lazy(() => import('./pages/JobsPage').then((m) => ({ default: m.JobsPage })))
const PeoplePage = lazy(() => import('./pages/PeoplePage').then((m) => ({ default: m.PeoplePage })))
const ConnectionsPage = lazy(() => import('./pages/ConnectionsPage').then((m) => ({ default: m.ConnectionsPage })))
const CommunitiesPage = lazy(() => import('./pages/CommunitiesPage').then((m) => ({ default: m.CommunitiesPage })))
const ChatJoinPage = lazy(() => import('./pages/ChatJoinPage').then((m) => ({ default: m.ChatJoinPage })))
const ChatPage = lazy(() => import('./pages/ChatPage').then((m) => ({ default: m.ChatPage })))
const CalendarPage = lazy(() => import('./pages/CalendarPage').then((m) => ({ default: m.CalendarPage })))
const NotificationsPage = lazy(() => import('./pages/NotificationsPage').then((m) => ({ default: m.NotificationsPage })))
const SettingsPage = lazy(() => import('./pages/SettingsPage').then((m) => ({ default: m.SettingsPage })))
const AdminPage = lazy(() => import('./pages/AdminPage').then((m) => ({ default: m.AdminPage })))

function RouteFallback() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-4 p-4 sm:p-6" role="status" aria-label="Loading page">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
      <div className="h-40 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
    </div>
  )
}

function PageViewTracker() {
  const location = useLocation()

  useEffect(() => {
    trackEvent('page_view', { path: location.pathname })
  }, [location.pathname])

  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <PageViewTracker />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/u/:id" element={<PublicProfilePage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/onboarding" element={<OnboardingFlowPage />} />
            <Route element={<AppLayout />}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/roadmap" element={<RoadmapPage />} />
              <Route path="/passport" element={<PassportPage />} />
              <Route path="/gamification" element={<GamificationPage />} />
              <Route path="/grants" element={<GrantsPage />} />
              <Route path="/parent-analytics" element={<ParentAnalyticsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/rating" element={<RatingPage />} />
              <Route path="/achievements" element={<AchievementsPage />} />
              <Route path="/showcase" element={<ShowcasePage />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/people" element={<PeoplePage />} />
              <Route path="/connections" element={<ConnectionsPage />} />
              <Route path="/communities" element={<CommunitiesPage />} />
              <Route path="/chat/join/:channelSlug" element={<ChatJoinPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/chat/:conversationId" element={<ChatPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
