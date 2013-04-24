/*jslint nomen: true*/
/*global define, window, document*/
define([
    'jquery',
    'underscore',
    'backbone',
    'bbgeneral',
    'bbmodels',
    'bbcollections',
    'bbviews',
    'backboneanalytics'
], function ($, _, Backbone, onReset, bbmodels, bbcollections, bbviews) {
    "use strict";
    var i,
        models = window.models = {},
        collections = window.collections = {},
        views = window.views = {},
        viewdata = {
            el: '.content',
            collections: collections
        },
        oproject,
        otodo,
        Workspace = Backbone.Router.extend({
            routes: {
                "projects": "projects",
                "projects:tab": "projects",
                "projects/:id": "project",
                "projects/:id/todo_lists": "project_todo_lists",
                "projects/:id/todo_lists/:tlid": "project_todo_list",
                "projects/:id/todo_lists/:tlid/:tiid": "project_todo_item",
                "projects/:id/todo_lists/:tlid/:tiid/comments": "project_todo_item_comments",
                "projects/:id/time_entries/todo_items/:tiid": "todo_time_entries",
                "projects/:id/time_entries": "project_time_entries",
                "projects/:id/people": "project_people",
                "projects/:id/posts": "project_posts",
                "projects/:id/posts/:pid": "project_post",
                "projects/:id/posts/:pid/comments": "project_post_comments",
                "projects/:id/files": "project_files",
                "projects/:id/files/:fid": "project_file",
                "projects/:id/calendar": "project_calendar",
                "projects/:id/calendar/:cid": "project_calendar_entry",
                "projects/:id/calendar/:cid/comments": "project_calendar_entry_comments",
                "projects/:id/categories": "project_categories",
                "projects/:id/categories/:cid": "project_category",
                "companies": "companies",
                "companies/:id": "company",
                "people": "people",
                "people:tab": "people",
                "people/:id": "person",
                "me": "me",
                "todos": "todos",
                "time_report": "time_report",
                "*actions": "defaultRoute"
            }
        });
    models.mydata = new bbmodels.MyModel();
    models.project = new bbmodels.Project();
    models.company = new bbmodels.Company();
    models.person = new bbmodels.Person();
    collections.projects = new bbcollections.Projects();
    collections.companies = new bbcollections.Companies();
    collections.people = new bbcollections.People();
    collections.todos = new bbcollections.TodoLists();
    collections.times = new bbcollections.TimeEntries();
    views.current = null;
    views.projects = new bbviews.ProjectsView(_.extend({
        collection: collections.projects
    }, viewdata));
    views.companies = new bbviews.CompaniesView(_.extend({
        collection: collections.companies
    }, viewdata));
    views.people = new bbviews.AllPeopleView(_.extend({
        collection: collections.people
    }, viewdata));
    views.time_report = new bbviews.TimeReportView(_.extend({
        collection: collections.times
    }, viewdata));
    views.todos = new bbviews.TodosView(_.extend({
        collection: collections.todos,
        mydata: models.mydata
    }, viewdata));
    for (i in collections) {
        if (collections.hasOwnProperty(i)) {
            collections[i].on("reset", onReset);
            collections[i].on("sync", onReset);
        }
    }
    collections.project_people = new bbcollections.People();
    collections.project_categories = new bbcollections.Categories();
    collections.project_posts = new bbcollections.Posts();
    collections.project_files = new bbcollections.Attachments();
    collections.project_todo_lists = new bbcollections.TodoLists();
    collections.project_calendar = new bbcollections.Calendar();
    collections.project_time_entries = new bbcollections.TimeEntries();
    collections.todo_items = new bbcollections.TodoItems();
    collections.todo_time_entries = new bbcollections.TodoTimeEntries();
    collections.project_todo_item_comments = new bbcollections.TodoComments();
    collections.project_post_comments = new bbcollections.PostComments();
    collections.project_calendar_entry_comments = new bbcollections.CalendarEntryComments();
    views.company_view = new bbviews.CompanyView(_.extend({
        model: models.company
    }, viewdata));
    views.person_view = new bbviews.PersonView(_.extend({
        model: models.person
    }, viewdata));
    oproject = _.extend({
        model: models.project
    }, viewdata);
    views.project_view = new bbviews.ProjectView(oproject);
    views.project_people = new bbviews.PeopleView(oproject);
    views.project_categories = new bbviews.CategoriesView(oproject);
    views.project_category = new bbviews.CategoryView(oproject);
    views.project_posts = new bbviews.PostsView(oproject);
    views.project_post = new bbviews.PostView(oproject);
    views.project_calendar = new bbviews.CalendarView(oproject);
    views.project_calendar_entry = new bbviews.CalendarEntryView(oproject);
    views.project_files = new bbviews.FilesView(oproject);
    views.project_file = new bbviews.FileView(oproject);
    views.project_time_entries = new bbviews.TimeEntriesView(oproject);
    views.todo_time_entries = new bbviews.TodoTimeEntriesView(oproject);
    views.project_post_comments = new bbviews.PostCommentsView(oproject);
    views.project_calendar_entry_comments = new bbviews.CalendarEntryCommentsView(oproject);
    views.todo = function (prid, item) {
        if (!views.todo[item.id]) {
            views.todo[item.id] = new bbviews.TodoView({model: item, collections: collections, project_id: prid});
        }
        return views.todo[item.id];
    };
    otodo = _.extend({
        todo: views.todo
    }, oproject);
    views.project_todo_lists = new bbviews.TodoListsView(otodo);
    views.project_todo_list = new bbviews.TodoListView(otodo);
    views.project_todo_item = new bbviews.TodoItemView(otodo);
    views.project_todo_item_comments = new bbviews.TodoItemCommentsView(otodo);
    window.workspace = new Workspace();
    window.workspace.on("route", function (route, params) {
        var id, cur_item;
        if (_.contains(["projects", "companies", "people", "time_report", "todos"], route)) {
            views.current = views[route].render();
        } else if (_.contains(["project_people", "project_categories", "project_time_entries", "project_posts", "project_files", "project_calendar", "project_todo_lists"], route)) {
            id = parseInt(params[0], 10);
            if (collections.projects.get(id)) {
                views[route].model = collections.projects.get(id);
            } else {
                views[route].model.id = id;
            }
            views[route].collection = collections[route].get_or_create(id);
            views.current = views[route].render();
        } else if (_.contains(["project_post", "project_file", "project_calendar_entry", "project_category", "project_todo_list"], route)) {
            id = parseInt(params[0], 10);
            cur_item = parseInt(params[1], 10);
            if (collections.projects.get(id)) {
                views[route].model = collections.projects.get(id);
            } else {
                views[route].model.id = id;
            }
            views[route].cur_item = cur_item;
            switch (route) {
            case "project_calendar_entry":
                views[route].collection = collections.project_calendar.get_or_create(id);
                break;
            case "project_category":
                views[route].collection = collections.project_categories.get_or_create(id);
                break;
            default:
                views[route].collection = collections[route + "s"].get_or_create(id);
            }
            views.current = views[route].render();
        } else if (_.contains(["project_calendar_entry_comments", "project_post_comments", "todo_time_entries"], route)) {
            id = parseInt(params[0], 10);
            cur_item = parseInt(params[1], 10);
            if (collections.projects.get(id)) {
                views[route].model = collections.projects.get(id);
            } else {
                views[route].model.id = id;
            }
            views[route].cur_item = cur_item;
            views[route].collection = collections[route].get_or_create(cur_item);
            views.current = views[route].render();
        }
        if (views.current) {
            document.title = views.current.name() + " - BB";
        }
//         add_hash();
        if (views.current && views.current.deps) {
            views.current.deps();
        }
        $(_.filter($(".navbar ul.nav li").removeClass("active"), function (i) {
            return $(i).find("a:visible")[0] && document.location.hash.indexOf($(i).find("a:visible")[0].hash) !== -1;
        })).addClass("active");
        $(_.filter($("div.content ul.projectnav li").removeClass("active"), function (i) {
            return $(i).find("a:visible")[0] && document.location.hash.indexOf($(i).find("a:visible")[0].hash) !== -1;
        })).filter(":last").addClass("active");
    }).on("route:project_todo_item", function (id, tlid, tiid) {
        if (collections.projects.get(id)) {
            views.project_todo_item.model = collections.projects.get(id);
        } else {
            views.project_todo_item.model.id = id;
        }
        views.project_todo_item.cur_item = tlid;
        views.project_todo_item.todo_item = tiid;
        views.project_todo_item.collection = collections.project_todo_lists.get_or_create(id);
        views.current = views.project_todo_item.render();
    }).on("route:project_todo_item_comments", function (id, tlid, tiid) {
        if (collections.projects.get(id)) {
            views.project_todo_item_comments.model = collections.projects.get(id);
        } else {
            views.project_todo_item_comments.model.id = id;
        }
        views.project_todo_item_comments.cur_item = tlid;
        views.project_todo_item_comments.todo_item = tiid;
        views.project_todo_item_comments.todo_lists = collections.project_todo_lists.get_or_create(id);
        views.project_todo_item_comments.collection = collections.project_todo_item_comments.get_or_create(tiid);
        views.current = views.project_todo_item_comments.render();
    }).on("route:project", function (id) {
        if (collections.projects.get(id)) {
            views.project_view.model = collections.projects.get(id);
        } else {
            views.project_view.model.id = id;
        }
        views.current = views.project_view.render();
    }).on("route:company", function (id) {
        if (collections.companies.get(id)) {
            views.company_view.model = collections.companies.get(id);
        } else {
            views.company_view.model.id = id;
        }
        views.current = views.company_view.render();
    }).on("route:person", function (id) {
        if (collections.people.get(id)) {
            views.person_view.model = collections.people.get(id);
        } else {
            views.person_view.model.id = id;
        }
        views.current = views.person_view.render();
    }).on("route:me", function () {
        views.person_view.model = models.mydata;
        views.current = views.person_view.render();
    }).on("route:defaultRoute", function (action) {
        this.navigate("projects", {
            trigger: true
        });
    });
    views.navbar = new bbviews.NavView({
        model: models.mydata,
        el: '.navbar'
    }).render();
    models.mydata.once("sync", function () {
        Backbone.history.start();
    });
    models.mydata.fetch();
});
