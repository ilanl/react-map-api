import React, { Component } from 'react';
import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
import { GOOGLE_MAP_API_KEY, GOOGLE_MAP_PROPS } from '../Constants';

const mapStyles = {
    width: '100%',
    height: '60vh',
};

class ItemsMap extends Component {
    static defaultProps = GOOGLE_MAP_PROPS;

    state = {
        showingInfoWindow: false,
        activeMarker: {},
        selectedPlace: {},
        tempMarker: {},
    };

    mapClicked = (mapProps, map, clickEvent) => {
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null,
            });
        } else {
            let lat = clickEvent.latLng.lat();
            let lng = clickEvent.latLng.lng();
            console.log('lat', lat, 'lng', lng);
            this.setState({
                ...this.state,
                tempMarker: { lat, lng },
            });
            this.props.onMapClick(this.state.tempMarker);
        }
    };

    onMarkerClick = (props, marker, e) => {
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true,
        });
    };

    onClose = () => {
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null,
            });
        }
    };

    render() {
        return (
            <Map
                onClick={this.mapClicked}
                google={this.props.google}
                zoom={GOOGLE_MAP_PROPS.zoom}
                style={mapStyles}
                initialCenter={GOOGLE_MAP_PROPS.center}
            >
                {this.state.tempMarker ? (
                    <Marker
                        key={'temp'}
                        id={'temp'}
                        position={{ lat: this.state.tempMarker.lat, lng: this.state.tempMarker.lng }}
                    />
                ) : null}

                {this.props.items.map(i => (
                    <Marker
                        onClick={this.onMarkerClick}
                        key={i.id}
                        id={i.id}
                        name={i.name}
                        position={{ lat: i.latitude, lng: i.longitude }}
                    />
                ))}
                <InfoWindow
                    marker={this.state.activeMarker}
                    visible={this.state.showingInfoWindow}
                    onClose={this.onClose}
                >
                    <div>
                        <h6>{this.state.selectedPlace.name}</h6>
                    </div>
                </InfoWindow>
            </Map>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: GOOGLE_MAP_API_KEY,
})(ItemsMap);
