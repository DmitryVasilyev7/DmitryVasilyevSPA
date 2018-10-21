(function () {
    'use strict';

    angular.module('spaApp.dashboard', [])
        .config([
            '$stateProvider', function($stateProvider) {
                $stateProvider
                    .state('customers', {
                        url: '/customers',
                        templateUrl: 'modules/dashboard/customers/customers.html',
                        controller: 'CustomersCtrl as vm'
                    })
                    .state('contacts', {
                        url: '/contacts',
                        templateUrl: 'modules/dashboard/contacts/contacts.html',
                        controller: 'ContactsCtrl as vm'
                    })
                    .state('about', {
                        url: '/about',
                        templateUrl: 'modules/dashboard/about/about.html',
                        controller: 'AboutCtrl as vm'
                    })
            }
        ]);
})();