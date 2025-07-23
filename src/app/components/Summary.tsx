'use client'

import React, { useState, useEffect, type ReactNode } from 'react'

import type { Answers } from './Answerer'
import { maxAnswer, maxTime } from '../../config'

type SummaryType = ({ total, answers }: SummaryProps) => ReactNode

interface SummaryProps {
  total: number
  answers: Answers[]
}

export const Summary: SummaryType = ({ total, answers }) => {
  const [totalScore, setTotalScore] = useState<number>(0)
  const [numAnswers, setNumAnswers] = useState<number>(0)
  const [allAnswers, setAllAnswers] = useState<Answers[]>([])
  const [numCorrect, setNumCorrect] = useState<number>(0)
  const [numUnanswered, setNumUnanswered] = useState<number>(0)
  const [avgTime, setAvgTime] = useState<number>(0)
  const [avgCorrectTime, setAvgCorrectTime] = useState<number>(0)

  const [showAnswers, setShowAnswers] = useState<boolean>(false)
  const [questionNumber, setQuestionNumber] = useState<number>(1)

  useEffect(() => {
    let numAnswers = answers.length
    let unAnswered = maxAnswer - numAnswers
    let numCorrect = 0
    let totalTime = 0
    let correctTime = 0
    answers.forEach((answer) => {
      //console.log('answer', answer)
      if (answer.answer == answer.correctAnswer) {
        numCorrect += 1
        correctTime += answer.time
      }

      if (answer.time == maxTime) {
        unAnswered += 1
      } else {
        totalTime += answer.time
      }
    })
    setNumAnswers(numAnswers)
    setAllAnswers(answers)
    setTotalScore(total)
    setNumCorrect(numCorrect)
    setNumUnanswered(unAnswered)
    setAvgTime(totalTime / (maxAnswer - unAnswered))
    setAvgCorrectTime(correctTime / numCorrect)
  }, [total, answers])

  return (
    <>
      <p className="font-bold">{`Total: ${totalScore.toFixed(2)}`}</p>
      {showAnswers ? (
        <>
          <h2>Question {questionNumber}</h2>
          <p>{allAnswers[questionNumber - 1].question}</p>
          <p>
            Your Answer:{' '}
            {allAnswers[questionNumber - 1].answer == 0
              ? '---'
              : allAnswers[questionNumber - 1].answer}
          </p>
          <p>Correct Answer: {allAnswers[questionNumber - 1].correctAnswer}</p>
          <p>
            Score:{' '}
            {allAnswers[questionNumber - 1].answer ==
            allAnswers[questionNumber - 1].correctAnswer ? (
              <>{(maxTime - allAnswers[questionNumber - 1].time).toFixed(2)}</>
            ) : (
              <>0</>
            )}
          </p>
          {questionNumber >= numAnswers ? (
            <div className="flex flex-row items-center justify-center gap-4">
              <button
                className="btn bg-button text-button-foreground border-button-border cursor-pointer hover:bg-button-hover active:shadow-xl my-4"
                onClick={() => setQuestionNumber(questionNumber - 1)}
              >
                Prev
              </button>
              <button
                className="btn bg-button text-button-foreground border-button-border cursor-pointer hover:bg-button-hover active:shadow-xl my-4"
                onClick={() => {
                  setShowAnswers(false)
                  setQuestionNumber(1)
                }}
              >
                Summary
              </button>
            </div>
          ) : (
            <>
              {questionNumber <= 1 ? (
                <div className="flex flex-row items-center justify-center gap-4">
                  <button
                    className="btn bg-button text-button-foreground border-button-border cursor-pointer hover:bg-button-hover active:shadow-xl my-4"
                    onClick={() => setQuestionNumber(questionNumber + 1)}
                  >
                    Next
                  </button>
                  <button
                    className="btn bg-button text-button-foreground border-button-border cursor-pointer hover:bg-button-hover active:shadow-xl my-4"
                    onClick={() => {
                      setShowAnswers(false)
                      setQuestionNumber(1)
                    }}
                  >
                    Summary
                  </button>
                </div>
              ) : (
                <div className="flex flex-row items-center justify-center gap-4">
                  <button
                    className="btn bg-button text-button-foreground border-button-border cursor-pointer hover:bg-button-hover active:shadow-xl my-4"
                    onClick={() => setQuestionNumber(questionNumber + 1)}
                  >
                    Next
                  </button>
                  <button
                    className="btn bg-button text-button-foreground border-button-border cursor-pointer hover:bg-button-hover active:shadow-xl my-4"
                    onClick={() => setQuestionNumber(questionNumber - 1)}
                  >
                    Prev
                  </button>
                  <button
                    className="btn bg-button text-button-foreground border-button-border cursor-pointer hover:bg-button-hover active:shadow-xl my-4"
                    onClick={() => {
                      setShowAnswers(false)
                      setQuestionNumber(1)
                    }}
                  >
                    Summary
                  </button>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <>
          <p>
            <b>
              {new Date().toLocaleDateString('en-UK', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </b>
          </p>
          <p>
            Correct: {numCorrect} / {maxAnswer}
          </p>
          <p>Unanswered: {numUnanswered}</p>
          <p>
            Average Correct Answer Time:{' '}
            {isNaN(avgCorrectTime) ? '---' : avgCorrectTime.toFixed(2) + 's'}
          </p>
          <p>
            Average Correct Score:{' '}
            {isNaN(avgCorrectTime) ? '---' : (totalScore / numCorrect).toFixed(2)}
          </p>
          <p>Average Answer Time: {avgTime === 10 ? '---' : avgTime.toFixed(2) + 's'}</p>
          <p>Average Score: {avgTime === 10 ? '---' : (totalScore / maxAnswer).toFixed(2)}</p>
          <button
            className="btn bg-button text-button-foreground border-button-border cursor-pointer hover:bg-button-hover active:shadow-xl my-4"
            onClick={() => setShowAnswers(true)}
          >
            Show Answers
          </button>
        </>
      )}
    </>
  )
}
