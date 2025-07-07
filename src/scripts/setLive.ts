import { getPayload } from 'payload'

import config from '@payload-config'
import { eq, and, asc } from '@payloadcms/db-sqlite/drizzle'

import { questions } from '../payload-generated-schema'

import { numLiveQuestions } from './config'

let exitCode = 0

const setLive = async () => {
  const payload = await getPayload({ config })
  const records = await payload.db.drizzle
    .select()
    .from(questions)
    .where(and(eq(questions.archived, false), eq(questions.archived, false)))
    .orderBy(asc(questions.id))
    .limit(numLiveQuestions)

  //console.log('result of sql', records)

  // set each one live
  for (const record of records) {
    //console.log('setting live record', record)
    await payload.db.drizzle
      .update(questions)
      .set({ live: true })
      .where(eq(questions.id, record.id))
  }
}

await setLive()
process.exit(exitCode)
