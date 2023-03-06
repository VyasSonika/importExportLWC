import { LightningElement, track, api, wire} from 'lwc';
import MapLoaction from '@salesforce/resourceUrl/MapLocation';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import uploadFiles from '@salesforce/apex/DriverController.uploadFile';
import getDriverList from '@salesforce/apex/DriverController.getDriverList'
//import saveFileData from '@salesforce/apex/DriverController.saveFileData';
import releatedFiles from '@salesforce/apex/DriverController.releatedFiles';
import updateRecords from '@salesforce/apex/DriverController.updateRecords';

import { refreshApex } from '@salesforce/apex';
import { readAsDataURL } from './readFile';
import { updateRecord } from 'lightning/uiRecordApi';
import { loadScript } from 'lightning/platformResourceLoader';
import excelFileReader from '@salesforce/resourceUrl/sheetjs';
let recordsList = [];
const cols= [
    {label:'Destination Name', fieldName:'Name', type:'text'},
    {label:'Destination Address', fieldName:'Address', type:'address'},
    {label:'Range', fieldName:'Range__c', type:'number'},
    {label:'Tag', fieldName:'Tags__c', type:'text'},
    {label:'Trip Date', fieldName:'TripDate__c', type:'date'},
    // {label:'Contact Name', fieldName:'Contact__r.Name', type:'text'},


]


