(function () {
    "use strict";

    angular
        .module('spaApp.dashboard')
        .controller('CustomersCtrl', ["$scope", "enums", "_", "dashboardService", CustomersCtrl]);

    function CustomersCtrl($scope, enums, _, dashboardService) {
        var vm = $scope;

        vm.selectedCustomer = null;
        vm.selectedOrder = null;
        vm.states = enums.states;

        vm.customers = [];
        vm.orders = [];

        vm.getDataStore = function(type) {
            var url = null;
            var loadParams = null;

            switch (type) {
                case "customer":
                    url = "/api/customer";
                    break;

                case "order":
                    url = "/api/order";
                    if (vm.selectedCustomer)
                        loadParams = { customerId: vm.selectedCustomer.id };
                    break;

                case "orderItem":
                    url = "/api/orderItem";
                    if (vm.selectedOrder)
                        loadParams = { orderId: vm.selectedOrder.id };
                    break;
            }

            var store = DevExpress.data.AspNet.createStore({
                key: "id",
                loadUrl: url,
                updateUrl: url,
                deleteUrl: url,
                loadParams: loadParams
            });

            return store;
        };

        vm.grids = {
            customers: {
                dataSource: vm.getDataStore("customer"),
                noDataText: "Data empty",
                selection: {
                    mode: "single"
                },
                searchPanel: {
                    visible: true,
                    highlightCaseSensitive: true
                },
                columns: [
                    {
                        dataField: "name",
                        caption: "Name",
                        dataType: "string"
                    },{
                        dataField: "ordersCount",
                        caption: "Orders Count",
                        allowEditing: false
                    }, {
                        caption: "Action",
                        cellTemplate: "action-template",
                        width: 80,
                        alignment: "center",
                        allowFiltering: false
                    }
                ],
                onInitialized: function (e) {
                    vm.grids.customers.instance = e.component;
                },
                onRowRemoved: function(e) {
                    vm.selectedCustomer = null;
                },
                onSelectionChanged: function (selectedItems) {
                    var data = selectedItems.selectedRowsData[0];

                    if (data) {
                        vm.selectedCustomer = data;
                    }
                }
            },
            orders: {
                dataSource: vm.getDataStore("order"),
                noDataText: "Data empty",
                selection: {
                    mode: "single"
                },
                columns: [
                    {
                        dataField: "number",
                        caption: "Number"
                    },{
                        dataField: "date",
                        caption: "Date",
                        dataType: "date",
                        format: "dd.MM.yyyy",
                        alignment: "center"
                    }, {
                        dataField: "state",
                        caption: "State",
                        alignment: "center",
                        lookup: {
                            valueExpr: "id",
                            displayExpr: "title",
                            dataSource: vm.states
                        }
                    }, {
                        dataField: "itemsCount",
                        caption: "Items Count",
                        allowEditing: false
                    },{
                        dataField: "total",
                        caption: "Total",
                        format: "currency",
                        allowEditing: false
                    }, {
                        caption: "Action",
                        cellTemplate: "action-template",
                        width: 80,
                        alignment: "center",
                        allowFiltering: false
                    }
                ],
                onInitialized: function (e) {
                    vm.grids.orders.instance = e.component;
                },
                onSelectionChanged: function (selectedItems) {
                    var data = selectedItems.selectedRowsData[0];

                    if (data) {
                        vm.selectedOrder = data;
                    }
                },
                instance: null
            },
            orderItems: {
                dataSource: vm.getDataStore("orderItem"),
                noDataText: "Data empty",
                columns: [
                    {
                        cellTemplate: "possition-template",
                        caption: "Position",
                        alignment: "center",
                    },{
                        dataField: "product",
                        caption: "Product"
                    }, {
                        dataField: "count",
                        caption: "Count"
                    }, {
                        dataField: "price",
                        caption: "Price",
                        format: "currency"
                    }, {
                        calculateDisplayValue: function (item) {
                            return vm.getTotal(item.price, item.count);
                        },
                        alignment: "right",
                        caption: "Total",
                        allowEditing: false,
                        format: "currency"
                    }, {
                        caption: "Action",
                        cellTemplate: "action-template",
                        width: 80,
                        alignment: "center",
                        allowFiltering: false
                    }
                ],
                onCellPrepared: function (e) {
                    if (e.rowType == 'header') {
                        e.cellElement.css("text-align", "center");
                        if (e.column.command == 'edit') {
                            e.cellElement[0].innerText = "Actions";
                        }
                    }
                },
                onInitialized: function (e) {
                    vm.grids.orderItems.instance = e.component;
                },
                instance: null
            }
        };

        vm.popups = {
            customer: {
                config: {
                    visible: false,
                    id: null
                },
                callback: function () {
                    vm.grids.customers.instance.refresh();
                }
            },
            order: {
                config: {
                    visible: false,
                    id: null
                },
                callback: function () {
                    vm.grids.orders.instance.refresh();
                    
                    if(!vm.popups.order.config.id){
                        vm.grids.customers.instance.refresh();
                    }
                }
            },
            orderItem: {
                config: {
                    visible: false,
                    id: null
                },
                callback: function (id) {
                    vm.grids.orderItems.instance.refresh();
                    vm.grids.orders.instance.refresh();
                }
            }
        };

        vm.editCustomer = function(item) {
            if (item) {
                vm.popups.customer.config.id = item.id;
            } else {
                vm.popups.customer.config.id = null;
            }

            vm.popups.customer.config.visible = true;
        };

        vm.deleteCustomer = function (item) {
            dashboardService.deleteCustomer(item.id).error(function (message) {
                DevExpress.ui.notify({
                    message: "Error",
                    type: "error",
                    displayTime: 3000,
                    closeOnClick: true
                });
            }).success(function (result) {
                DevExpress.ui.notify({
                    message: "Customer has been deleted",
                    type: "success",
                    displayTime: 3000,
                    closeOnClick: true
                });

                vm.selectedCustomer = null;
                vm.grids.customers.instance.refresh();
            });
        };

        $scope.$watch('selectedCustomer', function (newVal) {
            vm.selectedCustomer
                ? vm.grids.orders.instance.option('dataSource', vm.getDataStore("order"))
                : vm.grids.orders.instance.option('dataSource', []);

            vm.selectedOrder = null;
        });

        vm.editOrder = function (item) {
            if (item) {
                vm.popups.order.config.id = item.id;
            } else {
                vm.popups.order.config.id = null;
            }

            vm.popups.order.config.visible = true;
        };

        vm.deleteOrder = function (item) {
            dashboardService.deleteOrder(item.id).error(function (message) {
                DevExpress.ui.notify({
                    message: "Error",
                    type: "error",
                    displayTime: 3000,
                    closeOnClick: true
                });
            }).success(function (result) {
                DevExpress.ui.notify({
                    message: "Order has been deleted",
                    type: "success",
                    displayTime: 3000,
                    closeOnClick: true
                });

                vm.selectedOrder = null;
                vm.grids.orders.instance.refresh();
                vm.grids.customers.instance.refresh();
            });
        };

        $scope.$watch('selectedOrder', function (newVal) {
            vm.selectedOrder
                ? vm.grids.orderItems.instance.option('dataSource', vm.getDataStore("orderItem"))
                : vm.grids.orderItems.instance.option('dataSource', []);
        });

        vm.editOrderItem = function (item) {
            if (item) {
                vm.popups.orderItem.config.id = item.id;
            } else {
                vm.popups.orderItem.config.id = null;
            }

            vm.popups.orderItem.config.visible = true;
        };

        vm.deleteOrderItem = function (item) {
            dashboardService.deleteOrderItem(item.id).error(function (message) {
                DevExpress.ui.notify({
                    message: "Error",
                    type: "error",
                    displayTime: 3000,
                    closeOnClick: true
                });
            }).success(function (result) {
                DevExpress.ui.notify({
                    message: "Product has been deleted",
                    type: "success",
                    displayTime: 3000,
                    closeOnClick: true
                });

                vm.grids.orderItems.instance.refresh();
                vm.grids.orders.instance.refresh();
            });
        };

        vm.getTotal = function (price, count) {
            return price * count;
        };
    }
})();