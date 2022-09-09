public with sharing class DataController {
    @AuraEnabled(cacheable= true)
    public static List<Contact> getContactList(String accId){
        return [SELECT Id, Name, Phone, Email, AccountId FROM Contact WHERE AccountId =: accId];
    }

    @AuraEnabled(cacheable= true)
    public static List<Opportunity> getOpportunityList(String accId){
        return [SELECT Id, Name, StageName, CloseDate, AccountId, Amount FROM Opportunity WHERE AccountId =:accId];
    }
    @AuraEnabled
    public static List<Account> getAccount(String dateFilter){
        // System.debug('accId :---'+accId);
        System.debug('data filteer :---'+dateFilter);

        String query = 'SELECT Id, Name, Industry, BillingCity, Phone, Website FROM Account ';
        System.debug('query :-- :---'+query);
        switch on dateFilter {
            when  'TODAY'{
                query = dateFilter == null ? query : query + ' WHERE CreatedDate = TODAY';
            }
            when 'THIS_WEEK' {
                query = dateFilter == null ? query : query + ' WHERE CreatedDate = THIS_WEEK';
            }
            when 'THIS_MONTH' {
                query = dateFilter == null ? query : query + ' WHERE CreatedDate = THIS_MONTH';
            }
            when 'THIS_YEAR' {
                query = dateFilter == null ? query : query + ' WHERE CreatedDate = THIS_YEAR';
            } 
            when else {
                query = query;
            }
        }
        // query = query + ' ORDER BY CreatedDate DESC';
        List<Account> lstAccount = new List<Account>();
        lstAccount= Database.query(query);
        System.debug('account list'+ lstAccount);
        return lstAccount;
    }   

}