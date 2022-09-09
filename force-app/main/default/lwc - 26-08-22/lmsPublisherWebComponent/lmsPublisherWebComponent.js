import { LightningElement, wire, api } from 'lwc';
import getContactList from '@salesforce/apex/DataController.getContactList';

// Import message service features required for publishing and the message channel
import { publish, MessageContext } from 'lightning/messageService';
import RECORD_SELECTED_CHANNEL from '@salesforce/messageChannel/Record_Selected__c';

export default class LmsPublisherWebComponent extends LightningElement {
    @wire(getContactList)
    contacts;
    @wire(MessageContext)
    messageContext;

    // Respond to UI event by publishing message
    handleContactSelect(event) {
        console.log('record id', event.currenTarget.Id);
        const payload = { recordId: event.target.recordId };
        console.log('payload', JSON.stringify(payload));
        console.log('messageContext', this.messageContext);
        console.log('contact list', this.contacts);
        publish(this.messageContext, RECORD_SELECTED_CHANNEL, payload);
    }
}