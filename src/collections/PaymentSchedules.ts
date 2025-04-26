import { CollectionConfig } from 'payload';


type GeneratePaymentsBody = {
  month: number ;
  year: number;
  amount: number;
};


const PaymentSchedules: CollectionConfig = {
  slug: 'payment-schedules',
  admin: {
    useAsTitle: 'resident',
  },
  fields: [
    {
      name: 'resident',
      type: 'relationship',
      relationTo: 'residents' as const,
      required: true,
    },
    {
      name: 'month',
      type: 'number',
      required: true,
    },
    {
      name: 'year',
      type: 'number',
      required: true,
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Processing', value: 'processing' },
        { label: 'Completed', value: 'completed' },
      ],
      defaultValue: 'pending',
      required: true,
    },
  ],
  endpoints: [
       {
        path: '/generate-payments',
        method: 'post',
        handler: async (req) => {
          const now = new Date();
          const month = now.getMonth() + 1; // getMonth() dari 0 (January = 0), jadi +1
          const year = now.getFullYear();
          const amount = 0; // Default amount

          console.log(`Generate payments for month=${month}, year=${year}, amount=${amount}`);
      
          const payload = req.payload;
    
          const residents = await payload.find({
            collection: 'residents',
            limit: 1000,
          });
  
          let createdCount = 0;
        let skippedCount = 0;

        for (const resident of residents.docs) {
          // Cek apakah sudah ada payment untuk resident ini, bulan, dan tahun
          const existingPayment = await payload.find({
            collection: 'payment-schedules',
            where: {
              and: [
                { resident: { equals: resident.id } },
                { month: { equals: month } },
                { year: { equals: year } },
              ],
            },
          });

          if (existingPayment.totalDocs > 0) {
            console.log(`Skip resident ${resident.id}, payment sudah ada`);
            skippedCount++;
            continue; // Lewati kalau sudah ada
          }

          await payload.create({
            collection: 'payment-schedules',
            data: {
              resident: resident.id,
              month,
              year,
              amount,
              status: 'pending',
            },
          });

          console.log(`Created payment for resident ${resident.id}`);
          createdCount++;
        }
      
          return Response.json({
            message: 'successfully updated tracking info',
          })
        },
      },
    ],
};

export default PaymentSchedules;
