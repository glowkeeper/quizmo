'use client'

import React, { useState, useEffect, type ReactNode } from 'react'

import type { Questions } from '../../scripts/setQuestions'

import type { Answers } from './Answerer'

import { maxTime } from '../../scripts/config'

import { Answerer } from './Answerer'
import { Questioner } from './Questioner'
import { V } from 'vitest/dist/chunks/reporters.d.DL9pg5DB.js'

export const Quizmo = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [isFetching, setIsFetching] = useState<boolean>(true)
  const [hasAsked, setHasAsked] = useState<boolean>(false)

  const [allQuestions, setAllQuestions] = useState<Questions[]>([])
  const [questionNumber, setQuestionNumber] = useState<number>(1)

  const [allAnswers, setAllAnswers] = useState<Answers[]>([])
  const [total, setTotal] = useState<number>(0)

  useEffect(() => {
    const getQuestions = async () => {
      let questions: Questions[] = []
      await fetch('http://localhost:3000/api/questions/live').then(async (response: Response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const json = await response.json()
        //console.log('fetched', json)
        if (json?.message?.length) {
          questions = json?.message.map((choice: Questions) => choice)
        }
      })

      //console.log('questions', questions)
      setAllQuestions(questions)
      setIsFetching(false)
    }

    getQuestions()
  }, [])

  const handlePlay = () => {
    setIsPlaying(true)
  }

  const onHasAsked = (question: number) => {
    console.log('has asked', question, questionNumber)

    if (question === questionNumber) {
      setHasAsked(true)
    }
  }

  const onHasAnswered = (answer: Answers) => {
    console.log('has amswered', answer)

    if (answer.questionNumber === questionNumber) {
      //console.log('answers hoorah', currentAnswer)
      const answers = [...allAnswers]
      answers.push(answer)
      setAllAnswers(answers)

      if (answer.answer == answer.correctAnswer) {
        const newTotal = total + (maxTime - answer.time)
        //console.log('new total hoorah', newTotal)
        setTotal(newTotal)
      }
    }

    setHasAsked(false)
    setQuestionNumber(questionNumber + 1)
  }

  return (
    <div className="quizmo">
      {isPlaying ? (
        <>
          <p className="font-bold">{`Total: ${total.toFixed(2)}`}</p>
          {hasAsked ? (
            <Answerer
              questions={allQuestions}
              questionNumber={questionNumber}
              onHasAnswered={onHasAnswered}
            />
          ) : (
            <Questioner
              questions={allQuestions}
              questionNumber={questionNumber}
              onHasAsked={onHasAsked}
            />
          )}
        </>
      ) : (
        <>
          <>
            <p className="text-center">
              Quizmo is rapid-fire 25 questions. The answers are anything from 1 to 25.
            </p>
            <p className="text-center">
              You input your answer by selecting a button on a 5x5 grid, which runs from left to
              right and top to bottom. The top left button represents 1. The bottom right button
              represents 25.
            </p>
            <p className="text-center">
              You have just 10 seconds to decide on each answer, and the quicker you are, the higher
              you can score.
            </p>
            <p className="text-center">
              <b>Think fast and react quickly!</b>
            </p>
            <button
              className="btn bg-button text-button-foreground border-button-border cursor-pointer hover:bg-button-hover active:shadow-xl my-4"
              onClick={handlePlay}
              disabled={isFetching}
            >
              Play
            </button>
          </>
        </>
      )}
    </div>
  )
}
