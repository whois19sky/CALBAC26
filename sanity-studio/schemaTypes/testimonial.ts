export default {
  name: 'testimonial',
  title: 'Testimonials',
  type: 'document',
  fields: [
    { name: 'guestName', title: 'Guest Name', type: 'string', validation: (Rule: any) => Rule.required() },
    { name: 'origin', title: 'Origin (City, Country)', type: 'string' },
    { name: 'quote', title: 'Quote', type: 'text', validation: (Rule: any) => Rule.required() },
    { name: 'rating', title: 'Rating (1-5)', type: 'number', validation: (Rule: any) => Rule.required().min(1).max(5) },
    { name: 'reviewDate', title: 'Review Date', type: 'date', options: { dateFormat: 'YYYY-MM-DD' } },
    { name: 'isActive', title: 'Active (visible on site)', type: 'boolean', initialValue: true },
    { name: 'sortOrder', title: 'Sort Order', type: 'number' },
  ],
  preview: {
    select: { title: 'guestName', subtitle: 'quote' },
  },
};
