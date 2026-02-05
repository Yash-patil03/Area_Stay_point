import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '500px',
    borderRadius: '15px'
};

// Default center (Mumbai) - can be adjusted based on search results
const defaultCenter = {
    lat: 19.0760,
    lng: 72.8777
};

const libraries = ["places"];

const PGMap = ({ pgs, onPGSelect }) => {
    const [selectedPG, setSelectedPG] = useState(null);

    const center = pgs.length > 0 && pgs[0].latitude && pgs[0].longitude
        ? { lat: pgs[0].latitude, lng: pgs[0].longitude }
        : defaultCenter;

    return (
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY} libraries={libraries}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={12}
            >
                {pgs.map(pg => (
                    // Ensure lat/lng exist and are numbers
                    (pg.latitude && pg.longitude) && (
                        <Marker
                            key={pg.pgId}
                            position={{ lat: Number(pg.latitude), lng: Number(pg.longitude) }}
                            onClick={() => setSelectedPG(pg)}
                            title={pg.name}
                        />
                    )
                ))}

                {selectedPG && (
                    <InfoWindow
                        position={{ lat: Number(selectedPG.latitude), lng: Number(selectedPG.longitude) }}
                        onCloseClick={() => setSelectedPG(null)}
                    >
                        <div style={{ color: 'black', padding: '5px' }}>
                            <h6 style={{ margin: '0 0 5px 0' }}>{selectedPG.name}</h6>
                            <p style={{ margin: '0 0 5px 0', fontSize: '12px' }}>{selectedPG.address}</p>
                            <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>₹{selectedPG.rent}/month</p>
                            <button
                                style={{
                                    background: '#667eea',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    padding: '4px 8px',
                                    cursor: 'pointer',
                                    fontSize: '12px'
                                }}
                                onClick={() => {
                                    if (onPGSelect) onPGSelect(pg.pgId);
                                    // Also navigate? The parent can handle this.
                                }}
                            >
                                View Details
                            </button>
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </LoadScript>
    );
};

export default React.memo(PGMap);
