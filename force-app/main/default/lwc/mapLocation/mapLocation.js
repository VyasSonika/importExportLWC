import { LightningElement, api, wire, track } from 'lwc';

import getLocation from '@salesforce/apex/DriverController.getLocation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

let newMapMaker;
export default class MapLocation extends LightningElement {
    @api recordId;
    @api records;
    @track address =[];
    latitude;
    longitude;
    isLoad = false;
    @track mapMarkers= [];
    @track newMapMarkers= [];
    selectedMarkerValue;
    isRendered;
    inputFrom;
    inputTo;
    locationName = 'Hello world'
    connectedCallback(){
        console.log('from connected call back:-', JSON.parse(JSON.stringify(this.records)));
        this.records = JSON.parse(JSON.stringify(this.records))
        this.records.forEach(ele => {
            this.address.push({label: ele.Address, value: ele.Address});
            // return this.address;
        });
        console.log('options:--', this.address);
    }
    handleChangeFrom(evt){
        console.log('evt of change:-', evt.target.value);
        this.inputFrom = evt.target.value;
        // console.log('value handleLatitude:- ', this.inputFrom);
        // let arrValue = [];
        // arrValue = this.inputFrom.split(',');
        // console.log('separeted value from comma', arrValue);
        // for(let i = 0; i < arrValue.length; i++){
        //     newMapMaker =[
        //         {
        //             location: {
        //                 // Location Information
        //                 Country: arrValue[0],
        //                 Street: arrValue[1],
        //                 City: arrValue[2],
        //                 State: arrValue[3],
        //                 PostalCode: arrValue[4],
        //             },
        //             // For onmarkerselect
        //             value: arrValue[0] + '' + arrValue[2] + '' + arrValue[3],
    
        //             // Extra info for tile in list & info window
        //             icon: 'standard:account',
        //             title: 'Welcome', // e.g. Account.Name
        //             description: 'City name on Map',
        //         }
        //     ]
        // }
        // this.selectedMarkerValue = arrValue[0] + '' + arrValue[1] + '' + arrValue[2];
        // console.log('newMApLocation:-', newMapMaker);
        // this.newMapMarkers = newMapMaker;
    }
    handleChangeTo(evt){
        console.log('evt of change:-', evt.target.value);
        this.inputTo = evt.target.value;
        console.log('value handleLatitude:- ', this.inputTo);
    }
    // renderedCallback() {
    //     if (!this.isRendered) {
    //         console.log('isRendered:-');
    //         this.getLocationFromBrowser();
    //     }
    //     this.isRendered = true;
    // }
    handleAddressSearchLoc(){
        this.isLoad = true;
        // this.handleAddressSearch(this.mapMarkers);
        console.log('value handleAddressSearchLoc:- ', this.inputFrom);
        let arrValue = [];
        let arrValueTO = [];
        if(this.inputFrom != undefined){
            arrValue = this.inputFrom.split(',');
        }
        if(this.inputTo != undefined){
            arrValueTO = this.inputTo.split(',');
        }
        console.log('arrValue:--', arrValue);
        console.log('arrValueTO', arrValueTO);
        console.log('separeted value from comma', arrValue);
            newMapMaker =[
                {
                    location: {
                        // Location Information
                        Country: arrValue[0],
                        Street: arrValue[1],
                        City: arrValue[2],
                        State: arrValue[3],
                        PostalCode: arrValue[4],
                    },
                    // For onmarkerselect
                    value: arrValue[0] + '' + arrValue[2] + '' + arrValue[3],
    
                    // Extra info for tile in list & info window
                    icon: 'standard:account',
                    title: 'From', // e.g. Account.Name
                    description: 'City name on Map',
                },
                {
                    location: {
                        // Location Information
                        Country: arrValueTO[0],
                        Street: arrValueTO[1],
                        City: arrValueTO[2],
                        State: arrValueTO[3],
                        PostalCode: arrValueTO[4],
                    },
                    // For onmarkerselect
                    value: arrValueTO[0] + '' + arrValueTO[2] + '' + arrValueTO[3],
    
                    // Extra info for tile in list & info window
                    icon: 'standard:account',
                    title: 'TO', // e.g. Account.Name
                    description: 'Destination',
                },
            ]
        // this.selectedMarkerValue = arrValue[0] + '' + arrValue[1] + '' + arrValue[2];
        console.log('newMApLocation:-', newMapMaker);
        this.newMapMarkers = newMapMaker;
    
    }
    handleMarkerSelect(event) {
        this.selectedMarkerValue = event.target.selectedMarkerValue;
        console.log('selectedMarkerValue:--', this.selectedMarkerValue);
    }
    // getLocationFromBrowser() {
    //     if (navigator.geolocation) {
    //         console.log('navigator geoloaction:--', navigator.geolocation)
    //         navigator.geolocation.getCurrentPosition(position => {
    //             console.log('position:-', position);
    //             this.latitude = position.coords.latitude;
    //             console.log('latitude:-', this.latitude);

    //             this.longitude = position.coords.longitude;
    //             console.log('longitude:-', this.longitude);

    //         });
    //     }
    // }
    // handleAddressSearch(geoData){
    //     console.log('map data:-', geoData);
    //     const newMarkers = [{
    //         title: geoData.Name,
    //         location: {
    //             Latitude: this.latitude,
    //             Longitude: this.longitude
    //         },
    //         icon: 'standard:account',
    //         title: 'GetOnCrm Sotution',
    //         value: this.selectedMarkerValue,
    //         description: 'This is a my current location'

    //     }];
    //     this.newMapMarkers = newMarkers;
    //     console.log('newMarkers:--', newMarkers);
    //     let geocoder  = new google.maps.Geocoder();       
    //     console.log('geocoder', geocoder);      // create a geocoder object
    //     let location  = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);  
    //     console.log('location', location);      // create a geocoder object
    //      // turn coordinates into an object          
    //     geocoder.geocode({'latLng': location}, function (results, status) {
    //         if(status == google.maps.GeocoderStatus.OK) {           // if geocode success
    //             let add=results[0].formatted_address;         // if address found, pass to processing function
    //             console.log('add:--', add);      // create a geocoder object

    //         }
    //     })
    // }
   
}