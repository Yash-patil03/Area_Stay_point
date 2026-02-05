// src/components/ConnectionStatus.js
import React, { useState, useEffect } from 'react';
import { testApiConnection, isOnline } from '../utils/networkUtils';

const ConnectionStatus = () => {
    const [connectionStatus, setConnectionStatus] = useState('checking');
    const [apiUrl, setApiUrl] = useState('');

    useEffect(() => {
        checkConnection();

        const handleOnline = () => checkConnection();
        const handleOffline = () => setConnectionStatus('offline');

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const checkConnection = async () => {
        if (!isOnline()) {
            setConnectionStatus('offline');
            return;
        }

        try {
            const workingUrl = await testApiConnection();
            setApiUrl(workingUrl);
            setConnectionStatus('online');
        } catch (error) {
            setConnectionStatus('api-error');
        }
    };

    if (connectionStatus === 'online') return null;

    const getStatusMessage = () => {
        switch (connectionStatus) {
            case 'checking':
                return { text: 'Checking connection...', color: '#ffc107', icon: '🔄' };
            case 'offline':
                return { text: 'No internet connection', color: '#dc3545', icon: '📡' };
            case 'api-error':
                return { text: 'Backend server not reachable', color: '#fd7e14', icon: '⚠️' };
            default:
                return { text: 'Connected', color: '#28a745', icon: '✅' };
        }
    };

    const status = getStatusMessage();

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: status.color,
            color: 'white',
            padding: '8px 16px',
            textAlign: 'center',
            zIndex: 9999,
            fontSize: '14px',
            fontWeight: 'bold'
        }}>
            {status.icon} {status.text}
            {connectionStatus === 'api-error' && (
                <button
                    onClick={checkConnection}
                    style={{
                        marginLeft: '10px',
                        padding: '4px 8px',
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        border: 'none',
                        borderRadius: '4px',
                        color: 'white',
                        cursor: 'pointer'
                    }}
                >
                    Retry
                </button>
            )}
        </div>
    );
};

export default ConnectionStatus;
