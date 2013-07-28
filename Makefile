#!/usr/bin/make
#

BASE = app/static/js/general.js app/static/js/models.js app/static/js/collections.js app/static/js/templates.js app/static/js/views.js app/static/js/main.js
MIN = app/static/js/jquery.deserialize.js app/static/js/backbone.analytics.js
PYSCRIPTS = app/bb.py app/crypto.py app/keys.py tests/keywords.py
SCRIPTS = $(BASE)
MINIFY = $(BASE) $(MIN)

all: run

run:
	bin/dev_appserver app --skip_sdk_update_check --datastore_path=app.ds

prun:
	bin/dev_appserver app --skip_sdk_update_check --datastore_path=app.ds --auth_domain=Production

test:	clean
	bin/pybot -e screenshots tests

ptest:	clean
	PRO_TEST=True bin/pybot -e screenshots tests

xtest:	clean
	xvfb-run bin/pybot -e screenshots tests

pxtest:	clean
	PRO_TEST=True xvfb-run bin/pybot -e screenshots tests

test_chrome:	clean
	ROBOT_BROWSER=chrome bin/pybot -e screenshots tests

ptest_chrome:	clean
	ROBOT_BROWSER=chrome PRO_TEST=True bin/pybot -e screenshots tests

xtest_chrome:	clean
	ROBOT_BROWSER=chrome xvfb-run bin/pybot -e screenshots tests

pxtest_chrome:	clean
	ROBOT_BROWSER=chrome PRO_TEST=True xvfb-run bin/pybot -e screenshots tests

screenshots:
	bin/pybot -i screenshots tests/

xscreenshots:
	xvfb-run bin/pybot -i screenshots tests/

screenshots_chrome:
	bin/pybot -i screenshots tests/

xscreenshots_chrome:
	xvfb-run bin/pybot -i screenshots tests/

backup:
	cp app.ds app.ds.backup

restore:
	cp app.ds.backup app.ds

deploy: clean minify
	bin/appcfg update app --oauth2

minify:
	$(foreach JS,$(MIN),uglifyjs $(JS) --source-map `echo $(JS)|sed "s/\.js/.min.js.map/"` -o `echo $(JS)|sed "s/\.js/.min.js/"` -m;)
	$(foreach JS,$(BASE),uglifyjs $(JS) --source-map `echo $(JS)|sed "s/\.js/.min.js.map/"` -o `echo $(JS)|sed "s/\.js/.min.js/"` -cm --lint;)

jshint:
	jshint $(SCRIPTS)

jslint:
	jslint $(SCRIPTS)

gjslint:
	gjslint --disable 0011,0110,0130,0220 $(SCRIPTS)

fixjsstyle:
	fixjsstyle --disable 0011,0110,0130,0220 $(SCRIPTS)

simian:
	simian $(SCRIPTS) -reportDuplicateText

jssimian:
	simian $(SCRIPTS) -threshold=3 -reportDuplicateText

clean:
	find . -name \*~ -exec rm {} \;
	find . -name \*.pyc -exec rm {} \;
	rm -rf robot_* selenium-screenshot-* output.xml log.html report.html

sauceget:
	wget http://saucelabs.com/downloads/Sauce-Connect-latest.zip -O /tmp/Sauce-Connect-latest.zip
	unzip -oj /tmp/Sauce-Connect-latest.zip Sauce-Connect.jar -d /tmp

sauceconnect: clean
	java -jar /tmp/Sauce-Connect.jar $(SAUCE_USERNAME) $(SAUCE_ACCESS_KEY)

sauce:	clean
	ROBOT_DESIRED_CAPABILITIES=platform:Windows ROBOT_BROWSER=internetexplorer ROBOT_REMOTE_URL=http://$(SAUCE_USERNAME):$(SAUCE_ACCESS_KEY)@ondemand.saucelabs.com:80/wd/hub bin/pybot -e screenshots tests

