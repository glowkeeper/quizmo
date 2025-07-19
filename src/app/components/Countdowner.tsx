'use client'

import { useState, useEffect, type ReactNode } from 'react'

type TimerType = ({
  questionNumber,
  countdownFrom,
  granularity,
  onSetTime,
  startTimerToggle,
  wantsTimeToggle,
  clearToggle,
}: TimerProps) => ReactNode

interface TimerProps {
  questionNumber: number
  countdownFrom: number
  granularity: number
  onSetTime: (amountCountdown: number, question: number) => void
  startTimerToggle: boolean
  wantsTimeToggle: boolean
  clearToggle: boolean
}

export const Countdowner: TimerType = ({
  questionNumber,
  countdownFrom,
  granularity,
  onSetTime,
  startTimerToggle,
  wantsTimeToggle,
  clearToggle,
}) => {
  const [timer, setTimer] = useState<NodeJS.Timeout>()
  const [time, setTime] = useState<number>(-1)
  const [intervalTime, setIntervalTime] = useState<number>(100)
  const [question, setQuestion] = useState<number>(0)
  const [startToggle, setStartToggle] = useState<boolean>(false)
  const [sendTimeToggle, setSendTimeToggle] = useState<boolean>(false)
  const [resetToggle, setResetToggle] = useState<boolean>(false)

  useEffect(() => {
    setTime(countdownFrom)
    setIntervalTime(granularity)
  }, [])

  useEffect(() => {
    if (clearToggle !== resetToggle) {
      reset()
    }
  }, [clearToggle])

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
  }, [wantsTimeToggle])

  useEffect(() => {
    //console.log("wants time", wantsTimeToggle, sendTimeToggle)

    if (time.toFixed(2) === '0.00') {
      onSetTime(countdownFrom, question)
    }
  }, [time])

  useEffect(() => {
    //console.log('in here set timer?')
    if (startTimerToggle !== startToggle) {
      reset()
      setStartToggle(startTimerToggle)
      const timer = setInterval(() => {
        setTime((time) => {
          if (time.toFixed(2) === '0.00') {
            //console.log('this timer', timer)
            clearInterval(timer)
            return 0
          } else return time - intervalTime / 1000
        })
      }, intervalTime)

      //console.log('timer', timer)
      setTimer(timer)
    }

    return () => clearInterval(timer)
  }, [startTimerToggle])

  const reset = () => {
    setTime(countdownFrom)
    setIntervalTime(granularity)
    setResetToggle(clearToggle)
  }

  return <>{time.toFixed(2)}</>
}
