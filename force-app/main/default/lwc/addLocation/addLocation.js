import { LightningElement, track, api, wire} from 'lwc';
import MapLoaction from '@salesforce/resourceUrl/MapLocation';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import uploadFiles from '@salesforce/apex/DriverController.uploadFile';
import getDriverList from '@salesforce/apex/DriverController.getDriverList'
import saveFileData from '@salesforce/apex/DriverController.saveFileData';

import { readAsDataURL } from './readFile';
export default class AddLocation extends LightningElement {
    mapLoaction = MapLoaction;
    isMyLocation = false;
    isAddLocation = false;
    // @track cols = cols;
    @track fileData;
    fileReader;
    //MAX_SIZE = 500000;
    isFile = false;
    csvString;
    recordId;
    isupload = false;
   @track listData=[];
    base64String='';
   
    @wire(getDriverList)
    wiredDriver(result){
        this.refreshTable = result;
        const { error, data } = result;
        if(data){ 
            console.log('data', data);
            this.listData = data ;
            this.recordId = this.listData.map(e=>  e.Id);
            console.log('recordId', this.recordId);

        }
        if(error){
            console.error(error)
        }
    }
    myLocation(){
        this.isMyLocation = true;
        this.isAddLocation =false;
    }
    addLocation(){
        this.isMyLocation = false;
        this.isAddLocation =true;
    }
    successMsg(){

    }
   
    get acceptedCSVFormats() {
        return ['.csv', '.xlsx'];
    }
    get uploadfile(){ 
        console.log(this.fileData);
        if (this.fileData){
            this.isFile = true;
            return this.fileData[0].name;
        } 
        return 'or drag and drop file here';
    }

    // uploadFileHandler(event){
    //     this.isAddLocation = true;
    //      this.isFile = true;
    //     console.log(event.target.files);
    //      let fileName;
    //     if(event.target.files.length > 0) {
    //         this.fileData = event.target.files[0];
    //         console.log('fileData:', this.checkFileType(this.fileData));

    //         let fileTypeBool = this.checkFileType(this.fileData);
    //         console.log('fileTypeBool:', fileTypeBool);
    //         if(fileTypeBool){
    //             if(this.fileData.name){
    //                 fileName  = this.fileData.name;
    //            }
    //            let fileArray = [];
    //            this.fileReader = new FileReader();
    //            console.log('fileReader:', this.fileReader.onload);
    //            this.fileReader.onload = function(){
    //                 let base64 = 'base64,';
    //                 console.log('base64:', base64);
    //                 let content = freader.result.indexOf(base64) + base64.length;
    //                 console.log('content:', content);
    //                 let fileContents = freader.result.substring(content);
    //                 console.log('fileContents:', fileContents);

    //                 fileArray.push({
    //                     Title: file.name,
    //                     VersionData: fileContents,
    //                     documentType:this.fileData.type       
    //                 });
    //                 console.log('fileArray:', fileArray);
    //             }   
    //         }
    //     }
        
    // }
    // checkFileType(file){
    //     let name = file.name.split('.').pop();
    //     let supportedFiles = ['pdf','csv','jpg'];
    //    return (supportedFiles.includes(name) ?  true :  false);
    // }
    
    uploadFileHandler(event) {
        this.isFile = false;
        this.isupload= false;
        this.isMyLocation = true;
        this.fileData = event.target.files;
        let file= this.fileData[0];
        
        console.log(file);
        readAsDataURL(file)
        .then(file => {
            this.base64String = file.split(',')[1];
            console.log('base64String:', this.base64String);
        })
        .catch (error => {
            console.log("error", error);
        })
        this.isFile = true;
        this.isupload= true;
    }
    handleUploadFile(){
        this.isFile = true;
        this.isupload= false;
        let base64 = this.base64String;
        console.log('base64:', base64);
        let fileName = this.fileData[0].name;
        console.log('fileName:', fileName);
        let recordId = this.recordId[0].toString();
        console.log('recordId:', recordId);

        // uploadFiles({ base64, fileName, recordId})
           // Calling apex class to insert the file
        saveFileData({ recordId, fileName, base64})
        .then(result=>{
            console.log(result);
            this.fileData = null
            let title = `${fileName} uploaded successfully!!`
            this.toast(title)
        })
        
        this.isFile = false;
        this.isupload= false;
        
    }

  toast(title){
        const toastEvent = new ShowToastEvent({
            title, 
            variant:"success"
        })
        this.dispatchEvent(toastEvent)
        this.isFile = false;
        this.isupload= false;
        // this.isMyLocation = true;
    }
     
}
    