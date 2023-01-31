import TickerSymbol from '@salesforce/schema/Account.TickerSymbol';
import { LightningElement, track, api, wire} from 'lwc';
import UserNameFIELD from '@salesforce/schema/User.Name';
import { getRecord } from 'lightning/uiRecordApi';
import USERID from '@salesforce/user/Id';

let recordsList= [];
let columns = [];
let typeValue = [];
let labelName = [];
export default class MyLocation extends LightningElement {
    @api childColumn;
    @api tableData;
    userId = USERID;
    @track currentUserName;
    @api childRecords;
    isEditedChild;
    @track newArray;
    arrowUp = false;
    arrowDown = false;
    sortedDirection;
    fieldValues;
    showDatePicker = false;
    selectedDate;
    recordId;
    @track pagRecords= [];
    fieldName;
    showToolTip = false;

    @wire(getRecord, { recordId: USERID, fields: [UserNameFIELD]}) 
    currentUserInfo({error, data}) {
        if (data) {
            console.log('user info:-', data); 
            this.currentUserName = data.fields.Name.value;
            console.log('user name:-', this.currentUserName); 

        } else if (error) {
            this.error = error ;
        }
    }
    connectedCallback(){
        this.arrowDown = true;
        this.arrowUp = true;
        this.tableData = JSON.parse(JSON.stringify(this.tableData));
        console.log('table data:--', this.tableData);
        this.childRecords = JSON.parse(JSON.stringify(this.childRecords));
        console.log('childRecords:--', this.childRecords);
        this.childColumn =JSON.parse(JSON.stringify(this.childColumn));
        let childColumn = this.childColumn;
        childColumn.forEach(fn => {
            columns.push(fn.fieldName);
        })
        childColumn.forEach(t=>{
            typeValue.push(t.type);
        })
        childColumn.forEach(la => {
            labelName.push(la.label);
        })
        console.log('labelName value:--', labelName);
        this.handleTableData(this.childRecords);
    }
    onDoubleClickEdit(e){
        let editedId = e.currentTarget.dataset.id;
        this.recordId = editedId;
        // console.log('recordId:', this.recordId);
        recordsList = JSON.parse(JSON.stringify(this.childRecords));
        // console.log('recordsList:--', recordsList);
        recordsList.map(item =>{
            item.IsEdited = false;
            if(editedId == item.Id){
                item.IsEdited = true;
                
            }else{
                item.IsEdited = false;
            }
            item.keyItem.forEach(key =>{
                if(key.type ==='address'){
                    this.showToolTip = true;
                }
                if(key.isDate == true){
                    key.isDate = false;
                }
            })
        })
        this.childRecords = recordsList;
        // this.pagRecords = this.childRecord;
        // console.log('onDubleClick:', this.childRecords);
        // console.log('show value:-', this.showDatePicker);
        // this.showDatePicker = true;

      
        
    }
    @api 
    notEdited(){
        console.log('from child com. not edited', this.childRecords);
        recordsList = JSON.parse(JSON.stringify(this.childRecords));
        recordsList.map(item=>{
           item.IsEdited = false;
        })
        this.childRecords = recordsList;
        // console.log('inside notedited childRcords', this.childRecords);
    }
    handleChange(evt){
        this.fieldValues = evt.target.value;
        this.fieldName = evt.target.name;
        let fieldType = evt.target.dataset.type;
        console.log('update value', JSON.parse(JSON.stringify(this.childRecords)));
        recordsList =  JSON.parse(JSON.stringify(this.childRecords));
        recordsList.forEach(ele=>{
            if(ele.Id === this.recordId){
                ele.keyItem.forEach(item=>{
                   if(item.keys == this.fieldName){
                        item.values = this.fieldValues;
                        // console.log('item:--', item);
                        this.updateData(this.fieldName, item.values);
                   }
                   
                })
            }
            return ele;
        })
        console.log('updated value:--', recordsList);
        
        this.childRecords = [...recordsList];
    }
    handleDateChange(evt){
        let fieldName = evt.target.name;
        this.fieldValues = evt.target.value;
        let fieldType = evt.target.dataset.type;
        console.log('fieldType', fieldType);
        console.log('handledate change', evt);
        recordsList = this.childRecords
        recordsList.forEach(ele=>{
            if(ele.Id === this.recordId){
                ele.keyItem.forEach(item=>{
                    if(fieldType === 'date' && fieldName === item.keys){
                        console.log('item:--', item);
                        item.isDate = true;
                    }
                })
            }
            return ele;
        })
        this.childRecords = recordsList;
        console.log('record check here', this.childRecords);
        this.updateData(this.fieldName, this.fieldValues);


    }
    updateData(fieldName, fieldValues){
        // console.log('fieldname and fieldvalues:-', fieldName, fieldValues);
        this.dispatchEvent(new CustomEvent('valuechange',{ 
            detail:{ 
                record: fieldValues, fieldName: fieldName, recordId:this.recordId,
            }
        }))
    }

