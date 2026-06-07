import { Routes, Route, Navigate } from 'react-router-dom'
import useAppStore from './store/useAppStore'
import Layout from './components/layout/Layout'
import ToastContainer from './components/ui/Toast'
import SignUp from './pages/auth/SignUp'
import Login from './pages/auth/Login'
import ForgotPassword from './pages/auth/ForgotPassword'
import Onboarding from './pages/onboarding/Onboarding'
import Dashboard from './pages/dashboard/Dashboard'
import Home from './pages/dashboard/Home'
import Explore from './pages/dashboard/Explore'
import Projects from './pages/dashboard/Projects'
import Students from './pages/dashboard/Students'
import Finder from './pages/dashboard/Finder'
import Profile from './pages/dashboard/Profile'
import Notifications from './pages/dashboard/Notifications'
import Settings from './pages/dashboard/Settings'

function PrivateRoute({ children }) {
  const isLoggedIn = useAppStore(s => s.isLoggedIn)
  if (!isLoggedIn) return <Navigate to="/login" replace />
  return children
}

function OnboardingGuard({ children }) {
  const isLoggedIn = useAppStore(s => s.isLoggedIn)
  const isOnboarded = useAppStore(s => s.isOnboarded)
  if (!isLoggedIn) return <Navigate to="/login" replace />
  if (isOnboarded) return <Navigate to="/dashboard/home" replace />
  return children
}

export default function App() {
  const isLoggedIn = useAppStore(s => s.isLoggedIn)

  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          {/* Public routes */}
          <Route path="/" element={
            isLoggedIn ? <Navigate to="/dashboard/home" replace /> : <Navigate to="/login" replace />
          } />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot" element={<ForgotPassword />} />

          {/* Onboarding */}
          <Route path="/onboarding" element={
            <OnboardingGuard><Onboarding /></OnboardingGuard>
          } />

          {/* Dashboard */}
          <Route path="/dashboard" element={
            <PrivateRoute><Dashboard /></PrivateRoute>
          }>
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={<Home />} />
            <Route path="explore" element={<Explore />} />
            <Route path="projects" element={<Projects />} />
            <Route path="students" element={<Students />} />
            <Route path="finder" element={<Finder />} />
            <Route path="profile" element={<Profile />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      <ToastContainer />
    </>
  )
}
