// run: ./node_modules/.bin/payload run src/scripts/setLive.ts

import { getPayload } from 'payload'

import config from '@payload-config'
import { eq, and, asc, desc, sql } from '@payloadcms/db-sqlite/drizzle'

import { questions } from '../payload-generated-schema'
import { games } from '../payload-generated-schema'

import { maxAnswer } from '../config'

let exitCode = 0

const setLive = async () => {
  const payload = await getPayload({ config })

  // const records = await payload.db.drizzle.select().from(games).orderBy(desc(games.id))

  // console.log('result of sql', records)

  const insertedId = (
    await payload.db.drizzle
      .insert(games)
      .values({
        date: sql`(current_timestamp)`,
      })
      .returning()
  )[0].id

  // console.log('result of inserted sql', insertedId)

  const records = await payload.db.drizzle
    .select()
    .from(questions)
    // .where(and(eq(questions.archived, false), eq(questions.archived, false)))
    .where(eq(questions.archived, false))
    .orderBy(asc(questions.id))
    .limit(maxAnswer)

  //console.log('result of sql', records)

  //set each one live
  for (const record of records) {
    //console.log('setting live record', record)
    await payload.db.drizzle
      .update(questions)
      .set({
        live: true,
        game: insertedId,
      })
      .where(eq(questions.id, record.id))
  }
}

await setLive()
process.exit(exitCode)
