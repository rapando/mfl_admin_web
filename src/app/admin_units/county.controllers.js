"use strict";

angular.module("mfl.admin_units.county_controllers",[
    "mfl.counties.wrapper",
    "mfl.constituencies.wrapper"
])
    .controller("mfl.admin_units.controllers.counties", ["$scope",
        function ($scope) {
            $scope.test = "View administrative area";
            $scope.path = [
                {
                    name: "Adminstrative area",
                    route: "admin_units"
                },
                {
                    name: "Counties",
                    route: "admin_unit.counties"
                }
            ];
            $scope.title = [
                {
                    icon: "fa-map-marker",
                    name: "View Counties"
                }
            ];
            $scope.action = [
                {
                    func : "onclick=window.history.back()",
                    class: "action-btn action-btn-primary action-btn-md",
                    color: "blue",
                    tipmsg: "Go back",
                    icon: "fa-arrow-left"
                }
            ];
        }]
    )
    .controller("mfl.admin_units.controllers.counties.edit", ["$scope",
        function ($scope) {
            $scope.path = [
                {
                    name: "Adminstrative area",
                    route: "admin_units"
                },
                {
                    name: "Counties",
                    route: "admin_unit.counties"
                },
                {
                    name: "Edit County",
                    route: "admin_unit.view_unit"
                }
            ];
            $scope.title = [
                {
                    icon: "fa-map-marker",
                    name: "View Counties"
                }
            ];
            $scope.action = [
                {
                    func : "onclick=window.history.back()",
                    class: "action-btn action-btn-primary action-btn-md",
                    color: "blue",
                    tipmsg: "Go back",
                    icon: "fa-arrow-left"
                }
            ];
        }]
    )
    .controller("mfl.admin_units.controllers.counties.consts", ["$scope","$stateParams",
        "constituenciesApi","countiesApi",
        function ($scope, $stateParams,constituenciesApi, countiesApi) {
            $scope.count_id = $stateParams.count_id;
            countiesApi.api
                .get($stateParams.count_id)
                .success(function (data){
                    $scope.county_name = data.name;
                })
                .error(function(error){
                    console.log(error);
                });
            $scope.path = [
                {
                    name: "Adminstrative area",
                    route: "admin_units"
                },
                {
                    name: "County",
                    route: "admin_unit.counties"
                },
                {
                    name: "Constituencies",
                    route: "admin_units.counties.view_consts"
                }
            ];
            
            $scope.title = [
                {
                    icon: "fa-map-marker",
                    name: "{{county_name}}'s Constituencies"
                }
            ];
            $scope.action = [
                {
                    func : "onclick=window.history.back()",
                    class: "action-btn action-btn-primary action-btn-md",
                    color: "blue",
                    tipmsg: "Go back",
                    icon: "fa-arrow-left"
                }
            ];
            $scope.filters = {county: $stateParams.count_id};
            
        }]
    );