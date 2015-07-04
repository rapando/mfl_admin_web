(function(angular){
    "use strict";

    angular.module("mfl.facility_mgmt.controllers.upgrade_downgrade", [
        "mfl.facility_mgmt.services",
        "mfl.facility_mgmt.controllers.edit"
    ])

    .controller("mfl.facility_mgmt.controllers.updown_helper",
        ["$log", "mfl.facility_mgmt.services.wrappers",
        function ($log, wrappers) {
            var load = function ($scope) {
                $scope.new_type = {
                    id:"",
                    facility_type: "",
                    reason: "",
                    facility: $scope.facility_id
                };

                wrappers.facility_types.filter({page_size: 100, "ordering": "name"})
                .success(function(data) {
                    $scope.facility_types = data.results;
                })
                .error(function(data) {
                    $log.error(data);
                });
            };

            var updateType = function ($scope) {
                wrappers.facility_upgrade.create($scope.new_type)
                .success(function (data) {
                    $scope.new_type.id = data.id;
                })
                .error(function (data) {
                    $log.error(data);
                });
            };

            this.bootstrap = function ($scope, is_upgrade) {
                $scope.upgrade = is_upgrade;
                load($scope);
                $scope.updateType = function () {
                    updateType($scope);
                };
            };
        }]
    )

    .controller("mfl.facility_mgmt.controllers.facility_upgrade",
        ["$scope", "$controller", function ($scope, $controller) {
            var helper = $controller("mfl.facility_mgmt.controllers.updown_helper");
            helper.bootstrap($scope, true);
            $scope.upgrade = true;
        }]
    )

    .controller("mfl.facility_mgmt.controllers.facility_downgrade",
        ["$scope", "$controller",
        function ($scope, $controller) {
            var helper = $controller("mfl.facility_mgmt.controllers.updown_helper");
            helper.bootstrap($scope, false);
            $scope.upgrade = false;
        }]
    )

    .controller("mfl.facility_mgmt.controllers.update_services",
        ["$scope", "$controller", function ($scope, $controller) {
            var helper = $controller("mfl.facility_mgmt.controllers.services_helper");
            helper.bootstrap($scope);
        }]
    );

})(angular);
