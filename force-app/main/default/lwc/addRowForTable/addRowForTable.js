import { api, LightningElement, track, wire } from 'lwc';
import { CloseActionScreenEvent } from 'lightning/actions';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import getDriverList from '@salesforce/apex/DriverController.getDriverList'
import deleteRecord from '@salesforce/apex/DriverController.deleteRecord';
import updateRecords from '@salesforce/apex/DriverController.updateRecords';

import { refreshApex } from '@salesforce/apex';
const col = [
    {label:'Destination Name', fieldName:'Name', editable: 'true'},
    {label:'Range', fieldName:'Range__c', editable: 'true'},
    {label:'Tag', fieldName:'Tags__c', editable:'true'},
]
export default class AddRowForTable extends LightningElement {
    @track colunms = col;
    @track records;
    @track isLoading = true;
    wiredRecords;
    error;
    @track deleteId = '';
    isEdited = false;
    hideEdit = false;
    recordId;
    fieldName;
    fieldValue;
    fields = [];
    @wire(getDriverList)  
    wiredContact(result) {
        this.wiredRecords = result; // track the provisioned value
        const { data, error } = result;
 
        if(data) {
            this.records = JSON.parse(JSON.stringify(data));
            console.log('addrowfortable data:-', this.records);
            this.error = undefined;
            // this.handleIsLoading(false);
        } else if(error) {
            this.error = error;
            this.records = undefined;
            // this.handleIsLoading(false);
        }
    } 
    handleAddRow(){
        console.log('add method');
        let myNewElement ={}
        this.colunms.forEach(ele => {
            console.log('element:--', ele.fieldName);
            myNewElement = Object.assign({[ele.label]: ""});
            console.log('myNewElement:--', myNewElement);
            
        });
        this.records = [...this.records, myNewElement];
        console.log('addrow records:--', this.records);
    }
    //update table row values in list
    updateValues(event){
        console.log('event id:--', event.target.dataset.id);
        this.recordId = event.target.dataset.id;
        if(this.recordId == undefined){
            this.recordId = null;
        }
        console.log('record id:--', this.recordId);

        console.log('event name:--', event.target.name);
        this.fieldName = event.target.name;
        console.log('event value:--', event.target.value);
        this.fieldValue = event.target.value;

        // var foundelement = this.records.find(ele => ele.Id == event.target.dataset.id);
        // console.log('foundelement:--', foundelement);
        // if(event.target.name === 'Name'){
        //     foundelement.Name = event.target.value;
        // } else if(event.target.name === 'Range__c'){
        //     foundelement.Range__c = event.target.value;
        // } else if(event.target.name === 'Tags__c'){
        //     foundelement.Tags__c = event.target.value;
        // }
        // console.log('foundelement 123:--', foundelement);
        let records = this.records;
        records.map(item =>{
            if(item.Id == this.recordId){
                console.log('inside if block', this.recordId);
                let fields = {
                    Id: this.recordId,
                    fieldName: this.fieldName,
                    fieldValue: this.fieldValue
                }
                this.fields.push(fields);
                
            }
            // }else{
            //     let fields = {
            //         Id: this.recordId,
            //         fieldName: this.fieldName,
            //         fieldValue: this.fieldValue
            //     }
            //     this.fields.push(fields);
            // }
            
        })
        console.log('fields values', this.fields);
    }
    // get isDisable(){
    //     return (this.isLoading || (this.wiredRecords.data.length == 0 && this.records.length == 0));
    // }
 
    // //show/hide spinner
    // handleIsLoading(isLoading) {
    //     this.isLoading = isLoading;
    // }
 
    // 
    
 
    // //handle save and process dml 
    // handleSaveAction(){
    //     this.handleIsLoading(true);
 
    //     if(this.deleteIds !== ''){
    //         this.deleteIds = this.deleteIds.substring(1);
    //     }
 
    //     this.records.forEach(res =>{
    //         if(!isNaN(res.Id)){
    //             res.Id = null;
    //         }
    //     });
         
    //     deleteRecord({deleteId: this.deleteId})
    //     .then( result => {
    //         this.handleIsLoading(false);
    //         refreshApex(this.wiredRecords);
    //         this.updateRecordView(this.recordId);
    //         this.closeAction();
    //         this.showToast('Success', result, 'Success', 'dismissable');
    //     }).catch( error => {
    //         this.handleIsLoading(false);
    //         console.log(error);
    //         this.showToast('Error updating or refreshing records', error.body.message, 'Error', 'dismissable');
    //     });
    // }
 
    // //remove records from table
    // handleDeleteAction(event){
    //     if(isNaN(event.target.dataset.id)){
    //         this.deleteIds = event.target.dataset.id;
    //     }
    //     this.records.splice(this.records.findIndex(row => row.Id === event.target.dataset.id), 1);
    // }
 
 
    // 
    // }
 
    // updateRecordView() {
    //    setTimeout(() => {
    //         eval("$A.get('e.force:refreshView').fire();");
    //    }, 3000); 
    // }

    handleEditRow(evt){
        this.hideEdit = true;
        console.log('handleEditRow:--', evt.target.dataset.id);
        let editedId = evt.target.dataset.id;
        let recordList = this.records;
        recordList.map(item =>{
            item.IsEdited = false;
            if(editedId == item.Id){
                item.IsEdited = true;
                
            }else{
                item.IsEdited = false;
            }
        })
        this.records = recordList;
        console.log('edited records:-', this.records);

    }
    handleDeleteRow(evt){
        console.log('handleDeleteRow:--', evt.target.dataset.id);
        this.deleteId = evt.target.dataset.id;
        deleteRecord({deleteId: this.deleteId})
            .then( result => {
                console.log('result:--', result);
                // this.handleIsLoading(false);
                refreshApex(this.wiredRecords);
                this.showToast('Success', result, 'Success', 'dismissable');
            }).catch( error => {
                // this.handleIsLoading(false);
                console.log(error);
                this.showToast('Error updating or refreshing records', error.body.message, 'Error', 'dismissable');
            });
    }
    showToast(title, message, variant, mode) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
            mode: mode
        });
        this.dispatchEvent(event);
    }
    handleSaveRow(){
        this.hideEdit = false;
        console.log('inside handleSaveRow');
        updateRecords({fields: JSON.stringify(this.fields)})
            .then( result =>{
                console.log('result when recordsave', result);
                refreshApex(this.wiredRecords);
                this.showToast('Success', result, 'Success', 'dismissable');
            }).catch( error => {
                // this.handleIsLoading(false);
                console.log(error);
                this.showToast('Error updating or refreshing records', error.body.message, 'Error', 'dismissable');
            });
    }
    handleCancleRow(){
        this.hideEdit = false;
    }
}