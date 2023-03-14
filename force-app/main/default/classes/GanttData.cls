public without sharing class GanttData {
    @RemoteAction
    @AuraEnabled(cacheable=true)
    public static List<GanttTask__c> getTasks() {
 
        // fetching the Records via SOQL
        List<GanttTask__c> Tasks = new List<GanttTask__c>();
        Tasks = [SELECT Id, Name, Start_Date__c, Duration__c, 
                    Parent__c FROM GanttTask__c];
 
        // List<Driver__c> Links = new List<Driver__c>();
        // Links = [SELECT Id, Type__c, Source__c, Target__c FROM Driver__c];
 
        // Map<String, Object> result = new Map<String, Object>{
        //     'tasks' => Tasks, 'links' => Links };
        System.debug('Gantt chart task and link'+ Tasks);
        return Tasks;
   }
}