/*jslint nomen: true*/
/*global window, $, _, Backbone*/
(function () {
    "use strict";
    window.TimeReportView = Backbone.View.extend({
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
            this.$el.html(_.template($(this.template).html(), this, {variable: 'view'}));
            if (this.collection.filter_report) {
                this.$el.find('form#makereport').deserialize(this.collection.filter_report);
            }
            return this;
        }
    });
    window.AllPeopleView = Backbone.View.extend({
        deps: function () {
            return this.collection.fetchonce() && this.options.collections.companies.fetchonce();
        },
        template: '#people-template',
        itemtemplate: '#personitem-template',
        name: function () {
            return "People";
        }
    });
    window.ProjectsView = Backbone.View.extend({
        deps: function () {
            return this.collection.fetchonce();
        },
        template: '#projects-template',
        name: function () {
            return "Projects";
        }
    });
    window.ProjectView = Backbone.View.extend({
        deps: function () {
            return this.options.collections.projects.fetchonce();
        },
        template: '#project-template',
        name: function () {
            return this.model.get('name');
        }
    });
    window.CompaniesView = Backbone.View.extend({
        deps: function () {
            return this.collection.fetchonce();
        },
        template: '#companies-template',
        name: function () {
            return "Companies";
        }
    });
    window.CompanyView = Backbone.View.extend({
        deps: function () {
            return this.options.collections.companies.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.people.fetchonce();
        },
        template: '#company-template',
        name: function () {
            return this.model.get('name');
        }
    });
    window.PeopleView = Backbone.View.extend({
        deps: function () {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.companies.fetchonce();
        },
        template: '#project-people-template',
        itemtemplate: '#personitem-template',
        name: function () {
            return this.model.get('name') + " > People";
        }
    });
    window.TimeEntriesView = Backbone.View.extend({
        deps: function () {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce();
        },
        pagerid: "project-time",
        events: {
            "click .project-time.previous": "previous",
            "click .project-time.next": "next"
        },
        previous: function (e) {
            e.preventDefault();
            return this.collection.hasPrevious() && this.collection.getPreviousPage();
        },
        next: function (e) {
            e.preventDefault();
            return this.collection.hasNext() && this.collection.getNextPage();
        },
        itemtemplate: '#time-template',
        template: '#project-time-template',
        name: function () {
            return this.model.get('name') + " > Time";
        }
    });
    window.TodoTimeEntriesView = window.TimeEntriesView.extend({
        pagerid: "todo-time",
        events: {
            "click .todo-time.previous": "previous",
            "click .todo-time.next": "next"
        },
        template: '#todo-time-template'
    });
    window.PostCommentsView = Backbone.View.extend({
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
    window.CalendarEntryCommentsView = Backbone.View.extend({
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
    window.PostsView = Backbone.View.extend({
        deps: function () {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce();
        },
        template: '#project-posts-template',
        itemtemplate: '#post-template',
        name: function () {
            return this.model.get('name') + " > Posts";
        }
    });
    window.PostView = Backbone.View.extend({
        cur_item: null,
        deps: function () {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce();
        },
        template: '#project-post-template',
        itemtemplate: '#post-template',
        name: function () {
            var item = this.cur_item && this.collection.get(this.cur_item),
                title = item && item.get('title');
            return this.model.get('name') + " > Posts > " + title;
        }
    });
    window.FilesView = Backbone.View.extend({
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
    window.FileView = Backbone.View.extend({
        cur_item: null,
        deps: function () {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.people.fetchonce() && this.options.collections.project_categories.get_or_create(this.model.id).fetchonce();
        },
        template: '#project-file-template',
        name: function () {
            var item = this.cur_item && this.collection.get(this.cur_item),
                title = item && item.get('name');
            return this.model.get('name') + " > Files > " + title;
        }
    });
    window.CalendarView = Backbone.View.extend({
        deps: function () {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce();
        },
        template: '#project-calendar-template',
        itemtemplate: '#calendar-template',
        name: function () {
            return this.model.get('name') + " > Calendar";
        }
    });
    window.CalendarEntryView = Backbone.View.extend({
        cur_item: null,
        deps: function () {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce();
        },
        template: '#project-calendar-entry-template',
        itemtemplate: '#calendar-template',
        name: function () {
            var item = this.cur_item && this.collection.get(this.cur_item),
                title = item && item.get('title');
            return this.model.get('name') + " > Calendar > " + title;
        }
    });
    window.CategoriesView = Backbone.View.extend({
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
    window.CategoryView = Backbone.View.extend({
        cur_item: null,
        deps: function () {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce();
        },
        template: '#project-category-template',
        itemtemplate: '#category-template',
        name: function () {
            var item = this.cur_item && this.collection.get(this.cur_item),
                title = item && item.get('name');
            return this.model.get('name') + " > Categories > " + title;
        }
    });
    window.PersonView = Backbone.View.extend({
        deps: function () {
            return this.options.collections.people.fetchonce() && this.options.collections.companies.fetchonce();
        },
        template: '#person-template',
        name: function () {
            return this.model.name();
        }
    });
    window.TodosView = Backbone.View.extend({
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
    window.TodoListsView = Backbone.View.extend({
        deps: function () {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce();
        },
        template: '#project-todo-lists-template',
        itemtemplate: '#todolist-template',
        name: function () {
            if (this.collection.parent_id) {
                return this.model.get('name') + " > To-dos";
            }
            return "To-dos";
        }
    });
    window.TodoListView = Backbone.View.extend({
        cur_item: null,
        deps: function () {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.todo_items.get_or_create(this.cur_item).fetchonce();
        },
        template: '#project-todo-list-template',
        itemtemplate: '#todolist-template',
        name: function () {
            var item = this.cur_item && this.collection.get(this.cur_item),
                title = item && item.get('name');
            return this.model.get('name') + " > To-dos > " + title;
        },
        render: function () {
            this.$el.html(_.template($(this.template).html(), this, {variable: 'view'}));
            if (this.cur_item) {
                this.options.collections.todo_items.get_or_create(this.cur_item).each(function (item) {
                    this.$el.find(".todoitemsholder").append(this.options.todo(this.model.id, item).render().el);
                }, this);
            }
            return this;
        }
    });
    window.TodoItemView = Backbone.View.extend({
        todo_item: null,
        cur_item: null,
        deps: function () {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.todo_items.get_or_create(this.cur_item).fetchonce();
        },
        template: '#project-todo-item-template',
        itemtemplate: '#todolist-template',
        name: function () {
            var list = this.cur_item && this.collection.get(this.cur_item),
                title = list && list.get('name'),
                item = this.todo_item && this.options.collections.todo_items.get_or_create(this.cur_item).get(this.todo_item),
                itemtitle = item && item.get('content');
            return this.model.get('name') + " > To-dos > " + title + " > " + itemtitle;
        },
        render: function () {
            this.$el.html(_.template($(this.template).html(), this, {variable: 'view'}));
            var item = this.options.collections.todo_items.get_or_create(this.cur_item).get(this.todo_item);
            if (item) {
                this.$el.find(".todoitemsholder").append(this.options.todo(this.model.id, item).render().el);
            }
            return this;
        }
    });
    window.TodoItemCommentsView = Backbone.View.extend({
        todo_item: null,
        cur_item: null,
        deps: function () {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.todo_lists.fetchonce() && this.options.collections.todo_items.get_or_create(this.cur_item).fetchonce();
        },
        template: '#project-todo-item-comments-template',
        name: function () {
            var list = this.cur_item && this.todo_lists.get(this.cur_item),
                title = list && list.get('name'),
                item = this.todo_item && this.options.collections.todo_items.get_or_create(this.cur_item).get(this.todo_item),
                itemtitle = item && item.get('content');
            return this.model.get('name') + " > To-dos > " + title + " > " + itemtitle + " > Comments";
        },
        render: function () {
            this.$el.html(_.template($(this.template).html(), this, {variable: 'view'}));
            var item = this.options.collections.todo_items.get_or_create(this.cur_item).get(this.todo_item);
            if (item) {
                this.$el.find(".todoitemsholder").append(this.options.todo(this.model.id, item).render().el);
            }
            return this;
        }
    });
    window.TodoView = Backbone.View.extend({
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
            this.$el.html(_.template($(this.template).html(), this, {variable: 'view'}));
            this.delegateEvents();
            return this;
        }
    });
    window.NavView = Backbone.View.extend({
        template: '#nav-template',
        initialize: function () {
            this.model.bind("change", this.render, this);
        }
    });
}());
