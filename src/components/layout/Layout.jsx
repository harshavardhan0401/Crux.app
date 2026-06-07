import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function Layout() {
  return (
    <div className="min-h-screen bg-bg-base dark:bg-bg-base bg-bg-base-light">
      <Navbar />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  )
}
