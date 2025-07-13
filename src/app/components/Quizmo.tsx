'use client'

import React, { useState, useEffect, type ReactNode } from 'react'

import type { Questions } from '../../scripts/setQuestions'

import { maxTime } from '../../scripts/config'

import { AnswerGrid } from './AnswerGrid'
import { Countdowner } from './Countdowner'
import { Questioner } from './Questioner'

interface Answers {
  questionNumber: number
  question: string
  correctAnswer: number
  answer: number
  time: number
}

export const Quizmo = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [isFetching, setIsFetching] = useState<boolean>(true)

  const [allQuestions, setAllQuestions] = useState<Questions[]>([])
  const [allAnswers, setAllAnswers] = useState<Answers[]>([])
  const [currentAnswer, setCurrentAnswer] = useState<Answers>({
    questionNumber: 0,
    question: '',
    correctAnswer: 0,
    answer: 0,
    time: 0,
  })
  const [questionNumber, setQuestionNumber] = useState<number>(1)

  const [total, setTotal] = useState<number>(0)

  const [startToggle, setStartToggle] = useState<boolean>(true)
  const [wantsTimeToggle, setWantsTimeToggle] = useState<boolean>(false)
  const [wantsAnswerToggle, setWantsAnswerToggle] = useState<boolean>(false)
  const [clearToggle, setClearToggle] = useState<boolean>(true)

  useEffect(() => {
    const getQuestions = async () => {
      let questions: Questions[] = []
      await fetch('http://localhost:3000/api/questions/live').then(async (response: Response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const json = await response.json()
        console.log('fetched', json)
        if (json?.message?.length) {
          questions = json?.message.map((choice: Questions) => choice)
        }
      })

      console.log('questions', questions)
      setAllQuestions(questions)
      if (questions.length > 0) {
        const newAnswer = {
          questionNumber: 1,
          question: questions[0].question,
          correctAnswer: questions[0].answer,
          answer: 0,
          time: 0,
        }

        console.log('new answer', newAnswer)
        setCurrentAnswer(newAnswer)
      }
      setIsFetching(false)
    }

    getQuestions()
  }, [])

  useEffect(() => {
    //console.log('in here', currentAnswer)

    if (currentAnswer.time !== 0) {
      //console.log('answers hoorah', currentAnswer)
      const answers = [...allAnswers]
      answers.push(currentAnswer)
      setAllAnswers(answers)

      if (currentAnswer.answer == currentAnswer.correctAnswer) {
        const newTotal = total + (maxTime - currentAnswer.time)
        setTotal(newTotal)
      }

      const newQuestion = questionNumber + 1
      const newAnswer = {
        questionNumber: newQuestion,
        question: allQuestions[newQuestion - 1].question,
        correctAnswer: allQuestions[newQuestion - 1].answer,
        answer: 0,
        time: 0,
      }

      setCurrentAnswer(newAnswer)
      setQuestionNumber(newQuestion)
      setStartToggle(!startToggle)
    }
  }, [currentAnswer])

  const handlePlay = () => {
    setIsPlaying(true)
  }

  const onSetTime = (timeTaken: number, question: number) => {
    console.log(`Time for ${question} was ${timeTaken}`)

    if (currentAnswer.questionNumber === question) {
      const thisAnswer: Answers = { ...currentAnswer, time: timeTaken }
      console.log('setting time', thisAnswer)
      setCurrentAnswer(thisAnswer)
    }
  }

  const onSetAnswer = (answer: number, question: number) => {
    console.log(`answer for ${question} is ${answer}`)

    if (currentAnswer.questionNumber === question) {
      const thisAnswer: Answers = { ...currentAnswer, answer: answer }
      console.log('setting given answer', thisAnswer)

      setCurrentAnswer(thisAnswer)
      setWantsTimeToggle(!wantsTimeToggle)
      setWantsAnswerToggle(!wantsAnswerToggle)
    }
  }

  return (
    <div className="w-screen h-screen">
      {isPlaying ? (
        <>
          <p>{`Total: ${total.toFixed(2)}`}</p>

          <Questioner questions={allQuestions} questionNumber={questionNumber} />

          <br />

          <Countdowner
            countdownFrom={maxTime}
            granularity={100}
            onWantsTime={onSetTime}
            questionNumber={questionNumber}
            startTimerToggle={startToggle}
            wantsTimeToggle={wantsTimeToggle}
            clearToggle={clearToggle}
          />

          <AnswerGrid questionNumber={questionNumber} onSetAnswer={onSetAnswer} />
        </>
      ) : (
        <div className="h-screen flex flex-col items-center justify-center gap-4">
          <>
            <p className="text-center">
              Quizmo is rapid-fire 25 questions. The answers are anything from 1 to 25.
            </p>
          </>
          <>
            <p className="text-center">
              You input your answer by selecting a button on a 5x5 grid, which runs from left to
              right and top to bottom. The top left button represents 1. The bottom right button
              represents 25.
            </p>
          </>
          <>
            <p className="text-center">
              You have just 10 seconds to decide on each answer, and the quicker you are, the higher
              you can score.
            </p>
          </>
          <>
            <p className="text-center">
              <b>Think fast and react quickly!</b>
            </p>
          </>
          <>
            <button
              className="btn bg-button text-button-foreground border-button-border cursor-pointer hover:bg-button-hover active:shadow-xl"
              onClick={handlePlay}
              disabled={isFetching}
            >
              Play
            </button>
          </>
          <>
            <p className="text-center">
              By &nbsp;
              <a href="https://huckle.studio" target="_blank">
                Steve Huckle
              </a>
            </p>
          </>
        </div>
      )}
    </div>
  )
}
