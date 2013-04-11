/*jslint nomen: true*/
/*global window, _, Backbone*/
(function () {
    "use strict";
    window.Project = Backbone.Model.extend({
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
    window.Company = Backbone.Model.extend({
        urlRoot: "/api/companies/"
    });
    window.Person = Backbone.Model.extend({
        urlRoot: "/api/people/",
        name: function () {
            return this.get('first-name') + ' ' + this.get('last-name');
        }
    });
    window.Post = Backbone.Model.extend({
        urlRoot: "/api/posts/"
    });
    window.Attachment = Backbone.Model.extend();
    window.CalendarEntry = Backbone.Model.extend({
        urlRoot: "/api/projects/#{project_id}/calendar_entries/"
    });
    window.Category = Backbone.Model.extend({
        urlRoot: "/api/categories/"
    });
    window.TimeEntry = Backbone.Model.extend({
        urlRoot: "/api/time_entries/"
    });
    window.TodoItem = Backbone.Model.extend({
        urlRoot: "/api/todo_items/",
        complete: function () {
            this.save('completed', true, {url: _.result(this, 'url').replace('.xml', '/complete.xml')});
        },
        uncomplete: function () {
            this.save('completed', false, {url: _.result(this, 'url').replace('.xml', '/uncomplete.xml')});
        }
    });
    window.TodoList = Backbone.Model.extend({
        urlRoot: "/api/todo_lists/"
    });
    window.Comment = Backbone.Model.extend({
        urlRoot: "/api/comments/"
    });
    window.MyModel = window.Person.extend({
        defaults: {
            id: null
        },
        url: "/api/me.xml"
    });
}());
