public with sharing class AccountController {
   @AuraEnabled(cacheable = true)
   public static List<Account> getAccountList(){
    return [SELECT Id , Name, Rating FROM Account WHERE Id != null];
   }
}
