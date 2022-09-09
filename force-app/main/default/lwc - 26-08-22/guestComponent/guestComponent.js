import { LightningElement, track, wire } from 'lwc';
import { getPicklistValuesByRecordType } from 'lightning/uiObjectInfoApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import GUEST_OBJECT from '@salesforce/schema/Guest__c';

import saveGuest from '@salesforce/apex/GuestController.createGuest';
    
    export default class GuestComponent extends LightningElement {
    @track guestName;
    @track address;
    @track phone;
    @track email;
    @track recordId;
    
    @track controllingValues = [];
    @track dependentValues = [];
    @track selectedType;
    @track selectedMealPreference;
    @track isEmpty = false;
    @track error;
    controlValues;
    totalDependentValues = [];
    @track data;
    
guestChangeName(event) {
    this.guestName = event.detail.value;
}
changeAddress(event) {
    this.address = event.detail.value;
}
onChangePhone(event) {
    this.phone = event.detail.value;
}
onChangeEmail(event) {
    this.email = event.detail.value;
}

@wire(getObjectInfo, { objectApiName: GUEST_OBJECT })
objectInfo;

// Picklist values based on record type
@wire(getPicklistValuesByRecordType, { objectApiName: GUEST_OBJECT, recordTypeId: '$objectInfo.data.defaultRecordTypeId'})
countryPicklistValues({error, data}) {
                       if(data) {
                       this.error = null;
                       
                       let mealOptions = [{label:'--None--', value:'--None--'}];
                      
                      
                      data.picklistFieldValues.Meal_Preference__c.values.forEach(key => {
                      mealOptions.push({
                      label : key.label,
                      value: key.value
                      })
});

this.controllingValues = mealOptions;

let typeOptions = [{label:'--None--', value:'--None--'}];

this.controlValues = data.picklistFieldValues.Meal_Type__c.controllerValues;
this.totalDependentValues = data.picklistFieldValues.Meal_Type__c.values;
this.totalDependentValues.forEach(key => {
    typeOptions.push({
    label : key.label,
    value: key.value
})
});

this.dependentValues = typeOptions;
}
else if(error) {
    this.error = JSON.stringify(error);
}
}

handleMealPreferenceChange(event) {
    // Selected Meal Preference Value
    this.selectedMealPreference = event.target.value;
    this.isEmpty = false;
    let dependValues = [];
    
    if(this.selectedMealPreference) {
        // if Selected Meal Preference is none returns nothing
        if(this.selectedMealPreference === '--None--') {
            this.isEmpty = true;
            dependValues = [{label:'--None--', value:'--None--'}];
            this.selectedMealPreference = null;
            this.selectedType = null;
            return;
        }
        
        // filter the total dependent values based on selected meal preference value 
        this.totalDependentValues.forEach(conValues => {
            if(conValues.validFor[0] === this.controlValues[this.selectedMealPreference]) {
            dependValues.push({
            label: conValues.label,
            value: conValues.value
        })
    }
})

this.dependentValues = dependValues;
}
}

handleMealTypeChange(event) {
    this.selectedType = event.target.value;
}

//To Save the Record 
saveRecord() {
    
    let guestObj = { 'sobjectType': 'Guest__c' };
    guestObj.Name = this.guestName;
    guestObj.Address__c = this.address;
    guestObj.Email__c = this.email;
    guestObj.Phone__c = this.phone;
    guestObj.Meal_Preference__c = this.selectedMealPreference;
    guestObj.Meal_Type__c = this.selectedType;

    const value = true;
    const valueChangeEvent = new CustomEvent("valuechange", {
      detail: { value }
    });
    // Fire the custom event
    this.dispatchEvent(valueChangeEvent);

    saveGuest({newRecord: guestObj})
        .then(result => {
            this.recordId = result;
        })
        .catch(error => {
            this.error = error;
        });
}
}