import { CollectionConfig } from 'payload';

const Expenses: CollectionConfig = {
  slug: 'expenses',
  admin: {
    useAsTitle: 'description',
  },
  fields: [
    {
      name: 'date',
      type: 'date',
      required: true,
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Operational', value: 'operational' },
        { label: 'Event', value: 'event' },
        { label: 'Repair', value: 'repair' },
        { label: 'Electricity', value: 'electricity' },
        { label: 'Other', value: 'other' },
      ],
      required: true,
    },
    {
      name: 'description',
      type: 'text',
    },
  ],
};

export default Expenses;
