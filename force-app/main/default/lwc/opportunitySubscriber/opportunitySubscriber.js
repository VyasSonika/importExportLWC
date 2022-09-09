import { LightningElement, track, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import { refreshApex } from '@salesforce/apex';
// import addAccount from '@salesforce/apex/GetAccountList.addAccount';
import deleteAccount from '@salesforce/apex/GetAccountList.deleteAccount';
// import { fireEvent, registerListener, unregisterAllListeners } from 'c/pubsub';
import { subscribe, MessageContext } from 'lightning/messageService';
import RECORD_SELECTED_CHANNEL from '@salesforce/messageChannel/Record_Selected__c';
import getOpportunityList from '@salesforce/apex/DataController.getOpportunityList';

    
    const actions = [
        { label: 'Edit', name: 'Edit' },
        { label: 'Delete', name: 'delete' },
    ];
    const cols = [
        {label: 'Name', fieldName: 'Name', type: 'text', sortable: true, wrapText: true },
        {label: 'Account Name', fieldName: 'AccountId', type: 'text', sortable: true, wrapText: true },
        {label: 'Stage Name', fieldName: 'StageName', type: 'picklist', sortable: true, wrapText: true },
        {label: 'Close Date', fieldName: 'CloseDate', type: 'date', sortable: true, wrapText: true },
        {label: 'Amount', fieldName: 'Amount', type: 'currancy', sortable: true, wrapText: true },

        {
            
            type: 'action',
            typeAttributes: { rowActions: actions },
        },
    
    ];
    
export default class opportunitySubscriber extends LightningElement {
    oppList=[];
    opp;
    @track columns  = cols;
    @track startPage = 0;
    @track endPage;
    accountId; 
    recordId;
    refreshTable;
    record;
    @track visible = false;
    @track openmodel = false;

    
    @wire(getOpportunityList, { accId: '$recordId'}) 
    wiredOpportunity (result){
        this.refreshTable = result;
        const { error, data } = result;
        if(data){ 
            console.log('oportuntiy data', data);
            this.oppList = data ;
            //console.log(this.lstAccount)
        }
        if(error){
            console.error(error)
        }
    }
    updateDataHandler(event) {
        this.opp =[...event.detail.records]
        console.log(JSON.parse(JSON.stringify(event.detail.records)))
        console.log(JSON.parse(JSON.stringify(this.opp)))

    }
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
                    deleteAccount({accId:this.accountId})
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
                            this.isLoading=false;
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
            default:
        }

    }
    @wire(MessageContext)
    messageContext;

    // Encapsulate logic for LMS subscribe.
    subscribeToMessageChannel() {
        this.subscription = subscribe(
            this.messageContext,
            RECORD_SELECTED_CHANNEL, 
            (message) => this.handleMessage(message)
        );
        console.log('subscribeToMessageChannel ', this.messageContext);
         console.log('record id in subscriber', this.recordId);

    }

    // Handler for message received by component
    handleMessage(message) {
        console.log('mesasage record', message.recordId);
        this.recordId = message.recordId;
        // console.log('record id in subscriber handle', this.recordId);
    }

    // Standard lifecycle hooks used to sub/unsub to message channel
    connectedCallback() {
        this.subscribeToMessageChannel();
    
    }
    handleRefresh(){
        const evnt = new ShowToastEvent({
            "title": "Success!",
            "message": 'Record Updated',
        });
        this.dispatchEvent(evnt);
        refreshApex(this.refreshTable);
    }


}
