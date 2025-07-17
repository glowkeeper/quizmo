'use client'

import React, { useState, useEffect, type ReactNode } from 'react'

import type { Answers } from './Answerer'
import { maxAnswer } from '../../scripts/config'

type SummaryType = ({ total, answers }: SummaryProps) => ReactNode

interface SummaryProps {
  total: number
  answers: Answers[]
}

export const Summary: SummaryType = ({ total, answers }) => {
  const [totalScore, setTotalScore] = useState<number>(0)
  const [allAnswers, setAllAnswers] = useState<Answers[]>([])
  const [numCorrect, setNumCorrect] = useState<number>(0)
  const [avgTime, setAvgTime] = useState<number>(0)
  const [avgCorrectTime, setAvgCorrectTime] = useState<number>(0)

  useEffect(() => {
    let numCorrect = 0
    let totalTime = 0
    let correctTime = 0
    answers.forEach((answer) => {
      console.log('answer', answer)
      if (answer.answer == answer.correctAnswer) {
        numCorrect += 1
        correctTime += answer.time
      }
      totalTime += answer.time
    })
    setAllAnswers(answers)
    setTotalScore(total)
    setNumCorrect(numCorrect)
    setAvgTime(totalTime / maxAnswer)
    setAvgCorrectTime(correctTime / numCorrect)
  }, [total, answers])

  return (
    <>
      <h2>Summary</h2>
      <p className="font-bold">{`Total: ${total.toFixed(2)}`}</p>
      <p>
        Correct: {numCorrect} / {maxAnswer}
      </p>
      <p>Average Correct Answer Time: {avgCorrectTime.toFixed(2)}</p>
      <p>Average Answer Time: {avgTime.toFixed(2)}</p>
    </>
  )
}
