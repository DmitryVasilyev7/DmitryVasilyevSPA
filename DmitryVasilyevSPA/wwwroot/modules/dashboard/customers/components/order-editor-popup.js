(function () {
    'use strict';

    angular
        .module('spaApp.dashboard')
        .component("orderEditorPopup", {
            templateUrl: "/modules/dashboard/customers/components/order-editor-popup.html",
            bindings: {
                customer: "<",
                config: "=",
                callback: '&'
            },
            controller: ["$scope", "dashboardService", "enums", function($scope, dashboardService, enums) {
                var ctrl = this;

                ctrl.order = {
                    id: null,
                    number: null,
                    date: new Date(),
                    state: 0,
                    customerId: null
                };

                ctrl.$onInit = function() {
                    ctrl.orderPopup = {
                        config: {
                            width: 500,
                            height: 400,
                            contentTemplate: "orderPopup",
                            showTitle: true,
                            title: "Create",
                            dragEnabled: true,
                            onHidden: function () {
                                $scope.$ctrl.config.visible = false;
                            },
                            onInitialized: function (e) {
                                ctrl.orderPopup.instance = e.component;
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
                            number: {
                                bindingOptions: {
                                    value: "$ctrl.order.number" 
                                }
                            },
                            date: {
                                bindingOptions: {
                                    value: "$ctrl.order.date"
                                },
                                dataType: "date",
                                displayFormat: 'dd.MM.yyyy',
                                width: "100%"
                            },
                            state: {
                                bindingOptions: {
                                    value: "$ctrl.order.state"
                                },
                                valueExpr: "id",
                                displayExpr: "title",
                                dataSource: enums.states
                            }
                        }
                    };

                    ctrl.resetPopupData = function () {
                        ctrl.order.id = null;
                        ctrl.order.number = null;
                        ctrl.order.date = new Date();
                        ctrl.order.state = 0;
                        ctrl.order.customerId = null;
                    };

                    $scope.$watch(function ($scope) { return $scope.$ctrl.config.visible },
                        function (newValue, oldValue) {
                            if (!ctrl.orderPopup.instance)
                                return;

                            if (newValue) {
                                if (ctrl.config.id) {
                                    dashboardService.getOrder(ctrl.config.id).then(function (result) {
                                        ctrl.order = result.data;
                                    })
                                } else {
                                    ctrl.resetPopupData();
                                }

                                ctrl.orderPopup.instance.show();
                            } else {
                                ctrl.orderPopup.instance.hide();
                            }
                        }
                    );
                };

                ctrl.save = function() {
                    ctrl.order.customerId = ctrl.customer.id;
                    
                    dashboardService.editOrder(ctrl.order).error(function (message) {
                        DevExpress.ui.notify({
                            message: "Error",
                            type: "error",
                            displayTime: 3000,
                            closeOnClick: true
                        });
                    }).success(function (result) {
                        DevExpress.ui.notify({
                            message: "Order has been added",
                            type: "success",
                            displayTime: 3000,
                            closeOnClick: true
                        });

                        ctrl.orderPopup.instance.hide();
                        $scope.$ctrl.callback();
                    });
                };
            }]
        })
})();