import { CollectionConfig } from 'payload';
import GenerateReportButton from '../components/GenerateReportButton'; // Import komponen tombol

export interface LaporanDetail {
    resident: string; // ID resident
    amount: number;
    status: 'pending' | 'processing' | 'completed';
  }
  
  export interface Laporan {
    id: string; // dari Payload (MongoDB ID)
    month: number;
    year: number;
    saldoBulanSebelumnya: number;
    totalResidents: number;
    completedPayments: number;
    processingPayments: number;
    pendingPayments: number;
    totalAmount: number;
    details: LaporanDetail[];
    createdAt: string; // timestamp dari Payload
    updatedAt: string; // timestamp dari Payload
  }
  
const Laporans: CollectionConfig = {
  slug: 'laporans',
  admin: {
    // components: {
    //     beforeListTable: [
    //         GenerateReportButton
    //       ]
          
    // },
  },
  
  fields: [
    {
      name: 'month',
      type: 'number',
    //   required: false,
    },
    {
      name: 'year',
      type: 'number',
    //   required: false,
    },      
    {
      name: 'saldoBulanSebelumnya',
      type: 'number',
    //   required: false,
      defaultValue: 0,
    },
    {
      name: 'totalResidents',
      type: 'number',
    //   required: false,
    },
    {
      name: 'completedPayments',
      type: 'number',
    //   required: false,
    },
    {
      name: 'processingPayments',
      type: 'number',
    //   required: false,
    },
    {
      name: 'pendingPayments',
      type: 'number',
    //   required: false,
    },
    {
      name: 'totalAmount',
      type: 'number',
    //   required: false,
    },
    {
      name: 'details',
      type: 'array',
      fields: [
        {
          name: 'resident',
          type: 'relationship',
          relationTo: 'residents' as const,
        },
        {
          name: 'amount',
          type: 'number',
        },
        {
          name: 'status',
          type: 'select',
          options: [
            { label: 'Pending', value: 'pending' },
            { label: 'Processing', value: 'processing' },
            { label: 'Completed', value: 'completed' },
          ],
        },
      ],
    },
  ],
  endpoints: [
    {
        path: '/generate-report',
        method: 'post',
        handler: async (req) => {
          const now = new Date();
          const month = now.getMonth() + 1;
          const year = now.getFullYear();
      
          console.log(`Generating report for month=${month}, year=${year}`);
      
          const payload = req.payload;
      
          // Cek apakah laporan untuk bulan ini sudah ada
          const existingReport = await payload.find({
            collection: 'laporans',
            where: {
              and: [
                { month: { equals: month } },
                { year: { equals: year } },
              ],
            },
          });
      
          if (existingReport.totalDocs > 0) {
            console.log('Laporan bulan ini sudah ada, tidak membuat baru.');
            return Response.json({
              message: 'Laporan bulan ini sudah ada, skip generate baru.',
            });
          }
      
          // Ambil saldo bulan sebelumnya
          let previousMonth = month - 1;
          let previousYear = year;
          if (previousMonth === 0) {
            previousMonth = 12;
            previousYear = year - 1;
          }
      
          let saldoBulanSebelumnya = 0;
          const lastLaporan = await payload.find({
            collection: 'laporans',
            limit: 1,
            where: {
              and: [
                { month: { equals: previousMonth } },
                { year: { equals: previousYear } },
              ],
            },
          });
      
        //   if (lastLaporan.totalDocs > 0) {
        //     saldoBulanSebelumnya = lastLaporan.docs[0].totalAmount;
        //   }
      
          // Ambil semua payments bulan ini
          const payments = await payload.find({
            collection: 'payment-schedules',
            limit: 1000,
            where: {
              and: [
                { month: { equals: month } },
                { year: { equals: year } },
              ],
            },
          });
      
          let totalAmount = 0;
          let completedPayments = 0;
          let pendingPayments = 0;
          let processingPayments = 0;
          
          const details = [];

          for (const payment of payments.docs) {
            const { amount, status, resident } = payment;

            console.log(payment)
          
            console.log(amount)
            if (status === 'completed') {
              completedPayments++;
              totalAmount += amount;
            } else if (status === 'processing') {
              processingPayments++;
            } else {
              pendingPayments++;
            }
          
            // Ambil hanya resident.id
            const residentId = typeof resident === 'object' && resident !== null ? resident.id : resident;
          
            details.push({
              resident: residentId, // <- hanya ID saja, bukan full object
              amount,
              status,
            });
          }
          
          console.log("ada di sni")

          const bulanString = String(month).padStart(2, '0'); // Format 01, 02, ..., 12
          const periode = `${bulanString}/${year}`;
          
            // BENAR-BENAR clone details
            const cleanedDetails = details.map((d) => ({
                resident: d.resident,
                amount: d.amount,
                status: d.status,
            }));
            
            const laporan = await payload.create({
                collection: 'laporans',
                data: {
                month,
                year,
                saldoBulanSebelumnya,
                totalResidents: payments.totalDocs,
                completedPayments,
                processingPayments,
                pendingPayments,
                totalAmount,
                details: cleanedDetails, // <-- PASTIKAN pakai hasil cleaning
                },
            });
  
      
        //   console.log(`Created report for month=${month}, year=${year}, laporanID=${laporan.id}`);
      
          return Response.json({
            message: 'Laporan berhasil dibuat',
          });
        },
      }
      
  ]
};

export default Laporans;
