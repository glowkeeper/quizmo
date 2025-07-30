'use client'

import React, { useState, useEffect, type ReactNode } from 'react'

import Image, { StaticImageData } from 'next/image'

import type { Answers } from './Answerer'

import { maxAnswer, maxTime } from '../../config'

import share from '../../assets/images/share.png'

type SummaryType = ({ date, total, answers }: SummaryProps) => ReactNode
interface SummaryProps {
  date: string
  total: number
  answers: Answers[]
}

export const Summary: SummaryType = ({ date, total, answers }) => {
  const [totalScore, setTotalScore] = useState<number>(0)
  const [numAnswers, setNumAnswers] = useState<number>(0)
  const [allAnswers, setAllAnswers] = useState<Answers[]>([])
  const [numCorrect, setNumCorrect] = useState<number>(0)
  const [numUnanswered, setNumUnanswered] = useState<number>(0)
  const [avgTime, setAvgTime] = useState<number>(0)
  const [avgCorrectTime, setAvgCorrectTime] = useState<number>(0)

  const [showAnswers, setShowAnswers] = useState<boolean>(false)
  const [questionNumber, setQuestionNumber] = useState<number>(1)
  const [copyText, setCopyText] = useState<string>('')

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

  const onSetCopyText = () => {
    const url = 'https://www.quizmo.fun'
    const total = `Total: ${totalScore.toFixed(2)}`
    const thisDate = new Date(date).toLocaleDateString('en-UK', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
    const correct = `Correct: ${numCorrect} / ${maxAnswer}`
    const unAnswered = `Unanswered: ${numUnanswered}`
    const avgCorrect =
      'Average Correct Answer Time: ' +
      `${isNaN(avgCorrectTime) ? '---' : avgCorrectTime.toFixed(2) + 's'}`
    const avgAnswer =
      'Average Answer Time: ' +
      `${isNaN(avgCorrectTime) || avgTime === maxTime ? '---' : avgTime.toFixed(2) + 's'}`
    const copyText =
      url +
      '\n\n' +
      thisDate +
      '\n\n' +
      total +
      '\n' +
      correct +
      '\n' +
      unAnswered +
      '\n' +
      avgCorrect +
      '\n' +
      avgAnswer
    setCopyText(copyText)
  }

  return (
    <>
      <h2>{`Total: ${totalScore.toFixed(2)}`}</h2>
      {showAnswers ? (
        <>
          <h3>Question {questionNumber}</h3>
          <p>{allAnswers[questionNumber - 1].question}</p>
          <p>
            Your Answer:{' '}
            {allAnswers[questionNumber - 1].answer ? allAnswers[questionNumber - 1].answer : '---'}
          </p>
          <p>Correct Answer: {allAnswers[questionNumber - 1].correctAnswer}</p>
          <p>
            Score:{' '}
            {allAnswers[questionNumber - 1].answer ===
            allAnswers[questionNumber - 1].correctAnswer ? (
              <>{(maxTime - allAnswers[questionNumber - 1].time).toFixed(2)}</>
            ) : (
              <>0</>
            )}
          </p>
          <div className="flex flex-row items-center justify-center gap-4">
            {questionNumber > 1 ? (
              <button
                className="btn bg-button text-button-foreground border-button-border cursor-pointer hover:bg-button-hover active:shadow-xl my-4"
                onClick={() => setQuestionNumber(questionNumber - 1)}
              >
                Prev
              </button>
            ) : (
              <button
                className="btn btn-disabled bg-button text-button-foreground border-button-border active:shadow-xl my-4"
                tabIndex={-1}
              >
                Prev
              </button>
            )}
            <button
              className="btn bg-button text-button-foreground border-button-border cursor-pointer hover:bg-button-hover active:shadow-xl my-4"
              onClick={() => {
                setShowAnswers(false)
                setQuestionNumber(1)
              }}
            >
              Summary
            </button>
            {questionNumber < numAnswers ? (
              <button
                className="btn bg-button text-button-foreground border-button-border cursor-pointer hover:bg-button-hover active:shadow-xl my-4"
                onClick={() => setQuestionNumber(questionNumber + 1)}
              >
                Next
              </button>
            ) : (
              <button
                className="btn btn-disabled bg-button text-button-foreground border-button-border active:shadow-xl my-4"
                tabIndex={-1}
              >
                Next
              </button>
            )}
          </div>
        </>
      ) : (
        <>
          <p>
            Correct: {numCorrect} / {maxAnswer}
          </p>
          <p>Unanswered: {numUnanswered}</p>
          <p>
            Average Correct Answer Time:{' '}
            {isNaN(avgCorrectTime) ? '---' : avgCorrectTime.toFixed(2) + 's'}
          </p>
          <p>
            Average Answer Time:{' '}
            {isNaN(avgCorrectTime) || avgTime === maxTime ? '---' : avgTime.toFixed(2) + 's'}
          </p>
          <div className="grid grid-cols-2 place-items-center gap-4">
            <button
              className="btn bg-button text-button-foreground border-button-border cursor-pointer hover:bg-button-hover active:shadow-xl my-4"
              onClick={() => setShowAnswers(true)}
            >
              Show Answers
            </button>
            <button
              className="btn bg-button text-button-foreground border-button-border cursor-pointer hover:bg-button-hover active:shadow-xl"
              onClick={() => {
                onSetCopyText()
                ;(document.getElementById('copy_modal') as HTMLDialogElement).showModal()
              }}
            >
              <Image className="share" src={share as StaticImageData} alt="Quizmo Logo" />
            </button>
            <dialog id="copy_modal" className="modal">
              <div className="modal-box">
                <p className="font-bold">
                  {new Date(date).toLocaleDateString('en-UK', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
                <h2>{`Total: ${totalScore.toFixed(2)}`}</h2>
                <p>
                  Correct: {numCorrect} / {maxAnswer}
                </p>
                <p>Unanswered: {numUnanswered}</p>
                <p>
                  Average Correct Answer Time:{' '}
                  {isNaN(avgCorrectTime) ? '---' : avgCorrectTime.toFixed(2) + 's'}
                </p>
                <p>
                  Average Answer Time:{' '}
                  {isNaN(avgCorrectTime) || avgTime === maxTime ? '---' : avgTime.toFixed(2) + 's'}
                </p>
                <div className="grid grid-cols-2 place-items-center gap-4">
                  <button
                    className="btn"
                    onClick={() => {
                      navigator.clipboard.writeText(copyText)
                    }}
                  >
                    <p>⎗</p>
                  </button>
                  <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn">Close</button>
                  </form>
                </div>
              </div>
            </dialog>
          </div>
        </>
      )}
    </>
  )
}
