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

type GameHistory = GameStorage & HistoryProps

export const History: HistoryType = ({ game }) => {
  const [games, setGames] = useState<GameHistory[]>([])
  const [shownIndex, setShownIndex] = useState<number>(-1)

  useEffect(() => {
    const games: GameHistory[] = []
    const total = 0
    for (let i = 0; i < localStorage.length; i++) {
      // set iteration key name
      const thisGame = localStorage.key(i) as string

      // use key name to retrieve the corresponding value
      const data = localStorage.getItem(thisGame) as string

      // console.log the iteration key and value
      //console.log(i + ' Key: ' + thisGame + ', Data: ' + data)

      const answersEncoded: string = Buffer.from(data, 'base64').toString('ascii')
      const theseAnswers: GameStorage = JSON.parse(answersEncoded)
      const gameData: GameHistory = { game: thisGame, ...theseAnswers }
      games.push(gameData)

      if (game === thisGame) {
        console.log('this game', gameData, game, thisGame, gameData.date, gameData.total)
        setShownIndex(i)
      }
    }
    setGames(games)
  }, [game])

  return (
    <>
      {shownIndex !== -1 && (
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

          <hr className="w-48 h-1 my-4 bg-[var(--secondary)] border-0 rounded-sm"></hr>

          <div className="grid grid-cols-3 place-items-center gap-4">
            {shownIndex - 1 >= 0 ? (
              <button
                className="btn bg-button text-button-foreground border-button-border cursor-pointer hover:bg-button-hover active:shadow-xl my-4"
                onClick={() => setShownIndex(shownIndex - 1)}
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

            <p className="font-bold">
              {new Date(games[shownIndex].date).toLocaleDateString('en-UK', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>

            {shownIndex + 1 <= games.length - 1 ? (
              <button
                className="btn bg-button text-button-foreground border-button-border cursor-pointer hover:bg-button-hover active:shadow-xl my-4"
                onClick={() => setShownIndex(shownIndex + 1)}
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

          <hr className="w-48 h-1 my-4 bg-[var(--secondary)] border-0 rounded-sm"></hr>

          <Summary total={games[shownIndex].total} answers={games[shownIndex].answers} />
        </>
      )}
    </>
  )
}
