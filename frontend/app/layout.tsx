import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { AuthProvider } from '@/components/providers/AuthProvider'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'ForgeMuse AI – From Imagination to Creation',
    template: '%s | ForgeMuse AI',
  },
  description: 'ForgeMuse AI is an AI-powered creative studio that helps creators generate and improve original creative content — songs, stories, scripts, and more.',
  keywords: ['AI', 'creative writing', 'song lyrics', 'story generator', 'script writer', 'AI creative studio'],
  authors: [{ name: 'ForgeMuse AI' }],
  creator: 'ForgeMuse AI',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://forgemuseai.com',
    title: 'ForgeMuse AI – From Imagination to Creation',
    description: 'AI-powered creative studio for songs, stories, scripts and more.',
    siteName: 'ForgeMuse AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ForgeMuse AI – From Imagination to Creation',
    description: 'AI-powered creative studio for songs, stories, scripts and more.',
    creator: '@forgemuseai',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--toast-bg, #1e293b)',
                  color: 'var(--toast-color, #f8fafc)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '500',
                  padding: '12px 16px',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                },
                success: {
                  iconTheme: { primary: '#10b981', secondary: '#fff' },
                },
                error: {
                  iconTheme: { primary: '#ef4444', secondary: '#fff' },
                },
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
