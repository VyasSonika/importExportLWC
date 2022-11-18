import { LightningElement, track, api, wire} from 'lwc';
import MapLoaction from '@salesforce/resourceUrl/MapLocation';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import uploadFiles from '@salesforce/apex/DriverController.uploadFile';
import getDriverList from '@salesforce/apex/DriverController.getDriverList'
//import saveFileData from '@salesforce/apex/DriverController.saveFileData';
import releatedFiles from '@salesforce/apex/DriverController.releatedFiles';
import { refreshApex } from '@salesforce/apex';
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
    base64String ='';
    fileContent = '';
    isError = false;
    isSuccess = false;
    fileName = '';
    isDisabled = false;
    @wire(getDriverList)
    wiredDriver(result){
        this.refreshTable = result; 
        const { error, data } = result;
        if(data){ 
            console.log('data of addLocation', data);
            this.listData = data ;
            this.recordId = this.listData.map(e=>  e.Id);

        }
        if(error){
            console.error(error)
        }
    }
    myLocation(){
        this.isDisabled = false;
        // this.isMyLocation = true;
        // this.isAddLocation =false;
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
        return 'or drag and drop file here';
    }
    
    uploadFileHandler(event) {
        this.isFile = false;
        this.isupload= false;
        this.isMyLocation = true;
        this.fileData = event.target.files;
        let file= this.fileData[0];
        
        console.log('file:-',file);
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
        let base64Data = this.base64String;
        console.log('base64:', base64Data);
        let strFileName = this.fileData[0].name;
        console.log('fileName:', strFileName);
        let recordId = this.recordId[0].toString();
        console.log('recordId:', recordId);

        uploadFiles({ recordId: recordId, strFileName: strFileName, base64Data: base64Data})
           // Calling apex class to insert the file
        //saveFileData({ recordId: recordId, strFileName: strFileName, base64Data: base64Data})
        .then(result=>{
            console.log(result);
            this.fileContent = result;
            this.objectDataInsert();
        })
        
        this.isFile = false;
        this.isupload= false;
        
    }

//   toast(title){
//         const toastEvent = new ShowToastEvent({
//             title, 
//             variant:"success"
//         })
//         this.dispatchEvent(toastEvent)
//         this.isFile = false;
//         this.isupload= false;
//         this.isMyLocation = true;
//     }
       // Getting releated files of the current record
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
            this.isError =true;
            this.isSuccess= false;
            this.template.querySelector("my-card2");
            // this.dispatchEvent(
            //     new ShowToastEvent({
            //         title: 'Error!!',
            //         message: this.template.querySelector("my-card2"),
            //     }),
            // );
        });
        this.isFile = false;
        this.isupload= false;
        this.isMyLocation = true;
    }
}
    