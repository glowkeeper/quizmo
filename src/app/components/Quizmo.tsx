'use client'

import React, { useState, useEffect, useCallback } from 'react'

import type { Questions } from '../../scripts/setQuestions'

import type { Answers } from './Answerer'

import { maxAnswer, maxTime } from '../../config'

import { Answerer } from './Answerer'
import { Questioner } from './Questioner'
import { History } from './History'

export type GameStorage = {
  date: string
  total: number
  answers: Array<Answers>
}

export const Quizmo = () => {
  const [isFetching, setIsFetching] = useState<boolean>(true)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [hasAsked, setHasAsked] = useState<boolean>(false)
  const [hasFinished, setHasFinished] = useState<boolean>(false)

  const [doFetch, setDoFetch] = useState<boolean>(true)
  const [timer, setTimer] = useState<NodeJS.Timeout>()

  const [allQuestions, setAllQuestions] = useState<Questions[]>([])
  const [questionNumber, setQuestionNumber] = useState<number>(1)

  const [allAnswers, setAllAnswers] = useState<Answers[]>([])

  const [newScore, setNewScore] = useState<number>(0)
  const [hasNewScore, setHasNewScore] = useState<boolean>(false)

  const [hasShownOld, setHasShownOld] = useState<boolean>(false)
  const [oldTotal, setOldTotal] = useState<number>(0)
  const [total, setTotal] = useState<number>(0)
  const [game, setGame] = useState<string>('')
  const [gameDate, setGameDate] = useState<string>('')

  const setQuestions = (game: string, gameDate: string, questions: Questions[]) => {
    //console.log('decoded', game, gameDate, questions)
    if (questions.length) {
      const storedGame = localStorage.getItem(game)
      if (storedGame) {
        const answersEncoded: string = Buffer.from(storedGame, 'base64').toString('ascii')
        const theseAnswers: GameStorage = JSON.parse(answersEncoded)
        const total = theseAnswers.total
        const answers: Answers[] = theseAnswers.answers
        setAllAnswers(answers)
        setTotal(Number(total))
        setHasFinished(true)
      } else {
        localStorage.setItem(game, '')
      }
    }
    //console.log('questions', questions)

    setGame(game)
    setGameDate(gameDate)
    setAllQuestions(questions)
  }

  const getQuestions = useCallback(async () => {
    let questions: Questions[] = []
    let game = ''
    let gameDate = ''
    await fetch('http://localhost:3000/api/questions/live')
      .then(async (response: Response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const json = await response.json()
        //console.log('fetched', json)
        if (json?.message) {
          game = json.message.game
          gameDate = json.message.date
          questions = json.message.questions.map((question: Questions) => {
            const encodedQuestion = {
              question: Buffer.from(question.question, 'base64').toString('ascii'),
              answer: Buffer.from(question.answer, 'base64').toString('ascii'),
            }
            return encodedQuestion
          })
        }
      })
      .catch((error) => console.error('Error fetching data:', error))

    setQuestions(game, gameDate, questions)
    setIsFetching(false)
  }, [])

  useEffect(() => {
    return () => clearInterval(timer)
  }, [timer])

  useEffect(() => {
    if (doFetch) {
      setDoFetch(false)
      getQuestions()
      const timer = setInterval(() => {
        console.log('getting questions')
        getQuestions()
      }, 60000) //once a minute
      setTimer(timer)
    }

    return () => clearInterval(timer)
  }, [doFetch, getQuestions, timer])

  const handlePlay = () => {
    setIsPlaying(true)
    setDoFetch(false)
    clearInterval(timer)
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

  const onHasShownOld = () => {
    const answers: GameStorage = {
      date: gameDate,
      total: total,
      answers: allAnswers,
    }
    setOldTotal(total)
    setHasNewScore(false)
    if (questionNumber >= maxAnswer) {
      setIsPlaying(false)
      setHasFinished(true)
      setDoFetch(true)
    } else {
      setHasAsked(false)
      setQuestionNumber(questionNumber + 1)
    }
    localStorage.setItem(game, Buffer.from(JSON.stringify(answers)).toString('base64'))
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
                        onAnimationEnd={onHasShownOld}
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
              <History game={game} />
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
