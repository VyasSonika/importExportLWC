import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation'
export default class DragAndDropCard extends NavigationMixin(LightningElement) {
    @api stage
    @api record

    get isSameStage(){
        return this.stage === this.record.StageName
    }
    navigateOppHandler(event){
        event.preventDefault()
        this.navigateHandler(event.target.dataset.id, 'Opportunity')
    }
    navigateAccHandler(event){
        event.preventDefault()
        this.navigateHandler(event.target.dataset.id, 'Account')
    }
    navigateHandler(Id, apiName) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: Id,
                objectApiName: apiName,
                actionName: 'view',
            },
        });
    }
    itemDragStart(){
        const event = new CustomEvent('itemdrag', {
            detail: this.record.Id
        })
        this.dispatchEvent(event)
    }
    handleOnselect(event) {
        this.selectedItemValue = event.detail.value;

        if (this.selectedItemValue == 'Edit'){
            this.editVal = true;
        }else{
            this.editVal = false;
        }
       
        if (this.selectedItemValue == 'Save'){
            this.saveVal = true;
        }else{
            this.salesforceLWCVal = false;
        }
        
        if (this.selectedItemValue == 'Delete'){
            this.deleteval = true;
        }else{
            this.auraComponentVal = false;
        }
        if (this.selectedItemValue == 'salesforceTrigger'){
            this.salesforceTriggerVal = true;
        }else{
            this.salesforceTriggerVal = false;
        }

    }
}