import type { CollectionEntry } from 'astro:content';

export interface SidebarItem {
  label: string;
  href?: string;
  children?: SidebarItem[];
}

type Entry = CollectionEntry<'teaching'> | CollectionEntry<'algorithms'> | CollectionEntry<'notes'>;

const link = (label: string, href: string): SidebarItem => ({ label, href });

export function buildSidebar(
  pathname: string,
  teachingEntries: CollectionEntry<'teaching'>[],
  algorithmEntries: CollectionEntry<'algorithms'>[],
  noteEntries: CollectionEntry<'notes'>[],
): SidebarItem[] {
  if (pathname.startsWith('/teaching')) {
    const semester = '/teaching/nju-ps/2026-spring/';
    const lectures = teachingEntries
      .filter((entry) => entry.slug.startsWith('nju-ps/2026-spring/'))
      .sort((a, b) => (a.data.week ?? 999) - (b.data.week ?? 999))
      .map((entry) => link(entry.data.title, `/teaching/${entry.slug}/`));

    return [
      {
        label: 'NJU Problem Solving',
        href: '/teaching/',
        children: [
          {
            label: '2026 Spring',
            href: semester,
            children: [
              link('Overview', semester),
              link('Schedule', `${semester}schedule/`),
              ...(lectures.length ? [{ label: 'Lectures', children: lectures }] : []),
              link('OJ Solutions', `${semester}oj/`),
              link('FAQ & Debugging', `${semester}faq/`),
            ],
          },
          link('Archive', '/teaching/'),
        ],
      },
    ];
  }

  if (pathname.startsWith('/algorithms')) {
    const byCategory = new Map<string, SidebarItem[]>();
    for (const entry of algorithmEntries) {
      const category = entry.data.category || 'Others';
      const items = byCategory.get(category) ?? [];
      items.push(link(entry.data.title, `/algorithms/${entry.slug}/`));
      byCategory.set(category, items);
    }
    return [...byCategory.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([category, children]) => ({ label: category, children }));
  }

  if (pathname.startsWith('/notes')) {
    return [
      {
        label: 'Notes',
        href: '/notes/',
        children: noteEntries
          .sort((a, b) => a.data.title.localeCompare(b.data.title))
          .map((entry) => link(entry.data.title, `/notes/${entry.slug}/`)),
      },
    ];
  }

  return [];
}

export function isPublishedEntry(entry: Entry, now = new Date()) {
  return entry.data.published && (!entry.data.releaseDate || entry.data.releaseDate <= now);
}
