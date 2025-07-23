import type { CollectionConfig } from 'payload'

export const Games: CollectionConfig = {
  slug: 'games',
  fields: [
    {
      name: 'date',
      type: 'date',
      required: true,
    },
  ],
}
