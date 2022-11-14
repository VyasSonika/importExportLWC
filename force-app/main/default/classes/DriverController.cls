public with sharing class DriverController {

    @AuraEnabled(cacheable=true)
    public static List<Driver__c> getDriverList(){
        return [SELECT 
                    Id,
                    Contact__r.Name, 
                    Destination_Address__c, 
                    Location__c, 
                    Range__c,
                    Tags__c,
                    Destination_Name__c
                    FROM Driver__c WHERE Id !=NULL];
    }
    @AuraEnabled
    public static ContentVersion saveFileData(Id recordId, String strFileName, String base64Data) {
        // Decoding base64Data
        // base64Data = EncodingUtil.urlDecode(base64Data, 'UTF-8');
        
        // inserting file
        ContentVersion cv = new ContentVersion();
        cv.Title = strFileName;
        cv.PathOnClient = '/' + strFileName;
        cv.FirstPublishLocationId = recordId;
        cv.VersionData = EncodingUtil.base64Decode(base64Data);
        cv.IsMajorVersion = true;
        Insert cv;
        return cv;
    }

    @AuraEnabled
    public static list<Driver__c> releatedFiles(Id recordId){
        list<id> lstConDocs = new list<id>();
        list<Driver__c> dr = new list<Driver__c>();
        for(ContentDocumentLink cntLink : [Select Id, ContentDocumentId From ContentDocumentLink Where LinkedEntityId =:recordId]) {
            lstConDocs.add(cntLink.ContentDocumentId);
        }
        if(!lstConDocs.isEmpty()) {
            ContentVersion contentVersionObj = [SELECT Id, Title, ContentDocumentId FROM ContentVersion WHERE ContentDocumentId IN :lstConDocs];
            System.debug('contentVersionObj' + contentVersionObj);
            // split the file data
            list<String> csvRecordsList = contentVersionObj.VersionData.toString().split('\n');
            System.debug('csvRecordsList' + csvRecordsList);
            for(Integer i = 1; i < csvRecordsList.size(); i++){
                Driver__c d = new Driver__c();
                list<String> csvRowData = csvRecordsList[i].split(',');
                System.debug('csvRowData====> '+csvRowData);
                d.Destination_Name__c = csvRowData[0]; // dName
               // d.Destination_Address__c = csvRowData[1];
                d.Range__c = Decimal.valueOf(csvRowData[1]);
                d.Tags__c = csvRowData[2];
                d.Submit__c = csvRowData[3];
                if(!String.isBlank(recordId)){
                    d.Id = recordId;
                }
                dr.add(d);
                upsert dr;
                System.debug(dr);
            }
            return dr; 
        }   
        else {
            return null;
        }
    }

    @AuraEnabled
    public static String uploadFile(String base64, String filename, String recordId) {
        ContentVersion cv = createContentVersion(base64, filename, recordId);
        system.debug('cvId' + cv.Id);
        ContentDocumentLink cdl = createContentLink(cv.Id, recordId);
        system.debug('cdl' + cdl);
        if (cv == null || cdl == null) { return null; }
        return cdl.Id;
    }
    private static ContentVersion createContentVersion(String base64, String filename, String recordId) {
        ContentVersion cv = new ContentVersion();
        cv.VersionData = EncodingUtil.base64Decode(base64);
        cv.Title = filename;
        cv.PathOnClient = filename;
        cv.FirstPublishLocationId = recordId;
        system.debug('title' + cv.PathOnClient);
        try {
        insert cv;
        return cv;
        } catch(DMLException e) {
        System.debug(e);
        return null;
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
            insert cdl;
            return cdl;
        } catch(DMLException e) {
            System.debug(e);
            return null;
        }
    }
}
