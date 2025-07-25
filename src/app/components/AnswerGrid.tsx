'use client'

import { useState, useEffect, type ReactNode } from 'react'

import type { Questions } from '../../scripts/setQuestions'

import { maxAnswer } from '../../config'

type AnswerGridType = ({
  questions,
  questionNumber,
  timeElapsed,
  onSetAnswer,
  onGetTime,
}: AnswerGridProps) => ReactNode

interface AnswerGridProps {
  questions: Questions[]
  questionNumber: number
  timeElapsed: boolean
  onSetAnswer: (value: string, question: number) => void
  onGetTime: (question: number) => void
}

interface Grid {
  size: number
  css: string
}

interface GridData {
  value: number
  className: string
}

export const AnswerGrid: AnswerGridType = ({
  questions,
  questionNumber,
  timeElapsed,
  onSetAnswer,
  onGetTime,
}) => {
  const [grid, setGrid] = useState<GridData[]>([])
  const [question, setQuestion] = useState<number>(0)
  const [correctAnswer, setCorrectAnswer] = useState<string>('')
  const [answer, setAnswer] = useState<string>('')
  const [hasAnswered, setHasAnswered] = useState<boolean>(false)

  useEffect(() => {
    const buttonData: GridData[] = Array.from({ length: maxAnswer }, (_, index) => ({
      value: index + 1,
      className: 'btn btn-primary',
    }))

    setGrid(buttonData)
  }, [])

  useEffect(() => {
    setCorrectAnswer(questions[questionNumber - 1].answer)
    setQuestion(questionNumber)
  }, [questions, questionNumber])

  useEffect(() => {
    if (timeElapsed) {
      setAnswer('')
      setHasAnswered(true)
    }
  }, [timeElapsed])

  const onNumberSelect = (value: string) => {
    //console.log('all questions', allQuestions, value)
    setAnswer(value)
    setHasAnswered(true)
    onGetTime(question)
    //onSetAnswer(value, question)
  }

  const onShownCorrect = () => {
    onSetAnswer(answer, question)
  }

  return (
    <div className="grid grid-cols-5 gap-2 m-4">
      {grid.map((button, index) => {
        //console.log('coorect', correctAnswer)
        let buttonClass =
          button.value.toString() === answer
            ? button.value.toString() === correctAnswer
              ? 'btn bg-green-500 text-button-foreground border-button-border'
              : 'btn bg-red-500 text-button-foreground border-button-border'
            : button.value.toString() === correctAnswer
              ? 'btn bg-green-500 text-button-foreground border-button-border'
              : 'btn bg-button text-button-foreground border-button-border'
        return hasAnswered ? (
          <div key={index}>
            <button key={button.value} className={buttonClass}>
              {button.value.toString() === correctAnswer ? (
                <div
                  className="animate-fadeInShowAnswer"
                  onAnimationEnd={() => {
                    //console.log('shown correct end', button.value)
                    onShownCorrect()
                  }}
                >
                  {button.value < 10 ? <>0{button.value}</> : <>{button.value}</>}
                </div>
              ) : (
                <>
                  {button.value.toString() == answer ? (
                    <div className="animate-fadeInShowAnswer">
                      {button.value < 10 ? <>0{button.value}</> : <>{button.value}</>}
                    </div>
                  ) : (
                    <div className="grid-text-hidden">00</div>
                  )}
                </>
              )}
            </button>
          </div>
        ) : (
          <div key={index}>
            <button
              key={button.value}
              className="btn bg-button text-button-foreground border-button-border cursor-pointer hover:bg-button-hover active:shadow-xl"
              onClick={() => onNumberSelect(button.value.toString())}
            >
              <div className="grid-text-hidden">
                {button.value < 10 ? <>0{button.value}</> : <>{button.value}</>}
              </div>
            </button>
          </div>
        )
      })}
    </div>
  )
}