bootstrap-update:
	wget -q https://raw.github.com/twbs/bootstrap/3.0.0-wip/dist/css/bootstrap.css -O app/static/css/bootstrap.css
	wget -q https://raw.github.com/twbs/bootstrap/3.0.0-wip/dist/css/bootstrap.min.css -O app/static/css/bootstrap.min.css
	wget -q https://raw.github.com/twbs/bootstrap/3.0.0-wip/dist/js/bootstrap.js -O app/static/js/bootstrap.js
	wget -q https://raw.github.com/twbs/bootstrap/3.0.0-wip/dist/js/bootstrap.min.js -O app/static/js/bootstrap.min.js
	wget -q https://raw.github.com/twbs/bootstrap-glyphicons/gh-pages/css/bootstrap-glyphicons.css -O app/static/css/bootstrap-glyphicons.css
	wget -q https://raw.github.com/twbs/bootstrap-glyphicons/gh-pages/fonts/glyphiconshalflings-regular.eot -O app/static/fonts/glyphiconshalflings-regular.eot
	wget -q https://raw.github.com/twbs/bootstrap-glyphicons/gh-pages/fonts/glyphiconshalflings-regular.otf -O app/static/fonts/glyphiconshalflings-regular.otf
	wget -q https://raw.github.com/twbs/bootstrap-glyphicons/gh-pages/fonts/glyphiconshalflings-regular.svg -O app/static/fonts/glyphiconshalflings-regular.svg
	wget -q https://raw.github.com/twbs/bootstrap-glyphicons/gh-pages/fonts/glyphiconshalflings-regular.ttf -O app/static/fonts/glyphiconshalflings-regular.ttf
	wget -q https://raw.github.com/twbs/bootstrap-glyphicons/gh-pages/fonts/glyphiconshalflings-regular.woff -O app/static/fonts/glyphiconshalflings-regular.woff

bootstrap-datepicker-update:
	wget -q https://raw.github.com/eternicode/bootstrap-datepicker/1.1.3/css/datepicker.css -O app/static/css/datepicker.css
	wget -q https://raw.github.com/eternicode/bootstrap-datepicker/1.1.3/js/bootstrap-datepicker.js -O app/static/js/bootstrap-datepicker.js

backbone-update:
	wget -q http://backbonejs.org/backbone.js -O app/static/js/backbone.js

underscore-update:
	wget -q http://underscorejs.org/underscore.js -O app/static/js/underscore.js

backbone-pageable-update:
	wget -q https://raw.github.com/wyuenho/backbone-pageable/master/lib/backbone-pageable.js -O app/static/js/backbone-pageable.js

backbone-fetch-cache-update:
	wget -q https://raw.github.com/mrappleton/backbone-fetch-cache/master/backbone.fetch-cache.js -O app/static/js/backbone.fetch-cache.js

moment-update:
	wget -q https://raw.github.com/timrwood/moment/master/moment.js -O app/static/js/moment.js

update-all: bootstrap-update bootstrap-datepicker-update backbone-update underscore-update backbone-pageable-update backbone-fetch-cache-update moment-update

pylint:
	pylint -f colorized --rcfile=.pylintrc -r n $(PYSCRIPTS)

pylint-html:
	pylint -f html --rcfile=.pylintrc $(PYSCRIPTS) >/tmp/pylint.html; firefox /tmp/pylint.html

pep8:
	pep8 app/ tests/

flake8:
	flake8 --max-complexity=10 app/ tests/

pyflakes:
	pyflakes $(PYSCRIPTS)

clonedigger:
	clonedigger app tests && firefox output.html

pysimian:
	simian $(PYSCRIPTS) -threshold=3 -reportDuplicateText

pytest: pep8 pyflakes flake8 pylint

jstest: jshint jslint gjslint

sphinx:
	bin/sphinxbuilder && firefox docs/html/index.html