export default class AddLocation extends LightningElement {
    mapLoaction = MapLoaction;
    @track columns = cols; 
    isMyLocation = false;
    isAddLocation = false;
    @track fileData;
    fileReader;
    isFile = false;
    csvString;
    recordId;
    isupload = false;
    base64String = [];
    fileContent = '';
    isError = false;
    isSuccess = false;
    fileName = '';
    isDisabled = false;
    isActive = false;
    @track refreshTable = [];
    @track records=[];
    isEdited = false;
    @track element =[];
    @track fields = [];
    error;
    objExcelToJSON= [];
    @track ready = false;
    sortedColumn;
    sortedDirection;
    nameUp;
    nameDown;
    rangeUp;
    rangeDown;
    tagUp;
    tagDown;
    addUp;
    addDown;
    hide;
    show = false;
    selectedDate;
    dataPassChild = false;
    @track fields = [];
    connectedCallback() {

        loadScript(this, excelFileReader + '/sheetjs/sheetmin.js')
        .then(result => {
            console.log('result', result);
        })
        .catch(error => {
            this.error = error;
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Excel Upload: Error loading excelFileReader',
                    message: error.message,
                    variant: 'error'
                })
            );
        });
    }
    @wire(getDriverList)
    wiredDriver(result){
        this.refreshTable = result; 
        const { error, data } = result;
        if(data){ 
            console.log('data', data);
            // this.records = data;
            let record12 = JSON.parse(JSON.stringify(data));
            record12.Address= {};
            console.log(record12);
            // this.records = record12;
             
            this.records = record12.map((r)=>{
                console.log('r:--', r);
                r.Address = r.Destination_Address__c.countryCode + ', ' + r.Destination_Address__c.street + ', '+
                r.Destination_Address__c.city + ', '+ r.Destination_Address__c.stateCode + ', ' +
                r.Destination_Address__c.postalCode;
                this.recordId = r.Id;
                return r;
            })
            this.dataPassChild = true;
        }
        if(error){
            console.error(error)
        }
    }
    handleMyLocation(){
        this.isDisabled = false;
        this.isActive = true;
        this.isFile = true;
        this.isMyLocation = false;
        this.sortRecs();
    }
    handleAddLocation(){
        console.log('handleAddLocation');
        this.isDisabled = true;
        this.isActive = false;
        this.isFile = false;
        this.isupload = false;
        this.isMyLocation= false;
        

    }
   
   
    get acceptedCSVFormats() {
        return ['.csv', '.xlsx'];
    }
    get uploadfile(){ 
        console.log(this.fileData);
        if (this.fileData){
            if(this.fileData[0].type === 'text/csv'){
                // this.isFile = true;
                this.fileName = this.fileData[0].name;
                return this.fileName;
            }
            this.isFile = false;
            this.isupload= false;
            this.isMyLocation = true;
            return 'Please select CSV file only.'
        } 
        this.isDisabled = true;

        return 'or drag and drop file here';
    }
    
    uploadFileHandler(event) {
        this.isFile = false;
        this.isupload= false;
        this.isMyLocation = true;
        this.fileData = event.target.files;

        let file= this.fileData[0];
        console.log('file:-',this.fileData[0]);
        let fileReader = new FileReader();
        fileReader.readAsBinaryString(file);
        fileReader.onload = (evt => {
            let loadData = evt.target.result;
            console.log('loadData:', JSON.stringify(loadData));
            let workbook = XLSX.read(loadData, { type: "binary"});
            console.log('workbook', workbook);
            let rowObject = XLSX.utils.sheet_to_row_object_array(
                workbook.Sheets["Sheet1"]
            );
            console.log('rowObject', rowObject);
            this.objExcelToJSON = rowObject;
            console.log('objExcelToJSON length', this.objExcelToJSON);
            if(this.objExcelToJSON.length >= 0) {
                console.log('inside another if block');
                let keyValue = Object.keys(...this.objExcelToJSON);
                console.log('keyValue', keyValue);
                let rightValue = keyValue.includes("DestinationName", "Range", "Tags", "DeatinationAddress.countryCode", "Deatination Address.street", "Deatination Address.city", "Deatination Address.stateCode", "DeatinationAddress.postalCode");
                console.log('right value', rightValue);
                if(rightValue){
                    this.base64String = loadData.split(',');
                    console.log('base64String', this.base64String);
                    this.objExcelToJSON.map(a=>{
                        console.log('condition check', a);
                        if(a.DestinationName == undefined && a.DeatinationAddress.postalCode == undefined){
                            this.isFile = false;
                            this.isupload = false;
                            this.isDisabled = true;
                            this.isMyLocation = true;
                            this.isError = true;
                            this.error = 'Destination Name is not null or empty'
                            console.log(this.error);
                            
                        }
                    })
                    
                }else{
                    this.isFile = false;
                    this.isupload = false;
                    this.isDisabled = true;
                    this.isMyLocation = true;
                    this.isError = true;
                    this.error = 'please insert right colunm name csv file and can not insert empty file';
                    console.log(this.error);
                }
            }
        })
  
        this.isFile = true;
        this.isupload= true;
    }


    handleUploadFile(){
        this.isFile = true;
        this.isupload= false;
        let base64Data = this.base64String.toString();
        console.log('base64:', base64Data);
        let strFileName = this.fileData[0].name;
        console.log('fileName:', strFileName);
        let recordId = this.recordId;
        console.log('recordId:', recordId);
        // Calling apex class to insert the file
        uploadFiles({ recordId: recordId, strFileName: strFileName, base64Data: base64Data})
        .then(result=>{
            console.log(result);
            this.fileContent = result;
            this.objectDataInsert();
        })
        
        this.isFile = false;
        this.isupload= false;
        
    }
    objectDataInsert() {
        let conVerId = this.fileContent;
        releatedFiles({conId: conVerId})
        .then(data => {
            console.log('data:', data);
            this.isSuccess= true;
            this.isError = false;
            //let title = `${strFileName} uploaded successfully!!`
            this.template.querySelector("my-card2");
            return refreshApex(this.refreshTable);
        })
        .catch(error => {
            console.log(error);
            this.error = 'Please insert correct data in CSV file without using any special character';
            this.isError =true;
            this.isSuccess= false;
            this.template.querySelector("my-card2");
        });
        this.isFile = false;
        this.isupload= false;
        this.isMyLocation = true;
    }
    // onDoubleClickEdit(e){
    //     // this.show = false;
    //     console.log("inside onclick", e.currentTarget.dataset.id);
    //     let editedId = e.currentTarget.dataset.id;
        
    //     this.recordId = editedId;
    //     console.log('recordId:', this.recordId);
    //     recordsList = this.records;
    //     recordsList.map(item =>{
           
    //         if(editedId == item.Id){
    //             item.IsEdited = true;
    //         }else{
    //             item.IsEdited = false;
    //         }
    //     })
    //     this.records = recordsList;
    //     console.log('onDubleClick:', this.records);
    //     this.isEdited = true;
    //     // this.show = false;
    //     console.log('show value:-', this.show);
    //     if(this.show ===true){
    //         this.show = false;
    //     }
        
    // }
    // handleNameChange(event){
    //     this.show = false;
    //     recordsList= this.records;
    //     recordsList.forEach(ele => {
    //         if(ele.Id === event.target.dataset.id ){
    //             ele.Name = event.target.value;
    //         }
    //         return ele;
    //     });
    //     this.records = recordsList;
    //     console.log('records in Handler Name', this.records);
    // }
    // handleAddressChange(event){
    //     recordsList = this.records
    //     recordsList.forEach(ele => {
    //         if(ele.Id === event.target.dataset.id ){
    //             ele.Address = event.target.value;  
    //         }
    //         return ele;
    //     });
    //     this.records = recordsList;

    // }
    // handleRangeChange(event){
    //     recordsList = this.records
    //     recordsList.forEach(ele => {
    //         if(ele.Id === event.target.dataset.id ){
    //             ele.Range__c = event.target.value;
    //         }
    //         return ele;
    //     });
    //     this.records = recordsList;
    //     // this.show = false;

    // }
    // handleTagChange(event){
    //     recordsList = this.records
    //     recordsList.forEach(ele => {
    //         if(ele.Id === event.target.dataset.id ){
    //             ele.Tags__c = event.target.value;
    //         }
    //         return ele;
    //     }); 
    //     this.records = recordsList;

    // }
    // handleTripDateChange(event){
    //     this.selectedDate = event.target.value;
    //     console.log('inside handle trip date', this.selectedDate);
    //     recordsList.map(item =>{
    //         if(item.IsEdited == true){
    //             this.show = true;
    //             this.template.querySelector('c-date-picker').style.display = "block";
    //         }
    //     })

    //     this.records = recordsList;
    //     // this.show = false;
       
    // }
    async handleUpdate(){
        console.log('inside handleUpdate', this.records);
        recordsList = this.records;
        const records = recordsList.map(ele=>{

            // console.log('trip date update:-', ele.TripDate__c);
           const fields = {Id: ele.Id, 
                            Name: ele.Name, 
                            Destination_Address__c: ele.Destination_Address__c, 
                            Range__c: ele.Range__c, 
                            Tags__c:ele.Tags__c,
                           TripDate__c: ele.TripDate__c };
            return { fields };

        })
        console.log('update element records:', records);
        try{
            const recordUpdatePromises = records.map((record) =>
                // console.log('update element:', record)
                updateRecord(record)
            );
            console.log('recordUpdatePromises:-', recordUpdatePromises);
            await Promise.all(recordUpdatePromises);

            console.log('promise all data:--', await Promise.all(recordUpdatePromises));

            // Report success with a toast
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Records updated',
                    variant: 'success'
                })
            );
            this.template.querySelector('c-my-location').notEdited();
            this.isEdited = false;
            // Display fresh data in the datatable
            await refreshApex(this.records);
        } catch (error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error while updating or refreshing records',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        }
        
        // await updateRecords({fields: JSON.stringify(this.fields)})
        // .then(result => {
        //     console.log('result:--', result);
        //     this.dispatchEvent(
        //         new ShowToastEvent({
        //             title: 'Success',
        //             message: 'Records updated',
        //             variant: 'success'
        //         })
        //     );
        //     return refreshApex(this.refreshTable);

        // })
        // .catch(error => {
        //     console.log('error:--', error);
        // });
        this.template.querySelector('c-my-location').notEdited();
        this.isEdited = false;
        this.template.querySelector('c-my-location').handleTableData(this.records);

    }
    handleCancle(){
        // console.log('inside cancle button');
        this.template.querySelector('c-my-location').notEdited();
        this.isEdited = false;
        return refreshApex(this.refreshTable);

    }
    // sortRecs(event) {   
    //     this.nameUp = false;
    //     this.nameDown = false;
    //     this.rangeUp = false;
    //     this.rangeDown = false;
    //     this.tagUp = false;
    //     this.tagDown = false;
    //     this.addUp = false;
    //     this.addDown = false;
    //     let colName = event.target.name;
    //     console.log('Column Name is ' + colName);
    //     if ( colName ){
    //         console.log('colName:', colName)
    //         this.sortedDirection = (this.sortedDirection === 'asc' ? 'desc' : 'asc');
    //         console.log('sortedDirection:', this.sortedDirection);
    //     }else{
    //         this.sortedDirection = 'asc'
    //         console.log('colName in else:', colName)
    //     }
    //     let isReverse = this.sortedDirection === 'asc' ? 1 : -1;
    //     console.log('isReverse:', isReverse);

    //     switch ( colName ) {
    //         case "Name":
    //         if ( this.sortedDirection == 'asc' ){
    //             this.nameUp = true;
    //         }else{
    //             this.nameDown = true;
    //         }
    //         break;
                
    //         case "Address":
    //         if ( this.sortedDirection == 'asc' ){
    //             this.addUp = true;
    //         }else{
    //             this.addDown = true;
    //         }
    //         break;
            
    //         case "Range__c":
    //         if ( this.sortedDirection == 'asc' ){
    //             this.rangeUp = true;
    //         }
    //         else{
    //             this.rangeDown = true;
    //         }
    //         break;

    //         case "Tags__c":
    //         if ( this.sortedDirection == 'asc' ){
    //             this.tagUp = true;
    //         }else{
    //             this.tagDown = true;
    //         }
    //         break;
    //     }

    //     this.records = JSON.parse( JSON.stringify( this.records ) ).sort( ( a, b ) => {
    //         a = a[ colName ] ? a[ colName ].toLowerCase() : 'z'; 
    //         console.log('a:', a);
    //         b = b[ colName ] ? b[ colName ].toLowerCase() : 'z';
    //         return a > b ? 1 * isReverse : -1 * isReverse;
    //     });
    //     console.log('reciord in up down:', this.records);

    // }
    
    handlerDropOver(evt){
        // this.isDisabled = false

        console.log('over drag ', evt);
        evt.preventDefault();
    }
    dreggedEnd(ev) {
        // this.isDisabled = false
        console.log('dragg end ', ev);
        evt.preventDefault();

    }
   
    // handleSelectDate(event){
    //     console.log('event in handleselect', event.detail);
    //     this.selectedDate= event.detail;
    //     recordsList= JSON.parse(JSON.stringify(this.records));
    //     // console.log('in side handle selecte', records);

    //     recordsList.map((r) =>{
    //         if(r.Id == this.recordId ){
    //             r.TripDate__c = this.selectedDate.format('MM/DD/YY');
    //             // r.IsEdited = false;
    //             if(r.IsEdited == true){
    //                 let hide = this.template.querySelector('c-date-picker').style.display = "none";
    //                 console.log('inside if bolck', hide);
    //             }
    //         }
           
    //      })
    //      this.records = recordsList;

    //     // this.template.querySelector('c-date-picker').hideChild();
    // }
    handleValueChange(evt){
        this.isEdited = true;
        console.log('value coming from child', evt.detail.record);

        let fieldValue = evt.detail.record;
        let fieldName = evt.detail.fieldName;
        let recordId = evt.detail.recordId;
        recordsList = this.records;
        recordsList.map(item =>{
            // let fields = {};
            if(item.Id == recordId){
                console.log('inside if block', recordId);
                let fields = {
                    Id: recordId,
                    fieldName: fieldName,
                    fieldValue: fieldValue
                }
                // item = Object.assign(item, {[fieldName]:fieldValue});
                console.log('item inside handlevaluechange', fields);
                this.fields.push(fields);
                // this.fields.push(item);
            }
            // let date = new Date(item.TripDate__c)
            // let newDate = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)) + "-" + ("0" + date.getDate());
            // item.TripDate__c = newDate;
            // console.log('form_dt:-', item); 
                
        })
        console.log('update fields:-', JSON.parse(JSON.stringify(this.fields)));
        // this.records = recordsList;
        // console.log('value coming from child', this.records);
        // this.handleUpdate();
    }
}