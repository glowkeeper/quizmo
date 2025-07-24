import type { CollectionConfig } from 'payload'
import { eq } from '@payloadcms/db-sqlite/drizzle'

import { questions } from '../payload-generated-schema'

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
        //console.log('payload', req.payload)
        // const questions = await req.payload.find({
        //   collection: 'questions',
        // })

        //const findResults = await req.payload.db.drizzle.query.questions.findMany()
        const results = await req.payload.db.drizzle
          .select({
            question: questions.question,
            answer: questions.answer,
            game: questions.game,
          })
          .from(questions)
          .where(eq(questions.live, true))
          .limit(numRecords)

        const encoded = results.map((result) => {
          const game = result.game?.toString() as string
          const newResult = {
            question: Buffer.from(result.question).toString('base64'),
            answer: Buffer.from(result.answer).toString('base64'),
            game: Buffer.from(game).toString('base64'),
          }
          return newResult
        })

        //console.log('got encoded questions', encoded)

        return Response.json({
          message: encoded,
        })
      },
    },
  ],
}
