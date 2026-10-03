import type { CollectionEntry } from 'astro:content';

type ContentEntry = CollectionEntry<'teaching'> | CollectionEntry<'algorithms'> | CollectionEntry<'notes'>;

export function isPublished(entry: ContentEntry, now = new Date()) {
  return entry.data.published && (!entry.data.releaseDate || entry.data.releaseDate <= now);
}

export function sortByDate(entries: ContentEntry[]) {
  return [...entries].sort(
    (a, b) => (b.data.releaseDate?.getTime() ?? 0) - (a.data.releaseDate?.getTime() ?? 0),
  );
}
