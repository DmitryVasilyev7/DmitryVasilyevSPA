(function () {
    'use strict';

    angular
        .module('spaApp.dashboard')
        .service("messages", function() {
            var self = this;

            self.sendMessage = function (type, text) {
                DevExpress.ui.notify({
                    message: text,
                    type: type,
                    displayTime: 3000,
                    closeOnClick: true
                });
            };
        })
})();