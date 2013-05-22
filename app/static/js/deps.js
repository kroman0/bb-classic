/*global require*/

// Require.js allows us to configure shortcut alias
require.config({
    // The shim config allows us to configure dependencies for
    // scripts that do not call define() to register a module
    shim: {
        underscore: {
            exports: '_'
        },
        jquerydeserialize: {
            deps: [
                'jquery'
            ]
        },
        backbone: {
            deps: [
                'json2',
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        bootstrap: {
            deps: [
                'jquery'
            ]
        },
        datepicker: {
            deps: [
                'jquery',
                'bootstrap'
            ]
        },
        backbonecache: {
            deps: [
                'backbone'
            ]
        },
        backboneanalytics: {
            deps: [
                'backbone'
            ]
        },
        backbonepageable: {
            deps: [
                'backbone'
            ]
        },
        bbgeneral: {
            deps: [
                'backbone'
            ]
        },
        bbmodels: {
            deps: [
                'underscore',
                'backbone'
            ]
        },
        bbcollections: {
            deps: [
                'underscore',
                'backbone',
                'backbonepageable',
                'bbgeneral',
                'bbmodels'
            ]
        },
        bbviews: {
            deps: [
                'bbtemplates',
                'bootstrap',
                'jquery',
                'jquerydeserialize',
                'jquerydeserialize',
                'backbonecache'
            ]
        },
        bbmain: {
            deps: [
                'backboneanalytics',
                'bbmodels',
                'bbcollections',
                'bbviews'
            ]
        }
    },
    paths: {
        json2: 'json2',
        jquery: 'jquery-1.7.2',
        jquerydeserialize: 'jquery.deserialize',
        backbonepageable: 'backbone-pageable',
        backbonecache: 'backbone.fetch-cache',
        backboneanalytics: 'backbone.analytics',
        datepicker: 'bootstrap-datepicker',
        bbgeneral: 'general',
        bbmodels: 'models',
        bbcollections: 'collections',
        bbtemplates: 'templates',
        bbviews: 'views',
        bbmain: 'main',
    }
});

require([
    'bbmain',
    'json2',
    'bootstrap',
    'datepicker'
], function () {
    "use strict";
});
