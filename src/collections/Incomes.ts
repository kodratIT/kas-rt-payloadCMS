import { CollectionConfig } from 'payload';

const Incomes: CollectionConfig = {
  slug: 'incomes',
  admin: {
    useAsTitle: 'description',
  },
  fields: [
    { name: 'date', type: 'date', required: true },
    { name: 'amount', type: 'number', required: true },
    { name: 'description', type: 'text' },
  ],
};

export default Incomes;
