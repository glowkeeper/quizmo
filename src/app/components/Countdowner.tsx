'use client'

import { useState, useEffect, type ReactNode } from 'react'

type TimerType = ({
  questionNumber,
  countdownFrom,
  onSetTime,
  wantsTimeToggle,
}: TimerProps) => ReactNode

interface TimerProps {
  questionNumber: number
  countdownFrom: number
  onSetTime: (amountCountdown: number, question: number) => void
  wantsTimeToggle: boolean
}

export const Countdowner: TimerType = ({
  questionNumber,
  countdownFrom,
  onSetTime,
  wantsTimeToggle,
}) => {
  const [timer, setTimer] = useState<NodeJS.Timeout>()
  const [time, setTime] = useState<number>(0)
  const [question, setQuestion] = useState<number>(0)
  const [sendTimeToggle, setSendTimeToggle] = useState<boolean>(false)

  useEffect(() => {
    return () => clearInterval(timer)
  }, [timer])

  useEffect(() => {
    if (question !== questionNumber) {
      setTime(countdownFrom)
      setQuestion(questionNumber)
    }
  }, [question, questionNumber, countdownFrom])

  useEffect(() => {
    if (wantsTimeToggle !== sendTimeToggle) {
      clearInterval(timer)
      const amountCountdown = countdownFrom - time
      onSetTime(amountCountdown, question)
      setSendTimeToggle(wantsTimeToggle)
    }
  }, [countdownFrom, question, onSetTime, sendTimeToggle, time, timer, wantsTimeToggle])

  useEffect(() => {
    if (time <= 0.1) {
      onSetTime(countdownFrom, question)
    }
  }, [countdownFrom, onSetTime, question, time])

  useEffect(() => {
    // console.log('in here set timer?', time, countdownFrom)
    if (time === countdownFrom) {
      const timer = setInterval(() => {
        setTime((time) => {
          if (time <= 0.1) {
            //onSetTime(countdownFrom, question)
            clearInterval(timer)
            return 0
          } else return time - 1 / countdownFrom
        })
      }, 100)

      setTime(time - 1 / 1000)
      // console.log('timer', timer)
      setTimer(timer)
    }
  }, [countdownFrom, time, timer])

  return (
    <>
      <p>{time.toFixed(2)}</p>
    </>
  )
}
