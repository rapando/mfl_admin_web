"use strict";

angular.module("mfl.users.routes", [])

    .config(["$stateProvider", function ($stateProvider) {
        $stateProvider
            .state("users", {
                url: "/users",
                views: {
                    "main": {
                        controller: "mfl.users.controllers.users",
                        templateUrl: "users/tpls/main.tpl.html"
                    },
                    "header@users": {
                        controller: "mfl.home.controllers.home",
                        templateUrl: "home/tpls/header.tpl.html"
                    },
                    "sidebar@users": {
                        templateUrl: "home/tpls/side_nav.tpl.html"
                    },
                    "main-content@users": {
                        controller: "mfl.users.controllers.users",
                        templateUrl: "users/tpls/index.tpl.html"
                    }
                },
                data : { pageTitle: "Users" }
            })
            .state("users.new_user", {
                url: "/newuser",
                views: {
                    "main-content@users": {
                        controller: "mfl.users.controllers.new_user",
                        templateUrl: "users/tpls/new_user.tpl.html"
                    }
                }
            })
            .state("users.edit_user", {
                url: "/edituser/:user_id",
                views: {
                    "main-content@users": {
                        controller: "mfl.users.controllers.edit_user",
                        templateUrl: "users/tpls/new_user.tpl.html"
                    }
                }
            })
            .state("users.view_user", {
                url: "/viewuser/:user_id",
                views: {
                    "main-content@users": {
                        controller: "mfl.users.controllers.view_user",
                        templateUrl: "users/tpls/view_user.tpl.html"
                    }
                }
            });
    }]);