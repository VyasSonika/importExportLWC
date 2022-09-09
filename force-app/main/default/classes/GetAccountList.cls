public class GetAccountList {
    @AuraEnabled(cacheable=true)
    public static List<Account>getAccount(){
        List<Account> lstAccount = [SELECT Id, Name,
                                             Industry, 
                                             BillingCity, 
                                             Phone, 
                                             Website 
                                             FROM Account Order By Name Asc];
        //return list of accounts.
        System.debug(lstAccount);
        return lstAccount;
    }

    @AuraEnabled(cacheable=true)
    public static List<Account> getAccountSearch(String searchKey){
        String name = searchKey + '%';
       return [SELECT id, 
                        Name, 
                        BillingCity, 
                        Phone, 
                        Website 
                        FROM Account WHERE Name LIKE : name];
    }
    @AuraEnabled
    public static List<Account> deleteAccount(String accId){
        System.debug('accId '+ accId);
        Account acc = new Account(id= accId);
        delete acc;
        System.debug('acc'+ acc);
        return null;
    }
    @AuraEnabled
    public static Account addAccount(){
        Account acc = new Account();
        acc.Name = '';
        insert acc;
        return acc;
    }
    @AuraEnabled(cacheable=true)
    public static List<Account> getRelatedContact(String accId){
        return [SELECT Id,(SELECT Id, Name FROM Contacts) FROM Account WHERE Id=: accId];
    }
    @AuraEnabled(cacheable=true)
    public static List<Account> getRelatedOpportunity(String accId){
        return [SELECT Id,(SELECT Id, Name FROM Opportunities) FROM Account WHERE Id=: accId];
    }
}