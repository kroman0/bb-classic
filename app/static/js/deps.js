/*global require*/
'use strict';

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
        backbonecache: {
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
                'jquerydeserialize',
                'backbone.fetch-cache',
                'backbone-pageable'
            ]
        },
        bbmodels: {
            deps: [
                'bbgeneral'
            ]
        },
        bbcollections: {
            deps: [
                'backbone-pageable',
                'bbmodels'
            ]
        },
        bbviews: {
            deps: [
                'bootstrap',
                'bbcollections'
            ]
        },
        bbmain: {
            deps: [
                'bbviews'
            ]
        }
    },
    paths: {
        json2: 'json2',
        jquery: 'jquery-1.7.2',
        jquerydeserialize: 'jquery.deserialize',
        backbonecache: 'backbone.fetch-cache',
        bbgeneral: 'general',
        bbmodels: 'models',
        bbcollections: 'collections',
        bbviews: 'views',
        bbmain: 'main',
    }
});

require([
	'bbmain',
], function (Backbone) {
// 	/*jshint nonew:false*/
// 	// Initialize routing and start Backbone.history()
// 	new Workspace();
// 	Backbone.history.start();
// 
// 	// Initialize the application view
// 	new AppView();
});
