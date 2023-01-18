import { LightningElement, track, api, wire} from 'lwc';

let recordsList= [];
let columns = [];
let typeValue = [];
export default class MyLocation extends LightningElement {
    @api childColumn;
    // @track columns=[];
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
    // @track tableRecords = [];
    // @track editedValues = [];
    connectedCallback(){
        this.arrowDown = true;
        this.arrowUp = true;
        this.childRecords = JSON.parse(JSON.stringify(this.childRecords));
        console.log('childRecords:--', this.childRecords);
        this.childColumn =JSON.parse(JSON.stringify(this.childColumn));
        let childColumn = this.childColumn;
        childColumn.forEach(cc => {
            columns.push(cc.fieldName);
        })
        childColumn.forEach(t=>{
            typeValue.push(t.type);
        })
        console.log('type value:--', typeValue);
        this.handleTableData(this.childRecords);
    }
    
    onDoubleClickEdit(e){
        // console.log('event:---', e);
        // this.showDatePicker = true;
        console.log("inside onclick", e.currentTarget.dataset.id);
        let editedId = e.currentTarget.dataset.id;
        this.recordId = editedId;
        console.log('recordId:', this.recordId);
        recordsList = this.childRecords;
        console.log('recordsList:--', recordsList);
        recordsList.map(item =>{
            item.IsEdited = false;
            if(editedId == item.Id){
                console.log('inside if block:--');
                item.IsEdited = true;
            }else{
                item.IsEdited = false;
                // console.log('else block:--')
            }
        })
        this.childRecords = recordsList;
        // this.pagRecords = this.childRecord;
        // console.log('onDubleClick:', this.childRecord);
        // console.log('show value:-', this.showDatePicker);
        // this.showDatePicker = true;

      
        
    }
    @api 
    notEdited(){
        console.log('from child com. not edited', this.childRecords);
        recordsList = this.childRecords;
        recordsList.map(item=>{
           item.IsEdited = false;
        })
        this.childRecords = recordsList;
        console.log('inside notedited childRcords', this.childRecords);
    }
    handleChange(evt){
        this.fieldValues = evt.target.value;
        this.fieldName = evt.target.name;
        let fieldType = evt.target.dataset.type;
        console.log('field type:--', fieldType);
        console.log('field vales:--', this.fieldValues);
        
        // console.log('update value', JSON.parse(JSON.stringify(this.childRecords)));
        recordsList =  JSON.parse(JSON.stringify(this.childRecords));
        recordsList.forEach(ele=>{
            if(ele.Id === this.recordId){
                ele.keyItem.forEach(item=>{
                   if(item.keys == this.fieldName){
                        item.values = this.fieldValues;
                        console.log('item:--', item);
                        this.updateData(this.fieldName, item.values);
                   }
                })
                
            }
            return ele;
        })
        console.log('updated value:--', recordsList);

        this.childRecords = [...recordsList];
        this.pagRecords = this.childRecords
        console.log('updated value:--', this.pagRecords);
    }
    updateData(fieldName, fieldValues){
        console.log('fieldname and fieldvalues:-', fieldName, fieldValues);
        this.dispatchEvent(new CustomEvent('valuechange',{ 
            detail:{ 
                record: fieldValues, fieldName: fieldName, recordId:this.recordId,
            }
        }))
    }

    sortRecs(event) {   
        let colName = event.target.name;
    
        console.log('target event:--', event.target.name);
        if ( colName ){
            console.log('colName:', colName)
            this.sortedDirection = (this.sortedDirection === 'asc' ? 'desc' : 'asc');
            console.log('sortedDirection:', this.sortedDirection);
        }else{
            this.sortedDirection = 'asc'
            console.log('colName in else:', colName)
        }
        // cheking reverse direction
        let isReverse = this.sortedDirection === 'asc' ? 1 : -1;
        console.log('isReverse:', isReverse);
        

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
        console.log('event in handleselect', event.detail);
        this.selectedDate= event.detail;
        recordsList = JSON.parse(JSON.stringify(this.childRecords));
        console.log('records list form handleselected date:-', recordsList);
        recordsList.forEach(ele=>{
            if(ele.Id === this.recordId){
                ele.keyItem.forEach(item=>{
                   if(item.type === 'date'){
                        item.values = this.selectedDate;
                        console.log('item:--', item);
                        ele.IsEdited = true;
                        this.updateData(item.keys, item.values);
                   }
                })
                return ele; 
            }else{
                ele.IsEdited = false;

            }
        })
         console.log('updated value:--', recordsList);

        this.childRecords = recordsList;
        // this.childRecord = this.pagRecords;
    }
    @api
    handleTableData(data){
         let newArray = [];
       console.log('data from parent:-', data);
        data.forEach(item=>{

            item.keyItem = [];
            // console.log('columns:--', columns)
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
                    if(key.type == 'date'){
                        key.isDate = true;
                    }
                   
                    // console.log(key);
                    }
                })
               
            })
        }) 
            console.log('final array1233:--', newArray);
        this.pagRecords = JSON.parse(JSON.stringify(newArray));
        this.pagRecords = this.childRecords;
        console.log('final array:--', this.childRecords);
        // this.childRecords = this.pagRecords;

    }
    updateDataHandler(event) {
        console.log('page records:--', this.pagRecords)
        this.pagRecords = [...event.detail.records];
        console.log('paginetor data', JSON.parse(JSON.stringify(this.pagRecords)));
    }
}