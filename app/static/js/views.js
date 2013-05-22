/*jslint nomen: true*/
/*global define*/
define([
    'jquery',
    'underscore',
    'backbone',
    'bbtemplates',
    'jquerydeserialize',
    'backbonecache'
], function ($, _, Backbone, templates) {
    "use strict";
    var bbviews = {},
        BBView = Backbone.View.extend({
            render: function () {
                this.$el.html(_.template(templates[this.template], this, {variable: 'view'}));
                return this;
            },
            renderitem: function (item) {
                return _.template(templates[this.itemtemplate], item, {variable: 'item'});
            },
            rendercomments: function (comments) {
                return _.template(templates['#comments-template'], comments, {variable: 'comments'});
            },
            renderpager: function () {
                return _.template(templates['#pager-template'], this, {variable: 'view'});
            },
            renderheader: function () {
                return _.template(templates['#header-template'], this, {variable: 'view'});
            },
            renderprojectnav: function () {
                return _.template(templates['#project-nav-template'], this, {variable: 'view'});
            }
        });
    bbviews.TimeReportView = BBView.extend({
        deps: function () {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.people.fetchonce() && this.options.collections.companies.fetchonce();
        },
        pagerid: "time-report",
        events: {
            "click .time-report.previous": "previous",
            "click .time-report.next": "next",
            "click #getreport": "getreport"
        },
        previous: function (e) {
            e.preventDefault();
            return this.collection.hasPrevious() && this.collection.getPreviousPage();
        },
        next: function (e) {
            e.preventDefault();
            return this.collection.hasNext() && this.collection.getNextPage();
        },
        getreport: function (e) {
            e.preventDefault();
            this.collection.filter_report = $.param(_.filter(this.$('form#makereport').serializeArray(), function (i) {return i.value; }));
            this.collection.fetch({cache: true});
        },
        template: '#time-report-template',
        itemtemplate: '#time-template',
        name: function () {
            return "Time report";
        },
        render: function () {
            this.$el.html(_.template(templates[this.template], this, {variable: 'view'}));
            if (this.collection.filter_report) {
                this.$el.find('form#makereport').deserialize(this.collection.filter_report);
            }
            return this;
        }
    });
    bbviews.AllPeopleView = BBView.extend({
        deps: function () {
            return this.collection.fetchonce() && this.options.collections.companies.fetchonce();
        },
        template: '#people-template',
        itemtemplate: '#personitem-template',
        name: function () {
            return "People";
        }
    });
    bbviews.ProjectsView = BBView.extend({
        deps: function () {
            return this.collection.fetchonce();
        },
        template: '#projects-template',
        name: function () {
            return "Projects";
        }
    });
    bbviews.ProjectView = BBView.extend({
        deps: function () {
            return this.options.collections.projects.fetchonce();
        },
        template: '#project-template',
        name: function () {
            return this.model.get('name');
        }
    });
    bbviews.CompaniesView = BBView.extend({
        deps: function () {
            return this.collection.fetchonce();
        },
        template: '#companies-template',
        name: function () {
            return "Companies";
        }
    });
    bbviews.CompanyView = BBView.extend({
        deps: function () {
            return this.options.collections.companies.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.people.fetchonce();
        },
        template: '#company-template',
        name: function () {
            return this.model.get('name');
        }
    });
    bbviews.PeopleView = BBView.extend({
        deps: function () {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.companies.fetchonce();
        },
        template: '#project-people-template',
        itemtemplate: '#personitem-template',
        name: function () {
            return this.model.get('name') + " > People";
        }
    });
    bbviews.TimeEntriesView = BBView.extend({
        deps: function () {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.people.fetchonce();
        },
        pagerid: "project-time",
        events: {
            "click .project-time.previous": "previous",
            "click .project-time.next": "next",
            "click .project-time #add": "addtime",
            "click .project-time #edit": "edittime",
            "click .project-time #remove": "removetime",
            "click .project-time #save": "savetime",
            "click .project-time thead>tr>th": "sorttime"
        },
        previous: function (e) {
            e.preventDefault();
            return this.collection.hasPrevious() && this.collection.getPreviousPage();
        },
        next: function (e) {
            e.preventDefault();
            return this.collection.hasNext() && this.collection.getNextPage();
        },
        parseData: function (selector) {
            var data = {};
            data.date = this.$(selector + ' [name=date]').val();
            data.description = this.$(selector + ' [name=description]').val();
            data.hours = parseFloat(this.$(selector + ' [name=hours]').val(), 10);
            data['person-id'] = parseInt(this.$(selector + ' [name=person-id]').val(), 10);
            data['project-id'] = this.model.id;
            data['person-name'] = this.$(selector + ' [name=person-id]').find(':selected').text();
            return data;
        },
        sorttime: function (e) {
            e.preventDefault();
            var id = $(e.currentTarget).data('sort') || $(e.currentTarget).text();
            this.collection.setSorting(id, -this.collection.state.order);
            this.collection.fullCollection.sort();
        },
        addtime: function (e) {
            e.preventDefault();
            var item = this.collection.create(this.parseData('.addtime'), {wait: true});
            this.render();
        },
        edittime: function (e) {
            e.preventDefault();
            var id = $(e.currentTarget).data("id"),
                model = this.collection.get(id);
            model.edit = true;
            this.render();
        },
        removetime: function (e) {
            e.preventDefault();
            var id = $(e.currentTarget).data("id"),
                model = this.collection.get(id);
            model.destroy();
            this.render();
        },
        savetime: function (e) {
            e.preventDefault();
            var id = $(e.currentTarget).data("id"),
                model = this.collection.get(id);
            model.edit = false;
            model.save(this.parseData('.edittime'));
            this.render();
        },
        itemtemplate: '#time-template',
        template: '#project-time-template',
        name: function () {
            return this.model.get('name') + " > Time";
        }
    });
    bbviews.TodoTimeEntriesView = bbviews.TimeEntriesView.extend({
        pagerid: "todo-time",
        events: {
            "click .todo-time.previous": "previous",
            "click .todo-time.next": "next",
            "click .todo-time #add": "addtime",
            "click .todo-time #edit": "edittime",
            "click .todo-time #remove": "removetime",
            "click .todo-time #save": "savetime",
            "click .todo-time thead>tr>th": "sorttime"
        },
        template: '#todo-time-template'
    });
    bbviews.PostCommentsView = BBView.extend({
        cur_item: null,
        deps: function () {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.project_posts.get_or_create(this.model.id).fetchonce();
        },
        template: '#project-post-comments-template',
        itemtemplate: '#post-template',
        name: function () {
            var item = this.cur_item && this.options.collections.project_posts.get_or_create(this.model.id).get(this.cur_item),
                title = item && item.get('title');
            return this.model.get('name') + " > Posts > " + title + " > Comments";
        }
    });
    bbviews.CalendarEntryCommentsView = BBView.extend({
        cur_item: null,
        deps: function () {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.project_calendar.get_or_create(this.model.id).fetchonce();
        },
        template: '#project-calendar-entry-comments-template',
        itemtemplate: '#calendar-template',
        name: function () {
            var item = this.cur_item && this.options.collections.project_calendar.get_or_create(this.model.id).get(this.cur_item),
                title = item && item.get('title');
            return this.model.get('name') + " > Calendar > " + title + " > Comments";
        }
    });
    bbviews.PostsView = BBView.extend({
        deps: function () {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce();
        },
        template: '#project-posts-template',
        itemtemplate: '#post-template',
        name: function () {
            return this.model.get('name') + " > Posts";
        }
    });
    bbviews.PostView = BBView.extend({
        cur_item: null,
        deps: function () {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce();
        },
        template: '#project-post-template',
        itemtemplate: '#post-template',
        name: function () {
            var item = _.isFinite(this.cur_item) ? this.collection.get(this.cur_item) : this.cur_item,
                title = item && item.get('title');
            return this.model.get('name') + " > Posts > " + title;
        }
    });
    bbviews.FilesView = BBView.extend({
        deps: function () {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.people.fetchonce() && this.options.collections.project_categories.get_or_create(this.model.id).fetchonce();
        },
        pagerid: "project-files",
        events: {
            "click .project-files.previous": "previous",
            "click .project-files.next": "next"
        },
        previous: function (e) {
            e.preventDefault();
            return this.collection.hasPrevious() && this.collection.getPreviousPage();
        },
        next: function (e) {
            e.preventDefault();
            return this.collection.hasNext() && this.collection.getNextPage();
        },
        template: '#project-files-template',
        name: function () {
            return this.model.get('name') + " > Files";
        }
    });
    bbviews.FileView = BBView.extend({
        cur_item: null,
        deps: function () {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.people.fetchonce() && this.options.collections.project_categories.get_or_create(this.model.id).fetchonce();
        },
        template: '#project-file-template',
        name: function () {
            var item = _.isFinite(this.cur_item) ? this.collection.get(this.cur_item) : this.cur_item,
                title = item && item.get('name');
            return this.model.get('name') + " > Files > " + title;
        }
    });
    bbviews.CalendarView = BBView.extend({
        deps: function () {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce();
        },
        template: '#project-calendar-template',
        itemtemplate: '#calendar-template',
        name: function () {
            return this.model.get('name') + " > Calendar";
        }
    });
    bbviews.CalendarEntryView = BBView.extend({
        cur_item: null,
        deps: function () {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce();
        },
        template: '#project-calendar-entry-template',
        itemtemplate: '#calendar-template',
        name: function () {
            var item = _.isFinite(this.cur_item) ? this.collection.get(this.cur_item) : this.cur_item,
                title = item && item.get('title');
            return this.model.get('name') + " > Calendar > " + title;
        }
    });
    bbviews.CategoriesView = BBView.extend({
        deps: function () {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce();
        },
        pagerid: "project-categories",
        events: {
            "click .project-categories.previous": "previous",
            "click .project-categories.next": "next"
        },
        previous: function (e) {
            e.preventDefault();
            return this.collection.hasPrevious() && this.collection.getPreviousPage();
        },
        next: function (e) {
            e.preventDefault();
            return this.collection.hasNext() && this.collection.getNextPage();
        },
        template: '#project-categories-template',
        itemtemplate: '#category-template',
        name: function () {
            return this.model.get('name') + " > Categories";
        }
    });
    bbviews.CategoryView = BBView.extend({
        cur_item: null,
        deps: function () {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce();
        },
        template: '#project-category-template',
        itemtemplate: '#category-template',
        name: function () {
            var item = _.isFinite(this.cur_item) ? this.collection.get(this.cur_item) : this.cur_item,
                title = item && item.get('name');
            return this.model.get('name') + " > Categories > " + title;
        }
    });
    bbviews.PersonView = BBView.extend({
        deps: function () {
            return this.options.collections.people.fetchonce() && this.options.collections.companies.fetchonce();
        },
        template: '#person-template',
        name: function () {
            return this.model.name();
        }
    });
    bbviews.TodosView = BBView.extend({
        deps: function () {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.people.fetchonce();
        },
        events: {
            "change select[name='target']": "selectTarget"
        },
        selectTarget: function (e) {
            this.collection.responsible_party = $(e.target).val();
            this.collection.fetch({cache: true});
        },
        template: '#todo-lists-template',
        itemtemplate: '#todolist-template',
        name: function () {
            if (this.collection.responsible_party) {
                var person = this.options.collections.people && this.options.collections.people.get(this.collection.responsible_party);
                return person ? person.name() + "'s to-dos" : this.collection.responsible_party + "'s to-dos";
            }
            if (this.collection.responsible_party === null) {
                return "My to-dos";
            }
            if (this.collection.responsible_party === "") {
                return "Unassigned to-dos";
            }
            return "To-dos";
        },
        description: function () {
            if (this.collection.responsible_party) {
                var person = this.options.collections.people && this.options.collections.people.get(this.collection.responsible_party);
                return person ? person.name() + "'s" : this.collection.responsible_party + "'s";
            }
            if (this.collection.responsible_party === null) {
                return "My";
            }
            if (this.collection.responsible_party === "") {
                return "Unassigned";
            }
            return "All";
        }
    });
    bbviews.TodoListsView = BBView.extend({
        deps: function () {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce();
        },
        template: '#project-todo-lists-template',
        itemtemplate: '#todolist-template',
        name: function () {
            if (_.isFinite(this.collection.parent_id)) {
                return this.model.get('name') + " > To-dos";
            }
            return "To-dos";
        }
    });
    bbviews.TodoListView = BBView.extend({
        cur_item: null,
        deps: function () {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.todo_items.get_or_create(this.cur_item).fetchonce();
        },
        template: '#project-todo-list-template',
        itemtemplate: '#todolist-template',
        name: function () {
            var item = _.isFinite(this.cur_item) ? this.collection.get(this.cur_item) : this.cur_item,
                title = item && item.get('name');
            return this.model.get('name') + " > To-dos > " + title;
        },
        render: function () {
            this.$el.html(_.template(templates[this.template], this, {variable: 'view'}));
            if (_.isFinite(this.cur_item)) {
                this.options.collections.todo_items.get_or_create(this.cur_item).each(function (item) {
                    this.$el.find(".todoitemsholder").append(this.options.todo(this.model.id, item).render().el);
                }, this);
            }
            return this;
        }
    });
    bbviews.TodoItemView = BBView.extend({
        todo_item: null,
        cur_item: null,
        deps: function () {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.todo_items.get_or_create(this.cur_item).fetchonce();
        },
        template: '#project-todo-item-template',
        itemtemplate: '#todolist-template',
        name: function () {
            var list = _.isFinite(this.cur_item) ? this.collection.get(this.cur_item) : this.cur_item,
                title = list && list.get('name'),
                item = _.isFinite(this.todo_item) ? this.options.collections.todo_items.get_or_create(this.cur_item).get(this.todo_item) : this.todo_item,
                itemtitle = item && item.get('content');
            return this.model.get('name') + " > To-dos > " + title + " > " + itemtitle;
        },
        render: function () {
            this.$el.html(_.template(templates[this.template], this, {variable: 'view'}));
            var item = this.options.collections.todo_items.get_or_create(this.cur_item).get(this.todo_item);
            if (item) {
                this.$el.find(".todoitemsholder").append(this.options.todo(this.model.id, item).render().el);
            }
            return this;
        }
    });
    bbviews.TodoItemCommentsView = BBView.extend({
        todo_item: null,
        cur_item: null,
        deps: function () {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.todo_lists.fetchonce() && this.options.collections.todo_items.get_or_create(this.cur_item).fetchonce();
        },
        template: '#project-todo-item-comments-template',
        name: function () {
            var list = this.cur_item && this.todo_lists.get(this.cur_item),
                title = list && list.get('name'),
                item = _.isFinite(this.todo_item) ? this.options.collections.todo_items.get_or_create(this.cur_item).get(this.todo_item) : this.todo_item,
                itemtitle = item && item.get('content');
            return this.model.get('name') + " > To-dos > " + title + " > " + itemtitle + " > Comments";
        },
        render: function () {
            this.$el.html(_.template(templates[this.template], this, {variable: 'view'}));
            var item = this.options.collections.todo_items.get_or_create(this.cur_item).get(this.todo_item);
            if (item) {
                this.$el.find(".todoitemsholder").append(this.options.todo(this.model.id, item).render().el);
            }
            return this;
        }
    });
    bbviews.TodoView = BBView.extend({
        events: {
            "click .todo.icon-completed": "uncomplete",
            "click .todo.icon-uncompleted": "complete"
        },
        complete: function () {
            this.model.complete();
        },
        uncomplete: function () {
            this.model.uncomplete();
        },
        tagName: 'dd',
        template: '#todo-template',
        render: function () {
            this.$el.html(_.template(templates[this.template], this, {variable: 'view'}));
            this.delegateEvents();
            return this;
        }
    });
    bbviews.NavView = BBView.extend({
        template: '#nav-template',
        initialize: function () {
            this.model.bind("change", this.render, this);
        }
    });
    return bbviews;
});
