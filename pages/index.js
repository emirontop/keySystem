'use client';
import { useState } from 'react';

function generateRandomKey(length = 16) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for(let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function Home() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastKey, setLastKey] = useState('');

  async function handleAddKey() {
    setLoading(true);
    setLogs([]);

    const key = generateRandomKey();
    setLastKey(key);

    try {
      const res = await fetch('/api/addKey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
      });

      const data = await res.json();
      setLogs(data.logs || []);
    } catch (error) {
      setLogs([{ error: error.toString() }]);
    }

    setLoading(false);
  }

  return (
    <main style={{ padding: 20, maxWidth: 600, margin: "auto", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>Otomatik Key Ekleme Sistemi</h1>

      <button
        onClick={handleAddKey}
        disabled={loading}
        style={{
          padding: "10px 20px",
          fontSize: 16,
          cursor: loading ? "not-allowed" : "pointer",
          backgroundColor: loading ? "#999" : "#0070f3",
          color: "white",
          border: "none",
          borderRadius: 5,
          width: "100%",
          marginBottom: 15,
        }}
      >
        {loading ? "Key ekleniyor..." : "Yeni Key Oluştur ve Ekle"}
      </button>

      {lastKey && (
        <div style={{ marginBottom: 20, fontWeight: "bold" }}>
          Son Oluşturulan Key: <code>{lastKey}</code>
        </div>
      )}

      <div
        style={{
          whiteSpace: "pre-wrap",
          fontFamily: "monospace",
          maxHeight: 300,
          overflowY: "auto",
          background: "#f5f5f5",
          padding: 10,
          borderRadius: 6,
          border: "1px solid #ddd",
        }}
      >
        {logs.map((log, i) => (
          <div key={i}>{JSON.stringify(log)}</div>
        ))}
      </div>
    </main>
  );
}
