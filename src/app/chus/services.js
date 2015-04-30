"use strict";

(function(angular){
    angular.module("mfl.chul.wrapper", ["sil.api.wrapper"])
    .provider("chulApi", function(){
        var self = this;
        self.baseUrl = "api/chul/units/";
        this.$get = ["api", function(api){
            return {
                baseUrl: self.baseUrl,
                api: api.setBaseUrl(this.baseUrl)
            };
        }];
    });
})(angular);