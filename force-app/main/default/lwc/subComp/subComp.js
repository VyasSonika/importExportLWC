/* eslint-disable no-alert */
import { LightningElement,wire,track} from 'lwc';
import {registerListener,unregisterAllListeners} from 'c/pubSub';
import {CurrentPageReference} from 'lightning/navigation';
export default class SubComp extends LightningElement {
    @track myName = "Salesforce Predator";
    @wire (CurrentPageReference) pageRef;
    connectedCallback(){
        registerListener('pubsubevent',this.handleCallback,this);
        console.log('myName', this.myName);
    }

    disconnectedCallback(){
        unregisterAllListeners(this);
    }
 
    handleCallback(detail){
        alert('paramter from publisher ' + detail.firstname);
        this.myName = detail.firstname;
        console.log('myName', this.myName);
        
    }
}