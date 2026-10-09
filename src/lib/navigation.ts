import type { CollectionEntry } from 'astro:content';
import { groupNotes } from './notes';

export interface SidebarItem {
  label: string;
  href?: string;
  children?: SidebarItem[];
}

type Entry = CollectionEntry<'teaching'> | CollectionEntry<'notes'>;

const link = (label: string, href: string): SidebarItem => ({ label, href });

export function buildSidebar(
  pathname: string,
  teachingEntries: CollectionEntry<'teaching'>[],
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
            label: '2026 春',
            href: semester,
            children: [
              link('课程概览', semester),
              link('课程安排', `${semester}schedule/`),
              ...(lectures.length ? [{ label: '讲义', children: lectures }] : []),
              link('OJ 题解', `${semester}oj/`),
              link('常见问题与调试', `${semester}faq/`),
            ],
          },
        ],
      },
    ];
  }

  if (pathname.startsWith('/notes')) {
    return [
      {
        label: '笔记',
        href: '/notes/',
        children: groupNotes(noteEntries).map((group) => ({
          label: group.label,
          children: group.entries.map((entry) => link(entry.data.title, `/notes/${entry.slug}/`)),
        })),
      },
    ];
  }

  return [];
}

export function isPublishedEntry(entry: Entry, now = new Date()) {
  return entry.data.published && (!entry.data.releaseDate || entry.data.releaseDate <= now);
}
