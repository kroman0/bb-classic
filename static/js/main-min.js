$(function(){var e=function(){Backbone.history.loadUrl()};Backbone.Collection.prototype.fetchonce=function(){var e=this.fetched;return e||(this.fetch(),this.fetched=!0),e},Backbone.Collection.prototype.get_or_create=function(t){return this[t]||(this[t]=this.clone(),this[t].parent_id=t,this[t].on("reset",e)),this[t]},Backbone.View.prototype.render=function(){return this.$el.html(this.template()),this},uniq_hash=[];var t=function(){if(window.workspace){var e=/^[#\/]|\s+$/g,t=_.map(_.filter(_.keys(workspace.routes),function(e){return e.indexOf("*")===-1}),function(e){return workspace._routeToRegExp(e)}),n=_.uniq(_.map($("a"),function(t){return t.hash.replace(e,"")}));while(h=n.pop())_.every(t,function(e){return!e.test(h)})&&uniq_hash.indexOf(h)==-1&&uniq_hash.push(h)}},n=Backbone.Model.extend({icon:function(){switch(this.get("status")){case"active":return"icon-play";case"archived":return"icon-stop";case"on_hold":return"icon-pause"}}}),r=Backbone.Collection.extend({url:"/api/projects.xml",model:n}),s=Backbone.Model.extend(),o=Backbone.Collection.extend({url:"/api/companies.xml",model:s}),u=Backbone.Model.extend({name:function(){return this.get("first-name")+" "+this.get("last-name")}}),a=Backbone.Collection.extend({parent_id:null,url:function(){return this.parent_id?"/api/projects/"+this.parent_id+"/people.xml":"/api/people.xml"},model:u}),f=Backbone.Model.extend(),l=Backbone.Collection.extend({parent_id:null,url:function(){return"/api/projects/"+this.parent_id+"/posts.xml"},model:f}),c=Backbone.Model.extend(),p=Backbone.Collection.extend({parent_id:null,url:function(){return"/api/projects/"+this.parent_id+"/attachments.xml"},model:c}),d=Backbone.Model.extend(),v=Backbone.Collection.extend({parent_id:null,url:function(){return"/api/projects/"+this.parent_id+"/calendar_entries.xml"},model:d}),m=Backbone.Model.extend(),g=Backbone.Collection.extend({parent_id:null,url:function(){return"/api/projects/"+this.parent_id+"/categories.xml"},model:m}),y=Backbone.Model.extend(),b=Backbone.Collection.extend({parent_id:null,parent:null,filter_report:null,url:function(){return this.parent_id&&this.parent=="todo"?"/api/todo_items/"+this.parent_id+"/time_entries.xml":this.parent_id?"/api/projects/"+this.parent_id+"/time_entries.xml":this.filter_report?"/api/time_entries/report.xml?"+this.filter_report:"/api/time_entries/report.xml"},model:y}),w=Backbone.Model.extend(),E=Backbone.Collection.extend({parent_id:null,url:function(){return"/api/todo_lists/"+this.parent_id+"/todo_items.xml"},model:w}),S=Backbone.Model.extend(),x=Backbone.Collection.extend({responsible_party:null,parent_id:null,filter_status:null,url:function(){return this.parent_id&&this.filter_status?"/api/projects/"+this.parent_id+"/todo_lists.xml?filter="+this.filter_status:this.parent_id?"/api/projects/"+this.parent_id+"/todo_lists.xml":this.responsible_party==null?"/api/todo_lists.xml":this.responsible_party==""?"/api/todo_lists.xml?responsible_party=":"/api/todo_lists.xml?responsible_party="+this.responsible_party},model:S}),T=Backbone.Model.extend(),N=Backbone.Collection.extend({parent_id:null,parent_type:null,url:function(){return"/api/"+this.parent_type+"/"+this.parent_id+"/comments.xml"},model:T}),C=N.extend({parent_type:"posts"}),k=N.extend({parent_type:"todo_items"}),L=N.extend({parent_type:"milestones"}),A=Backbone.View.extend({deps:function(){this.collection.fetchonce()&&this.options.collections.projects.fetchonce()&&this.options.collections.people.fetchonce()&&this.options.collections.companies.fetchonce()},events:{"click #getreport":"getreport"},getreport:function(e){e.preventDefault(),this.collection.filter_report=this.$("form#makereport").serialize(),this.collection.fetch()},template:_.template($("#time-report-template").html()),name:function(){return"Time report"},render:function(){return this.$el.html(this.template()),this.collection.filter_report&&this.$el.find("form#makereport").deserialize(this.collection.filter_report),this}}),O=Backbone.View.extend({deps:function(){this.collection.fetchonce()&&this.options.collections.companies.fetchonce()},template:_.template($("#people-template").html()),name:function(){return"People"}}),M=Backbone.View.extend({deps:function(){this.collection.fetchonce()},template:_.template($("#projects-template").html()),name:function(){return"Projects"}}),D=Backbone.View.extend({deps:function(){this.options.collections.projects.fetchonce()},template:_.template($("#project-template").html()),name:function(){return this.model.get("name")}}),P=Backbone.View.extend({deps:function(){this.collection.fetchonce()},template:_.template($("#companies-template").html()),name:function(){return"Companies"}}),H=Backbone.View.extend({deps:function(){this.options.collections.companies.fetchonce()&&this.options.collections.projects.fetchonce()&&this.options.collections.people.fetchonce()},template:_.template($("#company-template").html()),name:function(){return this.model.get("name")}}),B=Backbone.View.extend({deps:function(){this.collection.fetchonce()&&this.options.collections.projects.fetchonce()&&this.options.collections.companies.fetchonce()},template:_.template($("#project-people-template").html()),name:function(){return this.model.get("name")+" > People"}}),j=Backbone.View.extend({deps:function(){this.collection.fetchonce()&&this.options.collections.projects.fetchonce()},template:_.template($("#project-time-template").html()),name:function(){return this.model.get("name")+" > Time"}}),F=Backbone.View.extend({cur_item:null,deps:function(){this.collection.fetchonce()&&this.options.collections.projects.fetchonce()&&this.options.collections.project_posts.get_or_create(this.model.id).fetchonce()},template:_.template($("#project-post-comments-template").html()),name:function(){var e=this.cur_item&&this.options.collections.project_posts.get_or_create(this.model.id).get(this.cur_item),t=e&&e.get("title");return this.model.get("name")+" > Posts > "+t+" > Comments"}}),I=Backbone.View.extend({cur_item:null,deps:function(){this.collection.fetchonce()&&this.options.collections.projects.fetchonce()&&this.options.collections.project_calendar.get_or_create(this.model.id).fetchonce()},template:_.template($("#project-calendar-entry-comments-template").html()),name:function(){var e=this.cur_item&&this.options.collections.project_calendar.get_or_create(this.model.id).get(this.cur_item),t=e&&e.get("title");return this.model.get("name")+" > Calendar > "+t+" > Comments"}}),q=Backbone.View.extend({deps:function(){this.collection.fetchonce()&&this.options.collections.projects.fetchonce()},template:_.template($("#project-posts-template").html()),name:function(){return this.model.get("name")+" > Posts"}}),R=Backbone.View.extend({cur_item:null,deps:function(){this.collection.fetchonce()&&this.options.collections.projects.fetchonce()},template:_.template($("#project-post-template").html()),name:function(){var e=this.cur_item&&this.collection.get(this.cur_item),t=e&&e.get("title");return this.model.get("name")+" > Posts > "+t}}),U=Backbone.View.extend({deps:function(){this.collection.fetchonce()&&this.options.collections.projects.fetchonce()&&this.options.collections.people.fetchonce()&&this.options.collections.project_categories.get_or_create(this.model.id).fetchonce()},template:_.template($("#project-files-template").html()),name:function(){return this.model.get("name")+" > Files"}}),z=Backbone.View.extend({cur_item:null,deps:function(){this.collection.fetchonce()&&this.options.collections.projects.fetchonce()&&this.options.collections.people.fetchonce()&&this.options.collections.project_categories.get_or_create(this.model.id).fetchonce()},template:_.template($("#project-file-template").html()),name:function(){var e=this.cur_item&&this.collection.get(this.cur_item),t=e&&e.get("name");return this.model.get("name")+" > Files > "+t}}),W=Backbone.View.extend({deps:function(){this.collection.fetchonce()&&this.options.collections.projects.fetchonce()},template:_.template($("#project-calendar-template").html()),name:function(){return this.model.get("name")+" > Calendar"}}),X=Backbone.View.extend({cur_item:null,deps:function(){this.collection.fetchonce()&&this.options.collections.projects.fetchonce()},template:_.template($("#project-calendar-entry-template").html()),name:function(){var e=this.cur_item&&this.collection.get(this.cur_item),t=e&&e.get("title");return this.model.get("name")+" > Calendar > "+t}}),V=Backbone.View.extend({deps:function(){this.collection.fetchonce()&&this.options.collections.projects.fetchonce()},template:_.template($("#project-categories-template").html()),name:function(){return this.model.get("name")+" > Categories"}}),J=Backbone.View.extend({cur_item:null,deps:function(){this.collection.fetchonce()&&this.options.collections.projects.fetchonce()},template:_.template($("#project-category-template").html()),name:function(){var e=this.cur_item&&this.collection.get(this.cur_item),t=e&&e.get("name");return this.model.get("name")+" > Categories > "+t}}),K=Backbone.View.extend({deps:function(){this.options.collections.people.fetchonce()&&this.options.collections.companies.fetchonce()},template:_.template($("#person-template").html()),name:function(){return this.model.name()}}),Q=Backbone.View.extend({deps:function(){this.collection.fetchonce()&&this.options.collections.projects.fetchonce()&&this.options.collections.people.fetchonce()},events:{"change select[name='target']":"selectTarget"},selectTarget:function(e){this.collection.responsible_party=$(e.target).val(),this.collection.fetch()},template:_.template($("#todo-lists-template").html()),name:function(){if(this.collection.responsible_party){var e=this.options.collections.people&&this.options.collections.people.get(this.collection.responsible_party);return e?e.name()+"'s to-dos":this.collection.responsible_party+"'s to-dos"}return this.collection.responsible_party==null?"My to-dos":this.collection.responsible_party==""?"Unassigned to-dos":"To-dos"},description:function(){if(this.collection.responsible_party){var e=this.options.collections.people&&this.options.collections.people.get(this.collection.responsible_party);return e&&e.name()+"'s"||this.collection.responsible_party+"'s"}return this.collection.responsible_party==null?"My":this.collection.responsible_party==""?"Unassigned":"All"}}),G=Backbone.View.extend({deps:function(){this.collection.fetchonce()&&this.options.collections.projects.fetchonce()&&this.sub()},template:_.template($("#project-todo-lists-template").html()),sub:function(){var e=this.options.collections.todo_items,t=_.map(this.collection.pluck("id"),function(t){return e.get_or_create(t)}),n=_.first(t.filter(function(e){return!e.fetched}));n&&(n.fetched=!0,n.fetch())},name:function(){return this.collection.parent_id?this.model.get("name")+" > To-dos":"To-dos"}}),Y=Backbone.View.extend({cur_item:null,deps:function(){this.collection.fetchonce()&&this.options.collections.projects.fetchonce()&&this.options.collections.todo_items.get_or_create(this.cur_item).fetchonce()},template:_.template($("#project-todo-lists-template").html()),name:function(){var e=this.cur_item&&this.collection.get(this.cur_item),t=e&&e.get("name");return this.model.get("name")+" > To-dos > "+t}}),Z=Backbone.Model.extend({defaults:{id:null},name:function(){return this.get("first-name")+" "+this.get("last-name")},url:"/api/me.xml"}),et=Backbone.View.extend({template:_.template($("#nav-template").html()),initialize:function(){this.model.bind("change",this.render,this)}});models={},collections={};var tt={el:".content",collections:collections};models.mydata=new Z,models.project=new n,models.company=new s,models.person=new u,collections.projects=new r,collections.companies=new o,collections.people=new a,collections.todos=new x,collections.times=new b,views={},views.current=null,views.projects=new M(_.extend({collection:collections.projects},tt)),views.companies=new P(_.extend({collection:collections.companies},tt)),views.people=new O(_.extend({collection:collections.people},tt)),views.time_report=new A(_.extend({collection:collections.times},tt)),views.todos=new Q(_.extend({collection:collections.todos,mydata:models.mydata},tt));for(i in collections)collections[i].on("reset",e);collections.project_people=new a,collections.project_categories=new g,collections.project_posts=new l,collections.project_files=new p,collections.project_todo_lists=new x,collections.project_calendar=new v,collections.project_time_entries=new b,collections.todo_items=new E,collections.project_todo_item_comments=new k,collections.project_post_comments=new C,collections.project_calendar_entry_comments=new L,views.company_view=new H(_.extend({model:models.company},tt)),views.person_view=new K(_.extend({model:models.person},tt));var nt=_.extend({model:models.project},tt);views.project_view=new D(nt),views.project_people=new B(nt),views.project_categories=new V(nt),views.project_category=new J(nt),views.project_posts=new q(nt),views.project_post=new R(nt),views.project_todo_lists=new G(nt),views.project_todo_list=new Y(nt),views.project_calendar=new W(nt),views.project_calendar_entry=new X(nt),views.project_files=new U(nt),views.project_file=new z(nt),views.project_time_entries=new j(nt),views.project_post_comments=new F(nt),views.project_calendar_entry_comments=new I(nt),collections.projects.on("reset",function(){this.each(function(e){collections.project_people.get_or_create(e.id),collections.project_categories.get_or_create(e.id),collections.project_posts.get_or_create(e.id),collections.project_todo_lists.get_or_create(e.id),collections.project_calendar.get_or_create(e.id),collections.project_categories.get_or_create(e.id),collections.project_files.get_or_create(e.id),collections.project_time_entries.get_or_create(e.id)})});var rt=Backbone.Router.extend({routes:{projects:"projects","projects:tab":"projects","projects/:id":"project","projects/:id/todo_lists":"project_todo_lists","projects/:id/todo_lists/:tlid":"project_todo_list","projects/:id/todo_lists/:tlid/:tiid":"project_todo_item","projects/:id/todo_lists/:tlid/:tiid/comments":"project_todo_item_comments","projects/:id/time_entries":"project_time_entries","projects/:id/people":"project_people","projects/:id/posts":"project_posts","projects/:id/posts/:pid":"project_post","projects/:id/posts/:pid/comments":"project_post_comments","projects/:id/files":"project_files","projects/:id/files/:fid":"project_file","projects/:id/calendar":"project_calendar","projects/:id/calendar/:cid":"project_calendar_entry","projects/:id/calendar/:cid/comments":"project_calendar_entry_comments","projects/:id/categories":"project_categories","projects/:id/categories/:cid":"project_category","todo_items/:id/time_entries":"todo_time_entries",companies:"companies","companies/:id":"company",people:"people","people:tab":"people","people/:id":"person",me:"me",todos:"todos",time_report:"time_report","*actions":"defaultRoute"}});workspace=new rt,workspace.on("route",function(e,n){if(["projects","companies","people","time_report","todos"].indexOf(e)!==-1)views.current=views[e].render();else if(["project_people","project_categories","project_time_entries","project_posts","project_files","project_calendar","project_todo_lists"].indexOf(e)!==-1){var r=parseInt(n[0]);collections.projects.get(r)?views[e].model=collections.projects.get(r):views[e].model.id=r,views[e].collection=collections[e].get_or_create(r),views.current=views[e].render()}else if(["project_post","project_file","project_calendar_entry","project_category","project_todo_list"].indexOf(e)!==-1){var r=parseInt(n[0]),i=parseInt(n[1]);collections.projects.get(r)?views[e].model=collections.projects.get(r):views[e].model.id=r,views[e].cur_item=i;switch(e){case"project_calendar_entry":views[e].collection=collections.project_calendar.get_or_create(r);break;case"project_category":views[e].collection=collections.project_categories.get_or_create(r);break;default:views[e].collection=collections[e+"s"].get_or_create(r)}views.current=views[e].render()}else if(["project_calendar_entry_comments","project_post_comments"].indexOf(e)!==-1){var r=parseInt(n[0]),s=parseInt(n[1]);collections.projects.get(r)?views[e].model=collections.projects.get(r):views[e].model.id=r,views[e].cur_item=s,views[e].collection=collections[e].get_or_create(s),views.current=views[e].render()}views.current&&$("title").html(views.current.name()+" - BB"),t(),views.current&&views.current.deps&&views.current.deps(),$(_.filter($(".navbar ul.nav li").removeClass("active"),function(e){return $(e).find("a:visible")[0]&&document.location.hash.indexOf($(e).find("a:visible")[0].hash)!==-1})).addClass("active")}).on("route:project",function(e){collections.projects.get(e)?views.project_view.model=collections.projects.get(e):views.project_view.model.id=e,views.current=views.project_view.render()}).on("route:company",function(e){collections.companies.get(e)?views.company_view.model=collections.companies.get(e):views.company_view.model.id=e,views.current=views.company_view.render()}).on("route:person",function(e){collections.people.get(e)?views.person_view.model=collections.people.get(e):views.person_view.model.id=e,views.current=views.person_view.render()}).on("route:me",function(){views.person_view.model=models.mydata,views.current=views.person_view.render()}).on("route:defaultRoute",function(e){this.navigate("projects",{trigger:!0})}),views.navbar=(new et({model:models.mydata,el:".navbar"})).render(),models.mydata.once("sync",function(){Backbone.history.start()}),models.mydata.fetch()});