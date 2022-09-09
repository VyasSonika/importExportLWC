import { LightningElement, track, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import { refreshApex } from '@salesforce/apex';
import addAccount from '@salesforce/apex/GetAccountList.addAccount';
import getAccountList from '@salesforce/apex/GetAccountList.getAccount';
import deleteAccount from '@salesforce/apex/GetAccountList.deleteAccount';
// import { fireEvent, registerListener, unregisterAllListeners } from 'c/pubsub';
import { publish, MessageContext } from 'lightning/messageService';
import RECORD_SELECTED_CHANNEL from '@salesforce/messageChannel/Record_Selected__c';
import getAccountList2 from '@salesforce/apex/DataController.getAccount';
   
    const actions = [
        { label: 'Edit', name: 'Edit' },
        { label: 'Delete', name: 'delete' },
        { label: 'ViewRelatedList', name: 'viewRelatedList' },

    ];
    const cols = [
        {label: 'Name', fieldName: 'Name', type: 'text', sortable: true, wrapText: true },
        {label: 'Website', fieldName: 'Website', type: 'url', sortable: true, wrapText: true },
        {label: 'BillingCity', fieldName: 'BillingCity', type: 'text', sortable: true, wrapText: true },
        {label: 'Phone', fieldName: 'Phone', type: 'phone', sortable: true, wrapText: true },
        {
            
            type: 'action',
            typeAttributes: { rowActions: actions },
        },
    
    ];
    
export default class accountDataTable extends LightningElement {
    @api lstAccount= [];
    @api account;
    @track columns  = cols;
    @track startPage = 0;
    @track endPage;
    @api accountId=''; 
    refreshTable;
    @api record;
    @track visible = false;
    @track openmodel = false;
    @track filterVal='';
    @track allData=[];
    accId='';
    @track filterVisible= false;
    recordName='';
    
    @wire(getAccountList) 
    wiredAccount(result){
        this.refreshTable = result;
        const { error, data } = result;
        if(data){ 
            console.log('data', data);
            this.lstAccount = data ;
        }
        if(error){
            console.error(error)
        }
    }
    saveRecord(){
        this.recordName =  this.template.querySelector('c-model-pop-up').openmodal();
    }
    updateDataHandler(event) {
        this.account=[...event.detail.records]
        console.log(JSON.parse(JSON.stringify(event.detail.records)))
        console.log(JSON.parse(JSON.stringify(this.account)))

    }
    @wire(MessageContext)
    messageContext;

    async handleAccountAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        this.record = row;
        this.accountId= this.record.Id;
        console.log('record id', this.accountId);
        console.log('handleAccountAction', JSON.parse(JSON.stringify(this.record)));

        switch (actionName) {
            
            case 'delete':
                console.log('delete case');
                const confirmation = await this.template.querySelector('c-confirmation-dialog-promises').open('Delete a record', 'Are you sure?');
                console.log('confirmation block', confirmation);
                if(confirmation) {
                    console.log('in if block accountId', this.accountId);
                    deleteAccount({ accId : this.accountId })
                        .then(() => {
                            console.log('show success');
                            const showSuccess = new ShowToastEvent({
                                title: 'Deleted!',
                                message: 'Your record Deleted.',
                                variant: 'Success',
                            });
                        console.log('in delete');
                            
                            this.dispatchEvent(showSuccess);
                            return refreshApex(this.refreshTable);
                        })
                        .catch(error => { 
                            window.console.log('Error ====> '+JSON.stringify(error));
                            const showError = new ShowToastEvent({
                                title: 'Error!!',
                                message: 'error',
                                variant: 'error',
                            });
                            this.dispatchEvent(showError); 
                        });
                        this.visible=true;
                }
                break;
            case 'Edit':
                this.template.querySelector('c-model-pop-up').openmodal();
      
                break;
            case 'viewRelatedList':
                const payload = { recordId: this.accountId};
                console.log('payload', JSON.stringify(payload));
                console.log('message context', this.messageContext);
                publish(this.messageContext, RECORD_SELECTED_CHANNEL, payload);

            default:
        }

    }
    handleRefresh(){
        const evnt = new ShowToastEvent({
            title: "Success!",
            message: 'Record Updated',
        });
        console.log('event', evnt);
        this.dispatchEvent(evnt);
        refreshApex(this.refreshTable);
    }
    get filterOption(){
        return [
			{ label: "ALL", value: "" },
			{ label: "TODAY", value: "TODAY" },
			{ label: "THIS WEEK", value: "THIS_WEEK" },
			{ label: "THIS MONTH", value: "THIS_MONTH" },
			{ label: "THIS YEAR", value: "THIS_YEAR" },
			
		];
    }
     
    handleFilterChange(event){
        this.filterVal = event.detail.value;
        console.log('filter val:', this.filterVal);
        this.loadData();
    }
    connectedCallback(){
        console.log('account Id in loaddata method', this.lstAccount);
        // console.log('account Id in loaddata method', this.accId);

    }   
    loadData(){
        console.log('Inside load data blog');
        getAccountList2({dateFilter : this.filterVal})
            .then(result => {
                console.log('Result-',result)
                this.lstAccount = result;
            })
    }
}

