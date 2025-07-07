// run: ./node_modules/.bin/payload run src/scripts/seed.ts

import { getPayload } from 'payload'

import config from '@payload-config'
import { eq } from '@payloadcms/db-sqlite/drizzle'

import { questions } from '../payload-generated-schema'

import type { Questions, DataReturned } from './setQuestions'
import { generateQuestions } from './setQuestions'
import { shuffle } from './shuffle'

let exitCode = 0

const seed = async () => {
  const data: DataReturned = await generateQuestions()

  if (data.parsed.length > 0) {
    //console.log('got data', data)

    const payload = await getPayload({ config })
    const shuffled: Questions[] = shuffle(data.parsed)

    for (const record of shuffled) {
      const prior = await payload.db.drizzle
        .select()
        .from(questions)
        .where(eq(questions.question, record.question))

      if (!prior.length) {
        //new question
        const inserted = await payload.db.drizzle.insert(questions).values({
          question: record.question,
          answer: record.answer.toLocaleString(),
          category: 'General Knowledge',
          archived: false,
          live: false,
        })

        //console.log('result of update', inserted, record)
      }
    }

    //console.log('finished inserting')
  } else {
    console.log('fetch failed', data)
    exitCode = 1
  }
}

await seed()
process.exit(exitCode)
