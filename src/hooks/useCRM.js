'use client'; // Essential Next.js directive for custom client-side tools

import { useContext } from 'react';
import { CRMContext } from '../context/CRMContext';

export const useCRM = () => {
    // 1. Fetch the database data vault context variables
    const contextVault = useContext(CRMContext);
    
    // 2. Safety Check: If someone tries to run this hook in a component 
    // that isn't nested inside our <CRMProvider> wrapper layout, throw a helpful error.
    if (!contextVault) {
        throw new Error("useCRM hook must be executed exclusively inside a valid <CRMProvider> encapsulation shell.");
    }
    
    // 3. Return the universal key containing all state arrays and API methods
    return contextVault;
};
