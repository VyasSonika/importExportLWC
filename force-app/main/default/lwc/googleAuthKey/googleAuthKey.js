import { LightningElement } from 'lwc';

export default class GoogleAuthKey extends LightningElement {
    authRec = {
        authKey: '',
        authSecret: ''
    }
    isAuthBtnDisabled = true;

    handleAuthInput(event){
        if(event.target.name == 'authKey'){
            this.authRec.authKey = event.target.value;
        } else if(event.target.name == 'authSecret'){
            this.authRec.authSecret = event.target.value;
        }
        if(this.authRec.authKey.trim() != '' 
            && this.authRec.authKey.trim() != null 
            && this.authRec.authSecret.trim() != '' 
            && this.authRec.authSecret.trim() != null
        ){
            console.log(this.authRec);
            this.isAuthBtnDisabled = false;
        } else {
            this.isAuthBtnDisabled = true;
        }
        // console.log(this.authRec);
    }
    handleAuthorizeClick(event){
        // apexfunctionCall({authKey: this.authRec.authKey.trim(), authSecret: this.authRec.authSecret.trim()})
        // .then(response => {
        //     console.log(response);
        //     const config = {
        //         type: 'standard__webPage',
        //         attributes: {
        //             url: response
        //         }
        //     };
        //     this[NavigationMixin.Navigate](config);
        // }).catch(error => {
        //     console.log(error);
        // });
    }
}