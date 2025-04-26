'use client';

import React, { useState } from 'react';

const GenerateReportButton = (_props: { [key: string]: any }) => { // <<--- pakai props kalau mau
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleGenerateReport = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/laporans/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`✅ ${data.message || 'Berhasil.'}`);
      } else {
        setMessage(`❌ ${data.message || 'Gagal.'}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Server error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <button
        type="button"
        onClick={handleGenerateReport}
        disabled={loading}
        style={{
          padding: '8px 16px',
          backgroundColor: loading ? '#ccc' : '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Generating...' : 'Generate Laporan'}
      </button>

      {message && (
        <div style={{ marginTop: '0.5rem', color: message.startsWith('✅') ? 'green' : 'red' }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default GenerateReportButton;
