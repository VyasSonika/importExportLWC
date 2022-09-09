import { LightningElement, api} from 'lwc';
import secondtemplate from './lifecyclehooks2.html';

export default class LifeCycleChild extends LightningElement {
    // @api temp = 'simple template'
    connectedCallback() {
        console.log('child component');
        throw new Error('Whoops!');
   }
}