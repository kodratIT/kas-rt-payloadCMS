import { CollectionConfig } from 'payload';

const Residents: CollectionConfig = {
  slug: 'residents',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'address',
      type: 'text',
    },
    {
      name: 'phone',
      type: 'text',
    },
  ],
};

export default Residents;
