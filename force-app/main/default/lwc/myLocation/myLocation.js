import { LightningElement, track, api, wire } from 'lwc';
import getDriverList from '@salesforce/apex/DriverController.getDriverList'
import { refreshApex } from '@salesforce/apex';
import updateRecord from '@salesforce/apex/DriverController.updateRecord'

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
    @track records=[];
    isEdited = false;
    @track element =[];
    recordId = '';
    desName = ''
    desAddress = '';
    range = '';
    tag = '';
    @wire(getDriverList)
    wiredDriver(result){
        this.refreshTable = result; 
        const { error, data } = result;
        if(data){ 
            console.log('data', data);
            this.records = data;
            let record12 = JSON.parse(JSON.stringify(data));
            record12.Address= {};
            // console.log(record12);
            this.records = record12;
            this.records = record12.map((r)=>{
                    r.Address = r.Destination_Address__c.countryCode+ ', ' + r.Destination_Address__c.street + ', '+
                    r.Destination_Address__c.city + ', '+ r.Destination_Address__c.stateCode + ', ' +
                    r.Destination_Address__c.postalCode;
                    this.desName = r.Destination_Name__c;
                    this.range = r.Range__c;
                    this.tag = r.Tags__c;
                    this.desAddress = r.Address;
                    return r;
            })
            console.log('records myLocation', this.records);
        }
        if(error){
            console.error(error)
        }
    }
    onDoubleClickEdit() {
        this.isEdited = true;
    }
    handleNameChange(event){
        
        console.log('handleNameChange');
        let records = JSON.parse(JSON.stringify(this.records));

        this.recordId = event.target.dataset.id;
        console.log('recordId', this.recordId);
        records.forEach(ele => {
            if(ele.Id === event.target.dataset.id ){
                ele.Destination_Name__c = event.target.value;
                this.desName= ele.Destination_Name__c;
            }
            return ele;
        });
        // this.records = records;
        // console.log('records', this.records);
    }
    handleAddressChange(event){
        console.log('handleAddressChange');
        this.recordId = event.target.dataset.id;
       this.records.forEach(ele => {
            if(ele.Id === event.target.dataset.id ){
                ele.Address = event.target.value;
                this.desAddress =  ele.Address;
            }
            return ele;
        });
    }
    handleRangeChange(event){
        console.log('handleRangeChange');
        this.recordId = event.target.dataset.id;
        this.records.forEach(ele => {
            if(ele.Id === event.target.dataset.id ){
                ele.Range__c = event.target.value;
                this.range =  ele.Range__c;
            }
            return ele;
        });
    }
    handleTagChange(event){
        console.log('handleTagChange');
        this.recordId = event.target.dataset.id;
        this.records.forEach(ele => {
            if(ele.Id === event.target.dataset.id ){
                ele.Tags__c = event.target.value;
                this.tag= ele.Tags__c;
            }
            return ele;
        }); 
    }
    handleUpdate(){
        this.isEdited = true;
        console.log('in side handleUpdate', JSON.parse(JSON.stringify(this.records)));
        console.log('in side handle', typeof(this.range));
        updateRecord({ recordId: this.recordId, desName: this.desName, desAddress: this.desAddress, range: this.range, tag: this.tag})
        .then(result =>{
            console.log(result)
        })
        .catch (error => {
            console.log("error", error);
        })
        this.isEdited =false;
        return refreshApex(this.refreshTable);
    }
    handleCancle(){
        this.isEdited = false;
    }
}