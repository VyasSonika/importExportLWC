import { LightningElement, api } from 'lwc';

export default class DragAndDropList extends LightningElement {
    @api records
    @api stage
    handleItemDrag(evt){
        const event = new CustomEvent('listitemdrag', {
            detail: evt.detail
        })
        this.dispatchEvent(event)
    }
    handleDragOver(evt){
        evt.preventDefault()
    }
    handleDrop(evt){
        console.log('event of handleDrop', evt);
        const event = new CustomEvent('itemdrop', {
            detail: this.stage
        })
        console.log('event', event);
        this.dispatchEvent(event)
    }
}