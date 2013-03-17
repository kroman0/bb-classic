#!/usr/bin/make
#

.PHONY: run

run:
	dev_appserver.py . --skip_sdk_update_check --high_replication --datastore_path=app.ds

test:	clean
	python setup.py test

backup:
	cp app.ds app.ds.backup

restore:
	cp app.ds.backup app.ds

deploy: clean minify
	appcfg.py update . --oauth2

minify:
	uglifyjs static/js/jquery.deserialize.js -o static/js/jquery.deserialize-min.js
	uglifyjs static/js/backbone.analytics.js -o static/js/backbone.analytics-min.js
	uglifyjs static/js/general.js static/js/models.js static/js/collections.js static/js/views.js static/js/main.js -o static/js/main-min.js

jshint:
	jshint static/js/general.js static/js/models.js static/js/collections.js static/js/views.js static/js/main.js

clean:
	find . -name \*~ -exec rm {} \;
	rm -rf *.pyc robot_*
