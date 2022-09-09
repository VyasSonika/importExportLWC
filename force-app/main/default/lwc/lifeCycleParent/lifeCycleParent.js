import { LightningElement, api } from 'lwc';
     import firsttemplate from './lifecyclehooks.html';
//import secondtemplate from './lifecyclehooks2.html';
export default class LifeC extends LightningElement {
@api templateno = 'temp1';
    constructor(){
        super();
        console.log('Inside constructor');
    }
    connectedCallback(){
        console.log('Inside connected callback');
    }
    disconnectedCallback(){
        console.log('Inside disconnected callback');
    }
    render()
    {
        console.log('Inside render');
        if(this.templateno==='temp1')
        return firsttemplate;
        else return secondtemplate;
    }
    renderedCallback(){
        console.log('insiderender callback');
    }
    errorCallback(error, stack){
        console.log('error callback'+error);

    }
}