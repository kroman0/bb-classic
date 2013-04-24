/*jslint nomen: true*/
/*global define*/
define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    "use strict";
    var bbmodels = {},
        urlError = function () {
            throw new Error('A "url" property or function must be specified');
        },
        BBModel = Backbone.Model.extend({
            url: function () {
                var base = _.result(this, 'urlRoot') || _.result(this.collection, 'url') || urlError();
                if (!this.isNew()) {
                    base = base + (base.charAt(base.length - 1) === '/' ? '' : '/') + encodeURIComponent(this.id) + '.xml';
                }
                return base;
            }
        });
    bbmodels.Project = BBModel.extend({
        urlRoot: "/api/projects/",
        icon: function () {
            switch (this.get('status')) {
            case "active":
                return "icon-play";
            case "archived":
                return "icon-stop";
            case "on_hold":
                return "icon-pause";
            }
        }
    });
    bbmodels.Company = BBModel.extend({
        urlRoot: "/api/companies/"
    });
    bbmodels.Person = BBModel.extend({
        urlRoot: "/api/people/",
        name: function () {
            return this.get('first-name') + ' ' + this.get('last-name');
        }
    });
    bbmodels.Post = BBModel.extend({
        urlRoot: "/api/posts/"
    });
    bbmodels.Attachment = BBModel.extend();
    bbmodels.CalendarEntry = BBModel.extend({
        urlRoot: "/api/projects/#{project_id}/calendar_entries/"
    });
    bbmodels.Category = BBModel.extend({
        urlRoot: "/api/categories/"
    });
    bbmodels.TimeEntry = BBModel.extend({
        urlRoot: "/api/time_entries/"
    });
    bbmodels.TodoItem = BBModel.extend({
        urlRoot: "/api/todo_items/",
        complete: function () {
            this.save('completed', true, {url: _.result(this, 'url').replace('.xml', '/complete.xml')});
        },
        uncomplete: function () {
            this.save('completed', false, {url: _.result(this, 'url').replace('.xml', '/uncomplete.xml')});
        }
    });
    bbmodels.TodoList = BBModel.extend({
        urlRoot: "/api/todo_lists/"
    });
    bbmodels.Comment = BBModel.extend({
        urlRoot: "/api/comments/"
    });
    bbmodels.MyModel = bbmodels.Person.extend({
        defaults: {
            id: null
        },
        url: "/api/me.xml"
    });
    return bbmodels;
});
