export default {
  name: 'experience',
  title: 'Experiences (WanderXP)',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string', validation: (Rule: any) => Rule.required() },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: (Rule: any) => Rule.required() },
    { name: 'category', title: 'Category', type: 'string' },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
    { name: 'price', title: 'Price (₹, 0 = free)', type: 'number' },
    { name: 'duration', title: 'Duration', type: 'string' },
    { name: 'sortOrder', title: 'Sort Order', type: 'number' },
  ],
  preview: {
    select: { title: 'title', subtitle: 'category', media: 'image' },
  },
};
