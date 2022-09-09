import { LightningElement, wire, api } from "lwc";
//import { getListUi } from 'lightning/uiListApi';
import getOpportunity from "@salesforce/apex/KanbanUtilityClass.getOpportunity";
//import { CurrentPageReference } from 'lightning/navigation';
import { updateRecord } from "lightning/uiRecordApi";
import { refreshApex } from "@salesforce/apex";
import { getPicklistValues, getObjectInfo } from "lightning/uiObjectInfoApi";
import OPPORTUNITY_OBJECT from "@salesforce/schema/Opportunity";
import STAGE_FIELD from "@salesforce/schema/Opportunity.StageName";
import ID_FIELD from "@salesforce/schema/Opportunity.Id";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
export default class DragAndDropLwc extends LightningElement {
  records;
  pickVals;
  recordId;
  searchKey = "";
  columns;
  refreshTable;
  dragRecordId;
  updateRecord;
  currentPage = 1;
  totalRecords = 0;
  @api recordSize = 5;
  totalPage;
  items;
  allRecords;

  
  @wire(getOpportunity, {
    searchKey: "$searchKey",
  })
  wiredOpportunity( value ) {
      
      this.allRecords = value;
      const { data, error } = value;
      if (data) {
          this.processRecords(data);

      } else if (error) {
          console.error(error);
      }
  }
  
  // wiredOpportunity({ error, data }) {
  //   if (data) {
  //     console.log("getOpoortunity", data);
  //     this.allRecords= data;
  //     this.processRecords(data);
  //     console.log("----hello error--");
  //   }
  //   if (error) {
  //     console.error(error);
  //   }
  // }
  @api
  refreshData(){
    refreshApex(this.allRecords);
    return refreshApex(this.result);
  }

  handleKeyChange(event) {
    this.searchKey = event.target.value;
    console.log("------searchKey----", this.searchKey);
    this.currentPage=1; 
    this.refreshData();
  }

  /** Fetch metadata abaout the opportunity object**/
  @wire(getObjectInfo, { objectApiName: OPPORTUNITY_OBJECT })
  objectInfo;
  /*** fetching Stage Picklist ***/

  @wire(getPicklistValues, {
    recordTypeId: "$objectInfo.data.defaultRecordTypeId",
    fieldApiName: STAGE_FIELD,
  })
  stagePicklistValues({ data, error }) {
    if (data) {
      console.log("Stage Picklist", data);
      this.pickVals = data.values.map((item) => item.value);
    }
    if (error) {
      console.error(error);
    }
  }
  processRecords(data) {
    this.items = data;
    this.totalRecords = data.length;
    console.log('totalRecords', this.totalRecords);
    this.totalPage = Math.ceil(this.totalRecords / this.recordSize);
    this.records = this.items.slice(0, this.recordSize);
    //this.page = this.records.length;
    //console.log('page size',this.records.length);
    console.log("Record in process record method:", this.records);
    this.endingRecord = this.recordSize;
  }

  /****getter to calculate the  width dynamically*/
  get calcWidth() {
    let len = this.pickVals.length + 1;
    return `width: calc(100vw/ ${len})`;
  }

  handleListItemDrag(event) {
    this.recordId = event.detail;
  }

  handleItemDrop(event) {
    let stage = event.detail;
    console.log('drag and drop', { stage });
    this.updateHandler(stage);
  }
  updateHandler(stage) {
    console.log("line 1");
    const fields = {};
    fields[ID_FIELD.fieldApiName] = this.recordId;
    console.log("line 2");
    fields[STAGE_FIELD.fieldApiName] = stage;
    console.log("line 3");
    const recordInput = { fields };
    console.log("line 4");
    updateRecord(recordInput)
      .then(() => {
        console.log("Updated Successfully");
        this.showToast();
        this.refreshData();

        //return refreshApex(this.wiredOpportunity);
      })
      .catch((error) => {
        console.error(error);
      });
    console.log("line 5");
  }

  showToast() {
    this.dispatchEvent(
      new ShowToastEvent({
        title: "Success",
        message: "Stage updated Successfully",
        variant: "success",
      })
    );
  }

  get disablePrevious() {
    return this.currentPage <= 1;
  }
  get disableNext() {
    return this.currentPage >= this.totalPage;
  }
  previousHandler() {
    //isPageChanged = true;
    if (this.currentPage > 1) {
      this.currentPage = this.currentPage - 1;
      this.displayRecordPerPage(this.currentPage);
    }
  }
  nextHandler() {
    //isPageChanged = true;
    if (this.currentPage < this.totalPage) {
      this.currentPage = this.currentPage + 1;
      console.log('nexHandler', this.currentPage);
      this.displayRecordPerPage(this.currentPage);
    }
  }
  displayRecordPerPage(currentPage) {
    this.startingRecord = (currentPage - 1) * this.recordSize;
    console.log('startingRecord', this.startingRecord);
    this.endingRecord = this.recordSize * currentPage;
    console.log('endingRecord', this.endingRecord);

    this.endingRecord = this.endingRecord > this.totalRecords
                                          ? this.totalRecords
                                          : this.endingRecord;
    console.log('endingRecord', this.endingRecord);
    this.records = this.items.slice(this.startingRecord, this.endingRecord);
    console.log('records in displayRecordPage', this.records );
    this.startingRecord = this.startingRecord + 1;
    console.log('starttingRecord', this.startingRecord);
    if(!this.isPageChanged || this.initialLoad){
        this.isPageChanged = true;
        this.initialLoad =false;
    }
    this.refreshData();
  }
  
}