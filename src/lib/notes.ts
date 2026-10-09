import type { CollectionEntry } from 'astro:content';

const categoryLabels: Record<string, string> = {
  'data-structures': '数据结构',
  graph: '图论',
  dp: '动态规划',
  tools: '工具与写作',
  others: '其他笔记',
};

export const noteCategoryLabel = (category = 'others') => categoryLabels[category] ?? category;

/** A shared category order for the index and sidebar; new categories need no new routes. */
export function groupNotes(entries: CollectionEntry<'notes'>[]) {
  const groups = new Map<string, CollectionEntry<'notes'>[]>();
  for (const entry of entries) {
    const category = entry.data.category || 'others';
    const group = groups.get(category) ?? [];
    group.push(entry);
    groups.set(category, group);
  }
  return [...groups].map(([category, items]) => ({
    category,
    label: noteCategoryLabel(category),
    entries: [...items].sort((a, b) => a.data.title.localeCompare(b.data.title, 'zh-CN')),
  })).sort((a, b) => {
    if (a.category === b.category) return 0;
    if (a.category === 'others') return 1;
    if (b.category === 'others') return -1;
    return a.label.localeCompare(b.label, 'zh-CN');
  });
}