    sortRecs(event) {   
        let colName = event.target.name;
    
        // console.log('target event:--', event.target.name);
        if ( colName ){
            // console.log('colName:', colName)
            this.sortedDirection = (this.sortedDirection === 'asc' ? 'desc' : 'asc');
            // console.log('sortedDirection:', this.sortedDirection);
        }else{
            this.sortedDirection = 'asc'
            // console.log('colName in else:', colName)
        }
        // cheking reverse direction
        let isReverse = this.sortedDirection === 'asc' ? 1 : -1;
        // console.log('isReverse:', isReverse);
        

        let parseData = JSON.parse(JSON.stringify(this.childRecords));
        // Return the value stored in the field
        let keyValue = (a) => {
            return a[colName];
        };
        // sorting data
        parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : ''; // handling null values
            y = keyValue(y) ? keyValue(y) : '';
            // sorting values based on direction
            return isReverse * ((x > y) - (y > x));
        });
        this.childRecords = parseData;
        // this.childRecord = this.pagRecords;
    }    
    handleSelectDate(event){
        // console.log('event in handleselect', event.detail);
        this.selectedDate= event.detail;
        recordsList = JSON.parse(JSON.stringify(this.childRecords));
        // console.log('records list form handleselected date:-', recordsList);
        recordsList.forEach(ele=>{
            if(ele.Id === this.recordId){
                ele.keyItem.forEach(item=>{
                   if(item.type === 'date'){
                        item.values = this.selectedDate;
                        // console.log('isEdited value', ele.IsEdited);
                        this.updateData(item.keys, item.values);
                        if(ele.IsEdited == true){
                            // console.log('hide date picker', this.template.querySelector('c-date-picker'));
                            // this.template.querySelector('c-date-picker').style.display = "none";
                            item.isDate = false;
                        }
                   }
                })
                return ele; 
            }
        })
        //  console.log('updated value:--', recordsList);

        this.childRecords = recordsList;
    }
    @api
    handleTableData(data) {
         let newArray = [];
        console.log('data from parent:-', JSON.parse(JSON.stringify(data)));
       data = JSON.parse(JSON.stringify(data));
        data.forEach(item=>{
            item.keyItem = [];
            columns.forEach(key=>{
                let result ={};
                if(item.hasOwnProperty(key) == false){
                    item = Object.assign(item, {[key]: ""})
                }
                if(Object.keys(item).includes(key)){
                // console.log('inside if block', item[key]);
                    result.keys = key;
                    result.values = item[key];
                    result.type = {};
                    //console.log('result:--', item)
                    item.keyItem.push(result);
                }  
            })
            newArray.push(item); 

        })
        this.childColumn.forEach((col)=>{
            newArray.map(item=>{
                item.keyItem.forEach(key=>{
                    if(col.fieldName === key.keys){
                        // console.log(col.type);
                        key.type = col.type;
                        if(key.type === 'date'){
                            key.isDate = true;
                            key.values = this.convert(key.values);
                        }
                    // console.log('values change:-', key);
                    }
                    if(key.type === 'address'){
                        key.isTooltip = true;
                    }
                })
            })
        }) 
            // console.log('final array1233:--', newArray);
        this.childRecords = JSON.parse(JSON.stringify(newArray));
        console.log('final array:--', this.childRecords);
        
    }
    convert(str) {
        let date = new Date(str),
          mnth = ("0" + (date.getMonth() + 1)).slice(-2),
          day = ("0" + date.getDate()).slice(-2),
          year = date.getFullYear();
        return [mnth, day, year].join("/");
      }
    updateDataHandler(event) {
        this.pagRecords = [...event.detail.records];
        console.log('paginetor data', JSON.parse(JSON.stringify(this.pagRecords)));
    }
    handleDownloadtable(){
        let records = this.tableData;
        this.downloadCSVFile(records);
    }
     // this method validates the data and creates the csv file to download
     downloadCSVFile(data) { 
        console.log('data:-', data);  
        let rowEnd = '\n';
        let csvString = '';
        csvString += labelName.join(',');
        console.log('csv+rowdata:--', csvString);
        csvString += rowEnd;
        console.log(data);
        data.forEach(obj=>{
            let count = 0;
            console.log('object;--', obj);
            columns.forEach(key=>{
                if(obj.hasOwnProperty(key) === true){
                    if(count > 0){
                        csvString += ','
                        console.log('csv+rowdata add comma:--', csvString);
    
                    }
                    // If the column is undefined, it as blank in the CSV file.
                    let value = obj[key] === undefined ? '' : obj[key];
                    csvString += '"'+ value +'"';
                    console.log('csvString value:--', csvString);
                    count++;
                }
            })
            csvString +=rowEnd;
        })
        // console.log("str", str)
        console.log("str:--", csvString)
 
        // Creating anchor element to download
        let downloadElement = document.createElement('a');
        let date = new Date();
        // This  encodeURI encodes special characters, except: , / ? : @ & = + $ # (Use encodeURIComponent() to encode these characters).
        downloadElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvString);
        downloadElement.target = '_self';
        // CSV File Name
        downloadElement.download = this.currentUserName +date+ '.csv';
        // below statement is required if you are using firefox browser
        document.body.appendChild(downloadElement);
        // click() Javascript function to download CSV file
        downloadElement.click(); 
    }
    handleClickRowDownload(evt){
        let rowId = evt.target.dataset.id;
        console.log('row id:--', rowId);
        let rowData = [];
        this.tableData.forEach(obj=>{
            if(obj.Id === rowId){
                rowData.push(obj);
            }
        })
        console.log('rowData:--', rowData);
        this.downloadCSVFile(rowData);
    }
}