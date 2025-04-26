// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import Residents from './collections/Residents'
import Incomes from './collections/Incomes'
import Expenses from './collections/Expenses'
import PaymentSchedules from './collections/PaymentSchedules'
import Laporans from './collections/Laporans'


const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

type GeneratePaymentsBody = {
  month: number ;
  year: number;
  amount: number;
};


export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    PaymentSchedules,
    Incomes,
    Expenses,
    Residents,
    Laporans,
    Users,

  ],
  endpoints:[
     {
      path: '/api/payment-schedules/generate-payments',
      method: 'post',
      handler: async (req) => {
        const body = req.json as unknown;
        const { month, year, amount } = body as GeneratePaymentsBody;
    
        const payload = req.payload;
  
        const residents = await payload.find({
          collection: 'residents',
          limit: 1000,
        });

        const createPayments = residents.docs.map((resident: { id: string }) => {
          return payload.create({
            collection: 'payment-schedules',
            data: {
              resident: resident.id,
              month,
              year,
              amount,
              status: 'pending',
            },
          });
        });
    
        await Promise.all(createPayments);
    
        return Response.json({
          message: 'successfully updated tracking info',
        })
      },
    },
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
})
