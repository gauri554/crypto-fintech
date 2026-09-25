'use client'; // Essential Next.js directive: Tells the app this file runs on the browser browser

import React, { createContext, useState } from 'react';

// 1. Create the blank context data vault instance
export const CRMContext = createContext(null);

// 2. Create the Provider shell that stores variables and shields the UI layout pages
export const CRMProvider = ({ children }) => {
    const [tickets, setTickets] = useState([]);
    const [activeTicket, setActiveTicket] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    // Dashboard scoreboards
    const [stats, setStats] = useState({
        total: 0,
        alarms: 0,
        locks: 0
    });

       // Unified asynchronous controller (REAL FULL-STACK VERSION CONNECTED TO NEXT.JS API)
    const processTicketPipeline = async (formData) => {
        setLoading(true);
        setErrorMsg(null);

        try {
            // 📡 Standard Next.js network call directly to your live API route.js file
            const response = await fetch('/api/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const outcome = await response.json();

            // Guardrail check: If the backend throws a 400 or 500 error, halt instantly
            if (!outcome.success) {
                throw new Error(outcome.error || "Internal processing block encountered.");
            }

            const freshData = outcome.payload; // Grab the newly created document directly from MongoDB

            // Update core state arrays cleanly
            setTickets((prev) => [freshData, ...prev]);
            setActiveTicket(freshData);

            // Dynamically increment analytical dashboard widget scores
            setStats((prev) => ({
                total: prev.total + 1,
                alarms: freshData.triageAnalysis.urgencyScore > 7 ? prev.alarms + 1 : prev.alarms,
                locks: freshData.systemState.ticketStatus === 'Frozen' ? prev.locks + 1 : prev.locks
            }));

        } catch (err) {
            console.error("handshake validation error:", err);
            setErrorMsg(err.message);
        } finally {
            setLoading(false);
        }
    };


    // Pack the variables up cleanly to share with any nested UI component window
    const contextValues = {
        tickets,
        activeTicket,
        loading,
        errorMsg,
        stats,
        processTicketPipeline,
        setActiveTicket
    };

    return (
        <CRMContext.Provider value={contextValues}>
            {children}
        </CRMContext.Provider>
    );
};
