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
        this.showDatePicker = true;
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
        console.log('onDubleClick:', this.childRecords);
        console.log('show value:-', this.showDatePicker);
        // this.showDatePicker = true;

      
        
    }
    @api 
    notEdited(){
        console.log('from child com. not edited');
        recordsList = this.childRecords;
        recordsList.map(item=>{
           item.IsEdited = false;
        })
        this.childRecords = recordsList;
        console.log('inside notedited childRcords', this.childRecords);
    }
    handleChange(evt){
        this.fieldValues = evt.target.value;
        let fieldName = evt.target.name;
        let fieldType = evt.target.dataset.type;
        console.log('field type:--', fieldType);
        console.log('field vales:--', this.fieldValues);
        
        // console.log('update value', JSON.parse(JSON.stringify(this.childRecords)));
        recordsList = JSON.parse(JSON.stringify(this.childRecords));
        recordsList.forEach(ele=>{
            if(ele.Id === this.recordId){
                ele.keyItem.forEach(item=>{
                   if(item.keys == fieldName){
                        item.values = this.fieldValues;
                        console.log('item:--', item);
                   }
                })
                
            }
            return ele;
        })
         console.log('updated value:--', recordsList);

        this.childRecords = [...recordsList];
        this.pagRecords = this.childRecords
        console.log('updated value:--', this.pagRecords);

        this.dispatchEvent(new CustomEvent('valuechange',{ 
            detail:{ 
                record: this.fieldValues, fieldName: fieldName, recordId:this.recordId,
            }
        }))
    }
    sortRecs(event) {   
        // this.arrowUp = false;
        // this.arrowDown = false;
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
    }    
    handleSelectDate(event){
        console.log('event in handleselect', event.detail);
        this.selectedDate= event.detail;
        recordsList= JSON.parse(JSON.stringify(this.childRecords));
        // console.log('in side handle selecte', records);

        recordsList.map((r) =>{
            if(r.Id == this.recordId ){
                r.TripDate__c = this.selectedDate.format('MM/DD/YY');
                // r.IsEdited = false;
                if(r.IsEdited == true){
                    let hide = this.template.querySelector('c-date-picker').style.display = "none";
                    console.log('inside if bolck', hide);
                }
            }
        })
         this.childRecords = recordsList;
    }
    @api
    handleTableData(data){
         let newArray = [];
        // recordsList = data;
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
        let finalArr= [];
        newArray.forEach(item=>{
            item.keyItem.forEach(keys=>{
                columns.forEach(col=>{
                    if(keys.keys == col){
                        console.log('inside if block:-');
                        typeValue.forEach(t=>{
                            keys.type = t;
                            stop();
                        })
                        return keys;
                    }
                })
               
            })
        })
            console.log('final array1233:--', newArray);
        this.pagRecords = JSON.parse(JSON.stringify(newArray));
        
        this.pagRecords = this.childRecords;
        console.log('final array:--', this.pagRecords);

    }
    updateDataHandler(event) {
        console.log('page records:--', this.pagRecords)
        this.pagRecords = [...event.detail.records];
        console.log('paginetor data', JSON.parse(JSON.stringify(this.pagRecords)));
    }
}