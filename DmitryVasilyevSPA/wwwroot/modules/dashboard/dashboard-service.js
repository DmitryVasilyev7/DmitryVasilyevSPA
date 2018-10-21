(function () {
    'use strict';

    angular
        .module('spaApp.dashboard')
        .factory('dashboardService', dashboardService);

    function dashboardService($http) {
        var service = {
            getCustomer: getCustomer,
            editCustomer: editCustomer,
            deleteCustomer: deleteCustomer,

            getOrder: getOrder,
            editOrder: editOrder,
            deleteOrder: deleteOrder,

            getOrderItem: getOrderItem,
            editOrderItem: editOrderItem,
            deleteOrderItem: deleteOrderItem,
        };
        return service;

        function getCustomer(id) {
            return $http.get('api/customer/' + id);
        }

        function editCustomer(customer) {
            return $http.post('api/customer/', customer);
        }

        function deleteCustomer(id) {
            return $http.delete('api/customer/' + id);
        }


        function getOrder(id) {
            return $http.get('api/order/' + id);
        }

        function editOrder(order) {
            return $http.post('api/order/', order);
        }

        function deleteOrder(id) {
            return $http.delete('api/order/' + id);
        }


        function getOrderItem(id) {
            return $http.get('api/orderItem/' + id);
        }

        function editOrderItem(item) {
            return $http.post('api/orderItem/', item);
        }

        function deleteOrderItem(id) {
            return $http.delete('api/orderItem/' + id);
        }
    }
})();