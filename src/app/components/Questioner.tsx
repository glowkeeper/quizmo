import { useState, useEffect, type ReactNode } from 'react'

import type { Questions } from '../utils/doQuestions'

type QuestionerType = ({questions, questionNumber}: QuestionerProps) => ReactNode 

interface QuestionerProps {
  questions: Questions[]
  questionNumber: number
}

export const Questioner: QuestionerType = ({questions, questionNumber}) => {

  const [allQuestions, setAllQuestions] = useState<Questions[]>([])
  const [number, setNumber] = useState<number>(-1)

  useEffect(() => {

    setNumber(questionNumber)

  }, [questionNumber])

  useEffect(() => {

    //console.log('questions', questions, questionNumber)

    setAllQuestions(questions)

  }, [questions])

  return (
    <>
      { allQuestions.length && (
        <>
          {`${questionNumber}: ${allQuestions[number -1].question}`}
        </>
      )}
    </>
  )
}
