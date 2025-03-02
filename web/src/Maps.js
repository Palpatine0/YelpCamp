import {useState, useEffect} from "react";
import GoogleMapReact from "google-map-react";

const Maps = ({latlng, zoom, moveable = false, onclick = undefined}) => {
    const [key] = useState("AIzaSyBOgNYVvSb-WEy2KmtlFbP2rQSsX2SbANk");
    const [inLatLng, setLatLng] = useState(latlng)
    const [inZoom, setZoom] = useState(zoom)

    //update
    useEffect(() => {
        setLatLng(latlng);
    }, [latlng]);

    const handelOnClick = ({x, y, lat, lng, event}) => {
        if (moveable) {
            setLatLng({lat: lat, lng: lng})
        }
        if (onclick){
            onclick(lat,lng)
        }
    }


    return (
        <div style={{height: '300px'}}>
            <GoogleMapReact
                onClick={handelOnClick}
                bootstrapURLKeys={{key}}
                center={inLatLng}
                defaultZoom={inZoom}
            >
                <MapPoingComponent
                    lat={inLatLng.lat}
                    lng={inLatLng.lng}
                />
            </GoogleMapReact>
        </div>
    );
}


const MapPoingComponent = () => {
    const markerStyle = {
        border: '1px solid white',
        borderRadius: '50%',
        height: 10,
        width: 10,
        backgroundColor: 'red',
        cursor: 'pointer',
        zIndex: 10,
    };
    return (
        <div style={markerStyle}/>
    );
}


export default Maps