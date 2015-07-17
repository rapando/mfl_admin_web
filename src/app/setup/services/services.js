(function(angular){
    "use strict";
    angular.module("mfl.setup.api", [
        "api.wrapper"
    ])
    .provider("adminApi",[function(){
        this.$get = ["api",function(api){
            return {
                constituencies:api.setBaseUrl("api/common/constituencies/"),
                wards: api.setBaseUrl("api/common/wards/"),
                counties: api.setBaseUrl("api/common/counties/"),
                towns: api.setBaseUrl("api/common/towns/"),
                contacts: api.setBaseUrl("api/common/contacts/"),
                contact_types: api.setBaseUrl("api/common/contact_types/"),
                facilityJobTitles: api.setBaseUrl("api/facilities/job_titles/"),
                facilityOwnerTypes: api.setBaseUrl("api/facilities/owner_types/"),
                facilityOwners: api.setBaseUrl("api/facilities/owners/"),
                regulatoryBodyContacts: api.setBaseUrl("api/common/contacts/"),
                facilityRegulatoryBodies: api.setBaseUrl("api/facilities/regulating_bodies/"),
                RegulatoryBodyContacts: api.setBaseUrl("api/facilities/regulating_body_contacts/"),
                chuStatus: api.setBaseUrl("api/chul/statuses/"),
                chuApprovers: api.setBaseUrl("api/chul/approvers/"),
                geocode_methods: api.setBaseUrl("api/gis/geo_code_methods/"),
                geocode_sources: api.setBaseUrl("api/gis/geo_code_sources/"),
                county_users : api.setBaseUrl("api/common/user_counties/"),
                county_slim : api.setBaseUrl("api/counties/slim_detail/")
            };
        }];
    }])
    .service("currentStateOpen",["$state",function ($state){
        this.whichTab = function (){
            var collapsed, state_name = $state.current.name;
            if(state_name.indexOf("counties") > -1 ||
               state_name.indexOf("constituencies") > -1 ||
               state_name.indexOf("wards") > -1 ||
               state_name.indexOf("towns") > -1 ){
                return collapsed = {
                    "one": true,
                    "true": false,
                    "three": false,
                    "four":false,
                    "five":false
                };
            } else if(state_name.indexOf("chu_") > -1){
                return collapsed = {
                    "one": false,
                    "true": true,
                    "three": false,
                    "four":false,
                    "five":false
                };
            } else if(state_name.indexOf("contact") > -1){
                return collapsed = {
                    "one": false,
                    "true": false,
                    "three": true,
                    "four":false,
                    "five":false
                };
            } else if(state_name.indexOf("facility_") > -1){
                return collapsed = {
                    "one": false,
                    "true": false,
                    "three": false,
                    "four":true,
                    "five":false
                };
            } else if(state_name.indexOf("geocode_") > -1){
                return collapsed = {
                    "one": false,
                    "true": false,
                    "three": false,
                    "four":false,
                    "five":true
                };
            } else {
                return collapsed = {};
            }
        };
    }]);
})(angular);
