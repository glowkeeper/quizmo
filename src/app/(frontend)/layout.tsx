import React from 'react'
import '@/styles/global.css'

export const metadata = {
  title: 'Quizmo Questions',
  description:
    'Quizmo is rapid-fire questions. You have just 10 seconds to decide on each answer, and the quicker you are, the higher you can score',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
