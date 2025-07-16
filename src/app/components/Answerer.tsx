'use client'

import React, { useState, useEffect, type ReactNode } from 'react'

import type { Questions } from '../../scripts/setQuestions'

import { maxTime } from '../../scripts/config'

import { AnswerGrid } from './AnswerGrid'
import { Countdowner } from './Countdowner'

export interface Answers {
  questionNumber: number
  question: string
  correctAnswer: number
  answer: number
  time: number
}

type AnswererType = ({ questions, questionNumber, onHasAnswered }: AnswererProps) => ReactNode

interface AnswererProps {
  questions: Questions[]
  questionNumber: number
  onHasAnswered: (answer: Answers) => void
}

export const Answerer: AnswererType = ({ questions, questionNumber, onHasAnswered }) => {
  //const [allQuestions, setAllQuestions] = useState<Questions[]>([])
  const [currentAnswer, setCurrentAnswer] = useState<Answers>({
    questionNumber: 1,
    question: '',
    correctAnswer: 0,
    answer: 0,
    time: 0,
  })

  const [question, setQuestion] = useState<number>(1)
  const [startToggle, setStartToggle] = useState<boolean>(false)
  const [wantsTimeToggle, setWantsTimeToggle] = useState<boolean>(false)
  const [clearToggle, setClearToggle] = useState<boolean>(true)

  useEffect(() => {
    //console.log('answerer useEffect', questions, questionNumber)

    if (questions.length) {
      const newAnswer = {
        questionNumber: questionNumber,
        question: questions[questionNumber - 1].question,
        correctAnswer: questions[questionNumber - 1].answer,
        answer: 0,
        time: 0,
      }
      setCurrentAnswer(newAnswer)
      setQuestion(questionNumber)
    }

    //setAllQuestions(questions)
    setStartToggle(!startToggle)
  }, [questions, questionNumber])

  const onSetTime = (timeTaken: number, question: number) => {
    //console.log(`Time for ${question} was ${timeTaken}`)

    if (currentAnswer.questionNumber === question) {
      const thisAnswer: Answers = { ...currentAnswer, time: timeTaken }
      //console.log('setting time', thisAnswer)
      onHasAnswered(thisAnswer)
    }
  }

  const onSetAnswer = (answer: number, question: number) => {
    console.log(`answer for ${question} is ${answer}`, currentAnswer.questionNumber)

    if (currentAnswer.questionNumber === question) {
      const thisAnswer: Answers = { ...currentAnswer, answer: answer }
      //console.log('setting given answer', thisAnswer)

      setCurrentAnswer(thisAnswer)
      setWantsTimeToggle(!wantsTimeToggle)
    }
  }

  return (
    <>
      <Countdowner
        questionNumber={questionNumber}
        countdownFrom={maxTime}
        granularity={100}
        onWantsTime={onSetTime}
        startTimerToggle={startToggle}
        wantsTimeToggle={wantsTimeToggle}
        clearToggle={clearToggle}
      />

      <AnswerGrid questionNumber={question} onSetAnswer={onSetAnswer} />
    </>
  )
}
