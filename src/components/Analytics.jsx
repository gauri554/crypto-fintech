'use client';

import React from 'react';
import { useCRM } from '../hooks/useCRM';

export default function Analytics() {
    // Extract the live dashboard stats object using our custom shortcut key hook
    const { stats } = useCRM();

    // Clean inline styling configurations for our flex grid layout workspace
    const cardStyle = {
        flex: 1,
        padding: '20px',
        borderRadius: '10px',
        backgroundColor: '#1e293b',
        border: '1px solid #334155',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '5px'
    };

    return (
        <div style={{ display: 'flex', width: '100%', gap: '20px', marginBottom: '30px', boxSizing: 'border-box' }}>
            
            {/* Box 1: General Throughput Metric */}
            <div style={{ ...cardStyle, borderLeft: '5px solid #64748b' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#94a3b8', letterSpacing: '0.05em' }}>
                    TOTAL TICKETS TRIAGED
                </span>
                <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f8fafc' }}>
                    {stats.total}
                </span>
            </div>

            {/* Box 2: High Urgency Threat Flags Indicator */}
            <div style={{ ...cardStyle, borderLeft: '5px solid #f97316', backgroundColor: stats.alarms > 0 ? '#2c1e15' : '#1e293b' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#fdba74', letterSpacing: '0.05em' }}>
                    CRITICAL RISK ALARMS
                </span>
                <span style={{ fontSize: '2rem', fontWeight: 'bold', color: stats.alarms > 0 ? '#f97316' : '#f8fafc' }}>
                    {stats.alarms}
                </span>
            </div>

            {/* Box 3: Agentic Auto-Frozen Accounts Tracker */}
            <div style={{ 
                ...cardStyle, 
                borderLeft: '5px solid #ef4444', 
                backgroundColor: stats.locks > 0 ? '#2d1919' : '#1e293b',
                animation: stats.locks > 0 ? 'pulse 2s infinite' : 'none' 
            }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#fca5a5', letterSpacing: '0.05em' }}>
                    AUTOMATED WALLET LOCKS
                </span>
                <span style={{ fontSize: '2rem', fontWeight: 'bold', color: stats.locks > 0 ? '#ef4444' : '#f8fafc' }}>
                    {stats.locks}
                </span>
            </div>

        </div>
    );
}
