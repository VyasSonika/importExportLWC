import { LightningElement, track, api } from 'lwc';
import getDriverList from '@salesforce/apex/DriverController.getDriverList'
// datatable columns
// const cols = [
//     {label: 'Destination Name',fieldName: 'Destination_Name__c', type:'text', editable: true}, 
//     {label: 'Deatination Address',fieldName: 'Destination_Address__c', type:'address', editable: true},
//     {label: 'Range',fieldName: 'Range__c', type:'number', editable: true}, 
//     {label: 'Tags',fieldName: 'Tags__c', type:'text', editable: true}, 
// ];
export default class MyLocation extends LightningElement {
    // @track cols = cols;
    refreshTable
    @api records;
    isEdited = false;
    @api recordId;
    connectedCallback(){
        console.log(this.records)
    }
    onDoubleClickEdit() {
        this.isEdited = true;
    }

}