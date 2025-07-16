'use client'

import { useState, useEffect, type ReactNode } from 'react'

import type { Questions } from '../../scripts/setQuestions'

type QuestionerType = ({ questions, questionNumber }: QuestionerProps) => ReactNode

interface QuestionerProps {
  questions: Questions[]
  questionNumber: number
  onHasAsked: (questionNumber: number) => void
}

export const Questioner: QuestionerType = ({ questions, questionNumber, onHasAsked }) => {
  const [allQuestions, setAllQuestions] = useState<Questions[]>([])
  const [number, setNumber] = useState<number>(-1)

  useEffect(() => {
    //console.log('questioner questions', questions, questionNumber)
    setAllQuestions(questions)
    setNumber(questionNumber)
  }, [questions, questionNumber])

  return (
    <>
      {allQuestions.length && (
        <>
          <h2>Question {number}</h2>
          <p
            className="animate-fadeInOut"
            onAnimationEnd={() => {
              //console.log('transition end')
              onHasAsked(number)
            }}
          >
            {allQuestions[number - 1].question}
          </p>
        </>
      )}
    </>
  )
}
