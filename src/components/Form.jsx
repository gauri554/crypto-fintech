'use client';

import React, { useState } from 'react';
import { useCRM } from '../hooks/useCRM';

export default function Form() {
    // 1. Local component input field trackers
    const [email, setEmail] = useState('');
    const [wallet, setWallet] = useState('');
    const [message, setMessage] = useState('');
    const [localValidationError, setLocalValidationError] = useState('');

    // 2. Fetch the state context execution bindings
    const { loading, errorMsg, processTicketPipeline } = useCRM();

    // 3. Form submission validation orchestrator
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalValidationError('');

        // Basic sanity validation check (Industry standard pattern)
        if (!email.trim() || !wallet.trim() || !message.trim()) {
            setLocalValidationError('Operational Fault: All input vectors must be populated.');
            return;
        }

        // Validate basic Ethereum/Bitcoin hex layout style rule (Looks smart in interviews!)
        if (!wallet.startsWith('0x') && wallet.length < 10) {
            setLocalValidationError('Invalid Argument: Public key must be a valid cryptographic node string.');
            return;
        }

        // Package payload data and pass it straight to the Global Data Vault pipeline
        await processTicketPipeline({
            customerEmail: email,
            walletAddress: wallet,
            messageText: message
        });

        // Clean form states only if the system completes with zero exceptions
        if (!errorMsg) {
            setMessage('');
        }
    };

    // Styling configurations
    const labelStyle = { display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#94a3b8', marginBottom: '5px' };
    const inputStyle = { width: '100%', padding: '12px', boxSizing: 'border-box', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#f8fafc', fontSize: '0.95rem', outline: 'none' };

    return (
        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '1.2rem', color: '#f8fafc', borderBottom: '1px solid #334155', paddingBottom: '10px' }}>
                📥 Queue Entry Ingestion
            </h3>

            {/* Render local or global error alerts safely */}
            {(localValidationError || errorMsg) && (
                <div style={{ backgroundColor: '#451a1a', borderLeft: '4px solid #ef4444', padding: '12px', borderRadius: '4px', marginBottom: '15px', fontSize: '0.85rem', color: '#fca5a5' }}>
                    {localValidationError || errorMsg}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                    <label style={labelStyle}>Client Email Address</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="client@exchange.com" style={inputStyle} disabled={loading} />
                </div>

                <div>
                    <label style={labelStyle}>Public Cryptographic Wallet Address</label>
                    <input type="text" value={wallet} onChange={e => setWallet(e.target.value)} placeholder="0x71C25227d82D3A..." style={inputStyle} disabled={loading} />
                </div>

                <div>
                    <label style={labelStyle}>Operational Ticket Issue Details</label>
                    <textarea rows="4" suppressHydrationWarning={true} value={message} onChange={e => setMessage(e.target.value)} placeholder="Describe the stuck transaction hash or security incident narrative..." style={{ ...inputStyle, resize: 'vertical', fontFamily: 'sans-serif' }} disabled={loading} />
                </div>

                <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', backgroundColor: loading ? '#475569' : '#2563eb', color: '#ffffff', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '1rem', transition: 'background-color 0.2s' }}>
                    {loading ? 'Analyzing Threats via RAG Pipeline...' : 'Commit Ticket to Engine Cluster'}
                </button>
            </form>
        </div>
    );
}
