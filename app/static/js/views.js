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
        cc = 'Companies',
        hashcc = '#' + cc.toLowerCase(),
        cpath = [
            hashcc,
            cc
        ],
        pp = 'Projects',
        hashpp = '#' + pp.toLowerCase(),
        ppath = [
            hashpp,
            pp
        ],
        _result = _.result,
        render = function(template, data, settings) {
            return _.template(bbtemplates[template], data, settings);
        },
        BBView = Backbone.View.extend({
            deps: function() {
                return this.collection.fetchonce();
            },
            title: function() {
                return this.model.name();
            },
            name: function() {
                var p = this.Path();
                return p ? _.pluck(p, 1).reverse().join(' - ') : _result(this, 'title');
            },
            Path: function() {
                var p = _result(this, 'path');
                if (p) {p.push(['', _result(this, 'title')]);}
                return p;
            },
            PageTitle: function() {
                return _result(this, 'name') + ' - BB';
            },
            PageHeader: function() {
                return _result(this, 'title') || _result(this, 'name');
            },
            render: function() {
                this.$el.html(render(this.template, {'view': this}));
                return this;
            },
            renderitem: function(item) {
                return render(item.edit ? this.itemtemplate + 'edit' : this.itemtemplate, {'item': item, 'view': this});
            }
        }),
        ProjectBBView = BBView.extend({
            deps: function() {
                return this.collection.fetchonce() && this.options.collections.projects.fetchonce();
            },
            path: function() {
                return [
                    cpath,
                    [
                        hashcc + '/' + (this.model.get('company') && this.model.get('company').id),
                        this.model.get('company') && this.model.get('company').name
                    ],
                    ppath,
                    [
                        hashpp + '/' + this.model.id,
                        this.model.name()
                    ]
                ];
            }
        }),
        PagesBBView = ProjectBBView.extend({
            previous: function(e) {
                e.preventDefault();
                return this.collection.hasPrevious() && this.collection.getPreviousPage();
            },
            next: function(e) {
                e.preventDefault();
                return this.collection.hasNext() && this.collection.getNextPage();
            }
        }),
        TitleBBView = ProjectBBView.extend({
            cur_item: null,
            title: function() {
                return _result(this, 'itemtitle');
            },
            itemtitle: function() {
                var item = _.isFinite(this.cur_item) ? this.collection.get(this.cur_item) : this.cur_item;
                return item && item.name();
            },
            nameParent: '',
            basepath: function() {
                var bpath = ProjectBBView.prototype.path.apply(this);
                bpath.push([
                    hashpp + '/' + this.model.id + '/' + (this.idParent || this.nameParent.toLowerCase()),
                    this.nameParent
                ]);
                return bpath;
            },
            extrapath: [],
            path: function() {
                var bpath = _result(this, 'basepath'), epath = _result(this, 'extrapath');
                _.each(epath, function(i) {
                    return bpath.push(i);
                });
                return bpath;
            }
        }),
        BBViewProto = BBView.prototype;
    // All People View - people
    bbviews.AllPeopleView = BBView.extend({
        deps: function() {
            return this.collection.fetchonce() && this.options.collections.companies.fetchonce();
        },
        template: '#people',
        itemtemplate: '#personitem',
        title: 'People'
    });
    // Projects View - projects
    bbviews.ProjectsView = BBView.extend({
        template: hashpp,
        title: pp
    });
    // Project View - projects/:id
    bbviews.ProjectView = BBView.extend({
        deps: function() {
            return this.options.collections.projects.fetchonce();
        },
        path: function() {
            return ProjectBBView.prototype.path.apply(this).slice(0, -1);
        },
        template: '#project'
    });
    // Companies View - companies
    bbviews.CompaniesView = BBView.extend({
        template: hashcc,
        title: cc
    });
    // Company View - companies/:id
    bbviews.CompanyView = BBView.extend({
        deps: function() {
            return this.options.collections.companies.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.people.fetchonce();
        },
        path: function() {
            return [cpath];
        },
        template: '#company'
    });
    // People View - projects/:id/people
    bbviews.PeopleView = ProjectBBView.extend({
        deps: function() {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.companies.fetchonce();
        },
        template: '#project-people',
        itemtemplate: '#personitem',
        title: 'People'
    });
    // Person View - projects/:id/people/:pid
    bbviews.PersonView = TitleBBView.extend({
        template: '#project-person',
        itemtemplate: '#personitem',
        nameParent: 'People'
    });
    // Time Entries View - projects/:id/time_entries
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
            return data;
        },
        finishItem: function(item) {
            return item.set({
                'project-id': this.model.id,
                'person-name': this.options.collections.people.get(item.get('person-id')).name()
            }, {silent: true});
        },
        sorttime: function(e) {
            e.preventDefault();
            var id = $(e.currentTarget).data('sort') || $(e.currentTarget).text();
            this.collection.setSorting(id, -this.collection.state.order);
            this.collection.fullCollection.sort();
        },
        addtime: function(e) {
            e.preventDefault();
            var context = this;
            this.collection.create(this.parseData('.addtime'), {
                wait: true,
                success: function(model) {
                    context.finishItem(model);
                    if (!context.collection.fullCollection.comparator) {
                        context.collection.setSorting('id', 1);
                    }
                    context.collection.fullCollection.sort();
                    return true;
                }});
            this.render();
        },
        currentTarget: function(e) {
            return this.collection.get($(e.currentTarget).parents('tr').data('id'));
        },
        edittime: function(e) {
            e.preventDefault();
            this.currentTarget(e).edit = true;
            this.render();
        },
        resettime: function(e) {
            e.preventDefault();
            this.currentTarget(e).edit = false;
            this.render();
        },
        removetime: function(e) {
            e.preventDefault();
            this.currentTarget(e).destroy();
            this.render();
        },
        savetime: function(e) {
            e.preventDefault();
            var model = this.currentTarget(e);
            model.edit = false;
            model.save(this.parseData('.edittime[data-id=' + model.id + ']'));
            this.render();
        },
        itemtemplate: '#time',
        template: '#project-time',
        title: 'Time'
    });
    // Todo Time Entries View - projects/:id/time_entries/todo_items/:tiid
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
        finishItem: function(item) {
            return item.set({
                'project-id': this.model.id,
                'todo-item-id': this.cur_item,
                'person-name': this.options.collections.people.get(item.get('person-id')).name()
            }, {silent: true});
        },
        template: '#todo-time'
    });
    // Time Report View - time_report
    bbviews.TimeReportView = bbviews.TimeEntriesView.extend({
        deps: function() {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.people.fetchonce() && this.options.collections.companies.fetchonce();
        },
        pagerid: 'time-report',
        events: {
            'click .time-report.previous': 'previous',
            'click .time-report.next': 'next',
            'click #getreport': 'getreport',
            'click .time-report #edit': 'edittime',
            'click .time-report #remove': 'removetime',
            'click .time-report #save': 'savetime',
            'click .time-report #reset': 'resettime',
            'click .time-report thead>tr>th': 'sorttime'
        },
        getreport: function(e) {
            e.preventDefault();
            this.collection.filter_report = $.param(_.filter(this.$('form#makereport').serializeArray(), function(i) {return i.value; }));
            this.collection.fetch({cache: true, reset: true});
        },
        template: '#time-report',
        path: false,
        title: 'Time report',
        render: function() {
            BBViewProto.render.apply(this);
            if (this.collection.filter_report) {
                this.$el.find('form#makereport').deserialize(this.collection.filter_report);
            }
            return this;
        }
    });
    // Post Comments View - projects/:id/posts/:pid/comments
    bbviews.PostCommentsView = TitleBBView.extend({
        deps: function() {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.project_posts.get_or_create(this.model.id).fetchonce();
        },
        template: '#project-post-comments',
        itemtemplate: '#post',
        extrapath: function() {
            return [
                [
                    hashpp + '/' + this.model.id + '/' + (this.idParent || this.nameParent.toLowerCase()) + '/' + this.cur_item,
                    _result(this, 'itemname')
                ]
            ];
        },
        nameParent: 'Posts',
        itemname: function() {
            var item = _.isFinite(this.cur_item) && this.options.collections.project_posts.get_or_create(this.model.id).get(this.cur_item),
                title = item && item.name();
            return title;
        },
        title: 'Comments'
    });
    // Calendar Entry Comments View - projects/:id/calendar/:cid/comments
    bbviews.CalendarEntryCommentsView = bbviews.PostCommentsView.extend({
        deps: function() {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.project_calendar.get_or_create(this.model.id).fetchonce();
        },
        template: '#project-calendar-entry-comments',
        itemtemplate: '#calendar',
        nameParent: 'Calendar',
        itemname: function() {
            var item = _.isFinite(this.cur_item) && this.options.collections.project_calendar.get_or_create(this.model.id).get(this.cur_item),
                title = item && item.name();
            return title;
        }
    });
    // Posts View - projects/:id/posts
    bbviews.PostsView = ProjectBBView.extend({
        template: '#project-posts',
        itemtemplate: '#post',
        title: 'Posts'
    });
    // Post View - projects/:id/posts/:pid
    bbviews.PostView = TitleBBView.extend({
        template: '#project-post',
        itemtemplate: '#post',
        nameParent: 'Posts'
    });
    // Files View - projects/:id/files
    bbviews.FilesView = PagesBBView.extend({
        deps: function() {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.people.fetchonce() && this.options.collections.project_categories.get_or_create(this.model.id).fetchonce();
        },
        pagerid: 'project-files',
        events: {
            'click .project-files.previous': 'previous',
            'click .project-files.next': 'next'
        },
        itemtemplate: '#file',
        template: '#project-files',
        title: 'Files'
    });
    // File View - projects/:id/files/:fid
    bbviews.FileView = TitleBBView.extend({
        deps: bbviews.FilesView.prototype.deps,
        itemtemplate: '#file',
        template: '#project-file',
        nameParent: 'Files'
    });
    // Calendar View - projects/:id/calendar
    bbviews.CalendarView = ProjectBBView.extend({
        template: '#project-calendar',
        itemtemplate: '#calendar',
        title: 'Calendar'
    });
    // Calendar Entry View - projects/:id/calendar/:cid
    bbviews.CalendarEntryView = TitleBBView.extend({
        template: '#project-calendar-entry',
        itemtemplate: '#calendar',
        nameParent: 'Calendar'
    });
    // Categories View - projects/:id/categories
    bbviews.CategoriesView = PagesBBView.extend({
        pagerid: 'project-categories',
        events: {
            'click .project-categories.previous': 'previous',
            'click .project-categories.next': 'next'
        },
        template: '#project-categories',
        itemtemplate: '#category',
        title: 'Categories'
    });
    // Category View - projects/:id/categories/:cid
    bbviews.CategoryView = TitleBBView.extend({
        template: '#project-category',
        itemtemplate: '#category',
        nameParent: 'Categories'
    });
    // All Person View - people/:id
    bbviews.AllPersonView = BBView.extend({
        deps: function() {
            return this.options.collections.people.fetchonce() && this.options.collections.companies.fetchonce();
        },
        template: '#person',
        path: function() {
            return [
                [
                    '#people',
                    'People'
                ]
            ];
        }
    });
    // Todos View - todos
    bbviews.TodosView = BBView.extend({
        deps: bbviews.TimeEntriesView.prototype.deps,
        events: {
            "change select[name='target']": 'selectTarget'
        },
        selectTarget: function(e) {
            this.collection.responsible_party = $(e.target).val();
            this.collection.fetch({cache: true, reset: true});
        },
        template: '#todo-lists',
        itemtemplate: '#todolist',
        title: function() {
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
    // Todo Lists View - projects/:id/todo_lists
    bbviews.TodoListsView = ProjectBBView.extend({
        template: '#project-todo-lists',
        itemtemplate: '#todolist',
        title: 'To-dos'
    });
    // Todo List View - projects/:id/todo_lists/:tlid
    bbviews.TodoListView = TitleBBView.extend({
        deps: function() {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.todos().fetchonce() && this.options.collections.project_people.get_or_create(this.model.id).fetchonce();
        },
        events: {
            'click .project-todo-list .todo.icon-completed': 'uncomplete',
            'click .project-todo-list .todo.icon-uncompleted': 'complete',
            'click #add_todo #add': 'addtodo'
        },
        todos: function() {
            return this.options.collections.todo_items.get_or_create(this.cur_item);
        },
        currentTarget: function(e) {
            return this.todos().get($(e.currentTarget).data('id'));
        },
        complete: function(e) {
            e.preventDefault();
            this.currentTarget(e).complete();
            this.render();
        },
        uncomplete: function(e) {
            e.preventDefault();
            this.currentTarget(e).uncomplete();
            this.render();
        },
        finishItem: function(item) {
            return item.set({
                'completed': false,
                'todo-list-id': this.cur_item,
                'comments-count': 0
            }, {silent: true});
        },
        addtodo: function(e) {
            e.preventDefault();
            var fdata = $('form').serializeArray(),
                data = _.object(_.pluck(fdata, 'name'), _.pluck(fdata, 'value')),
                context = this;
            this.todos().create(data, {
                wait: true,
                success: function(model) {
                    context.finishItem(model);
                    context.render();
                    return true;
                }});
        },
        template: '#project-todo-list',
        itemtemplate: '#todolist',
        idParent: 'todo_lists',
        nameParent: 'To-dos'
    });
    // Todo Item View - projects/:id/todo_lists/:tlid/:tiid
    bbviews.TodoItemView = bbviews.TodoListView.extend({
        todo_item: null,
        deps: function() {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.todo_lists.fetchonce() && this.todos().fetchonce();
        },
        events: {
            'click .project-todo-item .todo.icon-completed': 'uncomplete',
            'click .project-todo-item .todo.icon-uncompleted': 'complete'
        },
        currentTarget: function() {
            return this.todos().get(this.todo_item);
        },
        template: '#project-todo-item',
        itemtemplate: '#todolist',
        extrapath: bbviews.PostCommentsView.prototype.extrapath,
        itemname: function() {
            var list = this.cur_item && this.todo_lists.get(this.cur_item),
                title = list && list.name();
            return title;
        },
        itemtitle: function() {
            var item = _.isFinite(this.todo_item) ? this.todos().get(this.todo_item) : this.todo_item,
                itemtitle = item && item.name();
            return itemtitle;
        }
    });
    // Todo Item Comments View - projects/:id/todo_lists/:tlid/:tiid/comments
    bbviews.TodoItemCommentsView = bbviews.TodoItemView.extend({
        template: '#project-todo-item-comments',
        events: {
            'click .project-todo-item-comments .todo.icon-completed': 'uncomplete',
            'click .project-todo-item-comments .todo.icon-uncompleted': 'complete'
        },
        extrapath: function() {
            var bpath = bbviews.TodoItemView.prototype.extrapath.apply(this);
            return [
                bpath.shift(),
                [
                    hashpp + '/' + this.model.id + '/' + (this.idParent || this.nameParent.toLowerCase()) + '/' + this.cur_item + '/' + this.todo_item,
                    _result(this, 'itemtitle')
                ]
            ];
        },
        title: 'Comments'
    });
    // Nav View - no url
    bbviews.NavView = BBView.extend({
        template: '#nav',
        initialize: function() {
            this.model.bind('change', this.render, this);
        }
    });
    return bbviews;
}));
