(function () {
    'use strict';

    var spaApp = angular.module('spaApp', [
        'dx',
        'ui.router',
        'spaApp.dashboard',
        'underscore'
    ]);

    spaApp
        .config([
            '$urlRouterProvider', '$httpProvider',
            function ($urlRouterProvider, $httpProvider) {
                $urlRouterProvider.otherwise("/customers");
            }
        ])
}());