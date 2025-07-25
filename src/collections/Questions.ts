import type { CollectionConfig } from 'payload'
import { eq } from '@payloadcms/db-sqlite/drizzle'

import { questions, games } from '../payload-generated-schema'

const numRecords = 25

export const Questions: CollectionConfig = {
  slug: 'questions',
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
    },
    {
      name: 'answer',
      type: 'text',
      required: true,
    },
    {
      name: 'category',
      type: 'text',
      required: true,
    },
    {
      name: 'archived',
      type: 'checkbox',
      label: 'archived',
      defaultValue: false,
      required: true,
    },
    {
      name: 'live',
      type: 'checkbox',
      label: 'live',
      defaultValue: false,
      required: true,
    },
    {
      name: 'game',
      type: 'relationship',
      label: 'game',
      relationTo: 'games',
      required: false,
      hasMany: false,
    },
  ],
  endpoints: [
    {
      path: '/live',
      method: 'get',
      handler: async (req) => {
        const results = await req.payload.db.drizzle
          .select({
            question: questions.question,
            answer: questions.answer,
            game: questions.game,
            date: games.date,
          })
          .from(questions)
          .where(eq(questions.live, true))
          .rightJoin(games, eq(games.id, questions.game))
          .limit(numRecords)

        let game = ''
        let date = ''
        const encodedQuestions = results.map((result) => {
          game = result.game?.toString() as string
          date = result.date
          const newResult = {
            question: Buffer.from(result.question as string).toString('base64'),
            answer: Buffer.from(result.answer as string).toString('base64'),
          }
          return newResult
        })

        const newQuestions = {
          game: game,
          date: date,
          questions: encodedQuestions,
        }

        //console.log('got encoded questions', encoded)

        return Response.json({
          message: newQuestions,
        })
      },
    },
  ],
}
