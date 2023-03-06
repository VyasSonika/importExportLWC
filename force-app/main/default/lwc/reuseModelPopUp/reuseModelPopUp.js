import { LightningElement, api } from 'lwc';
import jQuerPlugin from '@salesforce/resourceUrl/jQuerPlugin';
// import SELECT_2_JS from '@salesforce/resourceUrl/Select2JS';
// import SELECT_2_JQUERY from '@salesforce/resourceUrl/Select2JQuery';
// import SELECT_2_CSS from '@salesforce/resourceUrl/Select2CSS';

import { loadScript, loadStyle } from 'lightning/platformResourceLoader';

export default class ReuseModelPopUp extends LightningElement {
    @api options;
    value = '';
    renderedCallback(){
        Promise.all([
            loadScript(this, jQuerPlugin)
        ]).then(()=>{
            console.log('jQuerPlugin loaded in dom');
            $(this.template.querySelector('select')).selectron();

        }).catch(error => {
            console.log("Error " + error);
        });
    }
    // connectedCallback(){
    //     console.log('option:--', this.options);
    //     console.log('option:--', this.select2);

    //     Promise.all([
    //         loadScript(this, SELECT_2_JQUERY),
    //         loadScript(this, SELECT_2_JS),
    //         loadStyle(this, SELECT_2_CSS)
    //     ]).then(result => {
    //         console.log('Files loaded.New', result);
    //         $(this.template.querySelector('.js-example-basic-single')).select2();

    //     }).catch(error => {
    //         console.log("Error " + error);
    //     });
    // }
    handleChange(evt){
        console.log('event:--', evt.target.value);
        this.value = evt.target.value;
        this.options.map(item=>{
            item = Object.assign({[item.label]: this.value}, {[item.value]: this.value}); 
            console.log('item:--', item);
        })
    }
}