import { defineCollection, z } from 'astro:content';

const contentSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  published: z.boolean().default(true),
  releaseDate: z.coerce.date().optional(),
  tags: z.array(z.string()).default([]),
  category: z.string().optional(),
  course: z.string().optional(),
  semester: z.string().optional(),
  week: z.number().int().positive().optional(),
});

const teaching = defineCollection({ schema: contentSchema });
const notes = defineCollection({ schema: contentSchema });

export const collections = { teaching, notes };
