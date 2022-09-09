import { LightningElement,track,api} from 'lwc';

export default class ChildCMP extends LightningElement {

    @track trackParam;
    @api apiParam;
    nonReactiveProp = "nonReactiveValue";
    @api myName='first';

    handleparamValues(){
       this.trackParam = "value changed for trackParam";
       this.apiParam = "Value changed for APIParam";
       this.nonReactiveProp = "value changed fro non reactive Param";
    }
    handleMe(event){
        const childEvent = new CustomEvent('buttonclick');//Created Event
        this.dispatchEvent(childEvent); // Dispatched the Event

    }

}