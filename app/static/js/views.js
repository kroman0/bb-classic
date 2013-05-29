/*jslint nomen: true, white: true*/
(function(root, factory) {
    'use strict';
    if (typeof root.define === 'function' && root.define.amd) {
        // AMD. Register as the bbviews module.
        root.define('bbviews', [
            'jquery',
            'underscore',
            'backbone',
            'bbtemplates',
            'bootstrap',
            'jquerydeserialize',
            'backbonecache'
        ], factory);
    } else {
        // Browser globals
        root.bbviews = factory(
            root.jQuery,
            root._,
            root.Backbone,
            root.bbtemplates
        );
    }
}(this, function($, _, Backbone, bbtemplates) {
    'use strict';
    var bbviews = {},
        render = function(template, data, settings) {
            return _.template(bbtemplates[template], data, settings);
        },
        BBView = Backbone.View.extend({
            deps: function() {
                return this.collection.fetchonce();
            },
            render: function(template) {
                this.$el.html(render(this.template, this, {variable: 'view'}));
                return this;
            },
            renderitem: function(item) {
                return render(item.edit ? this.itemtemplate + 'edit' : this.itemtemplate, item, {variable: 'item'});
            },
            rendercomments: function(comments) {
                return render('#comments-template', comments, {variable: 'comments'});
            },
            renderpager: function() {
                return render('#pager-template', this, {variable: 'view'});
            },
            renderheader: function() {
                return render('#header-template', this, {variable: 'view'});
            },
            renderprojectnav: function() {
                return render('#project-nav-template', this, {variable: 'view'});
            }
        }),
        PagesBBView = BBView.extend({
            previous: function(e) {
                e.preventDefault();
                return this.collection.hasPrevious() && this.collection.getPreviousPage();
            },
            next: function(e) {
                e.preventDefault();
                return this.collection.hasNext() && this.collection.getNextPage();
            }
        }),
        TitleBBView = BBView.extend({
            deps: function() {
                return this.collection.fetchonce() && this.options.collections.projects.fetchonce();
            },
            cur_item: null,
            Title: function() {
                var item = _.isFinite(this.cur_item) ? this.collection.get(this.cur_item) : this.cur_item;
                return item && item.name();
            },
            nameParent: null,
            name: function() {
                return this.model.name() + ' > ' + this.nameParent + ' > ' + this.Title();
            }
        }),
        BBViewProto = BBView.prototype;
    bbviews.TimeReportView = PagesBBView.extend({
        deps: function() {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.people.fetchonce() && this.options.collections.companies.fetchonce();
        },
        pagerid: 'time-report',
        events: {
            'click .time-report.previous': 'previous',
            'click .time-report.next': 'next',
            'click #getreport': 'getreport'
        },
        getreport: function(e) {
            e.preventDefault();
            this.collection.filter_report = $.param(_.filter(this.$('form#makereport').serializeArray(), function(i) {return i.value; }));
            this.collection.fetch({cache: true});
        },
        template: '#time-report-template',
        itemtemplate: '#time-template',
        name: function() {
            return 'Time report';
        },
        render: function() {
            BBViewProto.render.apply(this, arguments);
            if (this.collection.filter_report) {
                this.$el.find('form#makereport').deserialize(this.collection.filter_report);
            }
            return this;
        }
    });
    bbviews.AllPeopleView = BBView.extend({
        deps: function() {
            return this.collection.fetchonce() && this.options.collections.companies.fetchonce();
        },
        template: '#people-template',
        itemtemplate: '#personitem-template',
        name: function() {
            return 'People';
        }
    });
    bbviews.ProjectsView = BBView.extend({
        template: '#projects-template',
        name: function() {
            return 'Projects';
        }
    });
    bbviews.ProjectView = BBView.extend({
        deps: function() {
            return this.options.collections.projects.fetchonce();
        },
        template: '#project-template',
        name: function() {
            return this.model.name();
        }
    });
    bbviews.CompaniesView = BBView.extend({
        template: '#companies-template',
        name: function() {
            return 'Companies';
        }
    });
    bbviews.CompanyView = BBView.extend({
        deps: function() {
            return this.options.collections.companies.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.people.fetchonce();
        },
        template: '#company-template',
        name: function() {
            return this.model.name();
        }
    });
    bbviews.PeopleView = BBView.extend({
        deps: function() {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.companies.fetchonce();
        },
        template: '#project-people-template',
        itemtemplate: '#personitem-template',
        name: function() {
            return this.model.name() + ' > People';
        }
    });
    bbviews.TimeEntriesView = PagesBBView.extend({
        deps: function() {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.people.fetchonce();
        },
        pagerid: 'project-time',
        events: {
            'click .project-time.previous': 'previous',
            'click .project-time.next': 'next',
            'click .project-time #add': 'addtime',
            'click .project-time #edit': 'edittime',
            'click .project-time #remove': 'removetime',
            'click .project-time #save': 'savetime',
            'click .project-time #reset': 'resettime',
            'click .project-time thead>tr>th': 'sorttime'
        },
        parseData: function(selector) {
            var data = {};
            data.date = this.$(selector + ' [name=date]').val();
            data.description = this.$(selector + ' [name=description]').val();
            data.hours = parseFloat(this.$(selector + ' [name=hours]').val(), 10);
            data['person-id'] = parseInt(this.$(selector + ' [name=person-id]').val(), 10);
            data['project-id'] = this.model.id;
//             data['person-name'] = this.$(selector + ' [name=person-id]').find(':selected').text();
            return data;
        },
        sorttime: function(e) {
            e.preventDefault();
            var id = $(e.currentTarget).data('sort') || $(e.currentTarget).text();
            this.collection.setSorting(id, -this.collection.state.order);
            this.collection.fullCollection.sort();
        },
        addtime: function(e) {
            e.preventDefault();
            var collection = this.collection,
                item = this.collection.create(this.parseData('.addtime'), {
                wait: true,
                success: function(model, resp, options) {
                    try {
                        collection.fullCollection.sort();
                    } catch (err) {
                        collection.setSorting('id', 1);
                        collection.fullCollection.sort();
                    }
                    return true;
                }});
            this.render();
        },
        edittime: function(e) {
            e.preventDefault();
            var id = $(e.currentTarget).data('id'),
                model = this.collection.get(id);
            model.edit = true;
            this.render();
        },
        resettime: function(e) {
            e.preventDefault();
            var id = $(e.currentTarget).data('id'),
                model = this.collection.get(id);
            model.edit = false;
            this.render();
        },
        removetime: function(e) {
            e.preventDefault();
            var id = $(e.currentTarget).data('id'),
                model = this.collection.get(id);
            model.destroy();
            this.render();
        },
        savetime: function(e) {
            e.preventDefault();
            var id = $(e.currentTarget).data('id'),
                model = this.collection.get(id);
            model.edit = false;
            model.save(this.parseData('.edittime'));
            this.render();
        },
        itemtemplate: '#time-template',
        template: '#project-time-template',
        name: function() {
            return this.model.name() + ' > Time';
        }
    });
    bbviews.TodoTimeEntriesView = bbviews.TimeEntriesView.extend({
        pagerid: 'todo-time',
        events: {
            'click .todo-time.previous': 'previous',
            'click .todo-time.next': 'next',
            'click .todo-time #add': 'addtime',
            'click .todo-time #edit': 'edittime',
            'click .todo-time #remove': 'removetime',
            'click .todo-time #save': 'savetime',
            'click .todo-time #reset': 'resettime',
            'click .todo-time thead>tr>th': 'sorttime'
        },
        template: '#todo-time-template'
    });
    bbviews.PostCommentsView = TitleBBView.extend({
        deps: function() {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.project_posts.get_or_create(this.model.id).fetchonce();
        },
        template: '#project-post-comments-template',
        itemtemplate: '#post-template',
        name: function() {
            var item = this.cur_item && this.options.collections.project_posts.get_or_create(this.model.id).get(this.cur_item),
                title = item && item.name();
            return this.model.name() + ' > Posts > ' + title + ' > Comments';
        }
    });
    bbviews.CalendarEntryCommentsView = TitleBBView.extend({
        deps: function() {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.project_calendar.get_or_create(this.model.id).fetchonce();
        },
        template: '#project-calendar-entry-comments-template',
        itemtemplate: '#calendar-template',
        name: function() {
            var item = this.cur_item && this.options.collections.project_calendar.get_or_create(this.model.id).get(this.cur_item),
                title = item && item.name();
            return this.model.name() + ' > Calendar > ' + title + ' > Comments';
        }
    });
    bbviews.PostsView = BBView.extend({
        deps: function() {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce();
        },
        template: '#project-posts-template',
        itemtemplate: '#post-template',
        name: function() {
            return this.model.name() + ' > Posts';
        }
    });
    bbviews.PostView = TitleBBView.extend({
        template: '#project-post-template',
        itemtemplate: '#post-template',
        nameParent: 'Posts'
    });
    bbviews.FilesView = PagesBBView.extend({
        deps: function() {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.people.fetchonce() && this.options.collections.project_categories.get_or_create(this.model.id).fetchonce();
        },
        pagerid: 'project-files',
        events: {
            'click .project-files.previous': 'previous',
            'click .project-files.next': 'next'
        },
        template: '#project-files-template',
        name: function() {
            return this.model.name() + ' > Files';
        }
    });
    bbviews.FileView = TitleBBView.extend({
        deps: function() {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.people.fetchonce() && this.options.collections.project_categories.get_or_create(this.model.id).fetchonce();
        },
        template: '#project-file-template',
        nameParent: 'Files'
    });
    bbviews.CalendarView = BBView.extend({
        deps: function() {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce();
        },
        template: '#project-calendar-template',
        itemtemplate: '#calendar-template',
        name: function() {
            return this.model.name() + ' > Calendar';
        }
    });
    bbviews.CalendarEntryView = TitleBBView.extend({
        template: '#project-calendar-entry-template',
        itemtemplate: '#calendar-template',
        nameParent: 'Calendar'
    });
    bbviews.CategoriesView = PagesBBView.extend({
        deps: function() {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce();
        },
        pagerid: 'project-categories',
        events: {
            'click .project-categories.previous': 'previous',
            'click .project-categories.next': 'next'
        },
        template: '#project-categories-template',
        itemtemplate: '#category-template',
        name: function() {
            return this.model.name() + ' > Categories';
        }
    });
    bbviews.CategoryView = TitleBBView.extend({
        template: '#project-category-template',
        itemtemplate: '#category-template',
        nameParent: 'Categories'
    });
    bbviews.PersonView = BBView.extend({
        deps: function() {
            return this.options.collections.people.fetchonce() && this.options.collections.companies.fetchonce();
        },
        template: '#person-template',
        name: function() {
            return this.model.name();
        }
    });
    bbviews.TodosView = BBView.extend({
        deps: function() {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.people.fetchonce();
        },
        events: {
            "change select[name='target']": 'selectTarget'
        },
        selectTarget: function(e) {
            this.collection.responsible_party = $(e.target).val();
            this.collection.fetch({cache: true});
        },
        template: '#todo-lists-template',
        itemtemplate: '#todolist-template',
        name: function() {
            if (this.collection.responsible_party) {
                var person = this.options.collections.people && this.options.collections.people.get(this.collection.responsible_party);
                return person ? person.name() + "'s to-dos" : this.collection.responsible_party + "'s to-dos";
            }
            if (this.collection.responsible_party === null) {
                return 'My to-dos';
            }
            if (this.collection.responsible_party === '') {
                return 'Unassigned to-dos';
            }
            return 'To-dos';
        },
        description: function() {
            if (this.collection.responsible_party) {
                var person = this.options.collections.people && this.options.collections.people.get(this.collection.responsible_party);
                return person ? person.name() + "'s" : this.collection.responsible_party + "'s";
            }
            if (this.collection.responsible_party === null) {
                return 'My';
            }
            if (this.collection.responsible_party === '') {
                return 'Unassigned';
            }
            return 'All';
        }
    });
    bbviews.TodoListsView = BBView.extend({
        deps: function() {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce();
        },
        template: '#project-todo-lists-template',
        itemtemplate: '#todolist-template',
        name: function() {
            if (_.isFinite(this.collection.parent_id)) {
                return this.model.name() + ' > To-dos';
            }
            return 'To-dos';
        }
    });
    bbviews.TodoListView = TitleBBView.extend({
        deps: function() {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.todo_items.get_or_create(this.cur_item).fetchonce();
        },
        template: '#project-todo-list-template',
        itemtemplate: '#todolist-template',
        nameParent: 'To-dos',
        render: function() {
            BBViewProto.render.apply(this, arguments);
            if (_.isFinite(this.cur_item)) {
                this.options.collections.todo_items.get_or_create(this.cur_item).each(function(item) {
                    this.$el.find('.todoitemsholder').append(this.options.todo(this.model.id, item).render().el);
                }, this);
            }
            return this;
        }
    });
    bbviews.TodoItemView = TitleBBView.extend({
        todo_item: null,
        deps: function() {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.todo_items.get_or_create(this.cur_item).fetchonce();
        },
        template: '#project-todo-item-template',
        itemtemplate: '#todolist-template',
        name: function() {
            var item = _.isFinite(this.todo_item) ? this.options.collections.todo_items.get_or_create(this.cur_item).get(this.todo_item) : this.todo_item,
                itemtitle = item && item.name();
            return this.model.name() + ' > To-dos > ' + this.Title() + ' > ' + itemtitle;
        },
        render: function() {
            BBViewProto.render.apply(this, arguments);
            var item = this.options.collections.todo_items.get_or_create(this.cur_item).get(this.todo_item);
            if (item) {
                this.$el.find('.todoitemsholder').append(this.options.todo(this.model.id, item).render().el);
            }
            return this;
        }
    });
    bbviews.TodoItemCommentsView = TitleBBView.extend({
        todo_item: null,
        deps: function() {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.todo_lists.fetchonce() && this.options.collections.todo_items.get_or_create(this.cur_item).fetchonce();
        },
        template: '#project-todo-item-comments-template',
        name: function() {
            var list = this.cur_item && this.todo_lists.get(this.cur_item),
                title = list && list.name(),
                item = _.isFinite(this.todo_item) ? this.options.collections.todo_items.get_or_create(this.cur_item).get(this.todo_item) : this.todo_item,
                itemtitle = item && item.name();
            return this.model.name() + ' > To-dos > ' + title + ' > ' + itemtitle + ' > Comments';
        },
        render: function() {
            BBViewProto.render.apply(this, arguments);
            var item = this.options.collections.todo_items.get_or_create(this.cur_item).get(this.todo_item);
            if (item) {
                this.$el.find('.todoitemsholder').append(this.options.todo(this.model.id, item).render().el);
            }
            return this;
        }
    });
    bbviews.TodoView = BBView.extend({
        events: {
            'click .todo.icon-completed': 'uncomplete',
            'click .todo.icon-uncompleted': 'complete'
        },
        complete: function() {
            this.model.complete();
        },
        uncomplete: function() {
            this.model.uncomplete();
        },
        tagName: 'dd',
        template: '#todo-template',
        render: function() {
            BBViewProto.render.apply(this, arguments);
            this.delegateEvents();
            return this;
        }
    });
    bbviews.NavView = BBView.extend({
        template: '#nav-template',
        initialize: function() {
            this.model.bind('change', this.render, this);
        }
    });
    return bbviews;
}));
