import { api, LightningElement, track, wire } from 'lwc';
import { updateRecord, getRecord } from 'lightning/uiRecordApi';
import updateTemplateWithDocId from '@salesforce/apex/GOCDoc.updateTemplateWithDocId';
import createGoogleTemplate from '@salesforce/apex/GOCDoc.createGoogleTemplate';
import getAuthSecretFromMeta from '@salesforce/apex/GoogleAuthService.getAuthSecretFromMeta';
import { CloseActionScreenEvent } from 'lightning/actions';
import { NavigationMixin } from 'lightning/navigation';

const FIELDS  = ['GDOCTemplate__c.Google_Doc_Template_ID__c'];

export default class CreateUpdateDoc extends NavigationMixin(LightningElement) {
    @api recordId;
    @api googleDocId = '';

    @track value = '';
    @track showRadioGroup = false;
    @track selectedOption = '';
    @track optionSelected = false;
    @track isNew = false;
    @track isExisting = false;
    @track docId = '';
    @track docTitle = '';
    @track notAuthorized = false;
    @track docIdAvailable = false;
    @track updateOrCreateDoc = false;
    @track previousBtn = false;
    renderedCallback(){
        
    }
    connectedCallback(){
        
    }
    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    wiredRecord({ error, data }) {

        if (error) {
            console.log(error);
        } else if (data) {
            this.googleDocId = data.fields.Google_Doc_Template_ID__c.value;
            if(this.googleDocId != null && this.googleDocId != ''){
                this.docIdAvailable = true;
                console.log(this.googleDocId);
            }
            else {
                this.docIdAvailable = false;
                this.updateOrCreateDoc = true;
            }
           
        }
    }
    @wire(getAuthSecretFromMeta)
    wiredGetAuthSecretFromMeta(value){
        this.result = value;
        // Destructure the provisioned value
        const { data, error } = value;
        console.log(data);
        if(!error && data !== undefined){
            this.notAuthorized = !data;
            this.showRadioGroup = data;
            console.log('-----!data.data-----');
            console.log(!data);
            console.log('----data.data------');
            console.log(data);
            console.log('---notauthorizedflag-------');
            console.log(this.notAuthorized);
        } else if(error){
            console.log(error);
        }
    }

    get options(){
        return [
            { label: 'Create New Doc', value: 'New' },
            { label: 'Use Existing Doc', value: 'Existing' },
        ];
    }
    get optionNotSelected(){
        return !this.optionSelected;
    }
    refreshData(){
        return refreshApex(this.result);
    }
    updateRecordView(recordId) {
        updateRecord({fields: { Id: recordId }});
    }
    closeQuickAction() {
        this.dispatchEvent(new CloseActionScreenEvent());
    }
    handleRadioChange(event){
        console.log(event.target.value);
        this.selectedOption = event.target.value;
        if(this.selectedOption != ''){
            this.optionSelected = true;
        }
    }
    handleUpdateDoc(event){
        this.updateOrCreateDoc = true;
        this.docIdAvailable = false;
        this.previousBtn = true;
    }
    handleStratDesign(event) {
        console.log( 'Inside the Open Tab' );
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                apiName: 'Template_Builder'
            },
            state: {
                c__crecordId: this.recordId
            }
        });
    }
    handlePreviousBtn(event){
        this.docIdAvailable = true;
        this.updateOrCreateDoc = false;
    }
    handleNextClick(event){
        this.optionSelected = false;
        console.log(this.selectedOption);
        if(this.selectedOption == 'New'){
            this.showRadioGroup = false;
            this.isNew = true;
            console.log(this.isNew);
        } else if(this.selectedOption == 'Existing'){
            this.showRadioGroup = false;
            this.isExisting = true;
        }
        
        if(this.isNew && (this.docTitle != '' && this.docTitle != null)){
            this.optionSelected = false;
            createGoogleTemplate({docTitle : this.docTitle, recordId: this.recordId})
            .then(response => {
                this.googleDocId = response;
                console.log(this.googleDocId);
                this.updateRecordView(this.recordId);
                this.closeQuickAction();
            }).catch(error => {
                console.log(error);
            });
        }
        if(this.isExisting && (this.docId != '' && this.docId != null)){
            this.optionSelected = false;
            updateTemplateWithDocId({docId : this.docId, recordId: this.recordId})
            .then(response => {
                this.googleDocId = response;
                console.log(this.googleDocId);
                this.updateRecordView(this.recordId);
                this.closeQuickAction();
            }).catch(error => {
                console.log(error);
            });
        }
    }
    handleTitleInputChange(event){
        this.docTitle = event.target.value;
        console.log(event.target.value);
        console.log(this.docTitle);
        if(this.docTitle.trim() == '' || this.docTitle == null){
            this.optionSelected = false;
        } else {
            this.optionSelected = true;
        }
        this.docTitle = event.target.value;
    }
    handleDocIdInputChange(event){
        console.log(event.target.value);
        this.docId = event.target.value;
        console.log(this.docId);
        if(this.docId.trim() == '' || this.docId == null){
            this.optionSelected = false;
        } else {
            this.optionSelected = true;
        }
        this.docId = event.target.value;
    }
    handleAuthorized(event){
        this.refreshData();
        this.notAuthorized = false;
        this.showRadioGroup = true;
    }
}