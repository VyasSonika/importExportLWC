import {LightningElement, track } from 'lwc';

export default class ParentComponent extends LightningElement {
    name = 'api Value from Parent';
    @track chilparam = 'second';
    handleClick(event){
        alert('inside handler of parent');
        this.chilparam = 'third';
    }
}