var TimeReportView = Backbone.View.extend({
    deps: function () {
        this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.people.fetchonce() && this.options.collections.companies.fetchonce()
    },
    events: {
        "click .time-report.previous": "previous",
        "click .time-report.next": "next",
        "click #getreport": "getreport"
    },
    previous: function (e) {
        e.preventDefault();
        this.collection.hasPrevious() && this.collection.getPreviousPage();
    },
    next: function (e) {
        e.preventDefault();
        this.collection.hasNext() && this.collection.getNextPage();
    },
    getreport: function (e) {
        e.preventDefault();
        this.collection.filter_report = this.$('form#makereport').serialize();
        this.collection.fetch({cache:true})
    },
    template: '#time-report-template',
    itemtemplate: '#time-template',
    name: function () {
        return "Time report"
    },
    render: function () {
        this.$el.html(_.template($(this.template).html(), this, {variable: 'view'}));
        if (this.collection.filter_report) {
            this.$el.find('form#makereport').deserialize(this.collection.filter_report)
        }
        return this;
    }
});
var AllPeopleView = Backbone.View.extend({
    deps: function () {
        this.collection.fetchonce() && this.options.collections.companies.fetchonce()
    },
    template: '#people-template',
    name: function () {
        return "People"
    }
});
var ProjectsView = Backbone.View.extend({
    deps: function () {
        this.collection.fetchonce();
    },
    template: '#projects-template',
    name: function () {
        return "Projects"
    }
});
var ProjectView = Backbone.View.extend({
    deps: function () {
        this.options.collections.projects.fetchonce()
    },
    template: '#project-template',
    name: function () {
        return this.model.get('name')
    }
});
var CompaniesView = Backbone.View.extend({
    deps: function () {
        this.collection.fetchonce()
    },
    template: '#companies-template',
    name: function () {
        return "Companies"
    }
});
var CompanyView = Backbone.View.extend({
    deps: function () {
        this.options.collections.companies.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.people.fetchonce()
    },
    template: '#company-template',
    name: function () {
        return this.model.get('name')
    }
});
var PeopleView = Backbone.View.extend({
    deps: function () {
        this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.companies.fetchonce()
    },
    template: '#project-people-template',
    name: function () {
        return this.model.get('name') + " > People"
    }
});
var TimeEntriesView = Backbone.View.extend({
    deps: function () {
        this.collection.fetchonce() && this.options.collections.projects.fetchonce()
    },
    events: {
        "click .project-time.previous": "previous",
        "click .project-time.next": "next",
    },
    previous: function (e) {
        e.preventDefault();
        this.collection.hasPrevious() && this.collection.getPreviousPage();
    },
    next: function (e) {
        e.preventDefault();
        this.collection.hasNext() && this.collection.getNextPage();
    },
    template: '#project-time-template',
    name: function () {
        return this.model.get('name') + " > Time"
    }
});
var TodoTimeEntriesView = TimeEntriesView.extend({
    events: {
        "click .todo-time.previous": "previous",
        "click .todo-time.next": "next",
    },
    template: '#todo-time-template'
});
var PostCommentsView = Backbone.View.extend({
    cur_item: null,
    deps: function () {
        this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.project_posts.get_or_create(this.model.id).fetchonce()
    },
    template: '#project-post-comments-template',
    name: function () {
        var item=this.cur_item&&this.options.collections.project_posts.get_or_create(this.model.id).get(this.cur_item);
        var title=item&&item.get('title');
        return this.model.get('name') + " > Posts > " + title + " > Comments"
    }
});
var CalendarEntryCommentsView = Backbone.View.extend({
    cur_item: null,
    deps: function () {
        this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.project_calendar.get_or_create(this.model.id).fetchonce()
    },
    template: '#project-calendar-entry-comments-template',
    name: function () {
        var item=this.cur_item&&this.options.collections.project_calendar.get_or_create(this.model.id).get(this.cur_item);
        var title=item&&item.get('title');
        return this.model.get('name') + " > Calendar > " + title + " > Comments"
    }
});
var PostsView = Backbone.View.extend({
    deps: function () {
        this.collection.fetchonce() && this.options.collections.projects.fetchonce()
    },
    template: '#project-posts-template',
    name: function () {
        return this.model.get('name') + " > Posts"
    }
});
var PostView = Backbone.View.extend({
    cur_item: null,
    deps: function () {
        this.collection.fetchonce() && this.options.collections.projects.fetchonce()
    },
    template: '#project-post-template',
    name: function () {
        var item=this.cur_item&&this.collection.get(this.cur_item);
        var title=item&&item.get('title');
        return this.model.get('name') + " > Posts > " + title
    }
});
var FilesView = Backbone.View.extend({
    deps: function () {
        this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.people.fetchonce() && this.options.collections.project_categories.get_or_create(this.model.id).fetchonce()
    },
    events: {
        "click .project-files.previous": "previous",
        "click .project-files.next": "next",
    },
    previous: function (e) {
        e.preventDefault();
        this.collection.hasPrevious() && this.collection.getPreviousPage();
    },
    next: function (e) {
        e.preventDefault();
        this.collection.hasNext() && this.collection.getNextPage();
    },
    template: '#project-files-template',
    name: function () {
        return this.model.get('name') + " > Files"
    }
});
var FileView = Backbone.View.extend({
    cur_item: null,
    deps: function () {
        this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.people.fetchonce() && this.options.collections.project_categories.get_or_create(this.model.id).fetchonce()
    },
    template: '#project-file-template',
    name: function () {
        var item=this.cur_item&&this.collection.get(this.cur_item);
        var title=item&&item.get('name');
        return this.model.get('name') + " > Files > " + title
    }
});
var CalendarView = Backbone.View.extend({
    deps: function () {
        this.collection.fetchonce() && this.options.collections.projects.fetchonce()
    },
    template: '#project-calendar-template',
    name: function () {
        return this.model.get('name') + " > Calendar"
    }
});
var CalendarEntryView = Backbone.View.extend({
    cur_item: null,
    deps: function () {
        this.collection.fetchonce() && this.options.collections.projects.fetchonce()
    },
    template: '#project-calendar-entry-template',
    name: function () {
        var item=this.cur_item&&this.collection.get(this.cur_item);
        var title=item&&item.get('title');
        return this.model.get('name') + " > Calendar > " + title
    }
});
var CategoriesView = Backbone.View.extend({
    deps: function () {
        this.collection.fetchonce() && this.options.collections.projects.fetchonce()
    },
    template: '#project-categories-template',
    name: function () {
        return this.model.get('name') + " > Categories"
    }
});
var CategoryView = Backbone.View.extend({
    cur_item: null,
    deps: function () {
        this.collection.fetchonce() && this.options.collections.projects.fetchonce()
    },
    template: '#project-category-template',
    name: function () {
        var item=this.cur_item&&this.collection.get(this.cur_item);
        var title=item&&item.get('name');
        return this.model.get('name') + " > Categories > " + title
    }
});
var PersonView = Backbone.View.extend({
    deps: function () {
        this.options.collections.people.fetchonce() && this.options.collections.companies.fetchonce()
    },
    template: '#person-template',
    name: function () {
        return this.model.name()
    }
});
var TodosView = Backbone.View.extend({
    deps: function () {
        this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.people.fetchonce()
    },
    events: {
        "change select[name='target']": "selectTarget"
    },
    selectTarget: function (e) {
        this.collection.responsible_party = $(e.target).val();
        this.collection.fetch({cache:true})
    },
    template: '#todo-lists-template',
    name: function () {
        if (this.collection.responsible_party) {
            var person = this.options.collections.people && this.options.collections.people.get(this.collection.responsible_party);
            return person ? person.name() + "'s to-dos" : this.collection.responsible_party + "'s to-dos"
        }
        if (this.collection.responsible_party == null) return "My to-dos";
        if (this.collection.responsible_party == "") return "Unassigned to-dos";
        return "To-dos"
    },
    description: function () {
        if (this.collection.responsible_party) {
            var person = this.options.collections.people && this.options.collections.people.get(this.collection.responsible_party);
            return person && person.name() + "'s" || this.collection.responsible_party + "'s"
        }
        if (this.collection.responsible_party == null) return "My";
        if (this.collection.responsible_party == "") return "Unassigned";
        return "All"
    }
});
var TodoListsView = Backbone.View.extend({
    deps: function () {
        this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.sub()
    },
    events: {
        "click .project-todo-lists.icon-completed": "uncomplete",
        "click .project-todo-lists.icon-uncompleted": "complete"
    },
    complete: function (e) {
        var target = $(e.target);
        var todolist_id = parseInt(target.data('todolist-id'));
        var todoitem_id = parseInt(target.data('todoitem-id'));
        var todo_items = this.options.collections.todo_items;
        var items = todo_items.get_or_create(todolist_id);
        var item = items.get(todoitem_id);
        item.set('completed', true);
        this.render()
    },
    uncomplete: function (e) {
        var target = $(e.target);
        var todolist_id = parseInt(target.data('todolist-id'));
        var todoitem_id = parseInt(target.data('todoitem-id'));
        var todo_items = this.options.collections.todo_items;
        var items = todo_items.get_or_create(todolist_id);
        var item = items.get(todoitem_id);
        item.set('completed', false);
        this.render()
    },
    template: '#project-todo-lists-template',
    sub: function () {
        var todo_items = this.options.collections.todo_items;
        var td = _.map(this.collection.pluck('id'), function (id) {
            return todo_items.get_or_create(id)
        });
        var ftd = _.first(td.filter(function (i) {
            return !i.fetched
        }));
        if (ftd) {
            ftd.fetched = true;
            ftd.fetch({cache:true})
        }
    },
    name: function () {
        if (this.collection.parent_id) {
            return this.model.get('name') + " > To-dos"
        }
        return "To-dos"
    }
});
var TodoListView = Backbone.View.extend({
    cur_item: null,
    deps: function () {
        this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.todo_items.get_or_create(this.cur_item).fetchonce();
    },
    events: {
        "click .project-todo-list.icon-completed": "uncomplete",
        "click .project-todo-list.icon-uncompleted": "complete"
    },
    complete: function (e) {
        var target = $(e.target);
        var todolist_id = parseInt(target.data('todolist-id'));
        var todoitem_id = parseInt(target.data('todoitem-id'));
        var todo_items = this.options.collections.todo_items;
        var items = todo_items.get_or_create(todolist_id);
        var item = items.get(todoitem_id);
        item.set('completed', true);
        this.render()
    },
    uncomplete: function (e) {
        var target = $(e.target);
        var todolist_id = parseInt(target.data('todolist-id'));
        var todoitem_id = parseInt(target.data('todoitem-id'));
        var todo_items = this.options.collections.todo_items;
        var items = todo_items.get_or_create(todolist_id);
        var item = items.get(todoitem_id);
        item.set('completed', false);
        this.render()
    },
    template: '#project-todo-list-template',
    name: function () {
        var item=this.cur_item&&this.collection.get(this.cur_item);
        var title=item&&item.get('name');
        return this.model.get('name') + " > To-dos > " + title
    }
});
var TodoItemView = Backbone.View.extend({
    todo_item: null,
    cur_item: null,
    deps: function () {
        this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.options.collections.todo_items.get_or_create(this.cur_item).fetchonce();
    },
    events: {
        "click .project-todo-item.icon-completed": "uncomplete",
        "click .project-todo-item.icon-uncompleted": "complete"
    },
    complete: function (e) {
        var target = $(e.target);
        var todolist_id = parseInt(target.data('todolist-id'));
        var todoitem_id = parseInt(target.data('todoitem-id'));
        var todo_items = this.options.collections.todo_items;
        var items = todo_items.get_or_create(todolist_id);
        var item = items.get(todoitem_id);
        item.set('completed', true);
        this.render()
    },
    uncomplete: function (e) {
        var target = $(e.target);
        var todolist_id = parseInt(target.data('todolist-id'));
        var todoitem_id = parseInt(target.data('todoitem-id'));
        var todo_items = this.options.collections.todo_items;
        var items = todo_items.get_or_create(todolist_id);
        var item = items.get(todoitem_id);
        item.set('completed', false);
        this.render()
    },
    template: '#project-todo-item-template',
    name: function () {
        var list=this.cur_item&&this.collection.get(this.cur_item);
        var title=list&&list.get('name');
        var item=this.todo_item&&this.options.collections.todo_items.get_or_create(this.cur_item).get(this.todo_item);
        var itemtitle=item&&item.get('content');
        return this.model.get('name') + " > To-dos > " + title + " > " + itemtitle
    }
});
var TodoItemCommentsView = Backbone.View.extend({
    todo_item: null,
    cur_item: null,
    deps: function () {
        this.collection.fetchonce() && this.options.collections.projects.fetchonce() && this.todo_lists.fetchonce() && this.options.collections.todo_items.get_or_create(this.cur_item).fetchonce();
    },
    events: {
        "click .project-todo-item-comments.icon-completed": "uncomplete",
        "click .project-todo-item-comments.icon-uncompleted": "complete"
    },
    complete: function (e) {
        var target = $(e.target);
        var todolist_id = parseInt(target.data('todolist-id'));
        var todoitem_id = parseInt(target.data('todoitem-id'));
        var todo_items = this.options.collections.todo_items;
        var items = todo_items.get_or_create(todolist_id);
        var item = items.get(todoitem_id);
        item.set('completed', true);
        this.render()
    },
    uncomplete: function (e) {
        var target = $(e.target);
        var todolist_id = parseInt(target.data('todolist-id'));
        var todoitem_id = parseInt(target.data('todoitem-id'));
        var todo_items = this.options.collections.todo_items;
        var items = todo_items.get_or_create(todolist_id);
        var item = items.get(todoitem_id);
        item.set('completed', false);
        this.render()
    },
    template: '#project-todo-item-comments-template',
    name: function () {
        var list=this.cur_item&&this.todo_lists.get(this.cur_item);
        var title=list&&list.get('name');
        var item=this.todo_item&&this.options.collections.todo_items.get_or_create(this.cur_item).get(this.todo_item);
        var itemtitle=item&&item.get('content');
        return this.model.get('name') + " > To-dos > " + title + " > " + itemtitle + " > Comments"
    }
});
var NavView = Backbone.View.extend({
    template: '#nav-template',
    initialize: function () {
        this.model.bind("change", this.render, this);
    }
});