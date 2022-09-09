({
    getValueFromLwc : function(component, event, helper) {
        component.set("v.inputValue",event.getParam('value'));
    },
    
    handleValueChange : function(cmp, event, helper) {
        $A.get("e.force:closeQuickAction").fire();
    }
})