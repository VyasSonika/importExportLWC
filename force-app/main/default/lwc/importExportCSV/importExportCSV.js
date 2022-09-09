import { LightningElement, track, api, wire} from 'lwc';
// importing accounts
import getAccountList from '@salesforce/apex/GetAccountList.getAccount';
// imported to show toast messages
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import csvFileRead from '@salesforce/apex/CSVFileReadLWCCntrl.csvFileRead';


// datatable columns
const cols = [
    {label: 'Name',fieldName: 'Name'}, 
    {label: 'Industry',fieldName: 'Industry'},
    {label: 'Billing City',fieldName: 'BillingCity'}, 
    {label: 'Phone',fieldName: 'Phone',type: 'phone'}, 
];

export default class ImportExportCSV extends LightningElement {
    @track error;
    @track data;
    @track columns = cols;
    @api recordId;

    // this constructor invoke when component is created.
    // once component is created it will fetch the accounts
    constructor() {
        super();
        this.getallaccounts();
    }


    // fetching accounts from server
    getallaccounts() {
        getAccountList()
        .then(result => {
            this.data = result;
            console.log('data', JSON.parse(JSON.stringify(this.data)));
            this.error = undefined;
        })
        .catch(error => {
            this.error = error;
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error while getting Accounts', 
                    message: error.message, 
                    variant: 'error'
                }),
            );
            this.data = undefined;
        });
    }
    // accepted parameters
    get acceptedCSVFormats() {
        return ['.csv'];
    } 
    uploadFileHandler(event) {
        // Get the list of records from the uploaded files
        // const uploadedFiles = event.detail.files;
        console.log('uploadedFiles', JSON.parse(JSON.stringify(uploadedFiles))  );
        // calling apex class csvFileread method
        csvFileRead({contentDocumentId : uploadedFiles[0].documentId})
        .then(result => {
            console.log('result ===> '+result);
            this.data = result;
            console.log('RESULT', JSON.parse(JSON.stringify(this.data)));
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success!!',
                    message: 'Accounts are created according to the CSV file upload!!!',
                    variant: 'Success',
                }),
            );
        })
        .catch(error => {
            this.error = error;
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error!!',
                    message: JSON.stringify(error),
                    variant: 'error',
                }),
            );     
        })

    }


    // this method validates the data and creates the csv file to download
    downloadCSVFile() {   
        let rowEnd = '\n';
        let csvString = '';
        // this set elminates the duplicates if have any duplicate keys
        let rowData = new Set();
        console.log('rowData', rowData);
        // getting keys from data
        this.data.forEach(function (record) {
            console.log('in foreach record', JSON.stringify('record'));
            Object.keys(record).forEach(function (key) {
                rowData.add(key);
            });
        });
        // Array.from() method returns an Array object from any object with a length property or an iterable object.
        rowData = Array.from(rowData);
        console.log('rowData', rowData);
        // splitting using ','
        csvString += rowData.join(',');
        csvString += rowEnd;
        console.log('csvString', csvString);

        // Creating anchor element to download
        let downloadElement = document.createElement('a');
        console.log('downloadElement', JSON.parse(JSON.stringify(downloadElement)));
        // This  encodeURI encodes special characters, except: , / ? : @ & = + $ # (Use encodeURIComponent() to encode these characters).
        downloadElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvString);
        downloadElement.target = '_self';
        // CSV File Name
        downloadElement.download = 'Account Data.csv';
        // below statement is required if you are using firefox browser
        document.body.appendChild(downloadElement);
        // click() Javascript function to download CSV file
        downloadElement.click(); 
    }

}