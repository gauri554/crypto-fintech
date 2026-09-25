'use client';

import React from 'react';
import Analytics from '../components/Analytics';
import Form from '../components/Form';
import Display from '../components/Display';

export default function Home() {
  return (
    <div style={{ 
      maxWidth: '1280px', 
      margin: '0 auto', 
      padding: '40px 20px', 
      boxSizing: 'border-box',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      
      {/* Dashboard Top Header Title Block Section */}
      <header style={{ marginBottom: '30px', borderBottom: '1px solid #1e293b', paddingBottom: '20px' }}>
        <h1 style={{ margin: '0 0 5px 0', fontSize: '1.8rem', color: '#f8fafc', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
          🛡️ Risk-Management Support Portal
        </h1>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', fontWeight: '500' }}>
          Enterprise Full-Stack Triage Workspace • Unified AI & Compliance Pipeline
        </p>
      </header>

      {/* 📊 STEP 4 CORE BLOCK: The Live Scoreboard Panel Display Counter Row */}
      <Analytics />

      {/* The Master Flex Grid Columns Layer (Splits workspace into Left and Right Columns) */}
      <main style={{ 
        display: 'flex', 
        gap: '30px', 
        flexWrap: 'wrap', 
        width: '100%',
        flex: 1
      }}>
        
        {/* Left Column: Form User Input Controls (Occupies 5 columns equivalent size ratio) */}
        <section style={{ flex: '1 1 350px', minWidth: '320px' }}>
          <Form />
        </section>

        {/* Right Column: AI Live Response Execution Logs Display (Occupies 7 columns equivalent size ratio) */}
        <section style={{ flex: '1.5 1 450px', minWidth: '350px' }}>
          <Display />
        </section>

      </main>

      {/* Footer System Status Element */}
      <footer style={{ marginTop: '40px', borderTop: '1px solid #1e293b', paddingTop: '15px', textAlign: 'center', fontSize: '0.75rem', color: '#475569', fontFamily: 'monospace' }}>
        SECURE NODE CONNECTIONS TERMINAL ENGINE RUNNING • VER: 1.2.0-PROD
      </footer>

    </div>
  );
}
