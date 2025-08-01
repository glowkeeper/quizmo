'use client'

import { useState, useEffect, type ReactNode } from 'react'

type TimerType = ({
  questionNumber,
  countdownFrom,
  onSetTime,
  startTimerToggle,
  wantsTimeToggle,
}: TimerProps) => ReactNode

interface TimerProps {
  questionNumber: number
  countdownFrom: number
  onSetTime: (amountCountdown: number, question: number) => void
  startTimerToggle: boolean
  wantsTimeToggle: boolean
}

export const Countdowner: TimerType = ({
  questionNumber,
  countdownFrom,
  onSetTime,
  startTimerToggle,
  wantsTimeToggle,
}) => {
  const [timer, setTimer] = useState<NodeJS.Timeout>()
  const [time, setTime] = useState<number>(0)
  const [question, setQuestion] = useState<number>(0)
  const [startToggle, setStartToggle] = useState<boolean>(false)
  const [sendTimeToggle, setSendTimeToggle] = useState<boolean>(false)

  useEffect(() => {
    setTime(countdownFrom)
  }, [countdownFrom])

  useEffect(() => {
    setQuestion(questionNumber)
  }, [questionNumber])

  useEffect(() => {
    //console.log('wants time', wantsTimeToggle, sendTimeToggle)

    if (wantsTimeToggle !== sendTimeToggle) {
      //console.log('wants time here?', wantsTimeToggle, sendTimeToggle, timer)
      clearInterval(timer)
      const amountCountdown = countdownFrom - time
      onSetTime(amountCountdown, question)
      setSendTimeToggle(wantsTimeToggle)
    }
  }, [countdownFrom, question, sendTimeToggle, time, timer, wantsTimeToggle])

  useEffect(() => {
    //console.log("wants time", wantsTimeToggle, sendTimeToggle)

    if (time.toFixed(2) === '0.00') {
      onSetTime(countdownFrom, question)
    }
  }, [countdownFrom, onSetTime, question, time])

  useEffect(() => {
    //console.log('in here set timer?')
    if (startTimerToggle !== startToggle) {
      const intervalTime = countdownFrom * 10
      const timer = setInterval(() => {
        setTime((time) => {
          if (time.toFixed(2) === '0.00') {
            //console.log('this timer', timer, time)
            clearInterval(timer)
            return 0
          } else return time - time / intervalTime
        })
      }, intervalTime)

      // console.log('timer', timer)
      setTimer(timer)
      setStartToggle(startTimerToggle)
    }

    return () => clearInterval(timer)
  }, [countdownFrom, startTimerToggle, startToggle, timer])

  return (
    <>
      <p>{time.toFixed(2)}</p>
    </>
  )
}
