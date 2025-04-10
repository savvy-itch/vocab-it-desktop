import { ThemeProvider } from '@/components/theme-provider'
import TitleBar from '@/components/TitleBar'
import Navbar from 'components/Navbar'
import { Outlet } from 'react-router'

export default function Layout() {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="bg-main-bg-light dark:bg-main-bg-dark transition-colors">
          <TitleBar />
          <Navbar />
          <main className={`min-h-screen mx-auto flex flex-col justify-between pt-28 mobile:pt-[10rem]`}>
            <Outlet />
          </main>
        </div>
      </ThemeProvider>
    </>
  )
}
