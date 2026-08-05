export default {
  name: 'blogPost',
  title: 'Blog Posts',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string', validation: (Rule: any) => Rule.required() },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: (Rule: any) => Rule.required() },
    { name: 'excerpt', title: 'Excerpt (SEO description)', type: 'text', rows: 2 },
    { name: 'coverImage', title: 'Cover Image', type: 'image', options: { hotspot: true } },
    { name: 'author', title: 'Author', type: 'string', initialValue: 'Calcutta Backpackers' },
    { name: 'category', title: 'Category', type: 'string' },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        { type: 'block' }, // rich text
        { type: 'image', options: { hotspot: true } }, // inline images
        {
          type: 'object',
          name: 'youtubeEmbed',
          title: 'YouTube Video',
          fields: [{ name: 'url', title: 'YouTube URL', type: 'url' }],
          preview: { select: { title: 'url' } },
        },
        {
          type: 'object',
          name: 'instagramEmbed',
          title: 'Instagram Post',
          fields: [{ name: 'url', title: 'Instagram URL', type: 'url' }],
          preview: { select: { title: 'url' } },
        },
      ],
    },
    { name: 'isPublished', title: 'Published', type: 'boolean', initialValue: false },
    { name: 'isPinned', title: 'Pin to Top (shows before newer posts, in a "Popular" section)', type: 'boolean', initialValue: false },
    { name: 'publishedAt', title: 'Published At', type: 'datetime' },
  ],
  preview: {
    select: { title: 'title', subtitle: 'category', media: 'coverImage' },
  },
};
