'use client';

import React from 'react';
import { useCRM } from '../hooks/useCRM';

export default function Display() {
    // Subscribe to the active ticket data context state nodes
    const { activeTicket, loading } = useCRM();

    // Reusable styling layouts for diagnostic fields
    const indicatorBoxStyle = {
        flex: 1,
        padding: '12px',
        backgroundColor: '#0f172a',
        borderRadius: '6px',
        border: '1px solid #334155',
        textAlign: 'center'
    };

    // Render loading shadow template block if the AI is actively running calculation loops
    if (loading) {
        return (
            <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', padding: '30px', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '300px', boxSizing: 'border-box' }}>
                <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                    <div style={{ width: '40px', height: '40px', border: '4px solid #334155', borderTop: '4px solid #3563eb', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 15px auto' }}></div>
                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                    <p style={{ margin: 0, fontWeight: 'bold', fontSize: '0.95rem', letterSpacing: '0.05em' }}>COMPILING RAG SECURITY CONTEXT ARRAYS...</p>
                </div>
            </div>
        );
    }

    // Default standby template view if the agent hasn't committed a form package yet
    if (!activeTicket) {
        return (
            <div style={{ backgroundColor: '#1e293b', border: '1px dashed #334155', padding: '30px', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '300px', color: '#64748b', boxSizing: 'border-box' }}>
                <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: '500' }}>📡 Standby Mode: Commit an operational ticket to instantiate the AI triage engine.</p>
            </div>
        );
    }

    // Safely destructure verified pipeline parameters from the live MongoDB tracking row
    const { triageAnalysis, aiDraftedReply, systemState } = activeTicket;
    const isFrozen = systemState?.ticketStatus === 'Frozen';

    return (
        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <h3 style={{ margin: '0', fontSize: '1.2rem', color: '#f8fafc', borderBottom: '1px solid #334155', paddingBottom: '10px', display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
                <span>✨ Operational Intelligence Metrics</span>
            </h3>

            {/* AI Multi-Categorization Tag Cards Panel Row */}
            <div style={{ display: 'flex', gap: '15px' }}>
                <div style={indicatorBoxStyle}>
                    <small style={{ color: '#94a3b8', display: 'block', fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '4px' }}>SENTIMENT</small>
                    <strong style={{ color: triageAnalysis?.detectedSentiment?.includes('Panic') ? '#ef4444' : '#f8fafc', fontSize: '0.95rem' }}>
                        {triageAnalysis?.detectedSentiment || 'N/A'}
                    </strong>
                </div>
                <div style={indicatorBoxStyle}>
                    <small style={{ color: '#94a3b8', display: 'block', fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '4px' }}>TRIAGE LABEL</small>
                    <strong style={{ color: '#3b82f6', fontSize: '0.95rem' }}>{triageAnalysis?.assignedCategory || 'N/A'}</strong>
                </div>
                <div style={{ ...indicatorBoxStyle, border: isFrozen ? '1px solid #ef4444' : '1px solid #334155', backgroundColor: isFrozen ? '#2d1919' : '#0f172a' }}>
                    <small style={{ color: isFrozen ? '#fca5a5' : '#94a3b8', display: 'block', fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '4px' }}>SECURITY STATE</small>
                    <strong style={{ color: isFrozen ? '#ef4444' : '#22c55e', fontSize: '0.95rem' }}>
                        {isFrozen ? '🔒 ASSETS FROZEN' : '🔓 OPERATIONAL'}
                    </strong>
                </div>
            </div>

            {/* Risk Urgency Score Gradient Meter Display */}
            <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '6px', border: '1px solid #334155' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 'bold', color: '#94a3b8', marginBottom: '8px' }}>
                    <span>CRITICAL RISK THREAT RATING</span>
                    <span style={{ color: triageAnalysis?.urgencyScore > 7 ? '#f97316' : '#94a3b8' }}>{triageAnalysis?.urgencyScore || 0} / 10</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: '#334155', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${(triageAnalysis?.urgencyScore || 0) * 10}%`, height: '100%', backgroundColor: triageAnalysis?.urgencyScore > 7 ? '#ef4444' : triageAnalysis?.urgencyScore > 4 ? '#f97316' : '#22c55e', transition: 'width 0.5s ease-out' }}></div>
                </div>
            </div>

            {/* RAG Core Output Mail Drafting Window view */}
            <div style={{ flex: 1, backgroundColor: '#0f172a', padding: '20px', borderRadius: '8px', border: '1px solid #334155', overflowY: 'auto' }}>
                <h4 style={{ margin: '0 0 12px 0', color: '#38bdf8', fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '0.05em' }}>📜 RAG-VERIFIED RECOVERY COMPLIANCE DRAFT:</h4>
                <p style={{ margin: '0', color: '#cbd5e1', lineHeight: '1.6', fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>
                    {aiDraftedReply}
                </p>
            </div>

            {/* Backend Logging Event Automation Log Trail */}
            <div style={{ backgroundColor: '#090d16', padding: '12px', borderRadius: '6px', border: '1px solid #1e293b', fontFamily: 'monospace', fontSize: '0.75rem', color: '#64748b' }}>
                <span style={{ color: '#22c55e', marginRight: '5px' }}>&gt;</span> [AUTOMATION TRAIL]: {systemState?.executedToolsLog?.length > 0 
                    ? `Successfully invoked tool action [${systemState.executedToolsLog.join(', ')}] on MongoDB instance cluster nodes.` 
                    : 'System monitoring active. Zero state mutations injected.'}
            </div>

        </div>
    );
}
