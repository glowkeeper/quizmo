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
  ],
  // admin: {
  //   meta: {
  //     title: 'Quizmo Questions',
  //     description:
  //       'Quizmo is rapid-fire questions. You have just 10 seconds to decide on each answer, and the Quicker you are, the higher you can score',
  //   },
  // },
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
          })
          .from(questions)
          .where(eq(questions.live, true))
          .limit(numRecords)

        //console.log('got questions', results)

        return Response.json({
          message: results,
        })
      },
    },
  ],
}
