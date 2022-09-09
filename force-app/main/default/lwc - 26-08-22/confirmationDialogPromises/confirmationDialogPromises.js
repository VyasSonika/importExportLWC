import { LightningElement, api, track } from 'lwc';

export default class ConfirmationDialogPromises extends LightningElement {
  @track title;
  @track message='';
  @track confirmLabel;
  @track cancelLabel;
  @track visible = false;

  resolveTemplate = () => {};
  @api open(title, message, confirmLabel='Yes', cancelLabel='No') {
    return new Promise(resolve => {
      this.resolveTemplate = resolve;
      this.title = title;
      this.message = message;
      this.confirmLabel = confirmLabel;
      this.cancelLabel = cancelLabel;
      this.visible = true;
    });
  }

  handleClick(event) {
    let result;
    console.log('in handle click comfirmationbox', event.target.value);
    if (event.target.value === 'confirm') {
      result = true;
    }
    this.resolveTemplate(result);
    // this.open('Delate a record', 'Are you sure?', 'Yes', 'No');
    this.visible = false;
  }
}