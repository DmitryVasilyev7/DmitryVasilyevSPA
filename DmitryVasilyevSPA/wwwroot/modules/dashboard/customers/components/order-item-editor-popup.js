(function () {
    'use strict';

    angular
        .module('spaApp.dashboard')
        .component("orderItemEditorPopup", {
            templateUrl: "/modules/dashboard/customers/components/order-item-editor-popup.html",
            bindings: {
                order: "<",
                config: "=",
                callback: '&'
            },
            controller: ["$scope", "dashboardService", "messages", function ($scope, dashboardService, messages) {
                var ctrl = this;

                ctrl.item = {
                    id: null,
                    count: null,
                    price: null,
                    product: null,
                    orderId: null
                };

                ctrl.$onInit = function() {
                    ctrl.itemPopup = {
                        config: {
                            width: 500,
                            height: 400,
                            contentTemplate: "itemPopup",
                            showTitle: true,
                            title: "Create",
                            dragEnabled: true,
                            onHidden: function () {
                                $scope.$ctrl.config.visible = false;
                            },
                            onInitialized: function (e) {
                                ctrl.itemPopup.instance = e.component;
                            },
                            toolbarItems: [{
                                toolbar: "bottom",
                                location: "before",
                                widget: 'dxButton',
                                options: {
                                    text: "Cancel",
                                    type: "normal",
                                    width: "100px",
                                    onClick: function () {
                                        $scope.$ctrl.config.visible = false
                                    }
                                }
                            }, {
                                toolbar: "bottom",
                                location: "after",
                                widget: 'dxButton',
                                options: {
                                    text: "Save",
                                    type: "success",
                                    width: "100px",
                                    onClick: function () {
                                        ctrl.save();
                                    }
                                }
                            }],
                            instance: null
                        },
                        visible: $scope.$ctrl.config.visible,
                        form: {
                            product: {
                                bindingOptions: {
                                    value: "$ctrl.item.product" 
                                }
                            },
                            count: {
                                bindingOptions: {
                                    value: "$ctrl.item.count"
                                },
                                dataType: "number"
                            },
                            price: {
                                bindingOptions: {
                                    value: "$ctrl.item.price"
                                },
                                dataType: "number"
                            }
                        }
                    };

                    ctrl.resetPopupData = function () {
                        ctrl.item.id = null;
                        ctrl.item.price = null;
                        ctrl.item.product = null;
                        ctrl.item.count = null;
                        ctrl.item.orderId = null;
                    };

                    $scope.$watch(function ($scope) { return $scope.$ctrl.config.visible },
                        function (newValue, oldValue) {
                            if (!ctrl.itemPopup.instance)
                                return;

                            if (newValue) {
                                if (ctrl.config.id) {
                                    dashboardService.getOrderItem(ctrl.config.id).then(function (result) {
                                        ctrl.item = result.data;
                                    })
                                } else {
                                    ctrl.resetPopupData();
                                }
                                
                                ctrl.itemPopup.instance.show();
                            } else {
                                ctrl.itemPopup.instance.hide();
                            }
                        }
                    );
                };

                ctrl.save = function() {
                    ctrl.item.orderId = ctrl.order.id;

                    dashboardService.editOrderItem(ctrl.item).error(function (message) {
                        messages.sendMessage("error", "Error");
                    }).success(function (result) {
                        messages.sendMessage("success", "Product has been added");

                        ctrl.itemPopup.instance.hide();
                        
                        $scope.$ctrl.callback();
                    });
                };
            }]
        })
})();