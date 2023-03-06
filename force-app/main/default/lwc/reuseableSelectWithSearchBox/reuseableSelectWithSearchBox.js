import { LightningElement, api, track } from 'lwc';

/** The delay used when debouncing event handdlers before invoking functions. */
const delay = 350;
export default class ReuseableSelectWithSearchBox extends LightningElement {

    //functional properties
    @api fieldLabel;
    disabled = false;
    @track openDropDown = false;
    @track inputValue = "";
    @api placeholder;
    @api options;
    @track optionsToDisplay;
    value = "";
    label = "";
    delaytimeout;
    valueMatch = false;
    _rendered = false;

    proxyObject(obje){
        return JSON.parse(obje);
    }

    connectedCallback() {
        // console.log('option:-', );
        this.options = this.proxyObject(this.options);
        // let options = this.options;
        // options.map(item=>{
        //     item.label = item.first_name;
        //     item.value = item.id;
        //     // console.log('modify item:-', item);

        // })
        console.log('modify option:-', this.options);
        this.setOptionsAndValues(this.options);
    }

    // renderedCallback() {
    //     console.log('render callback call');
    //    let  value = this.value;
    //     // if (this.openDropDown) {
    //     //     //need to update this line.
    //     //     this.template.querySelector('.search-input-class').focus();
    //     //     console.log('search:--');
    //     // }
    //     let selectedOpt = this.template.querySelector(`.slds-listbox__item[data-value='${value}']`);
    //     selectedOpt.style.backgroundColor = 'yellow';
    // }
 
    //Public Method to set options and values
    @api setOptionsAndValues(options) {
        this.valueMatch = true;
        
        console.log('setOptionsAndValues:-', this.value);
        console.log('set option value:-', options);
        this.optionsToDisplay = (options && options.length > 0 ? options : []);
        console.log('optionsToDisplay:-', this.optionsToDisplay);
        if (this.value && this.value != "") {
            let label = this.getLabel(this.value);
            console.log('label', label);
            if (label && label != "") {
                this.label = label;
            }

        }
        else {
            this.label = "";
        }
    }

    //Method to get Label for value provided
    getLabel(value) {
        let optValue = value;
        console.log('getLabel:-', optValue);
        let selectedObjArray = this.options.filter(obj => obj.value === value);
        console.log('selectedObjArray:--', selectedObjArray);
        if (selectedObjArray && selectedObjArray.length > 0) {
            return selectedObjArray[0].label;
        }
        return null;
    }

    //Method to open listbox dropdown
    openDropDown(event) {
        this.toggleOpenDropDown(true);
    }

    //Method to close listbox dropdown
    // closeDropdown(event) {
    //     console.log('relatedTarget:--', event.relatedTarget);
    //     if (event.relatedTarget && event.relatedTarget.tagName == "UL" && event.relatedTarget.className.includes('customClass')) {
    //         console.log(JSON.stringify(event.relatedTarget.className));
    //         console.log('openDropDown:-', this.openDropDown);
    //         if (this.openDropDown) {
    //             this.template.querySelector('.search-input-class').focus();
    //         }
    //     }
    //     else {
    //         window.setTimeout(() => {
    //             this.toggleOpenDropDown(false);
    //         }, 1000);
    //     }
    // }
    // closeDropdown(){
    //     console.log('close drop down');
    //     this.toggleOpenDropDown(false);

    // }
    //Method to handle readonly input click
    handleInputClick(event) {
        this.resetParameters();
        this.toggleOpenDropDown(true);
        console.log('input click', event.target.value);
        let value = event.target.value;
        let newOpt = this.template.querySelectorAll('.slds-listbox__item');
        newOpt.forEach(ele=>{
            console.log('ele:-', ele.dataset.label);
            if(ele.dataset.label === value){
                console.log('option  match------', ele.dataset.label)
                let selectedOpt = this.template.querySelector(`.slds-listbox__item[data-value='${value}']`);
                selectedOpt.style.backgroundColor = 'yellow';
            }else{
                console.log('option not match====', ele.dataset.label);
                let valuChange = ele.dataset.label;
                let opt = this.template.querySelector(`.slds-listbox__item[data-value='${valuChange}']`)
                opt.style.backgroundColor = 'white';
            }
        })
        
    }

    //Method to handle key press on text input
    handleKeyPress(event) {
        const searchKey = event.target.value;
        console.log('searchKey', searchKey);
        this.setInputValue(searchKey);
        this.filterDropdownList(searchKey);

        // if (this.delaytimeout) {
        //     window.clearTimeout(this.delaytimeout);
        // }

        // this.delaytimeout = setTimeout(() => {
        //     //filter dropdown list based on search key parameter
        //     this.filterDropdownList(searchKey);
        // }, delay);
        // console.log('delaytimeout:--', this.delaytimeout);
    }

    //Method to filter dropdown list
    filterDropdownList(key) {
        let value = this.value;
        let  filteredOptions = this.options.filter(item => item.label.toLowerCase().includes(key.toLowerCase()));
        if(filteredOptions != 0){
            this.optionsToDisplay = filteredOptions;
            console.log('filteredOptions:--', this.optionsToDisplay);
            this.valueMatch = true;
        }else{
            this.valueMatch = false;
        }
        
    }

    //Method to handle selected options in listbox
    optionsClickHandler(event) {
        let value = event.target.closest('li').dataset.value;
        console.log('option value:-', value);
        let label = event.target.closest('li').dataset.label;
        console.log('option label:-', label);
        this.setValues(value, label);
        this.toggleOpenDropDown(false);
        const detail = {};
        detail["value"] = value;
        detail["label"] = label;
        this.dispatchEvent(new CustomEvent('change', { detail: detail }));
        
    }

    //Method to reset necessary properties
    resetParameters() {
        this.setInputValue("");
        this.optionsToDisplay = this.options;
    }

    //Method to set inputValue for search input box
    setInputValue(value) {
        this.inputValue = value;
        if(this.inputValue == ''){
            console.log('setInputValue:-', this.inputValue);
            this.setOptionsAndValues(this.options);
        }
    }

    //Method to set label and value based on
    //the parameter provided
    setValues(value, label) {
        console.log('set value', value);
        this.label = label;
        this.value = value;
    }

    //Method to toggle openDropDown state
    toggleOpenDropDown(toggleState) {
        this.openDropDown = toggleState;
    }

    //getter setter for labelClass
    get labelClass() {
        return (this.fieldLabel && this.fieldLabel != "" ? "slds-form-element__label slds-show" : "slds-form-element__label slds-hide")
    }

    //getter setter for dropDownClass
    get dropDownClass() {
        return (this.openDropDown ? "slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open" : "slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click");
    }

    //getter setter for isValueSelected
    get isValueSelected() {
        return (this.label && this.label != "" ? true : false);
    }

    get isDropdownOpen() {
        return (this.openDropDown ? true : false);
    }
    @api
    get optionsChange(){
        return this.options;
    }
    set optionsChange(val){
        this.options = val
        console.log('set method', this.options);
    }
    removeText(){
        this.inputValue = ""; 
        this.openDropDown = false;
        this.setOptionsAndValues(this.options);
       
    }
}
