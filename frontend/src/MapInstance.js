import ReactDOM from 'react-dom';
import React, { useEffect, useRef, Fragment } from 'react';
import { Map, APILoader, ScaleControl, ToolBarControl, ControlBarControl, Geolocation } from '@uiw/react-amap';

const MapInstance = () => (
    <div>
        <Map style={{ height: 968 }}>
            <ScaleControl offset={[16, 30]} position="LB" />
            <ToolBarControl offset={[16, 10]} position="RB" />
            <ControlBarControl offset={[16, 180]} position="RB" />
            <Geolocation
                maximumAge={100000}
                borderRadius="5px"
                position="RB"
                offset={[16, 80]}
                zoomToAccuracy={true}
                showCircle={true}
            />
        </Map>
    </div>
);

export default MapInstance;