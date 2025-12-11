/**
 * Dashboard Layout Component
 * LinkedIn-inspired three-column layout
 */

'use client'

import { ReactNode, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Home, 
  Users, 
  Briefcase, 
  MessageSquare, 
  Bell, 
  User,
  MoreHorizontal,
  WifiOff,
  Menu,
  X,
  LogOut,
  Settings
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/constants'
import { isOnline } from '@/lib/offlineAuth'
import { AuthService } from '@/services/auth.service'
import { toast } from 'sonner'

interface DashboardLayoutProps {
  children: ReactNode
  user?: any
}

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const online = isOnline()
  const router = useRouter()
  const userName = user?.email?.split('@')[0] || 'Student'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      setUserMenuOpen(false)
      setMobileMenuOpen(false)
      await AuthService.signOut()
      toast.success('Logged out successfully', {
        description: 'You have been signed out.',
      })
      router.push(ROUTES.LOGIN)
      router.refresh() // Refresh to clear any cached state
    } catch (error: any) {
      console.error('Logout error:', error)
      toast.error('Logout failed', {
        description: error.message || 'Failed to sign out. Please try again.',
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Navigation Bar - LinkedIn Style - Fully Responsive */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between h-12 sm:h-14">
            {/* Left: Logo & Search - Responsive */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
              <Link href={ROUTES.HOME} className="flex-shrink-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-gradient-to-br from-[#e5989b] to-[#b5838d] flex items-center justify-center">
                    <span className="text-white font-bold text-xs sm:text-sm">J</span>
                  </div>
                  <span className="font-bold text-base sm:text-lg hidden xs:block">EduPath</span>
                </div>
              </Link>
              
              {/* Search - Hidden on mobile, visible from sm */}
              <div className="hidden sm:flex flex-1 max-w-md ml-2">
                <div className="relative w-full">
                  <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search scholarships..."
                    className="pl-8 sm:pl-9 h-8 sm:h-9 text-sm bg-gray-100 dark:bg-gray-700 border-0 focus:bg-white dark:focus:bg-gray-600"
                  />
                </div>
              </div>
            </div>

            {/* Right: Navigation Icons - Responsive */}
            {/* Desktop: Full nav with labels */}
            <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1">
              <Link href={ROUTES.DASHBOARD}>
                <Button variant="ghost" size="sm" className="flex-col h-14 w-14 xl:w-16 rounded-none px-1">
                  <Home className="h-4 w-4 xl:h-5 xl:w-5" />
                  <span className="text-[10px] xl:text-xs mt-0.5">Home</span>
                </Button>
              </Link>
              
              <Button variant="ghost" size="sm" className="flex-col h-14 w-14 xl:w-16 rounded-none px-1">
                <Users className="h-4 w-4 xl:h-5 xl:w-5" />
                <span className="text-[10px] xl:text-xs mt-0.5">Network</span>
              </Button>
              
              <Button variant="ghost" size="sm" className="flex-col h-14 w-14 xl:w-16 rounded-none px-1">
                <Briefcase className="h-4 w-4 xl:h-5 xl:w-5" />
                <span className="text-[10px] xl:text-xs mt-0.5">Scholarships</span>
              </Button>
              
              <Button variant="ghost" size="sm" className="flex-col h-14 w-14 xl:w-16 rounded-none px-1">
                <MessageSquare className="h-4 w-4 xl:h-5 xl:w-5" />
                <span className="text-[10px] xl:text-xs mt-0.5">Messages</span>
              </Button>
              
              <Button variant="ghost" size="sm" className="flex-col h-14 w-14 xl:w-16 rounded-none px-1 relative">
                <Bell className="h-4 w-4 xl:h-5 xl:w-5" />
                <span className="text-[10px] xl:text-xs mt-0.5">Notifications</span>
                <Badge className="absolute top-0.5 right-1 xl:top-1 xl:right-2 h-3.5 w-3.5 xl:h-4 xl:w-4 p-0 flex items-center justify-center text-[9px] xl:text-xs">
                  7
                </Badge>
              </Button>
              
              {/* User Menu with Logout */}
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex-col h-14 w-14 xl:w-16 rounded-none px-1"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <User className="h-4 w-4 xl:h-5 xl:w-5" />
                  <span className="text-[10px] xl:text-xs mt-0.5">Me</span>
                </Button>
                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <>
                    {/* Backdrop to close menu */}
                    <div 
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                      <div className="py-1">
                        <Link 
                          href="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            View Profile
                          </div>
                        </Link>
                        <Link 
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <div className="flex items-center gap-2">
                            <Settings className="h-4 w-4" />
                            Settings
                          </div>
                        </Link>
                        <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              <Button variant="ghost" size="sm" className="flex-col h-14 w-14 xl:w-16 rounded-none px-1">
                <MoreHorizontal className="h-4 w-4 xl:h-5 xl:w-5" />
                <span className="text-[10px] xl:text-xs mt-0.5">More</span>
              </Button>
            </nav>

            {/* Tablet: Icons only, no labels */}
            <nav className="hidden md:flex lg:hidden items-center gap-0.5">
              <Link href={ROUTES.DASHBOARD}>
                <Button variant="ghost" size="sm" className="h-10 w-10 rounded-md">
                  <Home className="h-5 w-5" />
                </Button>
              </Link>
              <Button variant="ghost" size="sm" className="h-10 w-10 rounded-md">
                <Users className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="h-10 w-10 rounded-md">
                <Briefcase className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="h-10 w-10 rounded-md relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute top-0.5 right-0.5 h-3.5 w-3.5 p-0 flex items-center justify-center text-[9px]">
                  7
                </Badge>
              </Button>
              <Button variant="ghost" size="sm" className="h-10 w-10 rounded-md">
                <User className="h-5 w-5" />
              </Button>
            </nav>

            {/* Mobile: Search icon + Menu */}
            <div className="flex md:hidden items-center gap-1.5">
              <Button variant="ghost" size="sm" className="h-9 w-9 rounded-md p-0">
                <Search className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-9 w-9 rounded-md p-0"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <nav className="container mx-auto px-3 py-2">
              <div className="grid grid-cols-4 gap-1">
                <Link href={ROUTES.DASHBOARD} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" size="sm" className="flex-col h-16 w-full rounded-md">
                    <Home className="h-5 w-5 mb-1" />
                    <span className="text-xs">Home</span>
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" className="flex-col h-16 w-full rounded-md" onClick={() => setMobileMenuOpen(false)}>
                  <Users className="h-5 w-5 mb-1" />
                  <span className="text-xs">Network</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex-col h-16 w-full rounded-md relative" onClick={() => setMobileMenuOpen(false)}>
                  <Bell className="h-5 w-5 mb-1" />
                  <span className="text-xs">Alerts</span>
                  <Badge className="absolute top-1 right-2 h-4 w-4 p-0 flex items-center justify-center text-xs">
                    7
                  </Badge>
                </Button>
                <div className="relative">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex-col h-16 w-full rounded-md"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                  >
                    <User className="h-5 w-5 mb-1" />
                    <span className="text-xs">Me</span>
                  </Button>
                  {userMenuOpen && (
                    <div className="absolute bottom-full left-0 mb-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                      <div className="py-1">
                        <Link 
                          href="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => {
                            setUserMenuOpen(false)
                            setMobileMenuOpen(false)
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            View Profile
                          </div>
                        </Link>
                        <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Logout button in mobile menu */}
              <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content Area - Three Column Layout - Fully Responsive */}
      <main className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-5 md:py-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 md:gap-6">
          {/* Left Sidebar - Profile & Quick Links - Responsive */}
          <aside className="lg:col-span-3 space-y-3 sm:space-y-4">
            {/* Mobile: Horizontal profile card */}
            <div className="lg:hidden bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 sm:p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-gray-200 dark:border-gray-700 bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                  <User className="h-6 w-6 sm:h-7 sm:w-7 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base truncate">{userName}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Student</p>
                  {!online && (
                    <Badge variant="outline" className="mt-1 text-xs">
                      <WifiOff className="h-3 w-3 mr-1" />
                      Offline
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Desktop: Vertical profile card */}
            <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="h-16 bg-gradient-to-r from-[#e5989b] to-[#b5838d]"></div>
              <div className="px-4 pb-4 -mt-8">
                <div className="w-16 h-16 rounded-full border-4 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-2">
                  <User className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="font-semibold text-lg mb-1">{userName}</h3>
                <p className="text-sm text-muted-foreground mb-3">Student</p>
                {!online && (
                  <Badge variant="outline" className="w-full justify-center mb-3">
                    <WifiOff className="h-3 w-3 mr-1" />
                    Offline Mode
                  </Badge>
                )}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Profile views</span>
                    <span className="font-semibold">0</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className="text-muted-foreground">Matches found</span>
                    <span className="font-semibold">0</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full flex items-center justify-center gap-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Links - Responsive */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 sm:p-4">
              <h4 className="font-semibold text-xs sm:text-sm mb-2 sm:mb-3">Quick Links</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground hover:underline block py-1">
                    Saved Scholarships
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground hover:underline block py-1">
                    My Applications
                  </Link>
                </li>
                <li>
                  <Link href={ROUTES.CHAT} className="text-muted-foreground hover:text-foreground hover:underline block py-1">
                    AI Tutor Chat
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground hover:underline block py-1">
                    Document Templates
                  </Link>
                </li>
              </ul>
            </div>
          </aside>

          {/* Main Feed - Center Column - Responsive */}
          <div className="col-span-1 lg:col-span-6 min-w-0">
            {children}
          </div>

          {/* Right Sidebar - Recommendations & Info - Responsive */}
          <aside className="lg:col-span-3 space-y-3 sm:space-y-4">
            {/* AI Career Advisor Chat - Only on desktop */}
            <div className="hidden lg:block">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 h-[500px]">
                {/* Will be replaced with CareerAdvisorChat component */}
                <div className="p-4">
                  <h4 className="font-semibold text-sm mb-2">AI Career Advisor</h4>
                  <p className="text-xs text-muted-foreground mb-4">Get personalized career guidance</p>
                  <Button variant="outline" size="sm" className="w-full">
                    Open Chat
                  </Button>
                </div>
              </div>
            </div>

            {/* Upcoming Deadlines - Responsive */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 sm:p-4">
              <h4 className="font-semibold text-sm sm:text-base mb-2 sm:mb-3">Upcoming Deadlines</h4>
              <div className="space-y-2 sm:space-y-3">
                <div className="text-xs sm:text-sm">
                  <p className="font-medium truncate">Equity Wings to Fly</p>
                  <p className="text-muted-foreground text-[10px] sm:text-xs">5 days remaining</p>
                </div>
                <div className="text-xs sm:text-sm">
                  <p className="font-medium truncate">NG-CDF Bursary</p>
                  <p className="text-muted-foreground text-[10px] sm:text-xs">20 days remaining</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-3 sm:mt-4 text-xs sm:text-sm h-8 sm:h-9">
                View All
              </Button>
            </div>

            {/* Recommendations - Responsive */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 sm:p-4">
              <h4 className="font-semibold text-sm sm:text-base mb-2 sm:mb-3">You might also qualify for</h4>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-xs sm:text-sm truncate">KCB Foundation</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Match: 85%</p>
                  </div>
                  <Button variant="outline" size="sm" className="h-7 sm:h-8 text-xs px-2 sm:px-3 flex-shrink-0">
                    View
                  </Button>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-xs sm:text-sm truncate">HELB Loan</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Match: 78%</p>
                  </div>
                  <Button variant="outline" size="sm" className="h-7 sm:h-8 text-xs px-2 sm:px-3 flex-shrink-0">
                    View
                  </Button>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="w-full mt-3 sm:mt-4 text-[10px] sm:text-xs h-7 sm:h-8">
                View all recommendations →
              </Button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}

