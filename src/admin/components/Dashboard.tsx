'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@payloadcms/ui/components';

const DashboardKas: React.FC = () => {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const month = new Date().getMonth() + 1;
        const year = new Date().getFullYear();
        const response = await fetch(`/api/monthly-report?month=${month}&year=${year}`);
        const data = await response.json();
        setReport(data);
      } catch (error) {
        console.error('Gagal mengambil laporan:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  if (loading) return <p>Memuat laporan...</p>;
  if (!report) return <p>Data laporan tidak tersedia.</p>;

  return (
    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      <Card>
        <CardContent>
          <h3>Total Pemasukan Manual</h3>
          <p>Rp {report.totalIncome.toLocaleString('id-ID')}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h3>Total Pembayaran Warga (Paid)</h3>
          <p>Rp {report.totalPaid.toLocaleString('id-ID')}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h3>Total Pending Pembayaran</h3>
          <p>Rp {report.totalPending.toLocaleString('id-ID')}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h3>Saldo Kas Bulan Ini</h3>
          <p>Rp {report.balance.toLocaleString('id-ID')}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardKas;
