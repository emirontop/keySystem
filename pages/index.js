'use client';
import { useState } from 'react';

export default function Home() {
  const [key, setKey] = useState('');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit() {
    if (!key.trim()) {
      alert("Lütfen geçerli bir key girin.");
      return;
    }
    setLoading(true);
    setLogs([]);
    setSuccess(false);

    try {
      const res = await fetch('/api/addKey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
      });

      const data = await res.json();
      setLogs(data.logs || []);
      setSuccess(data.success);
    } catch (error) {
      setLogs([{ error: error.toString() }]);
      setSuccess(false);
    }
    setLoading(false);
  }

  return (
    <main style={{ padding: 20, maxWidth: 600, margin: "auto", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>Key Ekleme Sistemi</h1>
      <input
        type="text"
        placeholder="Yeni key girin"
        value={key}
        onChange={e => setKey(e.target.value.toUpperCase())}
        style={{
          width: "100%",
          padding: "10px",
          fontSize: 16,
          marginBottom: 10,
          borderRadius: 5,
          border: "1px solid #ccc",
          boxSizing: "border-box"
        }}
      />
      <button
        onClick={handleSubmit}
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
        }}
      >
        {loading ? "Gönderiliyor..." : "Key Ekle"}
      </button>

      <div
        style={{
          marginTop: 20,
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

      {success && (
        <div style={{ marginTop: 20, color: "green", fontWeight: "bold", textAlign: "center" }}>
          Key başarıyla eklendi!
        </div>
      )}
    </main>
  );
                 }
