public class CSVController {
    @AuraEnabled 
    public static String getCSVFileAsBase64String() {
        List<StaticResource> resourceList = [SELECT Id, Body FROM StaticResource WHERE Name = 'SiteSamples'];
        return EncodingUtil.base64Encode(resourceList[0].Body);
    }
}