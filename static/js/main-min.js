$(function(){var e=function(){Backbone.history.loadUrl()};Backbone.Collection.prototype.fetchonce=function(){var e=this.fetched;return e||(this.fetch(),this.fetched=!0),e},Backbone.Collection.prototype.get_or_create=function(t){return this[t]||(this[t]=this.clone(),this[t].parent_id=t,this[t].on("reset",e)),this[t]},Backbone.View.prototype.render=function(){return this.$el.html(this.template()),this},uniq_hash=[];var t=function(){if(window.workspace){var e=/^[#\/]|\s+$/g,t=_.map(_.filter(_.keys(workspace.routes),function(e){return e.indexOf("*")===-1}),function(e){return workspace._routeToRegExp(e)}),n=_.uniq(_.map($("a"),function(t){return t.hash.replace(e,"")}));while(h=n.pop())_.every(t,function(e){return!e.test(h)})&&uniq_hash.indexOf(h)==-1&&uniq_hash.push(h)}},n=Backbone.Model.extend({icon:function(){switch(this.get("status")){case"active":return"icon-play";case"archived":return"icon-stop";case"on_hold":return"icon-pause"}}}),r=Backbone.Collection.extend({url:"/api/projects.xml",model:n}),s=Backbone.Model.extend(),o=Backbone.Collection.extend({url:"/api/companies.xml",model:s}),u=Backbone.Model.extend({name:function(){return this.get("first-name")+" "+this.get("last-name")}}),a=Backbone.Collection.extend({parent_id:null,url:function(){return this.parent_id?"/api/projects/"+this.parent_id+"/people.xml":"/api/people.xml"},model:u}),f=Backbone.Model.extend(),l=Backbone.Collection.extend({parent_id:null,url:function(){return"/api/projects/"+this.parent_id+"/posts.xml"},model:f}),c=Backbone.Model.extend(),p=Backbone.Collection.extend({parent_id:null,url:function(){return"/api/projects/"+this.parent_id+"/attachments.xml"},model:c}),d=Backbone.Model.extend(),v=Backbone.Collection.extend({parent_id:null,url:function(){return"/api/projects/"+this.parent_id+"/calendar_entries.xml"},model:d}),m=Backbone.Model.extend(),g=Backbone.Collection.extend({parent_id:null,url:function(){return"/api/projects/"+this.parent_id+"/categories.xml"},model:m}),y=Backbone.Model.extend(),b=Backbone.Collection.extend({parent_id:null,parent:"projects",filter_report:null,url:function(){return this.parent_id?"/api/"+this.parent+"/"+this.parent_id+"/time_entries.xml":this.filter_report?"/api/time_entries/report.xml?"+this.filter_report:"/api/time_entries/report.xml"},model:y}),w=b.extend({parent:"todo_items"}),E=Backbone.Model.extend(),S=Backbone.Collection.extend({parent_id:null,url:function(){return"/api/todo_lists/"+this.parent_id+"/todo_items.xml"},model:E}),x=Backbone.Model.extend(),T=Backbone.Collection.extend({responsible_party:null,parent_id:null,filter_status:null,url:function(){return this.parent_id&&this.filter_status?"/api/projects/"+this.parent_id+"/todo_lists.xml?filter="+this.filter_status:this.parent_id?"/api/projects/"+this.parent_id+"/todo_lists.xml":this.responsible_party==null?"/api/todo_lists.xml":this.responsible_party==""?"/api/todo_lists.xml?responsible_party=":"/api/todo_lists.xml?responsible_party="+this.responsible_party},model:x}),N=Backbone.Model.extend(),C=Backbone.Collection.extend({parent_id:null,parent_type:null,url:function(){return"/api/"+this.parent_type+"/"+this.parent_id+"/comments.xml"},model:N}),k=C.extend({parent_type:"posts"}),L=C.extend({parent_type:"todo_items"}),A=C.extend({parent_type:"milestones"}),O=Backbone.View.extend({deps:function(){this.collection.fetchonce()&&this.options.collections.projects.fetchonce()&&this.options.collections.people.fetchonce()&&this.options.collections.companies.fetchonce()},events:{"click #getreport":"getreport"},getreport:function(e){e.preventDefault(),this.collection.filter_report=this.$("form#makereport").serialize(),this.collection.fetch()},template:_.template($("#time-report-template").html()),name:function(){return"Time report"},render:function(){return this.$el.html(this.template()),this.collection.filter_report&&this.$el.find("form#makereport").deserialize(this.collection.filter_report),this}}),M=Backbone.View.extend({deps:function(){this.collection.fetchonce()&&this.options.collections.companies.fetchonce()},template:_.template($("#people-template").html()),name:function(){return"People"}}),D=Backbone.View.extend({deps:function(){this.collection.fetchonce()},template:_.template($("#projects-template").html()),name:function(){return"Projects"}}),P=Backbone.View.extend({deps:function(){this.options.collections.projects.fetchonce()},template:_.template($("#project-template").html()),name:function(){return this.model.get("name")}}),H=Backbone.View.extend({deps:function(){this.collection.fetchonce()},template:_.template($("#companies-template").html()),name:function(){return"Companies"}}),B=Backbone.View.extend({deps:function(){this.options.collections.companies.fetchonce()&&this.options.collections.projects.fetchonce()&&this.options.collections.people.fetchonce()},template:_.template($("#company-template").html()),name:function(){return this.model.get("name")}}),j=Backbone.View.extend({deps:function(){this.collection.fetchonce()&&this.options.collections.projects.fetchonce()&&this.options.collections.companies.fetchonce()},template:_.template($("#project-people-template").html()),name:function(){return this.model.get("name")+" > People"}}),F=Backbone.View.extend({deps:function(){this.collection.fetchonce()&&this.options.collections.projects.fetchonce()},template:_.template($("#project-time-template").html()),name:function(){return this.model.get("name")+" > Time"}}),I=Backbone.View.extend({cur_item:null,deps:function(){this.collection.fetchonce()&&this.options.collections.projects.fetchonce()&&this.options.collections.project_posts.get_or_create(this.model.id).fetchonce()},template:_.template($("#project-post-comments-template").html()),name:function(){var e=this.cur_item&&this.options.collections.project_posts.get_or_create(this.model.id).get(this.cur_item),t=e&&e.get("title");return this.model.get("name")+" > Posts > "+t+" > Comments"}}),q=Backbone.View.extend({cur_item:null,deps:function(){this.collection.fetchonce()&&this.options.collections.projects.fetchonce()&&this.options.collections.project_calendar.get_or_create(this.model.id).fetchonce()},template:_.template($("#project-calendar-entry-comments-template").html()),name:function(){var e=this.cur_item&&this.options.collections.project_calendar.get_or_create(this.model.id).get(this.cur_item),t=e&&e.get("title");return this.model.get("name")+" > Calendar > "+t+" > Comments"}}),R=Backbone.View.extend({deps:function(){this.collection.fetchonce()&&this.options.collections.projects.fetchonce()},template:_.template($("#project-posts-template").html()),name:function(){return this.model.get("name")+" > Posts"}}),U=Backbone.View.extend({cur_item:null,deps:function(){this.collection.fetchonce()&&this.options.collections.projects.fetchonce()},template:_.template($("#project-post-template").html()),name:function(){var e=this.cur_item&&this.collection.get(this.cur_item),t=e&&e.get("title");return this.model.get("name")+" > Posts > "+t}}),z=Backbone.View.extend({deps:function(){this.collection.fetchonce()&&this.options.collections.projects.fetchonce()&&this.options.collections.people.fetchonce()&&this.options.collections.project_categories.get_or_create(this.model.id).fetchonce()},template:_.template($("#project-files-template").html()),name:function(){return this.model.get("name")+" > Files"}}),W=Backbone.View.extend({cur_item:null,deps:function(){this.collection.fetchonce()&&this.options.collections.projects.fetchonce()&&this.options.collections.people.fetchonce()&&this.options.collections.project_categories.get_or_create(this.model.id).fetchonce()},template:_.template($("#project-file-template").html()),name:function(){var e=this.cur_item&&this.collection.get(this.cur_item),t=e&&e.get("name");return this.model.get("name")+" > Files > "+t}}),X=Backbone.View.extend({deps:function(){this.collection.fetchonce()&&this.options.collections.projects.fetchonce()},template:_.template($("#project-calendar-template").html()),name:function(){return this.model.get("name")+" > Calendar"}}),V=Backbone.View.extend({cur_item:null,deps:function(){this.collection.fetchonce()&&this.options.collections.projects.fetchonce()},template:_.template($("#project-calendar-entry-template").html()),name:function(){var e=this.cur_item&&this.collection.get(this.cur_item),t=e&&e.get("title");return this.model.get("name")+" > Calendar > "+t}}),J=Backbone.View.extend({deps:function(){this.collection.fetchonce()&&this.options.collections.projects.fetchonce()},template:_.template($("#project-categories-template").html()),name:function(){return this.model.get("name")+" > Categories"}}),K=Backbone.View.extend({cur_item:null,deps:function(){this.collection.fetchonce()&&this.options.collections.projects.fetchonce()},template:_.template($("#project-category-template").html()),name:function(){var e=this.cur_item&&this.collection.get(this.cur_item),t=e&&e.get("name");return this.model.get("name")+" > Categories > "+t}}),Q=Backbone.View.extend({deps:function(){this.options.collections.people.fetchonce()&&this.options.collections.companies.fetchonce()},template:_.template($("#person-template").html()),name:function(){return this.model.name()}}),G=Backbone.View.extend({deps:function(){this.collection.fetchonce()&&this.options.collections.projects.fetchonce()&&this.options.collections.people.fetchonce()},events:{"change select[name='target']":"selectTarget"},selectTarget:function(e){this.collection.responsible_party=$(e.target).val(),this.collection.fetch()},template:_.template($("#todo-lists-template").html()),name:function(){if(this.collection.responsible_party){var e=this.options.collections.people&&this.options.collections.people.get(this.collection.responsible_party);return e?e.name()+"'s to-dos":this.collection.responsible_party+"'s to-dos"}return this.collection.responsible_party==null?"My to-dos":this.collection.responsible_party==""?"Unassigned to-dos":"To-dos"},description:function(){if(this.collection.responsible_party){var e=this.options.collections.people&&this.options.collections.people.get(this.collection.responsible_party);return e&&e.name()+"'s"||this.collection.responsible_party+"'s"}return this.collection.responsible_party==null?"My":this.collection.responsible_party==""?"Unassigned":"All"}}),Y=Backbone.View.extend({deps:function(){this.collection.fetchonce()&&this.options.collections.projects.fetchonce()&&this.sub()},events:{"click .icon-completed":"uncomplete","click .icon-uncompleted":"complete"},complete:function(e){var t=$(e.target),n=parseInt(t.data("todolist-id")),r=parseInt(t.data("todoitem-id")),i=this.options.collections.todo_items,s=i.get_or_create(n),o=s.get(r);o.set("completed",!0),this.render()},uncomplete:function(e){var t=$(e.target),n=parseInt(t.data("todolist-id")),r=parseInt(t.data("todoitem-id")),i=this.options.collections.todo_items,s=i.get_or_create(n),o=s.get(r);o.set("completed",!1),this.render()},template:_.template($("#project-todo-lists-template").html()),sub:function(){var e=this.options.collections.todo_items,t=_.map(this.collection.pluck("id"),function(t){return e.get_or_create(t)}),n=_.first(t.filter(function(e){return!e.fetched}));n&&(n.fetched=!0,n.fetch())},name:function(){return this.collection.parent_id?this.model.get("name")+" > To-dos":"To-dos"}}),Z=Backbone.View.extend({cur_item:null,deps:function(){this.collection.fetchonce()&&this.options.collections.projects.fetchonce()&&this.options.collections.todo_items.get_or_create(this.cur_item).fetchonce()},template:_.template($("#project-todo-lists-template").html()),name:function(){var e=this.cur_item&&this.collection.get(this.cur_item),t=e&&e.get("name");return this.model.get("name")+" > To-dos > "+t}}),et=Backbone.View.extend({todo_item:null,cur_item:null,deps:function(){this.collection.fetchonce()&&this.options.collections.projects.fetchonce()&&this.options.collections.todo_items.get_or_create(this.cur_item).fetchonce()},template:_.template($("#project-todo-item-template").html()),name:function(){var e=this.cur_item&&this.collection.get(this.cur_item),t=e&&e.get("name"),n=this.todo_item&&this.options.collections.todo_items.get_or_create(this.cur_item).get(this.todo_item),r=n&&n.get("content");return this.model.get("name")+" > To-dos > "+t+" > "+r}}),tt=Backbone.View.extend({todo_item:null,cur_item:null,deps:function(){this.collection.fetchonce()&&this.options.collections.projects.fetchonce()&&this.todo_lists.fetchonce()&&this.options.collections.todo_items.get_or_create(this.cur_item).fetchonce()},template:_.template($("#project-todo-item-comments-template").html()),name:function(){var e=this.cur_item&&this.todo_lists.get(this.cur_item),t=e&&e.get("name"),n=this.todo_item&&this.options.collections.todo_items.get_or_create(this.cur_item).get(this.todo_item),r=n&&n.get("content");return this.model.get("name")+" > To-dos > "+t+" > "+r+" > Comments"}}),nt=Backbone.Model.extend({defaults:{id:null},name:function(){return this.get("first-name")+" "+this.get("last-name")},url:"/api/me.xml"}),rt=Backbone.View.extend({template:_.template($("#nav-template").html()),initialize:function(){this.model.bind("change",this.render,this)}});models={},collections={};var it={el:".content",collections:collections};models.mydata=new nt,models.project=new n,models.company=new s,models.person=new u,collections.projects=new r,collections.companies=new o,collections.people=new a,collections.todos=new T,collections.times=new b,views={},views.current=null,views.projects=new D(_.extend({collection:collections.projects},it)),views.companies=new H(_.extend({collection:collections.companies},it)),views.people=new M(_.extend({collection:collections.people},it)),views.time_report=new O(_.extend({collection:collections.times},it)),views.todos=new G(_.extend({collection:collections.todos,mydata:models.mydata},it));for(i in collections)collections[i].on("reset",e);collections.project_people=new a,collections.project_categories=new g,collections.project_posts=new l,collections.project_files=new p,collections.project_todo_lists=new T,collections.project_calendar=new v,collections.project_time_entries=new b,collections.todo_items=new S,collections.todo_time_entries=new w,collections.project_todo_item_comments=new L,collections.project_post_comments=new k,collections.project_calendar_entry_comments=new A,views.company_view=new B(_.extend({model:models.company},it)),views.person_view=new Q(_.extend({model:models.person},it));var st=_.extend({model:models.project},it);views.project_view=new P(st),views.project_people=new j(st),views.project_categories=new J(st),views.project_category=new K(st),views.project_posts=new R(st),views.project_post=new U(st),views.project_todo_lists=new Y(st),views.project_todo_list=new Z(st),views.project_todo_item=new et(st),views.project_todo_item_comments=new tt(st),views.project_calendar=new X(st),views.project_calendar_entry=new V(st),views.project_files=new z(st),views.project_file=new W(st),views.project_time_entries=new F(st),views.todo_time_entries=new F(st),views.project_post_comments=new I(st),views.project_calendar_entry_comments=new q(st),collections.projects.on("reset",function(){this.each(function(e){collections.project_people.get_or_create(e.id),collections.project_categories.get_or_create(e.id),collections.project_posts.get_or_create(e.id),collections.project_todo_lists.get_or_create(e.id),collections.project_calendar.get_or_create(e.id),collections.project_categories.get_or_create(e.id),collections.project_files.get_or_create(e.id),collections.project_time_entries.get_or_create(e.id)})});var ot=Backbone.Router.extend({routes:{projects:"projects","projects:tab":"projects","projects/:id":"project","projects/:id/todo_lists":"project_todo_lists","projects/:id/todo_lists/:tlid":"project_todo_list","projects/:id/todo_lists/:tlid/:tiid":"project_todo_item","projects/:id/todo_lists/:tlid/:tiid/comments":"project_todo_item_comments","projects/:id/time_entries/todo_items/:tiid":"todo_time_entries","projects/:id/time_entries":"project_time_entries","projects/:id/people":"project_people","projects/:id/posts":"project_posts","projects/:id/posts/:pid":"project_post","projects/:id/posts/:pid/comments":"project_post_comments","projects/:id/files":"project_files","projects/:id/files/:fid":"project_file","projects/:id/calendar":"project_calendar","projects/:id/calendar/:cid":"project_calendar_entry","projects/:id/calendar/:cid/comments":"project_calendar_entry_comments","projects/:id/categories":"project_categories","projects/:id/categories/:cid":"project_category",companies:"companies","companies/:id":"company",people:"people","people:tab":"people","people/:id":"person",me:"me",todos:"todos",time_report:"time_report","*actions":"defaultRoute"}});workspace=new ot,workspace.on("route",function(e,n){if(["projects","companies","people","time_report","todos"].indexOf(e)!==-1)views.current=views[e].render();else if(["project_people","project_categories","project_time_entries","project_posts","project_files","project_calendar","project_todo_lists"].indexOf(e)!==-1){var r=parseInt(n[0]);collections.projects.get(r)?views[e].model=collections.projects.get(r):views[e].model.id=r,views[e].collection=collections[e].get_or_create(r),views.current=views[e].render()}else if(["project_post","project_file","project_calendar_entry","project_category","project_todo_list"].indexOf(e)!==-1){var r=parseInt(n[0]),i=parseInt(n[1]);collections.projects.get(r)?views[e].model=collections.projects.get(r):views[e].model.id=r,views[e].cur_item=i;switch(e){case"project_calendar_entry":views[e].collection=collections.project_calendar.get_or_create(r);break;case"project_category":views[e].collection=collections.project_categories.get_or_create(r);break;default:views[e].collection=collections[e+"s"].get_or_create(r)}views.current=views[e].render()}else if(["project_calendar_entry_comments","project_post_comments","todo_time_entries"].indexOf(e)!==-1){var r=parseInt(n[0]),s=parseInt(n[1]);collections.projects.get(r)?views[e].model=collections.projects.get(r):views[e].model.id=r,views[e].cur_item=s,views[e].collection=collections[e].get_or_create(s),views.current=views[e].render()}views.current&&$("title").html(views.current.name()+" - BB"),t(),views.current&&views.current.deps&&views.current.deps(),$(_.filter($(".navbar ul.nav li").removeClass("active"),function(e){return $(e).find("a:visible")[0]&&document.location.hash.indexOf($(e).find("a:visible")[0].hash)!==-1})).addClass("active")}).on("route:project_todo_item",function(e,t,n){collections.projects.get(e)?views.project_todo_item.model=collections.projects.get(e):views.project_todo_item.model.id=e,views.project_todo_item.cur_item=t,views.project_todo_item.todo_item=n,views.project_todo_item.collection=collections.project_todo_lists.get_or_create(e),views.current=views.project_todo_item.render()}).on("route:project_todo_item_comments",function(e,t,n){collections.projects.get(e)?views.project_todo_item_comments.model=collections.projects.get(e):views.project_todo_item_comments.model.id=e,views.project_todo_item_comments.cur_item=t,views.project_todo_item_comments.todo_item=n,views.project_todo_item_comments.todo_lists=collections.project_todo_lists.get_or_create(e),views.project_todo_item_comments.collection=collections.project_todo_item_comments.get_or_create(n),views.current=views.project_todo_item_comments.render()}).on("route:project",function(e){collections.projects.get(e)?views.project_view.model=collections.projects.get(e):views.project_view.model.id=e,views.current=views.project_view.render()}).on("route:company",function(e){collections.companies.get(e)?views.company_view.model=collections.companies.get(e):views.company_view.model.id=e,views.current=views.company_view.render()}).on("route:person",function(e){collections.people.get(e)?views.person_view.model=collections.people.get(e):views.person_view.model.id=e,views.current=views.person_view.render()}).on("route:me",function(){views.person_view.model=models.mydata,views.current=views.person_view.render()}).on("route:defaultRoute",function(e){this.navigate("projects",{trigger:!0})}),views.navbar=(new rt({model:models.mydata,el:".navbar"})).render(),models.mydata.once("sync",function(){Backbone.history.start()}),models.mydata.fetch()});