(function () {
    'use strict';

    angular
        .module('spaApp.dashboard')
        .component("customerEditorPopup", {
            templateUrl: "/modules/dashboard/customers/components/customer-editor-popup.html",
            bindings: {
                config: "=",
                callback: '&'
            },
            controller: ["$scope", "dashboardService", function ($scope, dashboardService) {
                var ctrl = this;

                ctrl.customer = {
                    id: null,
                    name: null
                };

                ctrl.$onInit = function () {
                    ctrl.customerPopup = {
                        config: {
                            width: 500,
                            height: 400,
                            contentTemplate: "customerPopup",
                            showTitle: true,
                            title: "Create",
                            dragEnabled: true,
                            onHidden: function () {
                                $scope.$ctrl.config.visible = false;
                            },
                            onInitialized: function (e) {
                                ctrl.customerPopup.instance = e.component;
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
                            name: {
                                bindingOptions: {
                                    value: "$ctrl.customer.name"
                                }
                            }
                        }
                    };

                    ctrl.resetPopupData = function () {
                        ctrl.customer.id = null;
                        ctrl.customer.name = null;
                    };

                    $scope.$watch(function ($scope) { return $scope.$ctrl.config.visible },
                        function (newValue, oldValue) {
                            if (!ctrl.customerPopup.instance)
                                return;

                            if (newValue) {

                                if (ctrl.config.id) {
                                    dashboardService.getCustomer(ctrl.config.id).then(function (result) {
                                        ctrl.customer = result.data;
                                    })
                                } else {
                                    ctrl.resetPopupData();
                                }
                                
                                ctrl.customerPopup.instance.show();
                            } else {
                                ctrl.customerPopup.instance.hide();
                            }
                        }
                    );
                };

                ctrl.save = function () {
                    dashboardService.editCustomer(ctrl.customer).error(function (message) {
                        DevExpress.ui.notify({
                            message: "Error",
                            type: "error",
                            displayTime: 3000,
                            closeOnClick: true
                        });
                    }).success(function (result) {
                        DevExpress.ui.notify({
                            message: "Customer has been added",
                            type: "success",
                            displayTime: 3000,
                            closeOnClick: true
                        });

                        ctrl.customerPopup.instance.hide();
                        $scope.$ctrl.callback();
                    });
                };
            }]
        })
})();