export default {
  name: 'room',
  title: 'Rooms',
  type: 'document',
  fields: [
    { name: 'name', title: 'Room Name', type: 'string', validation: (Rule: any) => Rule.required() },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' }, validation: (Rule: any) => Rule.required() },
    { name: 'tagline', title: 'Tagline', type: 'string' },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'pricePerNight', title: 'Price per Night (₹)', type: 'number', validation: (Rule: any) => Rule.required().min(0) },
    { name: 'capacity', title: 'Capacity (Guests)', type: 'number', validation: (Rule: any) => Rule.required().min(1) },
    { name: 'features', title: 'Features', type: 'array', of: [{ type: 'string' }] },
    { name: 'images', title: 'Images', type: 'array', of: [{ type: 'image', options: { hotspot: true } }] },
    { name: 'isActive', title: 'Active (visible on site)', type: 'boolean', initialValue: true },
    { name: 'sortOrder', title: 'Sort Order', type: 'number' },
  ],
  orderings: [
    { title: 'Sort Order', name: 'sortOrderAsc', by: [{ field: 'sortOrder', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'name', subtitle: 'tagline', media: 'images.0' },
  },
};
