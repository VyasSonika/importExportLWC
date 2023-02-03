import { LightningElement, api, wire, track } from 'lwc';

import getLocation from '@salesforce/apex/DriverController.getLocation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const LABEL_YOU_ARE_HERE = 'You are here!';
const ICON_STANDARD_USER = 'standard:user';

export default class MapLocation extends LightningElement {
    @api recordId;
    mapMarkers = [];
    isLoading = true;
    isRendered;
    latitude;
    longitude;
    @track markersTitle = 'Tavant Technologies';
    // @track zoomLevel = 15;
  
    // Add the wired method from the Apex Class
    // Name it getBoatsByLocation, and use latitude, longitude and boatTypeId
    // Handle the result and calls createMapMarkers
    @wire(getLocation, {latitude: '$latitude', longitude: '$longitude', recordId: '$recordId'})
    wiredGetLocation({error, data}) {
        if (data) {
            console.log('data:--', data);
            this.createMapMarkers(data);
        } else if (error) {
            const toast = new ShowToastEvent({
                title: error,
                message: error.message,
                variant: error,
            });
            this.dispatchEvent(toast);
        }
        this.isLoading = false;
    }
  
    // Controls the isRendered property
    // Calls getLocationFromBrowser()
    renderedCallback() {
        if (!this.isRendered) {
            console.log('isRendered inside if bloak');
            this.getLocationFromBrowser();
        }
        this.isRendered = true;
    }
  
    // Gets the location from the Browser
    // position => {latitude and longitude}
    getLocationFromBrowser() {
        console.log('inside getLocationFromBrowser:--', navigator.geolocation);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                console.log('position:--', position);
                this.latitude = position.coords.latitude;
                console.log('latitude:--', this.latitude);

                this.longitude = position.coords.longitude;
                console.log('longitude:--', this.longitude);

            });
        }
    }
  
    // Creates the map markers
    createMapMarkers(geoData) {
        console.log('geoData:--', geoData);
        const newMarkers = JSON.parse(geoData).map(data => {
            return {
                title: data.Name,
                location: {
                    Latitude: data.Location__Latitude__s,
                    Longitude: data.Location__Longitude__s
                }
            };
        });
        newMarkers.unshift({
            title: LABEL_YOU_ARE_HERE,
            icon: ICON_STANDARD_USER,
            location: {
                Latitude: this.latitude,
                Longitude: this.longitude
            }
        });
        this.mapMarkers = newMarkers;
        console.log('mapMarkers:--', this.mapMarkers);
    }
    handleLatitude(evt){
        let value = evt.target.value;
        console.log('value:--');
    }
    handleLongitude(evt){
        let value = evt.target.value;
        console.log('value11:--', value);
    }
    handleLocaClick(evt){
        console.log('handleLocaClick:-', evt)
    }
}