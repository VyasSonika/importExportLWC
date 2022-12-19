public with sharing class DriverController {

    @AuraEnabled(cacheable=true)
    public static List<Driver__c> getDriverList(){
        return [SELECT 
                    Id,
                    Name,
                    Contact__r.Name, 
                    Destination_Address__c, 
                    Location__c, 
                    Range__c,
                    Tags__c,
                    TripDate__c
                    FROM Driver__c ORDER BY Name ];
    }
    @AuraEnabled
    public static list<Driver__c> releatedFiles(Id conId){
        System.debug('content document id:' + conId);
        list<Driver__c> dr = new list<Driver__c>();
        ContentVersion contentVersionObj = [SELECT Id, 
                                                    VersionData 
                                                    FROM ContentVersion 
                                                    WHERE ContentDocumentId =:conId];
        System.debug('contentVersionObj' + contentVersionObj);
        // split the file data
        list<String> csvRecordsList = contentVersionObj.VersionData.toString().split('\n');
        System.debug('csvRecordsList' + csvRecordsList);
        for(Integer i = 1; i < csvRecordsList.size(); i++){
            Driver__c d = new Driver__c();
            list<String> csvRowData = csvRecordsList[i].split(',');
            System.debug('csvRowData====> '+csvRowData);
            d.Name = csvRowData[0];
            d.Range__c = decimal.valueOf(csvRowData[1]);
            d.Tags__c = csvRowData[2];
            //d.Submit__c = csvRowData[4];
            d.Destination_Address__CountryCode__s = csvRowData[3];
            d.Destination_Address__Street__s = csvRowData[4];
            d.Destination_Address__City__s = csvRowData[5];
            d.Destination_Address__StateCode__s = csvRowData[6];
            d.Destination_Address__PostalCode__s = csvRowData[7];

            dr.add(d);
            upsert dr;
            System.debug(dr);
        }
        return dr; 
    }   
    @AuraEnabled
    public static Driver__c updateRecord(String recordId, String desName, String desAddress, String range, String tag, String strdate){
        System.debug(recordId);
        System.debug(desName);
        System.debug(desAddress);
        System.debug(range);
        System.debug(tag);
        Driver__c d = new Driver__c(Id = recordId);
        String[] address     = desAddress.split(',');
        d.Destination_Address__CountryCode__s = address[0];
        d.Destination_Address__Street__s = address[1];
        d.Destination_Address__City__s = address[2];
        // d.Destination_Address__StateCode__s = address[3];
        d.Destination_Address__PostalCode__s = address[3];

        System.debug(d.Destination_Address__City__s);
        String strDate1 = strdate;
        LIst<String>dayList = strDate.split('-');
        d.TripDate__c = Date.newInstance(Integer.valueOf(dayList[0]), Integer.valueOf(dayList[1]), Integer.valueOf(dayList[2]));
        System.debug(d.TripDate__c);
        d.Name = desName;
        d.Range__c = decimal.valueOf(range);
        d.Tags__c = tag;
        update d;
        return d;
    }

    @AuraEnabled
    public static String uploadFile(Id recordId, String strFileName, String base64Data) {
        System.debug('base64Data:' + base64Data);
        System.debug('recordId:' + recordId);
        System.debug('strFileName:' + strFileName);
    
        ContentVersion cv = new ContentVersion();
        cv = createContentVersion(base64Data, strFileName, recordId);
        system.debug('cvId' + cv.Id);
        ContentDocumentLink cdl = createContentLink(cv.Id, recordId);
        system.debug('cdl' + cdl);
        return cdl.ContentDocumentId;
    }
    private static ContentVersion createContentVersion(String base64, String filename, String recordId) {
        ContentVersion cv = new ContentVersion();
        cv.VersionData = Blob.valueof(base64);
        system.debug('decode base64'+ cv.VersionData);
        cv.Title = filename;
        cv.PathOnClient = filename;
        cv.FirstPublishLocationId = recordId;
        system.debug('title' + cv.PathOnClient);
        try {
            if(cv.Id=='' || cv.Id == null){ insert cv; }
            return cv;
        } catch(DMLException e) {
        System.debug(e);
        return cv;
        }
    }
    private static ContentDocumentLink createContentLink(String contentVersionId, String recordId) {
            if (contentVersionId == null || recordId == null) { return null; }
        ContentDocumentLink cdl = new ContentDocumentLink();
            cdl.ContentDocumentId = [SELECT ContentDocumentId FROM ContentVersion WHERE Id =: contentVersionId
                                    ].ContentDocumentId;
        cdl.LinkedEntityId = recordId;
        // ShareType is either 'V', 'C', or 'I'
        // V = Viewer, C = Collaborator, I = Inferred
        cdl.ShareType = 'V';
        try {
            if(cdl.Id=='' || cdl.Id == null){ insert cdl; }
            return cdl;
        } catch(DMLException e) {
            System.debug(e);
            return cdl;
        }
    }
}
