import { LightningElement, track, api, wire } from 'lwc';
import getDriverList from '@salesforce/apex/DriverController.getDriverList';
import { refreshApex } from '@salesforce/apex';
//import updateRecord from '@salesforce/apex/DriverController.updateRecord';
import { ShowToastEvent} from 'lightning/platformShowToastEvent'
import { updateRecord } from 'lightning/uiRecordApi';

// datatable columns
// const cols = [
//     {label: 'Destination Name',fieldName: 'Destination_Name__c', type:'text', editable: true}, 
//     {label: 'Deatination Address',fieldName: 'Destination_Address__c', type:'address', editable: true},
//     {label: 'Range',fieldName: 'Range__c', type:'number', editable: true}, 
//     {label: 'Tags',fieldName: 'Tags__c', type:'text', editable: true}, 
// ];
let records;
export default class MyLocation extends LightningElement {
    // @track cols = cols;
    refreshTable
    @api records=[];
    isEdited;
    @track element =[];
    @track fields = [];
    // @wire(getDriverList)
    // wiredDriver(result){
    //     this.refreshTable = result; 
    //     const { error, data } = result;
    //     if(data){ 
    //         console.log('data', data);
    //         this.records = data;
    //         let record12 = JSON.parse(JSON.stringify(data));
    //         record12.Address= {};
    //         // console.log(record12);
    //         this.records = record12;
    //         this.records = record12.map((r)=>{
    //                 r.Address = r.Destination_Address__c.countryCode+ ', ' + r.Destination_Address__c.street + ', '+
    //                 r.Destination_Address__c.city + ', '+ r.Destination_Address__c.stateCode + ', ' +
    //                 r.Destination_Address__c.postalCode;
    //                 this.desName = r.Name;
    //                 this.range = r.Range__c;
    //                 this.tag = r.Tags__c;
    //                 this.desAddress = r.Address;
    //                 r.IsEdited = false;
    //                 this.isEdited = r.IsEdited;
    //                 return r;
    //         })
    //         console.log('records myLocation', this.records);
    //         console.log('isEdited:', this.isEdited);
    //     }
    //     if(error){
    //         console.error(error)
    //     }
    // }
    connectedCallback(){
        console.log('records comes from parent', this.records);
        let data = JSON.parse(JSON.stringify(this.records));
        data.Address ={};
        this.records = data.map(r=>{
        r.Address = r.Destination_Address__c.countryCode+ ', ' + r.Destination_Address__c.street + ', '+
                r.Destination_Address__c.city + ', '+ r.Destination_Address__c.stateCode + ', ' +
                r.Destination_Address__c.postalCode;
                this.desName = r.Name;
                this.range = r.Range__c;
                this.tag = r.Tags__c;
                this.desAddress = r.Address;
                r.IsEdited = false;
                this.isEdited = r.IsEdited;
                return r;
        });
        console.log('records myLocation', this.records);
        console.log('isEdited:', this.isEdited);
    }
    onDoubleClickEdit(e){
        let editedId = e.currentTarget.dataset.id;
        // this.recordId = editedId;
        console.log('recordId:', editedId);
        records = this.records;
        records.map(item =>{
           
            if(editedId == item.Id){
                item.IsEdited = true;
            }else{
                item.IsEdited = false;
            }
        })
        //console.log('change value', e.currentTarget.dataset.id);
        this.records = records;
        console.log('onDubleClick:', this.records);
        this.isEdited = true;
    }
    handleNameChange(event){
        records= this.records;
        records.forEach(ele => {
            if(ele.Id === event.target.dataset.id ){
                ele.Name = event.target.value;
            }
            return ele;
        });
        this.records = records;
        console.log('records in Handler Name', this.records);
    }
    handleAddressChange(event){
        records = this.records
        records.forEach(ele => {
            if(ele.Id === event.target.dataset.id ){
                ele.Address = event.target.value;  
            }
            return ele;
        });
        this.records = records;
    }
    handleRangeChange(event){
        records = this.records
        records.forEach(ele => {
            if(ele.Id === event.target.dataset.id ){
                ele.Range__c = event.target.value;
            }
            return ele;
        });
        this.records = records;
    }
    handleTagChange(event){
        records = this.records
        records.forEach(ele => {
            if(ele.Id === event.target.dataset.id ){
                ele.Tags__c = event.target.value;
            }
            return ele;
        }); 
        this.records = records;
    }
    handleUpdate(){
        console.log('inside handleUpdate', this.records);
        this.records.forEach(ele=>{
            let fields = {Id: ele.Id, Name: ele.Name, Destination_Address__c: ele.Destination_Address__c, Range__c: ele.Range__c, Tags__c:ele.Tags__c};
            let recordInput = { fields };
            console.log('element:', recordInput);

            updateRecord(recordInput)
            .then(result =>{
                    console.log("result:", result);
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: "Success",
                            message: "Record Successful updated",
                            variant:"success"
                        })
                    );
                    this.records.map(item =>{
                        item.IsEdited = false;
                        this.isEdited = item.IsEdited;
                    })
                    return refreshApex(this.refreshTable);
                })
                .catch (error => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: "Error!!",
                            message: "Error message",
                            variant:"error"
                        })
                    );
                    console.log("error", error);
                })
        })
        let required = this.template.querySelectorAll('lightning-input').forEach(ele=>{
            ele
        })
    }
    handleCancle(){
        this.records.map(item =>{
            item.IsEdited = false;
            this.isEdited = item.IsEdited;
        })
        this.handleRefresh();
    }
    handleRefresh(){
        console.log('in side handleRefresh');
        const event = new CustomEvent('refresh',{
        })
        this.dispatchEvent(event);
    }
}