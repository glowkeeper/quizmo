import { Quizmo } from '../components/Quizmo'

import '@/styles/payloadStyles.css'

export default async function HomePage() {
  return (
    <div className="home">
      <div className="content">
        <Quizmo />
      </div>
    </div>
  )
}
