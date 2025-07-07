import { getPayload } from 'payload'

import config from '@payload-config'
import { eq } from '@payloadcms/db-sqlite/drizzle'

import { questions } from '../payload-generated-schema'

const setArchived = async () => {
  const payload = await getPayload({ config })
  const records = await payload.db.drizzle.select().from(questions).where(eq(questions.live, true))

  // set each one archived (and not live)
  for (const record of records) {
    //console.log('setting live record', record)
    await payload.db.drizzle
      .update(questions)
      .set({ archived: true, live: false })
      .where(eq(questions.id, record.id))
  }
}

await setArchived()
process.exit(0)
