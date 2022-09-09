import {LightningElement, api, track} from 'lwc';

export default class ModelPopUp extends LightningElement {
    @api isopenmodel = false;
    @api recordId='';
    @api objectApiName;

    @api openmodal() {
        console.log('in open model block:');
        this.isopenmodel = true;
    }
    closeModal() {
        this.isopenmodel = false;
    } 
    saveMethod() {
        console.log('submit update blog')
    // to close modal set isModalOpen tarck value as false
        this.isopenmodel = false;
        const selectEvent = new CustomEvent('mycustomevent', {
        });
       this.dispatchEvent(selectEvent);
    }
    @api
    get getobjectapiname(){
        return this.objectApiName;
    }
    set getobjectapiname (value){
         this.objectApiName = value;
    }
    // handleEditSuccess(){
    //     this.isopenmodel = false;
    //     const showSuccess = new ShowToastEvent({ 
    //         title: 'Update!',
    //         message: 'Your record Updated .',
    //         variant: 'Success',
    //     });
    //     this.dispatchEvent(showSuccess);
    //     refreshApex(this.refreshTable);
    // }

}