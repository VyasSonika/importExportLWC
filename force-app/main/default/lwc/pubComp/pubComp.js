import { LightningElement,wire,track } from 'lwc';
import {CurrentPageReference} from 'lightning/navigation';
import {fireEvent} from 'c/pubSub';


export default class PubComp extends LightningElement {
@wire (CurrentPageReference) pageRef;

    calEvent(event){
        var eventParam = {'firstname': 'KnowledgePredator'};
        fireEvent(this.pageRef,'pubsubevent',eventParam);

    }
}