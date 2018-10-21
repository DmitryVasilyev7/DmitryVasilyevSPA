(function () {
    'use strict';

    angular
        .module('spaApp.dashboard')
        .service("enums", function() {
            var self = this;

            self.states = [{
                id: 0,
                title: 'Draft'
            }, {
                id: 1,
                title: 'Paid'
            }, {
                id: 2,
                title: 'Completed'
            }, {
                id: 3,
                title: 'Canceled'
            },];
        })
})();