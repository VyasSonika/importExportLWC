import ContactMobile from '@salesforce/schema/Case.ContactMobile';
import { LightningElement, track, api, wire} from 'lwc';
import DynamicTableDesign from '@salesforce/resourceUrl/DynamicTableDesign';
import { loadScript } from 'lightning/platformResourceLoader';

let recordsList;
let columns = [];
// let value = [];
export default class MyLocation extends LightningElement {
    @api childColumn;
    // @track columns=[];
    @api childRecords;
    isEdited = false;
    @track newArray;
    arrowUp = false;
    arrowDown = false;
    sortedDirection;
    fieldValues;
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
        let newArray = [];
        recordsList = this.childRecords;
        recordsList.forEach(item=>{
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
                    //console.log('result:--', item)
                    item.keyItem.push(result);
                }  
            })
            newArray.push(item); 
        })
        this.childRecords = JSON.parse(JSON.stringify(newArray));
        console.log('final array:--', this.childRecords);
    }
    
    onDoubleClickEdit(e){
        // this.show = false;
        console.log('event:---', e);
        console.log("inside onclick", e.currentTarget.dataset.id);
        let editedId = e.currentTarget.dataset.id;
        
        // this.recordId = editedId;
        // console.log('recordId:', this.recordId);
        recordsList = this.childRecords;
        recordsList.map(item =>{
           
            if(editedId == item.Id){
                console.log('inside if block:--');
                item.IsEdited = true;
            }else{
                item.IsEdited = false;
                console.log('else block:--')
            }
        })
        this.childRecords = recordsList;
        console.log('onDubleClick:', this.childRecords);
        
    }
    handleChange(evt){
        this.fieldValues = evt.target.value;
        console.log('field vales:--', this.fieldValues);
    }
    sortRecs(event) {   
        // this.arrowUp = false;
        // this.arrowDown = false;
        let colName = event.target.name;
    
        console.log('target event:--', event.target.name);
        if(colName){
            console.log('colName:', colName)
            this.sortedDirection = (this.sortedDirection === 'asc' ? 'desc' : 'asc');
            if(this.sortedDirection === 'desc'){
                this.arrowDown = true;
                this.arrowUp = false;
            }
            this.arrowDown = false;
            this.arrowUp = true;
            console.log('sortedDirection:', this.sortedDirection);
        }else{
            this.sortedDirection = 'asc';
            this.arrowDown = false;
            this.arrowUp = true;
        }
        let isReverse = this.sortedDirection === 'asc' ? 1 : -1;
        console.log('isReverse:', isReverse);

        this.childRecords = JSON.parse( JSON.stringify( this.childRecords ) ).sort( ( a, b ) => {
            a = a[ colName ] ? a[ colName ].toLowerCase() : 'z'; 
            console.log('a:', a);
            b = b[ colName ] ? b[ colName ].toLowerCase() : 'z';
            return a > b ? 1 * isReverse : -1 * isReverse;
        });
        console.log('record in up down:', this.childRecords);

    }
}