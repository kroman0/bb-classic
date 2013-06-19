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
        templateoptions = {
            variable: 'view'
        },
        dtemplate = '-template',
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
                this.$el.html(render(this.template, this, templateoptions));
                return this;
            },
            renderitem: function(item) {
                return render(item.edit ? this.itemtemplate + 'edit' : this.itemtemplate, item, {variable: 'item'});
            },
            rendercomments: function(comments) {
                return render('#comments' + dtemplate, comments, {variable: 'comments'});
            },
            renderpager: function() {
                return render('#pager' + dtemplate, this, templateoptions);
            },
            renderheader: function() {
                return render('#header' + dtemplate, this, templateoptions);
            },
            renderprojectnav: function() {
                return render('#project-nav' + dtemplate, this, templateoptions);
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
            extrapath: function() {
                return [];
            },
            path: function() {
                var bpath = this.basepath(), epath = this.extrapath();
                _.each(epath, function(i) {
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
        template: '#people' + dtemplate,
        itemtemplate: '#personitem' + dtemplate,
        title: 'People'
    });
    bbviews.ProjectsView = BBView.extend({
        template: hashpp + dtemplate,
        title: pp
    });
    bbviews.ProjectView = BBView.extend({
        deps: function() {
            return this.options.collections.projects.fetchonce();
        },
        path: function() {
            return ProjectBBView.prototype.path.apply(this).slice(0, -1);
        },
        template: '#project' + dtemplate
    });
    bbviews.CompaniesView = BBView.extend({
        template: hashcc + dtemplate,
        title: cc
    });
    bbviews.CompanyView = BBView.extend({
        deps: function() {
            return this.options.collections.companies.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.people.fetchonce();
        },
        path: function() {
            return [cpath];
        },
        template: '#company' + dtemplate
    });
    bbviews.PeopleView = ProjectBBView.extend({
        deps: function() {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.companies.fetchonce();
        },
        template: '#project-people' + dtemplate,
        itemtemplate: '#personitem' + dtemplate,
        title: 'People'
    });
    bbviews.PersonView = TitleBBView.extend({
        template: '#project-person' + dtemplate,
        itemtemplate: '#personitem' + dtemplate,
        nameParent: 'People'
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
        itemtemplate: '#time' + dtemplate,
        template: '#project-time' + dtemplate,
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
            return item.set({
                'project-id': this.model.id,
                'todo-item-id': this.cur_item,
                'person-name': this.options.collections.people.get(item.get('person-id')).name()
            }, {silent: true});
        },
        template: '#todo-time' + dtemplate
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
        template: '#time-report' + dtemplate,
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
    bbviews.PostCommentsView = TitleBBView.extend({
        deps: function() {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.project_posts.get_or_create(this.model.id).fetchonce();
        },
        template: '#project-post-comments' + dtemplate,
        itemtemplate: '#post' + dtemplate,
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
    bbviews.CalendarEntryCommentsView = bbviews.PostCommentsView.extend({
        deps: function() {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.project_calendar.get_or_create(this.model.id).fetchonce();
        },
        template: '#project-calendar-entry-comments' + dtemplate,
        itemtemplate: '#calendar' + dtemplate,
        nameParent: 'Calendar',
        itemname: function() {
            var item = _.isFinite(this.cur_item) && this.options.collections.project_calendar.get_or_create(this.model.id).get(this.cur_item),
                title = item && item.name();
            return title;
        }
    });
    bbviews.PostsView = ProjectBBView.extend({
        template: '#project-posts' + dtemplate,
        itemtemplate: '#post' + dtemplate,
        title: 'Posts'
    });
    bbviews.PostView = TitleBBView.extend({
        template: '#project-post' + dtemplate,
        itemtemplate: '#post' + dtemplate,
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
        template: '#project-files' + dtemplate,
        title: 'Files'
    });
    bbviews.FileView = TitleBBView.extend({
        deps: bbviews.FilesView.prototype.deps,
        template: '#project-file' + dtemplate,
        nameParent: 'Files'
    });
    bbviews.CalendarView = ProjectBBView.extend({
        template: '#project-calendar' + dtemplate,
        itemtemplate: '#calendar' + dtemplate,
        title: 'Calendar'
    });
    bbviews.CalendarEntryView = TitleBBView.extend({
        template: '#project-calendar-entry' + dtemplate,
        itemtemplate: '#calendar' + dtemplate,
        nameParent: 'Calendar'
    });
    bbviews.CategoriesView = PagesBBView.extend({
        pagerid: 'project-categories',
        events: {
            'click .project-categories.previous': 'previous',
            'click .project-categories.next': 'next'
        },
        template: '#project-categories' + dtemplate,
        itemtemplate: '#category' + dtemplate,
        title: 'Categories'
    });
    bbviews.CategoryView = TitleBBView.extend({
        template: '#project-category' + dtemplate,
        itemtemplate: '#category' + dtemplate,
        nameParent: 'Categories'
    });
    bbviews.AllPersonView = BBView.extend({
        deps: function() {
            return this.options.collections.people.fetchonce() && this.options.collections.companies.fetchonce();
        },
        template: '#person' + dtemplate,
        path: function() {
            return [
                [
                    '#people',
                    'People'
                ]
            ];
        }
    });
    bbviews.TodosView = BBView.extend({
        deps: bbviews.TimeEntriesView.prototype.deps,
        events: {
            "change select[name='target']": 'selectTarget'
        },
        selectTarget: function(e) {
            this.collection.responsible_party = $(e.target).val();
            this.collection.fetch({cache: true, reset: true});
        },
        template: '#todo-lists' + dtemplate,
        itemtemplate: '#todolist' + dtemplate,
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
        template: '#project-todo-lists' + dtemplate,
        itemtemplate: '#todolist' + dtemplate,
        title: 'To-dos'
    });
    bbviews.TodoListView = TitleBBView.extend({
        deps: function() {
            return this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.todo_items.get_or_create(this.cur_item).fetchonce();
        },
        template: '#project-todo-list' + dtemplate,
        itemtemplate: '#todolist' + dtemplate,
        idParent: 'todo_lists',
        nameParent: 'To-dos',
        render: function() {
            BBViewProto.render.apply(this);
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
        template: '#project-todo-item' + dtemplate,
        itemtemplate: '#todolist' + dtemplate,
        extrapath: bbviews.PostCommentsView.prototype.extrapath,
        idParent: 'todo_lists',
        nameParent: 'To-dos',
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
            BBViewProto.render.apply(this);
            var item = this.options.collections.todo_items.get_or_create(this.cur_item).get(this.todo_item);
            if (item) {
                this.$el.find('.todoitemsholder').append(this.options.todo(this.model.id, item).render().el);
            }
            return this;
        }
    });
    bbviews.TodoItemCommentsView = bbviews.TodoItemView.extend({
        template: '#project-todo-item-comments' + dtemplate,
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
        template: '#todo' + dtemplate,
        render: function() {
            BBViewProto.render.apply(this);
            this.delegateEvents();
            return this;
        }
    });
    bbviews.NavView = BBView.extend({
        template: '#nav' + dtemplate,
        initialize: function() {
            this.model.bind('change', this.render, this);
        }
    });
    return bbviews;
}));
