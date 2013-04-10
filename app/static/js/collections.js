define(['backbone', 'backbone-pageable'], function (Backbone, PageableCollection) {
window.Projects = Backbone.Collection.extend({
    url: '/api/projects.xml',
    model: Project
});
window.Companies = Backbone.Collection.extend({
    url: '/api/companies.xml',
    model: Company
});
window.People = Backbone.Collection.extend({
    parent_id: null, // project id
    url: function () {
        if (this.parent_id) return '/api/projects/' + this.parent_id + '/people.xml';
        return '/api/people.xml';
    },
    model: Person
});
window.Posts = Backbone.Collection.extend({
    parent_id: null, // project id
    url: function () {
        return '/api/projects/' + this.parent_id + '/posts.xml';
    },
    model: Post
});
window.Attachments = PageableCollection.extend({
    mode: 'client',
    parent_id: null, // project id
    url: function () {
        return '/api/projects/' + this.parent_id + '/attachments.xml';
    },
    model: Attachment
});
window.Calendar = Backbone.Collection.extend({
    parent_id: null, // project id
    url: function () {
        return '/api/projects/' + this.parent_id + '/calendar_entries.xml';
    },
    model: CalendarEntry
});
window.Categories = PageableCollection.extend({
    mode: 'client',
    parent_id: null, // project id
    url: function () {
        return '/api/projects/' + this.parent_id + '/categories.xml';
    },
    model: Category
});
window.TimeEntries = PageableCollection.extend({
    mode: 'client',
    parent_id: null, // project id
    parent: 'projects',
    filter_report: null, // report filter
    //         This action accepts the following query parameters:
    //         `from`, `to`, `subject_id`, `todo_item_id`,
    //         `filter_project_id`, and `filter_company_id`. 
    //         Both `from` and `to` should be dates in `YYYYMMDD` format, and can be used to restrict the result to a particular date range.
    //         The `subject_id` parameter lets you constrain the result to a single person’s time entries.
    //         `todo_item_id` restricts the result to only those entries relating to the given todo item.
    //         `filter_project_id` restricts the entries to those for the given project,
    //         and `filter_company_id` restricts the entries to those for the given company.
    url: function () {
        if (this.parent_id) return '/api/' + this.parent + '/' + this.parent_id + '/time_entries.xml';
        if (this.filter_report) return '/api/time_entries/report.xml?' + this.filter_report;
        return '/api/time_entries/report.xml';
    },
    model: TimeEntry
});
window.TodoTimeEntries = TimeEntries.extend({
    parent: 'todo_items'
});
window.TodoItems = Backbone.Collection.extend({
    parent_id: null,
    url: function () {
        return '/api/todo_lists/' + this.parent_id + '/todo_items.xml';
    },
    model: TodoItem
});
window.TodoLists = Backbone.Collection.extend({
    responsible_party: null, // person id
    parent_id: null, // project id
    filter_status: null, // filter for project [all\pending\finished]
    url: function () {
        if (this.parent_id && this.filter_status) return '/api/projects/' + this.parent_id + '/todo_lists.xml?filter=' + this.filter_status;
        if (this.parent_id) return '/api/projects/' + this.parent_id + '/todo_lists.xml';
        if (this.responsible_party === null) return '/api/todo_lists.xml';
        if (this.responsible_party === "") return '/api/todo_lists.xml?responsible_party=';
        return '/api/todo_lists.xml?responsible_party=' + this.responsible_party;
    },
    model: TodoList
});
window.Comments = Backbone.Collection.extend({
    parent_id: null, // parent id
    parent_type: null, // posts|milestones|todo_items
    url: function () {
        return '/api/' + this.parent_type + '/' + this.parent_id + '/comments.xml';
    },
    model: Comment
});
window.PostComments = Comments.extend({
    parent_type: 'posts'
});
window.TodoComments = Comments.extend({
    parent_type: 'todo_items'
});
window.CalendarEntryComments = Comments.extend({
    parent_type: 'milestones'
});
});