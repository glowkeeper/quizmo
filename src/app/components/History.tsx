'use client'

import React, { useState, useEffect, type ReactNode } from 'react'

import { Summary } from './Summary'

import type { GameStorage } from './Quizmo'
import type { Answers } from './Answerer'

import { maxAnswer, maxTime } from '../../config'

type HistoryType = ({ game }: HistoryProps) => ReactNode

interface HistoryProps {
  game: string
}

export const History: HistoryType = ({ game }) => {
  const [games, setGames] = useState<GameStorage[]>([])
  const [allAnswers, setAllAnswers] = useState<Answers[]>([])
  const [total, setTotal] = useState<number>(0)
  const [gameDate, setGameDate] = useState<string>('')

  useEffect(() => {
    const games: GameStorage[] = []
    const total = 0
    for (let i = 0; i < localStorage.length; i++) {
      // set iteration key name
      const thisGame = localStorage.key(i) as string

      // use key name to retrieve the corresponding value
      const data = localStorage.getItem(thisGame) as string

      // console.log the iteration key and value
      //console.log('Key: ' + key + ', Data: ' + data)

      const answersEncoded: string = Buffer.from(data, 'base64').toString('ascii')
      const theseAnswers: GameStorage = JSON.parse(answersEncoded)
      games.push(theseAnswers)

      if (game === thisGame) {
        setGameDate(theseAnswers.date)
        setTotal(theseAnswers.total)
        setAllAnswers(theseAnswers.answers)
      }
    }
    setGames(games)
  }, [game])

  return (
    <>
      <div className="grid grid-cols-5 place-items-center gap-4">
        <>
          <h3>Total Games</h3>
          <h3>Total Score</h3>
          <h3>Average Score</h3>
          <h3>Highest Score</h3>
          <h3>Lowest Score</h3>
        </>
        <>
          <p>{games.length}</p>
          <p>{games.reduce((accumulator, game) => accumulator + game.total, 0).toFixed(2)}</p>
          <p>
            {(
              games.reduce((accumulator, game) => accumulator + game.total, 0) / games.length
            ).toFixed(2)}
          </p>
          <p>
            {games
              .reduce((max, game) => {
                return max < game.total ? game.total : max
              }, 0)
              .toFixed(2)}
          </p>

          <p>
            {games
              .reduce((min, game) => {
                return min > game.total ? game.total : min
              }, maxAnswer * maxTime)
              .toFixed(2)}
          </p>
        </>
      </div>

      <p>
        {new Date(gameDate).toLocaleDateString('en-UK', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })}
      </p>
      <Summary total={total} answers={allAnswers} />
    </>
  )
}
