import { Quizmo } from '../components/Quizmo'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'

import '@/styles/payloadStyles.css'

export default async function HomePage() {
  return (
    <div className="w-screen h-screen">
      <Header />
      <Quizmo />
      <Footer />
    </div>
  )
}
