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
                return this.Path() ? _.pluck(_.result(this, 'path'), 1).reverse().join(' - ') : _.result(this, 'title');
            },
            Path: function() {
                return _.result(this, 'path');
            },
            PageTitle: function() {
                return _.result(this, 'name') + ' - BB';
            },
            PageHeader: function() {
                return _.result(this, 'title') || _.result(this, 'name');
            },
            render: function() {
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
                    ],
                    ['', _.result(this, 'title')]
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
        TitleBBView = BBView.extend({
            deps: function() {
                return this.collection.fetchonce() && this.options.collections.projects.fetchonce();
            },
            cur_item: null,
            title: function() {
                return _.result(this, 'itemtitle');
            },
            itemtitle: function() {
                var item = _.isFinite(this.cur_item) ? this.collection.get(this.cur_item) : this.cur_item;
                return item && item.name();
            },
            nameParent: '',
            basepath: function() {
                var bpath = ProjectBBView.prototype.path.apply(this, arguments).slice(0, -1);
                bpath.push([
                    hashpp + '/' + this.model.id + '/' + (this.idParent || this.nameParent.toLowerCase()),
                    this.nameParent
                ]);
                return bpath;
            },
            extrapath: function() {
                return [
                    ['', _.result(this, 'title')]
                ];
            },
            path: function() {
                var bpath = this.basepath(), epath = this.extrapath();
                epath.forEach(function(i) {
                    return bpath.push(i);
                });
                return bpath;
            }
        }),
        BBViewProto = BBView.prototype;
    bbviews.AllPeopleView = BBView.extend({
        deps: function() {
            return this.collection.fetchonce() && this.options.collections.companies.fetchonce();
        },
        template: '#people-template',
        itemtemplate: '#personitem-template',
        title: 'People'
    });
    bbviews.ProjectsView = BBView.extend({
        template: hashpp + '-template',
        title: pp
    });
    bbviews.ProjectView = BBView.extend({
        deps: function() {
            return this.options.collections.projects.fetchonce();
        },
        path: function() {
            var bpath = ProjectBBView.prototype.path.apply(this, arguments).slice(0, -2);
            bpath.push(['', _.result(this, 'title')]);
            return bpath;
        },
        template: '#project-template'
    });
    bbviews.CompaniesView = BBView.extend({
        template: hashcc + '-template',
        title: cc
    });
    bbviews.CompanyView = BBView.extend({
        deps: function() {
            return this.options.collections.companies.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.people.fetchonce();
        },
        path: function() {
            return [
                cpath,
                ['', this.model.name()]
            ];
        },
        template: '#company-template'
    });
    bbviews.PeopleView = ProjectBBView.extend({
        deps: function() {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.companies.fetchonce();
        },
        template: '#project-people-template',
        itemtemplate: '#personitem-template',
        title: 'People'
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
//             data['project-id'] = this.model.id;
//             data['person-name'] = this.$(selector + ' [name=person-id]').find(':selected').text();
            return data;
        },
        finishItem: function(item) {
            item.set('project-id', this.model.id, {silent: true});
            item.set('person-name', this.options.collections.people.get(item.get('person-id')).name(), {silent: true});
            return item;
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
                    try {
                        context.collection.fullCollection.sort();
                    } catch (err) {
                        context.collection.setSorting('id', 1);
                        context.collection.fullCollection.sort();
                    }
                    return true;
                }});
            this.render();
        },
        edittime: function(e) {
            e.preventDefault();
            var id = $(e.currentTarget).parents('tr').data('id'),
                model = this.collection.get(id);
            model.edit = true;
            this.render();
        },
        resettime: function(e) {
            e.preventDefault();
            var id = $(e.currentTarget).parents('tr').data('id'),
                model = this.collection.get(id);
            model.edit = false;
            this.render();
        },
        removetime: function(e) {
            e.preventDefault();
            var id = $(e.currentTarget).parents('tr').data('id'),
                model = this.collection.get(id);
            model.destroy();
            this.render();
        },
        savetime: function(e) {
            e.preventDefault();
            var id = $(e.currentTarget).parents('tr').data('id'),
                model = this.collection.get(id);
            model.edit = false;
            model.save(this.parseData('.edittime[data-id=' + id + ']'));
            this.render();
        },
        itemtemplate: '#time-template',
        template: '#project-time-template',
        title: 'Time'
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
        finishItem: function(item) {
            item.set('project-id', this.model.id, {silent: true});
            item.set('todo-item-id', this.cur_item, {silent: true});
            item.set('person-name', this.options.collections.people.get(item.get('person-id')).name(), {silent: true});
            return item;
        },
        template: '#todo-time-template'
    });
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
        template: '#time-report-template',
        path: false,
        title: 'Time report',
        render: function() {
            BBViewProto.render.apply(this, arguments);
            if (this.collection.filter_report) {
                this.$el.find('form#makereport').deserialize(this.collection.filter_report);
            }
            return this;
        }
    });
    bbviews.PostCommentsView = TitleBBView.extend({
        deps: function() {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.project_posts.get_or_create(this.model.id).fetchonce();
        },
        template: '#project-post-comments-template',
        itemtemplate: '#post-template',
        extrapath: function() {
            return [
                [
                    hashpp + '/' + this.model.id + '/' + (this.idParent || this.nameParent.toLowerCase()) + '/' + this.cur_item,
                    _.result(this, 'itemname')
                ],
                ['', _.result(this, 'title')]
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
    bbviews.CalendarEntryCommentsView = bbviews.PostCommentsView.extend({
        deps: function() {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.project_calendar.get_or_create(this.model.id).fetchonce();
        },
        template: '#project-calendar-entry-comments-template',
        itemtemplate: '#calendar-template',
        nameParent: 'Calendar',
        itemname: function() {
            var item = _.isFinite(this.cur_item) && this.options.collections.project_calendar.get_or_create(this.model.id).get(this.cur_item),
                title = item && item.name();
            return title;
        }
    });
    bbviews.PostsView = ProjectBBView.extend({
        template: '#project-posts-template',
        itemtemplate: '#post-template',
        title: 'Posts'
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
        title: 'Files'
    });
    bbviews.FileView = TitleBBView.extend({
        deps: function() {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.people.fetchonce() && this.options.collections.project_categories.get_or_create(this.model.id).fetchonce();
        },
        template: '#project-file-template',
        nameParent: 'Files'
    });
    bbviews.CalendarView = ProjectBBView.extend({
        template: '#project-calendar-template',
        itemtemplate: '#calendar-template',
        title: 'Calendar'
    });
    bbviews.CalendarEntryView = TitleBBView.extend({
        template: '#project-calendar-entry-template',
        itemtemplate: '#calendar-template',
        nameParent: 'Calendar'
    });
    bbviews.CategoriesView = PagesBBView.extend({
        pagerid: 'project-categories',
        events: {
            'click .project-categories.previous': 'previous',
            'click .project-categories.next': 'next'
        },
        template: '#project-categories-template',
        itemtemplate: '#category-template',
        title: 'Categories'
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
        path: function() {
            return [
                [
                    '#people',
                    'People'
                ],
                ['', this.model.name()]
            ];
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
            this.collection.fetch({cache: true, reset: true});
        },
        template: '#todo-lists-template',
        itemtemplate: '#todolist-template',
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
    bbviews.TodoListsView = ProjectBBView.extend({
        template: '#project-todo-lists-template',
        itemtemplate: '#todolist-template',
        title: 'To-dos'
    });
    bbviews.TodoListView = TitleBBView.extend({
        deps: function() {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.todo_items.get_or_create(this.cur_item).fetchonce();
        },
        template: '#project-todo-list-template',
        itemtemplate: '#todolist-template',
        idParent: 'todo_lists',
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
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.todo_lists.fetchonce() && this.options.collections.todo_items.get_or_create(this.cur_item).fetchonce();
        },
        template: '#project-todo-item-template',
        itemtemplate: '#todolist-template',
        extrapath: bbviews.PostCommentsView.prototype.extrapath,
        idParent: 'todo_lists',
        nameParent: 'To-dos',
        title: function() {
            return _.result(this, 'itemtitle');
        },
        itemname: function() {
            var list = this.cur_item && this.todo_lists.get(this.cur_item),
                title = list && list.name();
            return title;
        },
        itemtitle: function() {
            var item = _.isFinite(this.todo_item) ? this.options.collections.todo_items.get_or_create(this.cur_item).get(this.todo_item) : this.todo_item,
                itemtitle = item && item.name();
            return itemtitle;
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
    bbviews.TodoItemCommentsView = bbviews.TodoItemView.extend({
        template: '#project-todo-item-comments-template',
        extrapath: function() {
            var bpath = bbviews.TodoItemView.prototype.extrapath.apply(this, arguments);
            return [
                bpath.shift(),
                [
                    hashpp + '/' + this.model.id + '/' + (this.idParent || this.nameParent.toLowerCase()) + '/' + this.cur_item + '/' + this.todo_item,
                    _.result(this, 'itemtitle')
                ],
                ['', _.result(this, 'title')]
            ];
        },
        title: 'Comments'
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
