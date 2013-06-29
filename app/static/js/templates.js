/*jslint white: true*/
(function(root, factory) {
    'use strict';
    if (typeof root.define === 'function' && root.define.amd) {
        // AMD. Register as the bbtemplates module.
        root.define('bbtemplates', [], factory);
    } else {
        // Browser globals
        root.bbtemplates = factory();
    }
}(this, function() {
'use strict';
var templates = {};
templates['#time'] = '<tr <% if(item.get("hours")>2){ %>class="warning"<% } %> data-id="<%- item.id %>">' +
'    <td><%- item.get("date") %></td>' +
'    <td><%- item.get("hours") %></td>' +
'    <td><a title="<%- item.get("person-name") %>" href="#people/<%- item.get("person-id") %>"><i class="icon-user"></i><%- item.get("person-name") %></a></td>' +
'    <td>' +
'        <% if (item.get("todo-item-id")) { %>' +
'            <a title="Todo time" href="#projects/<%- item.get("project-id") %>/time_entries/todo_items/<%- item.get("todo-item-id") %>"><i class="icon-file"></i></a>' +
'        <% } else { %>' +
'            <a title="Project time" href="#projects/<%- item.get("project-id") %>/time_entries"><i class="icon-folder-close"></i></a>' +
'        <% } %>' +
'        <%- item.get("description") %>' +
'    </td>' +
'    <td>' +
'        <button id="edit" title="Edit"><i class="icon-edit"></i></button>' +
'        <button id="remove" title="Remove"><i class="icon-trash"></i></button>' +
'    </td>' +
'</tr>';
templates['#timeedit'] = '<tr class="edittime" data-id="<%- item.id %>">' +
'    <td><input data-provide="datepicker" data-date-autoclose="true" data-date-format="yyyy-mm-dd" type="text" class="input-small" name="date" placeholder="YYYY-MM-DD" value="<%- item.get("date") %>"></td>' +
'    <td><input type="text" class="input-small" name="hours" placeholder="hours" value="<%- item.get("hours") %>"></td>' +
'    <td>' +
'        <div>' +
'            <i class="icon-user"></i><select name="person-id">' +
'                <% view.options.collections.people.each(function (i) { %>' +
'                    <option value="<%- i.id %>" <% if (i.id==item.get("person-id")) { %>selected="selected"<% } %>><%- i.name() %></option>' +
'                <% }) %>' +
'            </select>' +
'        </div>' +
'    </td>' +
'    <td>' +
'        <% if (item.get("todo-item-id")) { %>' +
'            <a title="Todo time" href="#projects/<%- item.get("project-id") %>/time_entries/todo_items/<%- item.get("todo-item-id") %>"><i class="icon-file"></i></a>' +
'        <% } else { %>' +
'            <a title="Project time" href="#projects/<%- item.get("project-id") %>/time_entries"><i class="icon-folder-close"></i></a>' +
'        <% } %>' +
'        <input type="text" class="input-small" name="description" value="<%- item.get("description") %>">' +
'    </td>' +
'    <td>' +
'        <button id="save" title="Save"><i class="icon-ok"></i></button>' +
'        <button id="reset" title="Cancel"><i class="icon-off"></i></button>' +
'    </td>' +
'</tr>';
templates['#pager'] = '<% if(view.collection.hasPrevious() || view.collection.hasNext()){ %>' +
'<ul class="pager">' +
'    <li class="<%- view.pagerid %> previous<% if(!view.collection.hasPrevious()){ %> disabled<% } %>">' +
'        <a href="#">&larr; Previous Page</a>' +
'    </li>' +
'    <li class="<%- view.pagerid %> next<% if(!view.collection.hasNext()){ %> disabled<% } %>">' +
'        <a href="#">Next Page &rarr;</a>' +
'    </li>' +
'</ul>' +
'<% } %>';
templates['#header'] = '<div class="page-header">' +
'    <h1><%- view.PageHeader() %></h1>' +
'</div>' +
'<% var path = view.Path();' +
'if (path) { %>' +
'<ul class="breadcrumb">' +
'<% _.each(path, function(i) { %>' +
'    <li<% var url = i[0], title = i[1]; if (url) { %>>' +
'    <a href="<%- url %>"><%- title %></a> <span class="divider">&gt;</span>' +
'    <% } else { %> class="active">' +
'    <%- title %>' +
'    <% } %></li>' +
'<% }) %>' +
'</ul>' +
'<% } %>';
templates['#project-nav'] = '<ul class="nav nav-tabs projectnav">' +
'    <li><a title="<%- view.model.name() %> project overview" href="#projects/<%- view.model.id %>">Overview</a></li>' +
'    <li><a title="<%- view.model.name() %> project messages" href="#projects/<%- view.model.id %>/posts">Messages</a></li>' +
'    <li><a title="<%- view.model.name() %> project todos" href="#projects/<%- view.model.id %>/todo_lists">To-Dos</a></li>' +
'    <li><a title="<%- view.model.name() %> project calendar" href="#projects/<%- view.model.id %>/calendar">Calendar</a></li>' +
'    <li><a title="<%- view.model.name() %> project time" href="#projects/<%- view.model.id %>/time_entries">Time</a></li>' +
'    <li><a title="<%- view.model.name() %> project files" href="#projects/<%- view.model.id %>/files">Files</a></li>' +
'    <li class="pull-right"><a title="<%- view.model.name() %> project people" href="#projects/<%- view.model.id %>/people">People</a></li>' +
'    <li class="pull-right"><a title="<%- view.model.name() %> project categories" href="#projects/<%- view.model.id %>/categories">Categories</a></li>' +
'</ul>';
templates['#attachment'] = '<li>' +
'    <a href="<%- item["download-url"] %>"><%- item.name %></a>' +
'    <small>' +
'        <%- item["byte-size"] %>B' +
'        <a href="#people/<%- item["person-id"] %>"><i class="icon-user"></i><%- item["author-name"] %></a>' +
'    </small>' +
'</li>';
templates['#attachments'] = '<% if (item.get("attachments")) { %>' +
'    <ul>' +
'        <% _.each(item.get("attachments"),function (a) { %>' +
'<%= view.itemblock(a, "#attachment") %>' +
'        <% }) %>' +
'    </ul>' +
'    <% } %>';
templates['#comment'] = '<li class="thumbnail">' +
'    <small>' +
'        <a href="#people/<%- item.get("author-id") %>"><i class="icon-user"></i><%- item.get("author-name") %></a>' +
'        <abbr title="<%- item.get("created-at") %>"><%- moment(item.get("created-at")).format("LLL") %></abbr>' +
'    </small>' +
'    <p><%= item.get("body") %></p>' +
'<%= view.itemblock(item, "#attachments") %>' +
'</li>';
templates['#comments'] = '<% if (view.collection.isEmpty()) { %>' +
'<div class="alert alert-info">' +
'    No comments...' +
'</div>' +
'<% } else { %>' +
'<ul class="unstyled">' +
'    <% view.collection.each(function (item) { %>' +
'        <%= view.itemblock(item, "#comment") %>' +
'    <% }) %>' +
'</ul>' +
'<% } %>';
templates['#time-thead'] = '<thead>' +
'    <tr>' +
'        <th>date</th><th>hours</th><th data-sort="person-id">person</th><th>description</th><th data-sort="id">&nbsp;</th>' +
'    </tr>' +
'</thead>';
templates['#time-report'] = '<%= view.block("#header") %>' +
'<div id="time_report" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="makereportlabel" aria-hidden="true">' +
'<div class="modal-header">' +
'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>' +
'<h3 id="makereportlabel">Make report</h3>' +
'</div>' +
'<form id="makereport">' +
'    <div class="modal-body">' +
'    <div class="input-prepend">' +
'        <span class="add-on">From</span>' +
'        <input data-provide="datepicker" data-date-autoclose="true" data-date-format="yyyymmdd" type="text" class="input-small" name="from" placeholder="YYYYMMDD">' +
'    </div>' +
'    <br />' +
'    <div class="input-prepend">' +
'        <span class="add-on">To</span>' +
'        <input data-provide="datepicker" data-date-autoclose="true" data-date-format="yyyymmdd" type="text" class="input-small" name="to" placeholder="YYYYMMDD">' +
'    </div>' +
'    <br />' +
'    <div class="input-prepend">' +
'        <span class="add-on">For</span>' +
'        <select name="subject_id" class="input-medium">' +
'            <option value="">All</option>' +
'            <% view.options.collections.people.each(function (i) { %>' +
'                <option value="<%- i.id %>"><%- i.name() %></option>' +
'            <% }) %>' +
'        </select>' +
'    </div>' +
'    <br />' +
'    <div class="input-prepend">' +
'        <span class="add-on">Project</span>' +
'        <select name="filter_project_id" class="input-medium">' +
'            <option value="">All</option>' +
'            <% view.options.collections.projects.each(function (i) { %>' +
'                <option value="<%- i.id %>"><%- i.get("name") %></option>' +
'            <% }) %>' +
'        </select>' +
'    </div>' +
'    <br />' +
'    <div class="input-prepend">' +
'        <span class="add-on">Company</span>' +
'        <select name="filter_company_id" class="input-medium">' +
'            <option value="">All</option>' +
'            <% view.options.collections.companies.each(function (i) { %>' +
'                <option value="<%- i.id %>"><%- i.get("name") %></option>' +
'            <% }) %>' +
'        </select>' +
'    </div>' +
'    </div>' +
'    <div class="modal-footer">' +
'        <button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>' +
'        <button id="getreport" type="submit" data-dismiss="modal" class="btn btn-primary">Report</button>' +
'    </div>' +
'</form>' +
'</div>' +
'<a href="#time_report" role="button" class="btn btn-primary" data-toggle="modal">Report</a>' +
'<% var tt=view.collection;' +
'if (tt.isEmpty()) { %>' +
'<div class="alert alert-info">' +
'    No time entries...' +
'</div>' +
'<% } else { %>' +
'<%= view.block("#pager") %>' +
'<table class="table table-hover table-condensed table-bordered <%- view.pagerid %>">' +
'    <%= view.block("#time-thead") %>' +
'    <tbody>' +
'        <% var prs=view.options.collections.projects;' +
'        _.each(_.uniq(tt.pluck("project-id")), function (prid) { %>' +
'        <tr class="info">' +
'            <td>' +
'                <a href="#projects/<%- prid %>/time_entries"><%- prs.get(prid)?prs.get(prid).get("name"):prid %></a>' +
'            </td>' +
'            <td>' +
'                <%- _.reduce(_.map(tt.where({"project-id":prid}),function(i){return i.get("hours");}),function(memo, num) { return memo + num; }, 0) %>' +
'            </td>' +
'            <td colspan="3">&nbsp;</td>' +
'        </tr>' +
'        <% _.each(tt.where({"project-id":prid}), function (item) { %>' +
'            <%= view.renderitem(item) %>' +
'        <% }) %>' +
'        <% }) %>' +
'    </tbody>' +
'</table>' +
'<%= view.block("#pager") %>' +
'<% } %>';
templates['#projects'] = '<%= view.block("#header") %>' +
'<% var pp=view.collection; if (pp.isEmpty()) { %>' +
'<div class="alert alert-info">' +
'    No projects...' +
'</div>' +
'<% } else { %>' +
'<div class="tabbable">' +
'<ul class="nav nav-pills">' +
'<% var fprst=_.first(pp.pluck("status"));' +
'   _.each(_.uniq(pp.pluck("status")), function (status) { %>' +
'    <li class="prstatus<% if (fprst==status) { %> active<% } %> pull-right">' +
'        <a href="#projects_<%- status %>" data-toggle="tab"><%- status %></a>' +
'    </li>' +
'<% }) %>' +
'</ul>' +
'<div class="tab-content">' +
'<% _.each(pp.groupBy(function(i){ return i.get("status")}), function (plist, status) { %>' +
'    <div class="tab-pane fade<% if (fprst==status) { %> in active<% } %>" id="projects_<%- status %>">' +
'        <div class="tabbable row-fluid">' +
'        <ul class="nav nav-list span4 pull-right">' +
'        <% var fprcoid=_.first(plist).get("company").id;' +
'        _.each(_.groupBy(plist, function(item){ return item.get("company").id}), function (list, coid) { %>' +
'            <li<% if (fprcoid==coid) { %> class="active"<% } %>>' +
'                <a href="#projects_<%- status %>_<%- coid %>" data-toggle="tab"><%- _.first(list).get("company").name %></a>' +
'            </li>' +
'        <% }) %>' +
'        </ul>' +
'        <div class="tab-content span8">' +
'        <% _.each(_.groupBy(plist, function(item){ return item.get("company").id}), function (list, coid) { %>' +
'            <div class="tab-pane fade<% if (fprcoid==coid) { %> in active<% } %>" id="projects_<%- status %>_<%- coid %>">' +
'                <ul class="unstyled">' +
'                <% _.each(list, function (item) { %>' +
'                    <li>' +
'                        <h3><a href="#projects/<%- item.id %>"><%- item.get("name") %></a></h3>' +
'                    </li>' +
'                <% }) %>' +
'                </ul>' +
'            </div>' +
'        <% }) %>' +
'        </div>' +
'        </div>' +
'    </div>' +
'<% }) %>' +
'</div>' +
'</div>' +
'<% } %>';
templates['#project'] = '<%= view.block("#header") %>' +
'<%= view.block("#project-nav") %>' +
'<% if (view.model.get("announcement")) { %><p><%= view.model.get("announcement") %></p><% } %>';
templates['#companies'] = '<%= view.block("#header") %>' +
'<% cc=view.collection; if (cc.isEmpty()) { %>' +
'<div class="alert alert-info">' +
'    No companies...' +
'</div>' +
'<% } else { %>' +
'<dl>' +
'<% cc.each(function (item) { %>' +
'    <dt><h3><a href="#companies/<%- item.id %>"><%- item.get("name") %></a></h3></dt>' +
'    <dd class="row-fluid thumbnail">' +
'        <div class="span4">' +
'            <% if (item.get("web-address")) { %><a href="<%- item.get("web-address") %>"><b><%- item.get("web-address") %></b></a><br /><% } %>' +
'            <% if (item.get("time-zone-id")) { %>Time zone: <%- item.get("time-zone-id") %><br /><% } %>' +
'            <% if (item.get("locale")) { %>Locale: <%- item.get("locale") %><% } %>' +
'        </div>' +
'        <div class="span4">' +
'            <% if (item.get("country")) { %><%- item.get("country") %><br /><% } %>' +
'            <% if (item.get("city")) { %><%- item.get("city") %> <%- item.get("zip") %><br /><% } %>' +
'            <% if (item.get("address-one")) { %><%- item.get("address-one") %><br /><% } %>' +
'            <% if (item.get("address-two")) { %><%- item.get("address-two") %><% } %>' +
'        </div>' +
'        <div class="span4">' +
'            <% if (item.get("state")) { %>State: <%- item.get("state") %><br /><% } %>' +
'            <% if (item.get("phone-number-office")) { %>Office phone: <%- item.get("phone-number-office") %><br /><% } %>' +
'            <% if (item.get("phone-number-fax")) { %>Fax phone: <%- item.get("phone-number-fax") %><br /><% } %>' +
'        </div>' +
'    </dd>' +
'<% }) %>' +
'</dl>' +
'<% } %>';
templates['#company'] = '<%= view.block("#header") %>' +
'<div class="row">' +
'    <div class="span4">' +
'        <h2>Projects</h2>' +
'        <% var cid = view.model.id; var pp=view.options.collections.projects; if (pp.isEmpty()) { %>' +
'        <div class="alert alert-info">' +
'            No projects...' +
'        </div>' +
'        <% } else { %>' +
'        <ul class="unstyled">' +
'        <% _.each(pp.filter(function(i){return i.get("company").id==cid}), function (item) { %>' +
'            <li><i class="<%- item.icon() %>"></i>&nbsp;<a href="#projects/<%- item.id %>"><%- item.get("name") %></a></li>' +
'        <% }) %>' +
'        </ul>' +
'        <% } %>' +
'    </div>' +
'    <div class="span4">' +
'        <h2>People</h2>' +
'        <% var pp=view.options.collections.people; if (pp.isEmpty()) { %>' +
'        <div class="alert alert-info">' +
'            No people...' +
'        </div>' +
'        <% } else { %>' +
'        <ul class="unstyled">' +
'        <% _.each(pp.filter(function(i){return i.get("company-id")==cid}), function (item) { %>' +
'            <li><a href="#people/<%- item.id %>"><i class="icon-user"></i><%- item.name() %></a></li>' +
'        <% }) %>' +
'        </ul>' +
'        <% } %>' +
'    </div>' +
'    <div class="span4">' +
'        <h2>Contact</h2>' +
'        <% if (view.model.get("web-address")) { %>' +
'        <a href="<%- view.model.get("web-address") %>"><b><%- view.model.get("web-address") %></b></a><br />' +
'        <% } %>' +
'        <% if (view.model.get("time-zone-id")) { %>Time zone: <%- view.model.get("time-zone-id") %><br /><% } %>' +
'        <% if (view.model.get("locale")) { %>Locale: <%- view.model.get("locale") %><% } %>' +
'        <% if (view.model.get("country")) { %><%- view.model.get("country") %><br /><% } %>' +
'        <% if (view.model.get("city")) { %><%- view.model.get("city") %> <%- view.model.get("zip") %><br /><% } %>' +
'        <% if (view.model.get("address-one")) { %><%- view.model.get("address-one") %><br /><% } %>' +
'        <% if (view.model.get("address-two")) { %><%- view.model.get("address-two") %><% } %>' +
'        <% if (view.model.get("state")) { %>State: <%- view.model.get("state") %><br /><% } %>' +
'        <% if (view.model.get("phone-number-office")) { %>Office phone: <%- view.model.get("phone-number-office") %><br /><% } %>' +
'        <% if (view.model.get("phone-number-fax")) { %>Fax phone: <%- view.model.get("phone-number-fax") %><br /><% } %>' +
'    </div>' +
'</div>';
templates['#person'] = '<%= view.block("#header") %>' +
'<img class="pull-right img-polaroid" width="55" height="55"' +
'     src="<%- view.model.get("avatar-url") %>"' +
'     alt="<%- view.model.name() %>">' +
'<a href="mailto:<%- view.model.get("email-address") %>"><b><%- view.model.get("email-address") %></b></a><br />' +
'<% if (view.model.get("im-service")&&view.model.get("im-handle")) { %>' +
'    <%- view.model.get("im-service") %>: <% if (view.model.get("im-service")=="Skype") { %>' +
'        <a href="skype:<%- view.model.get("im-handle") %>?call" title="Skype call to <%- view.model.name() %>"><%- view.model.get("im-handle") %></a>' +
'    <% } else { %>' +
'        <%- view.model.get("im-handle") %>' +
'    <% } %>' +
'    <br />' +
'<% } %>' +
'<% if (view.model.get("phone-number-office")) { %>Office phone: <%- view.model.get("phone-number-office") %><br /><% } %>' +
'<% if (view.model.get("phone-number-mobile")) { %>Mobile phone: <%- view.model.get("phone-number-mobile") %><br /><% } %>' +
'<% if (view.model.get("phone-number-home")) { %>Home phone: <%- view.model.get("phone-number-home") %><br /><% } %>' +
'<% if (view.model.get("phone-number-fax")) { %>Fax phone: <%- view.model.get("phone-number-fax") %><br /><% } %>' +
'<% if (view.model.get("time-zone-name")) { %>Time zone: <%- view.model.get("time-zone-name") %><% } %>';
templates['#personitem'] = '<% var in_project=item.collection.url().indexOf("projects")!==-1 %>' +
'<li class="media well well-small">' +
'    <a class="pull-right" href="#<%- in_project ? "projects/" + item.get("project-id") + "/" : "" %>people/<%- item.id %>" title="<%- item.name() %>"><img class="media-object img-polaroid" src="<%- item.get("avatar-url") %>" alt="<%- item.name() %>"></a>' +
'    <div class="media-body">' +
'        <h4 class="media-heading">' +
'            <a href="#<%- in_project ? "projects/" + item.get("project-id") + "/" : "" %>people/<%- item.id %>" title="<%- item.name() %>"><%- item.name() %></a>' +
'            <% if (item.get("title")) { %>' +
'            <small><%- item.get("title") %></small>' +
'            <% } %>' +
'        </h4>' +
'        <a href="mailto:<%- item.get("email-address") %>"><b><%- item.get("email-address") %></b></a><br />' +
'        <% if (item.get("im-service")&&item.get("im-handle")) { %>' +
'            <%- item.get("im-service") %>: <% if (item.get("im-service")=="Skype") { %>' +
'                <a href="skype:<%- item.get("im-handle") %>?call" title="Skype call to <%- item.name() %>"><%- item.get("im-handle") %></a>' +
'            <% } else { %>' +
'                <%- item.get("im-handle") %>' +
'            <% } %>' +
'            <br />' +
'        <% } %>' +
'        <% if (item.get("phone-number-office")) { %>Office phone: <%- item.get("phone-number-office") %><br /><% } %>' +
'        <% if (item.get("phone-number-mobile")) { %>Mobile phone: <%- item.get("phone-number-mobile") %><br /><% } %>' +
'        <% if (item.get("phone-number-home")) { %>Home phone: <%- item.get("phone-number-home") %><br /><% } %>' +
'        <% if (item.get("phone-number-fax")) { %>Fax phone: <%- item.get("phone-number-fax") %><br /><% } %>' +
'        <% if (item.get("time-zone-name")) { %>Time zone: <%- item.get("time-zone-name") %><% } %>' +
'    </div>' +
'</li>';
templates['#people'] = '<%= view.block("#header") %>' +
'<% var pp=view.collection; var co=view.options.collections.companies;' +
'if (pp.isEmpty()) { %>' +
'<div class="alert alert-info">' +
'    No people...' +
'</div>' +
'<% } else {' +
'if (co.isEmpty()) { %>' +
'<ul class="media-list">' +
'<% pp.each(function (item) { %>' +
'    <%= view.renderitem(item) %>' +
'<% }) %>' +
'</ul>' +
'<% } else { %>' +
'<div class="tabbable tabs-left row-fluid">' +
'<ul class="nav nav-tabs span3">' +
'<% var fcoid=_.first(pp.pluck("company-id"));' +
'   view.options.collections.companies.each(function (item) { %>' +
'    <li<% if (fcoid==item.id) { %> class="active"<% } %>><a href="#people_c<%- item.id %>" data-toggle="tab"><%- item.get("name") %></a></li>' +
'<% }) %>' +
'</ul>' +
'<div class="tab-content span8">' +
'<% view.options.collections.companies.each(function (cc) { %>' +
'    <div class="tab-pane fade<% if (fcoid==cc.id) { %> in active<% } %>" id="people_c<%- cc.id %>">' +
'        <% var cp=pp.where({"company-id":cc.id}); if (_.isEmpty(cp)) { %>' +
'        <div class="alert alert-info">' +
'            No people in company...' +
'        </div>' +
'        <% } else { %>' +
'        <ul class="media-list">' +
'        <% _.each(cp, function (item) { %>' +
'            <%= view.renderitem(item) %>' +
'        <% }) %>' +
'        </ul>' +
'        <% } %>' +
'    </div>' +
'<% }) %>' +
'</div>' +
'</div>' +
'<% }} %>';
templates['#project-people'] = '<%= view.block("#header") %>' +
'<%= view.block("#project-nav") %>' +
'<% var pp=view.collection;  var cc=view.options.collections.companies;' +
'if (pp.isEmpty()) { %>' +
'<div class="alert alert-info">' +
'    No people...' +
'</div>' +
'<% } else {' +
'if (cc.isEmpty()) { %>' +
'<ul class="media-list">' +
'<% pp.each(function (item) { %>' +
'    <%= view.renderitem(item) %>' +
'<% }) %>' +
'</ul>' +
'<% } else { %>' +
'<div class="tabbable tabs-left row-fluid">' +
'<ul class="nav nav-tabs span3">' +
'<% var pc=_.uniq(pp.pluck("company-id")); var fcoid=_.first(pc);' +
'_.each(pc, function (id) { %>' +
'    <li<% if (fcoid==id) { %> class="active"<% } %>><a href="#people_c<%- id %>" data-toggle="tab"><%- cc.get(id)?cc.get(id).get("name"):id %></a></li>' +
'<% }) %>' +
'</ul>' +
'<div class="tab-content span8">' +
'<% _.each(pc, function (id) { %>' +
'    <div class="tab-pane fade<% if (fcoid==id) { %> in active<% } %>" id="people_c<%- id %>">' +
'        <ul class="media-list">' +
'        <% _.each(pp.where({"company-id":id}), function (item) { %>' +
'            <%= view.renderitem(item) %>' +
'        <% }) %>' +
'        </ul>' +
'    </div>' +
'<% }) %>' +
'</div>' +
'</div>' +
'<% }} %>';
templates['#project-person'] = '<%= view.block("#header") %>' +
'<%= view.block("#project-nav") %>' +
'<% var pp=view.collection; var item=pp.get(view.cur_item);' +
'if (pp.isEmpty()) { %>' +
'<div class="alert alert-info">' +
'    No people...' +
'</div>' +
'<% } else { %>' +
'<ul class="media-list">' +
'    <%= view.renderitem(item) %>' +
'</ul>' +
'<% } %>';
templates['#project-time'] = templates['#todo-time'] = '<%= view.block("#header") %>' +
'<%= view.block("#project-nav") %>' +
'<% var tt=view.collection; var prid=view.model.id;' +
'var pp=view.options.collections.people;' +
'var mid=view.options.mydata?view.options.mydata.id:0;' +
'if (tt.isEmpty()) { %>' +
'<div class="alert alert-info">' +
'    No time entries...' +
'</div>' +
'<% } else { %>' +
'<%= view.block("#pager") %>' +
'<table class="table table-hover table-condensed table-bordered <%- view.pagerid %>">' +
'    <%= view.block("#time-thead") %>' +
'    <tbody>' +
'        <tr class="addtime">' +
'            <td><input data-provide="datepicker" data-date-autoclose="true" data-date-format="yyyy-mm-dd" type="text" class="input-small" name="date" placeholder="YYYY-MM-DD" value="<%- moment().format("YYYY-MM-DD") %>"></td>' +
'            <td><input type="text" class="input-small" name="hours" placeholder="hours" value="0"></td>' +
'            <td>' +
'                <div>' +
'                    <i class="icon-user"></i><select name="person-id">' +
'                        <% pp.each(function (i) { %>' +
'                            <option value="<%- i.id %>" <% if (i.id==mid) { %>selected="selected"<% } %>><%- i.name() %></option>' +
'                        <% }) %>' +
'                    </select>' +
'                </div>' +
'            </td>' +
'            <td>' +
'                <input type="text" class="input-small" name="description">' +
'            </td>' +
'            <td>' +
'                <button id="add" title="Add"><i class="icon-plus"></i></button>' +
'            </td>' +
'        </tr>' +
'        <% tt.each(function (item) { %>' +
'            <%= view.renderitem(item) %>' +
'        <% }) %>' +
'    </tbody>' +
'</table>' +
'<%= view.block("#pager") %>' +
'<% } %>';
templates['#post'] = '<li class="thumbnail">' +
'    <h3>' +
'        <a href="#projects/<%- item.get("project-id") %>/posts/<%- item.id %>"><%- item.get("title") %></a>' +
'        <% if (item.get("private")) { %><i class="icon-lock"></i><% } %>' +
'        <a href="#projects/<%- item.get("project-id") %>/posts/<%- item.id %>/comments" title="<%- item.get("comments-count") %> comments" class="badge badge-inverse"><%- item.get("comments-count") %><i class="icon-comment icon-white"></i></a>' +
'    </h3>' +
'    <small>' +
'        by' +
'        <a href="#people/<%- item.get("author-id") %>"><i class="icon-user"></i><%- item.get("author-name") %></a>' +
'        <% if (item.get("category-id")) { %>' +
'        in' +
'        <a href="#projects/<%- item.get("project-id") %>/categories/<%- item.get("category-id") %>"><%- item.get("category-name") %></a>' +
'        <% } %>' +
'        on: <abbr title="<%- item.get("posted-on") %>"><%- moment(item.get("posted-on")).format("LLL") %></abbr>' +
'    </small>' +
'    <p><%= item.get("display-body") %></p>' +
'    <% if (item.get("attachments")) { %>' +
'    <ul>' +
'        <% _.each(item.get("attachments"),function (a) { %>' +
'        <li>' +
'            <a href="<%- a["download-url"] %>"><%- a.name %></a>' +
'            <small>' +
'                <%- a["byte-size"] %>B' +
'                <a href="#people/<%- a["person-id"] %>"><i class="icon-user"></i><%- a["author-name"] %></a>' +
'            </small>' +
'        </li>' +
'        <% }) %>' +
'    </ul>' +
'    <% } %>' +
'</li>';
templates['#project-posts'] = '<%= view.block("#header") %>' +
'<%= view.block("#project-nav") %>' +
'<% var pp=view.collection; var prid=view.model.id;' +
'if (pp.isEmpty()) { %>' +
'<div class="alert alert-info">' +
'    No posts...' +
'</div>' +
'<% } else { %>' +
'<ul class="unstyled">' +
'<% pp.each(function (item) { %>' +
'    <%= view.renderitem(item) %>' +
'<% }) %>' +
'</ul>' +
'<% } %>';
templates['#project-post'] = '<%= view.block("#header") %>' +
'<%= view.block("#project-nav") %>' +
'<% var pp=view.collection; var prid=view.model.id; var item=pp.get(view.cur_item);' +
'if (pp.isEmpty()) { %>' +
'<div class="alert alert-info">' +
'    No posts...' +
'</div>' +
'<% } else { %>' +
'<ul class="unstyled">' +
'    <%= view.renderitem(item) %>' +
'</ul>' +
'<% } %>';
templates['#project-post-comments'] = '<%= view.block("#header") %>' +
'<%= view.block("#project-nav") %>' +
'<% var item=view.options.collections.project_posts.get_or_create(view.model.id).get(view.cur_item);' +
'if (item) { %>' +
'<ul class="unstyled">' +
'    <%= view.renderitem(item) %>' +
'</ul>' +
'<% } %>' +
'<%= view.block("#comments") %>';
templates['#file'] = '<% var prid=view.model.id; var pp=view.options.collections.people;' +
'var cc=view.options.collections.project_categories.get_or_create(prid); %>' +
'<li class="media well well-small">' +
'    <h3>' +
'        <a href="#projects/<%- prid %>/files/<%- item.id %>"><%- item.get("name") %><% if (item.get("private")) { %><i class="icon-lock"></i><% } %></a>' +
'    </h3>' +
'    <small>' +
'        by' +
'        <a href="#people/<%- item.get("person-id") %>"><i class="icon-user"></i><%- pp.get(item.get("person-id"))?pp.get(item.get("person-id")).name():item.get("person-id") %></a>' +
'        <% if (_.isFinite(item.get("category-id"))) { %>' +
'        in' +
'        <a href="#projects/<%- prid %>/categories/<%- item.get("category-id") %>"><%- cc.get(item.get("category-id"))?cc.get(item.get("category-id")).get("name"):item.get("category-id") %></a>' +
'        <% } %>' +
'        on' +
'        <abbr title="<%- item.get("created-on") %>"><%- moment(item.get("created-on")).format("LLL") %></abbr>,' +
'        <%- item.get("byte-size") %>B<br />' +
'        <% if (_.isFinite(item.get("owner-id"))) { %>' +
'        for <%- item.get("owner-type") %> #<%- item.get("owner-id") %><br />' +
'        <% } %>' +
'        version #<%- item.get("version") %>' +
'        <% if (item.get("current")) { %>' +
'        - <a href="#projects/<%- prid %>/files/<%- item.get("collection") %>">parent version</a>' +
'        <% } else { var current=view.collection.where({"current":true,"collection":item.id}); %>' +
'        - <a href="#projects/<%- prid %>/files/<%- current && current[0] && current[0].id %>">current version</a>' +
'        <% } %>' +
'    </small>' +
'    <br/>' +
'    <a class="btn btn-success" href="<%- item.get("download-url") %>">Download</a>' +
'</li>';
templates['#project-files'] = '<%= view.block("#header") %>' +
'<%= view.block("#project-nav") %>' +
'<% var ff=view.collection;' +
'if (ff.isEmpty()) { %>' +
'<div class="alert alert-info">' +
'    No files...' +
'</div>' +
'<% } else { %>' +
'<%= view.block("#pager") %>' +
'<ul class="media-list">' +
'<% ff.each(function (item) { %>' +
'    <%= view.renderitem(item) %>' +
'<% }) %>' +
'</ul>' +
'<%= view.block("#pager") %>' +
'<% } %>';
templates['#project-file'] = '<%= view.block("#header") %>' +
'<%= view.block("#project-nav") %>' +
'<% var ff=view.collection; var item=ff.get(view.cur_item);' +
'if (ff.isEmpty()) { %>' +
'<div class="alert alert-info">' +
'    No files...' +
'</div>' +
'<% } else { %>' +
'<ul class="media-list">' +
'    <%= view.renderitem(item) %>' +
'</ul>' +
'<% } %>';
templates['#calendar'] = '<li class="thumbnail">' +
'    <h3>' +
'        <a <% if (item.get("type")=="Milestone" && item.get("completed")) { %>class="muted" <% } %>href="#projects/<%- item.get("project-id") %>/calendar/<%- item.id %>"><%- item.get("title") %></a>' +
'        <a href="#projects/<%- item.get("project-id") %>/calendar/<%- item.id %>/comments" title="<%- item.get("comments-count") %> comments" class="badge badge-inverse"><%- item.get("comments-count") %><i class="icon-comment icon-white"></i></a>' +
'    </h3>' +
'    <small>' +
'        <% if (item.get("type")=="Milestone" && item.get("responsible-party-id")) { %>' +
'        <a href="#<%- item.get("responsible-party-type")=="Company"?"companies":"people" %>/<%- item.get("responsible-party-id") %>"><% if (item.get("responsible-party-type")=="Person") { %><i class="icon-user"></i><% } %><%- item.get("responsible-party-name") %></a><br />' +
'        <% } %>' +
'        Type: <%- item.get("type") %><br />' +
'        <% if (item.get("start-at")) { %>' +
'        Start at <abbr title="<%- item.get("start-at") %>"><%- moment(item.get("start-at")).format("LL") %></abbr><br />' +
'        <% } %>' +
'        <% if (item.get("type")=="CalendarEvent" && item.get("due-at")) { %>' +
'        Due at <abbr title="<%- item.get("due-at") %>"><%- moment(item.get("due-at")).format("LLL") %></abbr><br />' +
'        <% } %>' +
'        <% if (item.get("type")=="Milestone" && item.get("deadline")) { %>' +
'        Deadline at <abbr title="<%- item.get("deadline") %>"><%- moment(item.get("deadline")).format("LL") %></abbr><br />' +
'        <% } %>' +
'        Created by' +
'        <a href="#people/<%- item.get("creator-id") %>"><i class="icon-user"></i><%- item.get("creator-name") %></a>' +
'        on' +
'        <abbr title="<%- item.get("created-on") %>"><%- moment(item.get("created-on")).format("LLL") %></abbr>' +
'        <% if (item.get("type")=="Milestone" && item.get("completed")) { %>' +
'        <br />' +
'        Completed by' +
'        <a href="#people/<%- item.get("completer-id") %>"><i class="icon-user"></i><%- item.get("completer-name") %></a>' +
'        at' +
'        <abbr title="<%- item.get("completed-at") %>"><%- moment(item.get("completed-at")).format("LLL") %></abbr>' +
'        <% } %>' +
'    </small>' +
'</li>';
templates['#project-calendar'] = '<%= view.block("#header") %>' +
'<%= view.block("#project-nav") %>' +
'<% var cc=view.collection; var prid=view.model.id;' +
'if (cc.isEmpty()) { %>' +
'<div class="alert alert-info">' +
'    No events...' +
'</div>' +
'<% } else { %>' +
'<ul class="unstyled">' +
'<% cc.each(function (item) { %>' +
'    <%= view.renderitem(item) %>' +
'<% }) %>' +
'</ul>' +
'<% } %>';
templates['#project-calendar-entry'] = '<%= view.block("#header") %>' +
'<%= view.block("#project-nav") %>' +
'<% var cc=view.collection; var prid=view.model.id; var item=cc.get(view.cur_item);' +
'if (cc.isEmpty()) { %>' +
'<div class="alert alert-info">' +
'    No events...' +
'</div>' +
'<% } else { %>' +
'<ul class="unstyled">' +
'    <%= view.renderitem(item) %>' +
'</ul>' +
'<% } %>';
templates['#project-calendar-entry-comments'] = '<%= view.block("#header") %>' +
'<%= view.block("#project-nav") %>' +
'<% var item=view.options.collections.project_calendar.get_or_create(view.model.id).get(view.cur_item);' +
'if (item) { %>' +
'<ul class="unstyled">' +
'    <%= view.renderitem(item) %>' +
'</ul>' +
'<% } %>' +
'<%= view.block("#comments") %>';
templates['#category'] = '<dt>' +
'    <h3>' +
'        <a href="#projects/<%- item.get("project-id") %>/categories/<%- item.id %>"><%- item.get("name") %></a>' +
'    </h3>' +
'</dt>' +
'<dd>' +
'    <%- item.get("type") %><br />Elements: <%- item.get("elements-count") %>' +
'</dd>';
templates['#project-categories'] = '<%= view.block("#header") %>' +
'<%= view.block("#project-nav") %>' +
'<% var cc=view.collection; var prid=view.model.id;' +
'if (cc.isEmpty()) { %>' +
'<div class="alert alert-info">' +
'    No categories...' +
'</div>' +
'<% } else { %>' +
'<%= view.block("#pager") %>' +
'<dl>' +
'<% cc.each(function (item) { %>' +
'    <%= view.renderitem(item) %>' +
'<% }) %>' +
'</dl>' +
'<%= view.block("#pager") %>' +
'<% } %>';
templates['#project-category'] = '<%= view.block("#header") %>' +
'<%= view.block("#project-nav") %>' +
'<% var cc=view.collection; var prid=view.model.id; var item=cc.get(view.cur_item);' +
'if (cc.isEmpty()) { %>' +
'<div class="alert alert-info">' +
'    No categories...' +
'</div>' +
'<% } else { %>' +
'<dl>' +
'    <%= view.renderitem(item) %>' +
'</dl>' +
'<% } %>';
templates['#todo'] = '<% var item=view.model;' +
'var prid=view.options.project_id;' +
'var list=view.options.collections.project_todo_lists.get_or_create(prid).get(item.get("todo-list-id")); %>' +
'<i class="todo icon-<%- item.get("completed")?"":"un" %>completed" data-todolist-id="<%- item.get("todo-list-id") %>" data-todoitem-id="<%- item.id %>"></i>' +
'<% if (list&&list.get("tracked")) { %>' +
'<a href="#projects/<%- prid %>/time_entries/todo_items/<%- item.id %>"><i class="icon-time"></i></a>' +
'<% } %>&nbsp;' +
'<a href="#projects/<%- prid %>/todo_lists/<%- item.get("todo-list-id") %>/<%- item.id %>"><%= item.get("content") %></a>' +
'<a href="#projects/<%- prid %>/todo_lists/<%- item.get("todo-list-id") %>/<%- item.id %>/comments" title="<%- item.get("comments-count") %> comments" class="badge badge-inverse"><%- item.get("comments-count") %><i class="icon-comment icon-white"></i></a>';
templates['#todolist'] = '<dt>' +
'    <a <% if (item.get("completed")) { %>class="muted"<% } %>' +
'       href="#projects/<%- item.get("project-id") %>/todo_lists/<%- item.id %>"><%- item.get("name") %><% if (item.get("private")) { %><i class="icon-lock"></i><% } %></a>' +
'    <small><%= item.get("description") %></small>' +
'</dt>';
templates['#todo-lists'] = '<%= view.block("#header") %>' +
'<% var td=view.collection;' +
'var pp=view.options.collections.people;' +
'var prs=view.options.collections.projects;' +
'var party=view.collection.responsible_party;' +
'var mid=party==null?view.options.mydata.id:view.collection.responsible_party; %>' +
'<div>' +
'    <div class="pull-right">Show items assigned to:' +
'        <select name="target">' +
'            <option value="" <% if (party=="") { %>selected="selected"<% } %>>Nobody</option>' +
'            <% pp.each(function (i) { %>' +
'                <option value="<%- i.id %>" <% if (i.id==mid) { %>selected="selected"<% } %>><%- i.name() %></option>' +
'            <% }) %>' +
'        </select>' +
'    </div>' +
'    <h3><%- view.description() %> to-do items across all projects</h3>' +
'</div>' +
'<% if (td.isEmpty()) { %>' +
'<div class="alert alert-info">' +
'    No todo lists...' +
'</div>' +
'<% } else { %>' +
'<dl>' +
'<% _.each(_.uniq(td.pluck("project-id")),function (prid) { %>' +
'    <dt><a href="#projects/<%- prid %>/todo_lists"><%- prs.get(prid)?prs.get(prid).get("name"):prid %></a></dt>' +
'    <dd>' +
'    <dl>' +
'        <% _.each(td.where({"project-id":prid}), function (list) { %>' +
'        <%= view.renderitem(list) %>' +
'        <dd>' +
'        <dl>' +
'        <% _.each(list.get("todo-items"), function (item) { %>' +
'        <dd>' +
'            <% if(false){if (item.completed) { %>' +
'            <i class="todo-lists icon-completed" data-todolist-id="<%- list.id %>" data-todoitem-id="<%- item.id %>"></i>' +
'            <% } else { %>' +
'            <i class="todo-lists icon-uncompleted" data-todolist-id="<%- list.id %>" data-todoitem-id="<%- item.id %>"></i>' +
'            <% } %>' +
'            <% if (list.get("tracked")) { %>' +
'            <a href="#projects/<%- prid %>/time_entries/todo_items/<%- item.id %>"><i class="icon-time"></i></a>' +
'            <% }} %>' +
'            <a href="#projects/<%- prid %>/todo_lists/<%- list.id %>/<%- item.id %>"><%= item.content %></a>' +
'            <% if(false){ %>' +
'            <a href="#projects/<%- prid %>/todo_lists/<%- list.id %>/<%- item.id %>/comments" title="<%- item["comments-count"] %> comments" class="badge badge-inverse"><%- item.get("comments-count") %><i class="icon-comment icon-white"></i></a>' +
'            <% } %>' +
'        </dd>' +
'        <% }) %>' +
'        </dl>' +
'        </dd>' +
'        <% }) %>' +
'    </dl>' +
'    </dd>' +
'<% }) %>' +
'</dl>' +
'<% } %>';
templates['#project-todo-lists'] = '<%= view.block("#header") %>' +
'<%= view.block("#project-nav") %>' +
'<% var td=view.collection; var todo_items=view.options.collections.todo_items; var prid=view.model.id;' +
'if (td.isEmpty()) { %>' +
'<div class="alert alert-info">' +
'    No todo lists...' +
'</div>' +
'<% } else { %>' +
'<div class="tabbable row-fluid">' +
'<ul class="nav nav-list span4 pull-right">' +
'<% var ftdst=_.first(td.pluck("completed"));' +
'   _.each(_.uniq(td.pluck("completed")), function (status) { %>' +
'    <li<% if (ftdst==status) { %> class="active"<% } %>>' +
'        <a href="#todolists_<%- status %>" data-toggle="tab"><% if (status==true) { %>Finished<% } else { %>Pending<% } %></a>' +
'    </li>' +
'<% }) %>' +
'</ul>' +
'<div class="tab-content span8">' +
'    <% _.each(td.groupBy(function(i){ return i.get("completed")}), function (tlgroup, status) { %>' +
'    <div class="tab-pane fade<% if (ftdst+""==status) { %> in active<% } %>" id="todolists_<%- status %>">' +
'        <dl>' +
'            <% _.each(tlgroup, function (list) { %>' +
'            <%= view.renderitem(list) %>' +
'            <dd>' +
'                <small>' +
'                    Completed: <%- list.get("completed-count") %>' +
'                    <br />' +
'                    Uncompleted: <%- list.get("uncompleted-count") %>' +
'                </small>' +
'            </dd>' +
'            <% }) %>' +
'        </dl>' +
'    </div>' +
'    <% }) %>' +
'</div>' +
'</div>' +
'<% } %>';
templates['#tododo'] = '<% var list=view.options.collections.project_todo_lists.get_or_create(prid).get(item.get("todo-list-id")); %>' +
'<i class="todo icon-<%- item.get("completed")?"":"un" %>completed" data-id="<%- item.id %>" data-todolist-id="<%- item.get("todo-list-id") %>" data-todoitem-id="<%- item.id %>"></i>' +
'<% if (list&&list.get("tracked")) { %>' +
'<a href="#projects/<%- prid %>/time_entries/todo_items/<%- item.id %>"><i class="icon-time"></i></a>' +
'<% } %>&nbsp;' +
'<a href="#projects/<%- prid %>/todo_lists/<%- item.get("todo-list-id") %>/<%- item.id %>"><%= item.get("content") %></a>' +
'<a href="#projects/<%- prid %>/todo_lists/<%- item.get("todo-list-id") %>/<%- item.id %>/comments" title="<%- item.get("comments-count") %> comments" class="badge badge-inverse"><%- item.get("comments-count") %><i class="icon-comment icon-white"></i></a>';
templates['#project-todo-list'] = '<%= view.block("#header") %>' +
'<%= view.block("#project-nav") %>' +
'<% var td=view.collection; var todo_items=view.options.collections.todo_items; var prid=view.model.id;' +
'var pp=view.options.collections.project_people.get_or_create(view.model.id);' +
'var ci=view.cur_item; var list=td.get(ci); var ftdst=list&&list.get("completed");' +
'if (td.isEmpty()) { %>' +
'<div class="alert alert-info">' +
'    No todo lists...' +
'</div>' +
'<% } else { %>' +
'<div class="row-fluid">' +
'<dl class="todoitemsholder span8 project-todo-list">' +
'    <%= view.renderitem(list) %>' +
'    <dd>' +
'        <button type="button" class="btn" data-toggle="collapse" data-target="#add_todo_wrapper">Add todo</button>' +
'        <div id="add_todo_wrapper" class="collapse"><form id="add_todo">' +
'<legend>Add todo</legend>' +
'<label for="todoContent">Todo content</label>' +
'<textarea id="todoContent" name="content" required></textarea>' +
'<label for="todoDueAt">Due date</label>' +
'<input id="todoDueAt" data-provide="datepicker" data-date-autoclose="true" data-date-format="yyyy-mm-dd" type="text" class="input-small" name="due-at" placeholder="YYYY-MM-DD" value=""><br />' +
'<label for="responsiblePerson">Responsible person</label>' +
'<select  id="responsiblePerson" name="responsible-party">' +
'<option value="">Nobody</option>' +
'<% pp.each(function (i) { %><option value="<%- i.id %>"><%- i.name() %></option><% }) %>' +
'</select>' +
'<div class="checkbox"><label><input type="checkbox" name="notify" value="true"> Notify responsible person</label></div>' +
'<button id="add" class="btn btn-default" title="Add"><i class="icon-plus"></i></button>' +
'</form></div>' +
'    </dd>' +
'<% view.options.collections.todo_items.get_or_create(ci).each(function (item) { %>' +
'    <dd>' +
templates['#tododo'] +
'    </dd>' +
'<% }) %>' +
'</dl>' +
'<div class="tabbable span4 pull-right">' +
'<ul class="nav nav-pills">' +
'<% _.each(_.uniq(td.pluck("completed")), function (status) { %>' +
'    <li<% if (ftdst==status) { %> class="active"<% } %>>' +
'        <a href="#todolists_<%- status %>" data-toggle="tab"><% if (status==true) { %>Finished<% } else { %>Pending<% } %></a>' +
'    </li>' +
'<% }) %>' +
'</ul>' +
'<div class="tab-content">' +
'<% _.each(td.groupBy(function(i){ return i.get("completed")}), function (tlgroup, status) { %>' +
'    <div class="tab-pane fade<% if (ftdst+""==status) { %> in active<% } %>" id="todolists_<%- status %>">' +
'    <ul class="nav nav-list">' +
'        <% _.each(tlgroup, function (l) { %>' +
'        <li<% if (ci==l.id) { %> class="active"<% } %>>' +
'            <a href="#projects/<%- prid %>/todo_lists/<%- l.id %>"><%- l.get("name") %><% if (l.get("private")) { %><i class="icon-lock"></i><% } %></a>' +
'        </li>' +
'        <% }) %>' +
'    </ul>' +
'    </div>' +
'<% }) %>' +
'</div>' +
'</div>' +
'</div>' +
'<% } %>';
templates['#project-todo-item'] = '<%= view.block("#header") %>' +
'<%= view.block("#project-nav") %>' +
'<% var td=view.collection; var todo_items=view.options.collections.todo_items;' +
'var prid=view.model.id; var list_id=view.cur_item; var item_id=view.todo_item;' +
'var items=todo_items.get_or_create(list_id); var list=td.get(list_id);' +
'var item=items.get(item_id);' +
'if (td.isEmpty()||items.isEmpty()) { %>' +
'<div class="alert alert-info">' +
'    No todo items...' +
'</div>' +
'<% } else { %>' +
'<dl class="todoitemsholder project-todo-item">' +
'    <%= view.renderitem(list) %>' +
'    <dd>' +
templates['#tododo'] +
'    </dd>' +
'</dl>' +
'<% } %>';
templates['#project-todo-item-comments'] = '<%= view.block("#header") %>' +
'<%= view.block("#project-nav") %>' +
'<% var td=view.todo_lists; var todo_items=view.options.collections.todo_items;' +
'var prid=view.model.id; var list_id=view.cur_item; var item_id=view.todo_item;' +
'var items=todo_items.get_or_create(list_id);' +
'var item=items.get(item_id);' +
'var ccc=view.collection;' +
'if (td.isEmpty()||items.isEmpty()) { %>' +
'<div class="alert alert-info">' +
'    No todo items...' +
'</div>' +
'<% } else { %>' +
'<dl class="todoitemsholder project-todo-item-comments">' +
'    <dd>' +
templates['#tododo'] +
'    </dd>' +
'</dl>' +
'<% } %>' +
'<%= view.block("#comments") %>';
templates['#nav'] = '<div class="navbar-inner">' +
'<button data-target=".nav-collapse" data-toggle="collapse" class="btn btn-navbar" type="button">' +
'    <span class="icon-bar"></span>' +
'    <span class="icon-bar"></span>' +
'    <span class="icon-bar"></span>' +
'</button>' +
'<a class="brand" href="#">BB</a>' +
'<% if (_.isFinite(view.model.id)) { %>' +
'<ul class="nav nav-collapse">' +
'    <li><a href="#projects">Projects</a></li>' +
'    <li><a href="#companies">Companies</a></li>' +
'    <li><a href="#todos">To-Dos</a></li>' +
'    <li><a href="#time_report">Time</a></li>' +
'    <li><a href="#people">People</a></li>' +
'</ul>' +
'<ul class="nav pull-right">' +
'    <li>' +
'        <a href="#me" title="<%- view.model.get("user-name") %>" class="dropdown-toggle" data-toggle="dropdown"><%- view.model.name() %> <span class="caret"></span></a>' +
'        <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu">' +
'            <li><a href="#me"><i class="icon-user"></i> My profile</a></li>' +
'            <li><a href="#todos"><i class="icon-tasks"></i> My todos</a></li>' +
'            <li><a href="#time_report"><i class="icon-time"></i> My time</a></li>' +
'            <li class="divider"></li>' +
'            <li><a href="/logout"><i class="icon-eject"></i> Logout</a></li>' +
'        </ul>' +
'    </li>' +
'</ul>' +
'<% } else { %>' +
'<ul class="nav pull-right">' +
'    <li>' +
'        <a href="/login" title="Login">Login</a>' +
'    </li>' +
'</ul>' +
'<% } %>' +
'</div>';
return templates;
}));
