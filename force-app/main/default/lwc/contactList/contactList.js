import { LightningElement, wire, track } from 'lwc';
import getContacts from '@salesforce/apex/ContactController.getContacts';
import FIRSTNAME from '@salesforce/schema/Contact.FirstName';
import LASTNAME from '@salesforce/schema/Contact.LastName';
import EMAIL from '@salesforce/schema/Contact.Email'; 
col = [
    { label: 'First Name', fieldName: FIRSTNAME.fieldApiName, type: 'text' },
    { label: 'Last Name', fieldName: LASTNAME.fieldApiName, type: 'text' },
    { label: 'Email', fieldName: EMAIL.fieldApiName, type: 'email' }
];

export default class ContactList extends LightningElement {
    @track column = col;
    contacts = [];
    @wire(getContacts)
    if(data){
        this.contacts = data;
        console.log(this.contacts);
    }
}