"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [token, setToken] = useState("");
  const [connected, setConnected] = useState(false);
  const [balance, setBalance] = useState(0);
  const [currency, setCurrency] = useState("USD");
  const [bot, setBot] = useState("MV RIVEN - Under 7");
  const [ativo, setAtivo] = useState("frxXAUUSD");
  const [stake, setStake] = useState("0.35");
  const [status, setStatus] = useState("Aguardando conexão...");
  const ws = useRef(null);

  // CONECTAR NA DERIV
  const connectDeriv = () => {
    const tokenLimpo = token.trim();
    if (!tokenLimpo) return alert("⚠️ Cola o token primeiro");

    setStatus("Conectando...");
    ws.current = new WebSocket(`wss://ws.derivws.com/websockets/v3?app_id=1089`);

    ws.current.onopen = () => {
      ws.current.send(JSON.stringify({ authorize: tokenLimpo }));
    };

    ws.current.onmessage = (msg) => {
      const data = JSON.parse(msg.data);

      if (data.error) {
        alert("❌ Token inválido: " + data.error.message);
        setStatus("Erro na conexão");
        return;
      }

      if (data.authorize) {
        setConnected(true);
        setStatus("Conectado ✅");
        getBalance();
      }
      
      if (data.balance) {
        setBalance(data.balance);
        setCurrency(data.balance.currency);
      }
    };

    ws.current.onclose = () => {
      setConnected(false);
      setStatus("Desconectado");
    };
  };

  // PEGAR SALDO
  const getBalance = () => {
    if (ws.current) {
      ws.current.send(JSON.stringify({ balance: 1, subscribe: 1 }));
    }
  };

  // DESCONECTAR
  const disconnect = () => {
    if (ws.current) ws.current.close();
    setConnected(false);
    setStatus("Desconectado");
  };

  // INICIAR BOT
  const startBot = () => {
    if (!connected) return alert("⚠️ Conecta na Deriv primeiro");
    
    const stakeFinal = parseFloat(stake.replace(",", "."));
    if (isNaN(stakeFinal) || stakeFinal <= 0) return alert("⚠️ Stake inválido. Use ponto . ex: 0.35");
    
    alert(`🤖 Bot ${bot} iniciado!\nAtivo: ${ativo}\nStake: $${stakeFinal}`);
    setStatus("Analisando mercado...");
  };

  return (
    <div style={{ background: "#0a0a0a", color: "#fff", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      <div style={{ background: "#00ff88", color: "#000", padding: 15, textAlign: "center", fontWeight: "bold", fontSize: 18 }}>
        MV INVESTIMENTO
      </div>

      <div style={{ padding: 20, maxWidth: 500, margin: "0 auto" }}>
        
        {/* CONEXÃO */}
        <div style={{ background: "#111", padding: 15, borderRadius: 10, marginBottom: 20, border: "1px solid #333" }}>
          <h3 style={{ marginTop: 0 }}>Conexão Deriv</h3>
          <label>Token da API:</label>
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Cole seu token aqui"
            style={{ width: "100%", padding: 10, marginTop: 5, background: "#222", color: "#fff", border: "1px solid #444", borderRadius: 5, boxSizing: "border-box" }}
          />
          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            <button onClick={connectDeriv} disabled={connected} style={{ flex: 1, padding: 12, background: connected ? "#555" : "#00ff88", color: "#000", border: "none", borderRadius: 5, fontWeight: "bold", cursor: "pointer" }}>
              Conectar
            </button>
            <button onClick={disconnect} disabled={!connected} style={{ flex: 1, padding: 12, background: connected ? "red" : "#555", color: "#fff", border: "none", borderRadius: 5, fontWeight: "bold", cursor: "pointer" }}>
              Desconectar
            </button>
          </div>
          <p style={{ marginTop: 10 }}>Status: <span style={{ color: connected ? "#00ff88" : "yellow", fontWeight: "bold" }}>{status}</span></p>
          {connected && <p>Saldo: <b style={{ color: "#00ff88" }}>{currency} {balance.toFixed(2)}</b></p>}
        </div>

        {/* CONFIGURAÇÕES */}
        <div style={{ background: "#111", padding: 15, borderRadius: 10, border: "1px solid #333" }}>
          <h3 style={{ marginTop: 0 }}>Configurações do Bot</h3>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label>Moeda</label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} style={{ width: "100%", padding: 8, marginTop: 5, background: "#222", color: "#fff", border: "1px solid #444" }}>
                <option>USD</option>
                <option>EUR</option>
              </select>
            </div>
            <div>
              <label>Bots</label>
              <select value={bot} onChange={(e) => setBot(e.target.value)} style={{ width: "100%", padding: 8, marginTop: 5, background: "#222", color: "#fff", border: "1px solid #444" }}>
                <option>MV RIVEN - Under 7</option>
                <option>MV ANA - Over 6</option>
                <option>MV CRIPTON</option>
              </select>
            </div>
          </div>

          <p style={{ marginTop: 10, fontSize: 12, color: "#aaa" }}>Ganha com dígitos abaixo de 7</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
            <div>
              <label>Ativo</label>
              <select value={ativo} onChange={(e) => setAtivo(e.target.value)} style={{ width: "100%", padding: 8, marginTop: 5, background: "#222", color: "#fff", border: "1px solid #444" }}>
                <option value="frxXAUUSD">Volatility 100</option>
                <option value="frxEURUSD">Volatility 75</option>
                <option value="frxGBPUSD">Volatility 50</option>
              </select>
            </div>
            <div>
              <label>Stake</label>
              <input
                type="text"
                value={stake}
                onChange={(e) => setStake(e.target.value)}
                placeholder="0.35"
                style={{ width: "100%", padding: 8, marginTop: 5, background: "#222", color: "#fff", border: "1px solid #444" }}
              />
            </div>
          </div>
          <small style={{ color: "yellow", fontSize: 11 }}>Dica: Use ponto . e não vírgula ,</small>

          <button onClick={startBot} style={{ width: "100%", padding: 15, marginTop: 20, background: "#00ff88", color: "#000", border: "none", borderRadius: 5, fontWeight: "bold", fontSize: 16, cursor: "pointer" }}>
            INICIAR BOT
          </button>
        </div>
      </div>
    </div>
  );
}
