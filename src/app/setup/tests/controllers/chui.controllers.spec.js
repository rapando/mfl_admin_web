(function(_){
    "use strict";
    describe("chu controllers test suite", function(){
        var createController, $scope, $stateParams, $httpBackend, $state, adminApi;
        var formService, SERVER_URL;

        beforeEach(function(){
            module("mflAdminApp");
            inject(["$rootScope", "$controller", "$stateParams", "$httpBackend",
                   "$state", "adminApi","mfl.common.forms.changes","SERVER_URL",
                   function($rootScope, $controller,_$stateParams,
                    _$httpBackend, _$state, _adminApi, frm, _SERVER_URL){
                $scope = $rootScope.$new();
                SERVER_URL = _SERVER_URL;
                $httpBackend = _$httpBackend;
                $stateParams = _$stateParams;
                $state = _$state;
                adminApi = _adminApi;
                formService = frm;
                var data = {
                    $scope: $scope
                };
                createController = function(ctrl, params){
                    return $controller(ctrl, _.extend(data, params));

                };
            }]);
        });

        afterEach(function(){
            $httpBackend.verifyNoOutstandingRequest();
        });

        it("should have `mfl.setup.controller.chuStatus.list` defined",
           function(){
                var ctrl = createController("mfl.setup.controller.chuStatus.list", {});
                expect(ctrl).toBeDefined();
            });

        it("should have `mfl.setup.controller.chuStatus.view` defined",
           function(){
                var dt = {
                    $stateParams: {id: 1}
                };
                var ctrl = createController("mfl.setup.controller.chuStatus.view", dt);
                expect(ctrl).toBeDefined();
            });
        it("should view a chuStatus: success",function(){
                var dt = {
                    $stateParams: {id: 1}
                };
                var res = {msg: "ok"};
                $httpBackend.expectGET(SERVER_URL+"api/chul/statuses/1/").respond(
                200, res);
                createController("mfl.setup.controller.chuStatus.view", dt);
                $httpBackend.flush();
                expect($scope.chuStatus).toEqual(res);
            });
        it("should navigate to creating new chuStatus", function () {
            var dt = {
                $stateParams : {id: "create"}
            };
            var test_title = {
                icon: "fa-plus-circle",
                name: "New Community Unit Status"
            };
            createController("mfl.setup.controller.chuStatus.view", dt);
            expect($scope.title).toEqual(test_title);
        });

        it("should view a chuStatus: error",function(){
                var dt = {
                    $stateParams: {id: 1}
                };
                var res = {error: "error"};
                $httpBackend.expectGET(SERVER_URL+"api/chul/statuses/1/").respond(
                500, res);
                createController("mfl.setup.controller.chuStatus.view", dt);
                $httpBackend.flush();
            });

        it("should delete chuStatus: success",function(){
                var dt = {
                    $stateParams: {id: 1}
                };
                spyOn($state, "go");
                var res = {mgs: "ok"};
                $httpBackend.expectGET(SERVER_URL+"api/chul/statuses/1/").respond(
                200, res);
                $httpBackend.expectDELETE(SERVER_URL+"api/chul/statuses/1/").respond(
                200, res);
                createController("mfl.setup.controller.chuStatus.view", dt);
                $scope.remove();
                $httpBackend.flush();
                expect($state.go).toHaveBeenCalledWith("setup.chu_status");
            });

        it("should delete chuStatus: error",function(){
                var dt = {
                    $stateParams: {id: 1}
                };
                spyOn($state, "go");
                var res = {error: "error"};
                $httpBackend.expectGET(SERVER_URL+"api/chul/statuses/1/").respond(
                200, res);
                $httpBackend.expectDELETE(SERVER_URL+"api/chul/statuses/1/").respond(
                500, res);
                createController("mfl.setup.controller.chuStatus.view", dt);
                $scope.cancel();
                expect($state.go).toHaveBeenCalledWith("setup.chu_status.view");
                $scope.remove();
                expect($state.go).toHaveBeenCalledWith("setup.chu_status.view");
                $httpBackend.flush();
                expect($scope.alert).toEqual(res.error);
            });

        it("should update chuStatus: success",function(){
                var dt = {
                    $stateParams: {id: 1}
                };
                var res = {msg: "Ok"};
                var form = {name : "Antony"};
                spyOn($state, "go");
                spyOn(formService, "whatChanged").andReturn(form);
                $httpBackend.expectGET(SERVER_URL+"api/chul/statuses/1/").respond(
                200, res);
                $httpBackend.expectPATCH(SERVER_URL+"api/chul/statuses/1/").respond(
                200, res);
                createController("mfl.setup.controller.chuStatus.view", dt);
                $scope.updateChuStatus(1, form);
                $httpBackend.flush();
                expect($state.go).toHaveBeenCalledWith("setup.chu_status");
            });

        it("should update chuStatus: fail",function(){
                var dt = {
                    $stateParams: {id: 1}
                };
                var res = {error: "error"};
                var form = {name : "Antony"};
                spyOn($state, "go");
                spyOn(formService, "whatChanged").andReturn(form);
                $httpBackend.expectGET(SERVER_URL+"api/chul/statuses/1/").respond(
                200, res);
                $httpBackend.expectPATCH(SERVER_URL+"api/chul/statuses/1/").respond(
                500, res);
                createController("mfl.setup.controller.chuStatus.view", dt);
                $scope.updateChuStatus(1, form);
                $httpBackend.flush();
                expect($state.go).not.toHaveBeenCalledWith("setup.chu_status");
                expect($scope.alert).toEqual(res.error);
            });

        it("should update chuStatus: no changes",function(){
                var dt = {
                    $stateParams: {id: 1}
                };
                var res = {error: "error"};
                var form = {};
                spyOn($state, "go");
                spyOn(formService, "whatChanged").andReturn(form);
                $httpBackend.expectGET(SERVER_URL+"api/chul/statuses/1/").respond(
                200, res);
                $httpBackend.expectPATCH(SERVER_URL+"api/chul/statuses/1/").respond(
                500, res);
                createController("mfl.setup.controller.chuStatus.view", dt);
                $scope.updateChuStatus(1, form);
                expect($httpBackend.flush).toThrow();
                expect($state.go).not.toHaveBeenCalledWith("setup.chu_status");
            });

        it("should create chuStatus: success",function(){
                spyOn($state, "go");
                $httpBackend.expectPOST(SERVER_URL+"api/chul/statuses/").respond(
                200, {});
                createController("mfl.setup.controller.chuStatus.view", {});
                $scope.createChuStatus({name: "Testing"});
                $httpBackend.flush();
                expect($state.go).toHaveBeenCalledWith("setup.chu_status");
            });

        it("should create chuStatus: fail",function(){
                spyOn($state, "go");
                $httpBackend.expectPOST(SERVER_URL+"api/chul/statuses/").respond(
                500, {error: "error"});
                createController("mfl.setup.controller.chuStatus.view", {});
                $scope.createChuStatus({name: "Testing"});
                $httpBackend.flush();
                expect($scope.alert).toEqual("error");
                expect($state.go).not.toHaveBeenCalledWith("setup.chu_status");
            });

        it("should have `mfl.setup.controller.chuService.list` defined",
           function(){
                var ctrl = createController("mfl.setup.controller.chuService.list", {});
                expect(ctrl).toBeDefined();
            });

        it("should have `mfl.setup.controller.chuService.view` defined",
           function(){
                var dt = {
                    $stateParams: {id: 1}
                };
                var ctrl = createController("mfl.setup.controller.chuService.view", dt);
                expect(ctrl).toBeDefined();
            });
        it("should view a chuService: success",function(){
                var dt = {
                    $stateParams: {id: "1"}
                };
                var res = {id: "1"};
                $scope.create = false;
                $httpBackend.expectGET(SERVER_URL+"api/chul/services/1/").respond(200, res);
                createController("mfl.setup.controller.chuService.view", dt);
                $httpBackend.flush();
                expect($scope.chuService).toEqual(res);
            });

        it("should view a chuService: fail",function(){
                var dt = {
                    $stateParams: {id: "1"}
                };
                $scope.create = false;
                $httpBackend.expectGET(SERVER_URL+"api/chul/services/1/").respond(500, {});
                createController("mfl.setup.controller.chuService.view", dt);
                $httpBackend.flush();
            });

        it("should delete chuService: success",function(){
                var dt = {
                    $stateParams: {id: 1}
                };
                spyOn($state, "go");
                var res = {mgs: "ok"};
                $httpBackend.expectDELETE(SERVER_URL+"api/chul/services/1/").respond(200, res);
                createController("mfl.setup.controller.chuService.view", dt);
                $scope.remove();
                $httpBackend.flush();
                expect($state.go).toHaveBeenCalledWith("setup.chu_service");
            });

        it("should delete chuService: fail",function(){
                var dt = {
                    $stateParams: {id: 1}
                };
                $httpBackend.expectDELETE(SERVER_URL+"api/chul/services/1/").respond(500, {});
                createController("mfl.setup.controller.chuService.view", dt);
                $scope.remove();
                $httpBackend.flush();
            });

        it("should update chuService: success",function(){
                var dt = {
                    $stateParams: {id: 1}
                };
                var res = {msg: "Ok"};
                var form = {name : "Antony"};
                spyOn($state, "go");
                spyOn(formService, "whatChanged").andReturn(form);
                $httpBackend.expectPATCH(SERVER_URL+"api/chul/services/1/")
                    .respond(200, res);
                createController("mfl.setup.controller.chuService.view", dt);
                $scope.service_id = 1;
                $scope.create = false;
                $scope.saveChuservice(form);
                $httpBackend.flush();
            });

        it("should update chuService: fail",function(){
                var dt = {
                    $stateParams: {id: 1}
                };
                var form = {name : "Antony"};
                spyOn($state, "go");
                spyOn(formService, "whatChanged").andReturn(form);
                $httpBackend.expectPATCH(SERVER_URL+"api/chul/services/1/")
                    .respond(500, {});
                createController("mfl.setup.controller.chuService.view", dt);
                $scope.service_id = 1;
                $scope.create = false;
                $scope.saveChuservice(form);
                $httpBackend.flush();
            });

        it("should create chuService: success",function(){
                var dt = {
                    $stateParams: {id: 1}
                };
                var res = {msg: "Ok"};
                var form = {name : "Antony"};
                spyOn($state, "go");
                spyOn(formService, "whatChanged").andReturn(form);
                $httpBackend.expectPOST(SERVER_URL+"api/chul/services/")
                    .respond(200, res);
                createController("mfl.setup.controller.chuService.view", dt);
                $scope.service_id = 1;
                $scope.create = true;
                $scope.saveChuservice(form);
                $httpBackend.flush();
            });

        it("should create chuService: fail",function(){
                var dt = {
                    $stateParams: {id: 1}
                };
                var form = {name : "Antony"};
                spyOn($state, "go");
                spyOn(formService, "whatChanged").andReturn(form);
                $httpBackend.expectPOST(SERVER_URL+"api/chul/services/")
                    .respond(500, {});
                createController("mfl.setup.controller.chuService.view", dt);
                $scope.service_id = 1;
                $scope.create = true;
                $scope.saveChuservice(form);
                $httpBackend.flush();
            });
    });
})(window._);
