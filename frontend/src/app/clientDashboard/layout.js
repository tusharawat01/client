// import './globals.css'
import ClientSidebar from '../../components/ClientSidebar'

export default function RootLayout({ children }) {
  return (
      <main className="flex h-screen flex-col items-center justify-between">
        <main className="flex h-full w-full">
          <ClientSidebar />
          {children}
        </main>
      </main>
  )
}
