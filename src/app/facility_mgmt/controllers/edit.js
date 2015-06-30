(function(angular, _){
    "use strict";

    angular.module("mfl.facility_mgmt.controllers.edit", [
        "mfl.facility_mgmt.services",
        "mfl.auth.services"
    ])

    .controller("mfl.facility_mgmt.controllers.services_helper",
        ["$log", "mfl.facility_mgmt.services.wrappers",
        function ($log, wrappers) {
            var loadData = function ($scope) {
                wrappers.services.filter({page_size: 100, ordering: "name"})
                .success(function (data) {
                    $scope.services = data.results;
                })
                .error(function (data) {
                    $log.error(data);
                });
            };

            var addServiceOption = function ($scope, so) {
                var payload = {
                    facility: $scope.facility_id,
                    selected_option: so
                };
                wrappers.facility_services.create(payload)
                .success(function(data) {
                    $scope.facility.facility_services.push(data);
                })
                .error(function (data) {
                    $log.error(data);
                });
            };

            var removeServiceOption = function ($scope, fs) {
                wrappers.facility_services.remove(fs.id)
                .success(function () {
                    $scope.facility.facility_services = _.without(
                        $scope.facility.facility_services, fs
                    );
                })
                .error(function(data){
                    $log.error(data);
                });
            };

            this.bootstrap = function($scope) {
                loadData($scope);
                $scope.new_service = {
                    service: "",
                    option: ""
                };
                $scope.services = [];
                $scope.service_options = [];

                $scope.addServiceOption = function (a) {
                    addServiceOption($scope, a);
                };
                $scope.removeChild = function (a) {
                    removeServiceOption($scope, a);
                };
                $scope.$watch("new_service.service", function (newVal) {
                    var s = _.findWhere($scope.services, {"id": newVal});
                    if (angular.isDefined(s) && _.isArray(s.service_options)) {
                        $scope.service_options = s.service_options;
                    } else {
                        $scope.service_options = [];
                    }
                });
            };
        }]
    )

    .controller("mfl.facility_mgmt.controllers.facility_edit",
        ["$scope", "$log", "$stateParams", "mfl.facility_mgmt.services.wrappers",
        "mfl.auth.services.login",
        function ($scope, $log, $stateParams, wrappers, loginService) {
            $scope.facility_id = $stateParams.facility_id;
            $scope.spinner = true;
            wrappers.facility_detail.get($scope.facility_id)
                .success(function(data){
                    $scope.spinner = false;
                    $scope.facility = data;
                })
                .error(function (data) {
                    $log.error(data);
                });
            $scope.login_user = loginService.getUser();
        }]
    )

    .controller("mfl.facility_mgmt.controllers.facility_edit.basic",
        ["$scope", "$log", "$stateParams", "mfl.facility_mgmt.services.wrappers",
        function ($scope, $log, $stateParams, wrappers) {
            wrappers.facility_owners.filter({page_size: 100, "ordering": "name"})
            .success(function(data) {
                $scope.facility_owners = data.results;
            })
            .error(function(data) {
                $log.error(data);
            });

            wrappers.facility_types.filter({page_size: 100, "ordering": "name"})
            .success(function(data) {
                $scope.facility_types = data.results;
            })
            .error(function(data) {
                $log.error(data);
            });

            wrappers.wards.filter(
                {page_size: 500, "ordering": "name", "county": $scope.login_user.county})
            .success(function (data) {
                $scope.wards = data.results;
            })
            .error(function (data) {
                $log.error(data);
            });

            wrappers.towns.filter({page_size: 50000, "ordering": "name"})
            .success(function (data) {
                $scope.towns = data.results;
            })
            .error(function (data) {
                $log.error(data);
            });

            $scope.save = function () {};
        }]
    )

    .controller("mfl.facility_mgmt.controllers.facility_edit.contacts",
        ["$scope", "$log", "$stateParams", "mfl.facility_mgmt.services.wrappers",
        function($scope,$log,$stateParams,wrappers){

            $scope.contacts = [];
            $scope.contact = {
                contact_type: "",
                contact: ""
            };

            /*contact types*/
            wrappers.contact_types.list()
            .success(function(data){
                $scope.contact_types = data.results;
            })
            .error(function(error){
                $log.error(error);
            });

            /*facility contacts*/
            wrappers.facility_contacts.filter({facility:$stateParams.facility_id})
            .success(function(data){
                $scope.fac_contacts = data.results;
            })
            .error(function(error){
                $log.error(error);
            });

            /*remove contact*/
            $scope.removeChild = function (obj) {
                obj.delete_spinner = true;
                wrappers.facility_contacts.remove(obj.id)
                .success(function () {
                    wrappers.contacts.remove(obj.contact)
                    .success(function () {
                        $scope.fac_contacts = _.without($scope.fac_contacts, obj);
                        obj.delete_spinner = false;
                    })
                    .error(function (data) {
                        $log.error(data);
                        obj.delete_spinner = false;
                    });
                })
                .error(function (data) {
                    $log.error(data);
                    obj.delete_spinner = false;
                });
            };

            /*add contact*/
            $scope.add = function () {
                $scope.spinner = true;
                wrappers.contacts.create({
                    "contact_type": $scope.contact.contact_type,
                    "contact": $scope.contact.contact
                })
                .success(function (data) {
                    wrappers.facility_contacts.create({
                        "facility": $stateParams.facility_id,
                        "contact": data.id
                    })
                    .success(function (data) {
                        $scope.fac_contacts.push(data);
                        $scope.contact = {
                            contact_type: "",
                            contact: ""
                        };
                        $scope.spinner = false;
                    })
                    .error(function (data) {
                        $log.error(data);
                        $scope.spinner = false;
                    });
                })
                .error(function (data) {
                    $log.error(data);
                    $scope.spinner = false;
                });
            };
        }]
    )

    .controller("mfl.facility_mgmt.controllers.facility_edit.officers",
        ["$scope", "$log", "$stateParams", "mfl.facility_mgmt.services.wrappers",
        function($scope, $log, $stateParams, wrappers){
            $scope.fac_officers = [];

            /*officers*/
            wrappers.officers.list()
            .success(function(data){
                $scope.officers = data.results;
            })
            .error(function(error){
                $log.error(error);
            });
            /*facility officers*/
            wrappers.facility_officers.filter({facility:$stateParams.facility_id})
            .success(function(data){
                $scope.fac_officers = data.results;
            })
            .error(function(error){
                $log.error(error);
            });
            /*add existing officer to facility*/
            $scope.add = function () {
                $scope.spinner = true;
                wrappers.facility_officers.create({
                        "facility": $scope.facility_id,
                        "officer": $scope.officer.id
                    })
                    .success(function (data) {
                        $scope.fac_officers.push(data);
                        $scope.spinner = false;
                    })
                    .error(function (data) {
                        $log.error(data);
                        $scope.spinner = false;
                    });
            };
            /*remove officer*/
            $scope.removeChild = function (obj) {
                obj.delete_spinner = true;
                wrappers.facility_officers.remove(obj.id)
                .success(function () {
                    $scope.fac_officers = _.without($scope.fac_officers, obj);
                    obj.delete_spinner = false;
                })
                .error(function (data) {
                    $log.error(data);
                    obj.delete_spinner = false;
                });
            };
        }])

    .controller("mfl.facility_mgmt.controllers.facility_edit.services",
        ["$scope", "$controller", function ($scope, $controller) {
            var helper = $controller("mfl.facility_mgmt.controllers.services_helper");
            helper.bootstrap($scope);
        }]
    )

    .controller("mfl.facility_mgmt.controllers.facility_edit.units",
        ["$scope", "$log", "$stateParams", "mfl.facility_mgmt.services.wrappers",
        function ($scope, $log, $stateParams, wrappers) {

            /*regulating bodies*/
            wrappers.regulating_bodies.list()
            .success(function(data){
                $scope.regbodies = data.results;
            })
            .error(function(error){
                $log.error(error);
            });

            /*facility units*/
            wrappers.facility_units.filter({facility:$scope.facility_id})
            .success(function(data){
                $scope.fac_units = data.results;
            })
            .error(function(error){
                $log.error(error);
            });

            /*add existing regulatory to facility*/
            $scope.add = function () {
                $scope.spinner = true;
                wrappers.facility_units.create({
                        "facility": $scope.facility_id,
                        "regulating_body": $scope.facility_unit.regulating_body,
                        "name": $scope.facility_unit.name,
                        "description": $scope.facility_unit.description
                    })
                    .success(function (data) {
                        $scope.fac_units.push(data);
                        $scope.spinner = false;
                    })
                    .error(function (data) {
                        $log.error(data);
                        $scope.spinner = false;
                    });
            };

            /*remove facility unit*/
            $scope.removeChild = function (obj) {
                obj.delete_spinner = true;
                wrappers.facility_units.remove(obj.id)
                .success(function () {
                    $scope.fac_units = _.without($scope.fac_units, obj);
                    obj.delete_spinner = false;
                })
                .error(function (data) {
                    $log.error(data);
                    obj.delete_spinner = false;
                });
            };
        }
    ])

    .controller("mfl.facility_mgmt.controllers.facility_edit.setup",
        ["$scope","mfl.facility_mgmt.services.wrappers",
        function ($scope,wrappers) {

            /*geo_code_sources*/
            wrappers.geo_code_sources.list()
            .success(function (data) {
                $scope.geo_code_sources = data.results;
            })
            .error(function (error) {
                $log.error(error);
            });

            /*geo_code_methods*/
            wrappers.geo_code_methods.list()
            .success(function (data) {
                $scope.geo_code_methods = data.results;
            })
            .error(function (error) {
                $log.error(error);
            });
        }]);

})(angular, _);