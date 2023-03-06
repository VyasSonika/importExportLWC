import { LightningElement, track, wire} from 'lwc';
import getAccount from '@salesforce/apex/GetAccountList.getAccount'
import getRelatedContact from '@salesforce/apex/GetAccountList.getRelatedContact'
import getRecords from '@salesforce/apex/GetAccountList.getRecords'

let recordsAcc = [];
let recordsCon = [];
export default class SelectAccountAndContact extends LightningElement {
    @track accounts = [];
    @track contacts = [];
    @track strAccounts = '';
    @track strContacts = '';
    accountId = '';
    contactId = '';
    refreshTableCon; 
    refreshTableAcc;
    @track placeholderAcc = 'Select Account.';
    @track placeholderCon = 'Select Contact.'
    
    @wire(getRecords)
    wiredAccount(result){
        this.refreshTableAcc = result; 
        // let { error, data } = result;
        if(result.data){ 
            console.log('data', result.data);
            let tempAcc = JSON.parse(JSON.stringify(result.data));
            let tempCon = [];
            tempAcc.forEach(item => {
                item.label = item.Name;
                item.value = item.Id;
                let cont = {};
                tempCon.push(...item.Contacts);
                // this.accountId = item.Id;
           })
           recordsAcc = [ { label: '---None---', value: 'None' }, ...tempAcc];
           console.log('accouts:----', recordsAcc);
           this.accounts = recordsAcc;
           console.log('contcts:----', tempCon);
        //    console.log('accouts:----', JSON.stringify(recordsAcc));
        //    this.strAccounts = JSON.stringify(this.accounts);
        }
        if(result.error){
            console.error(result.error)
        }
    }
    // @wire(getAccount)
    // wiredAccount(result){
    //     this.refreshTableAcc = result; 
    //     let { error, data } = result;
    //     if(data){ 
    //         console.log('data', data);
    //         let tempAcc = JSON.parse(JSON.stringify(data));
    //         tempAcc.map(item => {
    //             item.label = item.Name;
    //             item.value = item.Id;
    //             this.accountId = item.Id;
    //        })
    //        recordsAcc = [ { label: '---None---', value: 'None' }, ...tempAcc];
    //        console.log('accouts:----', recordsAcc);

    //        this.accounts = recordsAcc;
           
    //     //    console.log('accouts:----', JSON.stringify(recordsAcc));
    //     //    this.strAccounts = JSON.stringify(this.accounts);
    //     }
    //     if(error){
    //         console.error(error)
    //     }
    // }
    // @wire(getRelatedContact, { accId: '$accountId'} )
    // wiredContact(result){
    //     this.refreshTableCon = result; 
    //     const { error, data } = result;
    //     if(data){ 
    //         console.log('contact data', data);
    //         let tempCon = JSON.parse(JSON.stringify(data));
    //         if(tempCon.length == 0){
    //             let emptyCon = {};
    //             emptyCon.label = 'Please select An Account.';
    //             emptyCon.value = 'Please select An Account.';
    //             tempCon.push(emptyCon);
    //             console.log('tempCon-------', tempCon);
    //             this.contacts = tempCon;

    //        }
    //        else{
    //             tempCon.forEach(item=>{
    //                 item.label = item.Name;
    //                 item.value = item.Id;
    //             })
    //             recordsCon = [ { label: '---None---', value: 'None' }, ...tempCon];
    //             this.contacts = recordsCon;
  
    //         }
    //     }
    //     if(error){
    //         console.error(error)
    //     }
    // }
    handleSelectonchange(evt){
        console.log('handle change value:- fron child', evt.detail.value);
        let recordId = evt.detail.value;
        this.accounts.forEach(ele=>{
            if(ele.Id === recordId){
                this.accountId = recordId;
                console.log('accountId:--', this.accountId);
            }
        })
        if(recordId === 'None'){
            this.contacts = [ { label: '---None---', value: 'None' }];
            console.log('change contact when none acc:--', this.contacts);

        }
       
        
    }
}