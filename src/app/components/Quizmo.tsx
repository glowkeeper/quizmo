'use client'

import React, { useState, useEffect, type ReactNode } from 'react'

import type { Questions } from '../../scripts/setQuestions'

import type { Answers } from './Answerer'

import { maxAnswer, maxTime } from '../../config'

import { Answerer } from './Answerer'
import { Questioner } from './Questioner'
import { Summary } from './Summary'

export const Quizmo = () => {
  const [isFetching, setIsFetching] = useState<boolean>(true)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [hasAsked, setHasAsked] = useState<boolean>(false)
  const [hasFinished, setHasFinished] = useState<boolean>(false)

  const [allQuestions, setAllQuestions] = useState<Questions[]>([])
  const [questionNumber, setQuestionNumber] = useState<number>(1)

  const [allAnswers, setAllAnswers] = useState<Answers[]>([])

  const [newScore, setNewScore] = useState<number>(0)
  const [hasNewScore, setHasNewScore] = useState<boolean>(false)

  const [hasShownOld, setHasShownOld] = useState<boolean>(false)
  const [oldTotal, setOldTotal] = useState<number>(0)
  const [total, setTotal] = useState<number>(0)
  const [game, setGame] = useState<string>('')

  const setQuestions = (questions: Questions[]) => {
    //console.log('decoded', questions)
    if (questions.length) {
      const game = questions[0].game
      const storedGame = localStorage.getItem(game)
      if (storedGame) {
        const answersEncoded: string = Buffer.from(storedGame, 'base64').toString('ascii')
        const theseAnswers = JSON.parse(answersEncoded)
        const total = theseAnswers.total
        const answers: Answers[] = theseAnswers.answers
        setAllAnswers(answers)
        setTotal(Number(total))
        setHasFinished(true)
      } else {
        localStorage.setItem(game, Buffer.from(questions[0].game).toString('base64'))
      }
      setGame(game)
    }
    //console.log('questions', questions)
    setAllQuestions(questions)
  }

  useEffect(() => {
    const getQuestions = async () => {
      let questions: Questions[] = []
      await fetch('http://localhost:3000/api/questions/live')
        .then(async (response: Response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }
          const json = await response.json()
          //console.log('fetched', json)
          if (json?.message?.length) {
            questions = json?.message.map((question: Questions) => {
              const encodedQuestion = {
                question: Buffer.from(question.question, 'base64').toString('ascii'),
                answer: Buffer.from(question.answer, 'base64').toString('ascii'),
                game: question.game,
              }
              return encodedQuestion
            })
          }
        })
        .catch((error) => console.error('Error fetching data:', error))

      setQuestions(questions)
      setIsFetching(false)
    }

    getQuestions()
  }, [])

  const handlePlay = () => {
    setIsPlaying(true)
  }

  const onHasAsked = (question: number) => {
    //console.log('has asked', question, questionNumber)

    if (question === questionNumber) {
      setHasAsked(true)
    }
  }

  const onHasAnswered = (answer: Answers) => {
    //console.log('has amswered', answer)

    if (answer.questionNumber === questionNumber) {
      //console.log('answers hoorah', currentAnswer)
      const answers = [...allAnswers]
      answers.push(answer)
      setAllAnswers(answers)

      let newScore = 0
      if (answer.answer == answer.correctAnswer) {
        newScore = maxTime - answer.time
        const newTotal = total + newScore
        setOldTotal(total)
        setTotal(newTotal)
      }

      setHasShownOld(false)
      setHasNewScore(true)
      setNewScore(newScore)
    }
  }

  return (
    <div className="quizmo">
      {isPlaying ? (
        <>
          {hasAsked ? (
            <>
              {hasNewScore ? (
                <>
                  {hasShownOld ? (
                    <>
                      <p
                        className="font-bold animate-fadeInVeryFast"
                        onAnimationEnd={() => {
                          const answers = {
                            total: total,
                            answers: allAnswers,
                          }
                          setOldTotal(total)
                          setHasNewScore(false)
                          if (questionNumber >= maxAnswer) {
                            setIsPlaying(false)
                            setHasFinished(true)
                          } else {
                            setHasAsked(false)
                            setQuestionNumber(questionNumber + 1)
                          }
                          localStorage.setItem(
                            game,
                            Buffer.from(JSON.stringify(answers)).toString('base64'),
                          )
                        }}
                      >
                        {`Total: ${total.toFixed(2)}`}
                      </p>
                      <p>
                        <b>+{newScore.toFixed(2)}</b>
                      </p>
                    </>
                  ) : (
                    <>
                      <p
                        className="font-bold animate-fadeInOutFast"
                        onAnimationEnd={() => {
                          setHasShownOld(true)
                        }}
                      >
                        {`Old Total: ${oldTotal.toFixed(2)}`}
                      </p>
                      <p className="animate-blinkText">
                        <b>+{newScore.toFixed(2)}</b>
                      </p>
                    </>
                  )}
                </>
              ) : (
                <>
                  <p className="font-bold">{`Total: ${total.toFixed(2)}`}</p>
                  <Answerer
                    questions={allQuestions}
                    questionNumber={questionNumber}
                    onHasAnswered={onHasAnswered}
                  />
                </>
              )}
            </>
          ) : (
            <>
              <p className="font-bold">{`Total: ${total.toFixed(2)}`}</p>
              <Questioner
                questions={allQuestions}
                questionNumber={questionNumber}
                onHasAsked={onHasAsked}
              />
            </>
          )}
        </>
      ) : (
        <>
          {hasFinished ? (
            <>
              <Summary total={total} answers={allAnswers} />
            </>
          ) : (
            <>
              <p className="text-center">
                <b>Quizmo</b>: 25 Questions. 10 Seconds Each. Think Fast, Score Big!
              </p>
              <p>
                <b>
                  {new Date().toLocaleDateString('en-UK', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </b>
              </p>
              <button
                className="btn bg-button text-button-foreground border-button-border cursor-pointer hover:bg-button-hover active:shadow-xl my-4"
                onClick={handlePlay}
                disabled={isFetching}
              >
                Play
              </button>
            </>
          )}
        </>
      )}
    </div>
  )
}
