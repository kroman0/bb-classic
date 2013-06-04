/*jslint white: true*/
/*global require,window*/

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
        }
    },
    paths: {
        json2: 'json2.min',
        jquery: 'jquery-1.7.2.min',
        jquerydeserialize: 'jquery.deserialize-min',
        underscore: 'underscore-min',
        backbone: 'backbone-min',
        backbonepageable: 'backbone-pageable.min',
        backbonecache: 'backbone.fetch-cache.min',
        backboneanalytics: 'backbone.analytics-min',
        bootstrap: 'bootstrap.min',
        datepicker: 'bootstrap-datepicker.min',
        bbgeneral: 'general.min',
        bbmodels: 'models.min',
        bbcollections: 'collections.min',
        bbtemplates: 'templates.min',
        bbviews: 'views.min',
        bbmain: 'main.min'
    }
});

require([
    'bbmain',
    'json2',
    'bootstrap',
    'datepicker'
], function(BB) {
    'use strict';
    window.BB = BB;
});
