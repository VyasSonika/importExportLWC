public with sharing class KanbanUtilityClass{
//     @AuraEnabled(Cacheable = true)
//  public static List<SObject> findRecords(String searchKey, String objectName,
//                                     String searchField, String columns){
//         if (searchKey != ''){
//             String key = '%' + searchKey + '%';
//             System.debug('-----key-----'+ key);
//             String query = 'SELECT Id, ' + columns + ' FROM ' + objectName + 
//                            ' WHERE ' + searchField + ' LIKE :key' + ' ORDER BY ' + searchField;
//             System.debug('-----query-----'+ query);
//             List<SObject> sObjectList = Database.query(QUERY);
//             System.debug('--------sObjectList-----'+ sObjectList);
//             return sObjectList;
//         } else{
//             return null;
//         }

    @AuraEnabled(Cacheable = true)
    public static List<Opportunity> getOpportunity(String searchKey) {

        // oppList = oppList + '%';

        // List<Opportunity> lstOpp = [SELECT  Id, Name, StageName FROM Opportunity WHERE Name LIKE :oppList];
        String query = 'SELECT Id, Name, AccountId, CloseDate, StageName FROM Opportunity';
        if (searchKey != ''){
            String key = '%' + searchKey + '%';
            query += ' WHERE Name LIKE :key';
        }
        List<Opportunity> lstOpp = Database.query(query);
        return lstOpp; 
    }
}