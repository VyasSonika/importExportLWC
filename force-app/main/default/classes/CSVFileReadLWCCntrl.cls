public with sharing class CSVFileReadLWCCntrl {
    @AuraEnabled
    public static list<Account> csvFileRead(Id contentDocumentId){
        list<Account> accList = new list<Account>();
        if(contentDocumentId != null) {
            // Fetch File Data based on the basic of document id
            ContentVersion contentVersionObj = [SELECT Id, 
                                                        VersionData 
                                                        FROM ContentVersion 
                                                        WHERE ContentDocumentId =:contentDocumentId];
            System.debug('contentVersionObj' + contentVersionObj);
            // split the file data
            list<String> csvRecordsList = contentVersionObj.VersionData.toString().split('\n');
            System.debug('csvRecordsList' + csvRecordsList);

            for(Integer i = 1; i < csvRecordsList.size(); i++){
                Account acc = new Account();
                list<String> csvRowData = csvRecordsList[i].split(',');
                System.debug('csvRowData====> '+csvRowData);
                acc.Name = csvRowData[0]; // accName
                acc.Industry = csvRowData[1];
                acc.BillingCity = csvRowData[2];
                acc.Phone = csvRowData[3];
                acc.Website = csvRowData[4];
                accList.add(acc);
                System.debug(accList);
            }
            //insert accList;

        //     try{    
        //         if(!accList.isEmpty()) {
        //             //insert accList;
        //         }
        //     }
        //     catch (Exception ex) {
        //         throw new AuraHandledException(ex.getMessage());
        //     } 
         }
        return accList;    
    }
}