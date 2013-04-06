import webapp2
import os
import json
from google.appengine.ext.webapp import template
from google.appengine.api import urlfetch
from google.appengine.ext import db
from xml.dom import minidom
import datetime
import base64
from urlparse import urlunparse

from crypto import encodeData, decodeData

_ = lambda x: os.path.join(os.path.dirname(__file__), 'templates', x)

DOMAIN = 'basecamphq.com'


def absoluteUrl(subdomain, relative_url='', params='', query='', fragment=''):
    if type(query) == dict:
        query = urlencode(query)
    return urlunparse(('https', '%s.%s' % (subdomain, DOMAIN),
                      relative_url, params, query, fragment))


class CacheInfo(db.Model):
    """ Model for the cached response.
    """
    url = db.StringProperty('Fetch URL', required=True)
    status_code = db.IntegerProperty(
        'Response status', required=True, indexed=False)
    headers = db.ListProperty(db.Blob, 'Response headers', indexed=False)
    content = db.BlobProperty('Response content')
    date = db.DateTimeProperty('Date when response was added to the cache',
                               auto_now=True)


class BaseRequestHandler(webapp2.RequestHandler):
    def dev(self):
        dev = self.request.get('dev', False)
        return dev or os.environ['SERVER_SOFTWARE'].startswith('Development')

    def auth_check(self):
        isSessioned = False
        if 'ssid' in self.request.cookies:
            data = decodeData(self.request.cookies['ssid'])
            if data:
                isSessioned = True
                self.username, self.password, self.subjectId, self.subdomain = data
        return isSessioned


class MainPage(BaseRequestHandler):
    def get(self):
        if self.auth_check():
            self.response.out.write(template.render(
                _('index.html'),
                {'dev': self.dev()}))
        else:
            return self.redirect('/login')


class LoginPage(BaseRequestHandler):
    def getSubjectId(self, username, password, subdomain):
        """
        Get 'subject_id' for report query - it is id of logged in user.
        """
        headers = {
            'Content-Type': 'application/xml',
            'Accept': 'application/xml'
        }
        creds = username + u':' + password
        creds = "Basic " + base64.encodestring(creds.encode('utf-8')).strip()
        headers["Authorization"] = creds
        result = urlfetch.fetch(url=absoluteUrl(
            subdomain, '/me.xml'), method=urlfetch.GET, headers=headers)
        if result.status_code == 200:
            dom = minidom.parseString(result.content)
            return str(dom.getElementsByTagName('id')[0].firstChild.nodeValue)
        else:
            raise Exception('Can\'t get subject_id')

    def get(self):
        self.response.out.write(template.render(
            _('login.html'),
            {'dev': self.dev()}))

    def post(self):
        login = self.request.get('username')
        pwd = self.request.get('password')
        subdomain = self.request.get('subdomain')

        # test login
        if subdomain == 'test' and login == 'test' and pwd == 'test':
            subject_id = 'test'
            data = [login, pwd, subject_id, subdomain]
            expires = (datetime.datetime.now() + datetime.timedelta(weeks=4))\
                .strftime('%a, %d-%b-%Y %H:%M:%S UTC')
            ssid_cookie = 'ssid=%s; expires=%s' % \
                (encodeData(tuple(data)), expires)
            self.response.headers.add_header('Set-Cookie', str(ssid_cookie))
            return

        # check whether all needed data is given
        if not (subdomain and login and pwd):
            self.error(401)
            return

        # make a request to the Basecamp API
        try:
            subject_id = self.getSubjectId(login, pwd, subdomain)
        except:
            self.error(401)
            return

        # save login information in a cookie
        data = [login, pwd, subject_id, subdomain]
        expires = (datetime.datetime.now() + datetime.timedelta(weeks=4))\
            .strftime('%a, %d-%b-%Y %H:%M:%S UTC')
        ssid_cookie = 'ssid=%s; expires=%s' % \
            (encodeData(tuple(data)), expires)
        self.response.headers.add_header('Set-Cookie', str(ssid_cookie))


class LogoutPage(BaseRequestHandler):
    def get(self):
        ssid = self.request.cookies.get('ssid', '')
        self.response.headers['Set-Cookie'] = str(
            'ssid=%s; expires=Fri, 31-Dec-2008 23:59:59 GMT;' % ssid)
        self.response.out.write(template.render(
            _('logout.html'),
            {'dev': self.dev()}))


def convert(node):
    name = node.nodeName
    if node.getAttribute("nil") == "true":
        return (name, None)
    childs = node.childNodes
    if not childs:
        return (name, "")
    type_ = node.getAttribute("type")
    if type_ == "integer":
        value = int(node.firstChild.nodeValue)
    elif type_ == "boolean":
        value = True if node.firstChild.nodeValue == "true" else False
    elif type_ == "float":
        value = float(node.firstChild.nodeValue)
    elif type_ == "array":
        result = []
        for i in filter(lambda x: x.nodeType == 1, childs):
            items = filter(lambda x: x.nodeType == 1, i.childNodes)
            result.append(dict([convert(i) for i in items]))
        value = result
    else:
        subnodes = filter(lambda x: x.nodeType == 1, childs)
        if subnodes:
            value = dict([convert(i) for i in subnodes])
        else:
            value = "".join([i.nodeValue for i in childs])
    return (name, value)


def dict2xml(data):
    from xml.dom.minidom import Document
    d = Document()
    p = d.createElement("photo")
    d.appendChild(p)
    a = d.createAttribute("asd")
    p.attributes.setNamedItem(a)
    a.value = "dsa"
    t = d.createTextNode("test")
    p.appendChild(t)
    d.toprettyxml()
    '<?xml version="1.0" ?>\n<photo asd="dsa">test</photo>\n'


class CrossDomain(BaseRequestHandler):
    username = None
    password = None
    subjectId = None
    subdomain = None

    def put(self):
        if not self.auth_check():
            return self.redirect('/login')
        # self.response.headers['Content-Type'] = 'application/json'
        # self.response.out.write(self.request.body)

    def get(self):
        if not self.auth_check():
            return self.redirect('/login')
        if self.subdomain == 'test' and self.username == 'test' and \
                self.password == 'test' and self.subjectId == 'test':
            self.response.headers['Content-Type'] = 'application/json'
            medata = {
                "avatar-url": "/static/img/avatar.gif",
                "company-id": 1,
                "created-at": "2000-00-00T00:00:00Z",
                "deleted": False,
                "email-address": "name@domain.com",
                "first-name": "First",
                "id": 1,
                "im-handle": "example",
                "im-service": "Skype",
                "last-name": "Last",
                "phone-number-fax": "+000 (00) 000-0002",
                "phone-number-home": "+000 (00) 000-0001",
                "phone-number-mobile": "+000 (00) 000-0000",
                "phone-number-office": "+000 (00) 000-0003",
                "phone-number-office-ext": "",
                "time-zone-name": "Europe/Kiev",
                "title": "Title",
                "updated-at": "2000-01-01T00:00:00Z",
                "user-name": "test",
            }
            import random
            import string
            attachment = lambda x: {
                "author-name": "Author name #%s"%i,
                "byte-size": 100 * x,
                "download-url": "url%s"%x,
                "name": "Name #%s"%x,
                "person-id": x%5 + 1,
            }
            todo = lambda x: {
                "id": x,
                "content": "Todo content #%s"%x,
            }
            collection = [{
                "address-one": "Address one of #%s"%i,
                "address-two": "Address two of #%s"%i,
                "announcement": "announcement of #%s"%i,
                "attachments": [attachment(x) for x in range(1, i%5 + 1)],
                "attachments-count": i%5,
                "author-id": i%5 + 1,
                "author-name": "Author name #%s"%i,
                "avatar-url": "/static/img/avatar.gif",
                "body": "Body of #%s"%i,
                "byte-size": 100 * i,
                "category-id": i%5 + 1,
                "city": "City #%s"%i,
                "commented-at": "%s-%s-%s"%(i%12 + 2001, i%12 + 1, i%30 + 1),
                "comments-count": i,
                "company": {"id": i%5 + 1, "name": "Company name #%s"%(i%5 + 1)},
                "company-id": i%5 + 1,
                "completed": [True, False][i%2],
                "completed-at": "%s-%s-%s"%(i%12 + 2001, i%12 + 1, i%30 + 1),
                "completed-count": i%5 + 1,
                "completer-id": i%5 + 1,
                "completer-name": "Completer name #%s"%i,
                "content": "Todo content #%s"%x,
                "country": "Country #%s"%i,
                "created-at": "%s-%s-%s"%(i%12 + 2001, i%12 + 1, i%30 + 1),
                "created-on": "%s-%s-%s"%(i%12 + 2001, i%12 + 1, i%30 + 1),
                "creator-id": i%5 + 1,
                "creator-name": "Creator name #%s"%i,
                "date": "%s-%s-%s"%(i%12 + 2001, i%12 + 1, i%30 + 1),
                "deadline": "%s-%s-%s"%(i%12 + 2001, i%12 + 1, i%30 + 1),
                "description": "description of #%s"%i,
                "display-body": "Display body of #%s"%i,
                "download-url": "url%s"%i,
                "due-at": "%s-%s-%s"%(i%12 + 2001, i%12 + 1, i%30 + 1),
                "elements-count": i,
                "email-address": "name@domain.com",
                "first-name": "First#%s"%i,
                "hours": i%5 * 0.5 + 0.1,
                "id": i,
                "im-handle": "example#%s"%i,
                "im-service": "Skype",
                "last-name": "Last",
                "locale": ["en", "ru", "ua"][i%3],
                "name": "Name of #%s"%i,
                "person-id": i%5 + 1,
                "person-name": "Pesson #%s"%i,
                "phone-number-fax": "Fax of #%s"%i,
                "phone-number-home": "Home phone of #%s"%i,
                "phone-number-mobile": "Mobile phone of #%s"%i,
                "phone-number-office": "Office phone of #%s"%i,
                "posted-on": "%s-%s-%s"%(i%12 + 2001, i%12 + 1, i%30 + 1),
                "private": [True, False][i%2],
                "project-id": i%5 + 1,
                "responsible-party-id": i%5 + 1,
                "responsible-party-name": "Responsible party name #%s"%i,
                "responsible-party-type": ['Company', 'Person'][i%2],
                "start-at": "%s-%s-%s"%(i%12 + 2001, i%12 + 1, i%30 + 1),
                "state": "State phone of #%s"%i,
                "status": ["active", "on_hold", "archived"][i%3],
                "time-zone-id": "EET",
                "time-zone-name": "Europe/Kiev",
                "title": "Title #%s"%i,
                "todo-item-id": i%5 + 1,
                "todo-items": [todo(x) for x in range(1, i%5 + 1)],
                "todo-list-id": i%5 + 1,
                "tracked": [True, False][i%2],
                "type": "Type of #%s"%i,
                "uncompleted-count": 5 - i%5,
                "use-textile": [True, False][i%2],
                "user-name": "test",
                "web-address": "http://example%s.com"%i,
                "zip": "".join(random.sample(string.digits, 5)),
            }
                for i in range(1, 30)]
            if self.request.path_qs == "/api/me.xml":
                self.response.out.write(json.dumps(medata))
            else:
                self.response.out.write(json.dumps(collection))
            return
        DEV = self.dev()
        q = None
        if DEV:
            q = db.GqlQuery(
                "SELECT * FROM CacheInfo"
                " WHERE url='%s'" % self.request.path_qs)
        if DEV and q and q.count():
            content = q[0].content
        else:
            # headers = dict(self.request.headers)
            # if not "Authorization" in headers:
                # cookie = dict([i.split("=", 1) for i in headers.pop("Cookie", "").split("; ")])
                # if "authorization" in cookie:
                    # headers["Authorization"] = "Basic %s" % cookie["authorization"]
            # headers.pop("Host", "")
            headers = {
                'Content-Type': 'application/xml',
                'Accept': 'application/xml'
            }
            creds = self.username + u':' + self.password
            creds = "Basic " + base64.encodestring(
                creds.encode('utf-8')).strip()
            headers["Authorization"] = creds
            # url = "https://quintagroup.basecamphq.com%s" %
            # self.request.path_qs[4:]
            url = absoluteUrl(self.subdomain, self.request.path_qs[4:])
            # BOBO
            # if DEV and os.path.exists(os.path.abspath(self.request.path_qs[1:])):
                # ff = os.path.abspath(self.request.path_qs[1:])
                # f = open(ff)
                # content = f.read()
                # f.close()
                # dom = minidom.parseString(content)
                # parent = dom.firstChild
                # result = convert(parent)[1]
                # self.response.set_status(200)
                # self.response.headers['Content-Type'] = 'application/json'
                # self.response.out.write(json.dumps(result))
                # return
            # self.response.set_status(500)
            # return
            result = urlfetch.fetch(
                url=url, method=urlfetch.GET, headers=headers)
            if result.status_code != 200:
                self.response.set_status(result.status_code)
                self.response.out.write(result.content)
                return
            content = result.content
            # if DEV and not os.path.exists(os.path.abspath(self.request.path_qs[1:])):
                # ff = os.path.abspath(self.request.path_qs[1:])
                # if not os.path.exists(os.path.dirname(ff)):
                    # os.mkdir(os.path.dirname(ff))
                # f = open(ff, "w")
                # f.write(content)
                # f.close()
            if DEV:
                e = CacheInfo(url=self.request.path_qs,
                              status_code=result.status_code,
                              headers=[db.Blob(
                                       '%s:%s' % (k, v)) for k, v in result.headers.items()],
                              content=result.content)
                e.put()
            self.response.set_status(result.status_code)
            self.response.headers.update(result.headers)
            # if "Authorization" in self.request.headers:
                # authorization = self.request.headers["Authorization"].split(" ")
                # if len(authorization)==2:
                    # expires = (datetime.datetime.now() + datetime.timedelta(weeks=2)).strftime('%a, %d-%b-%Y %H:%M:%S UTC')
                    # cookie = 'authorization=%s; expires=%s' % (authorization[1], expires)
                    # self.response.headers.add_header('Set-Cookie',
                    # str(cookie))
        dom = minidom.parseString(content)
        parent = dom.firstChild
        result = convert(parent)[1]
        self.response.headers['Content-Type'] = 'application/json'
        self.response.out.write(json.dumps(result))

app = webapp2.WSGIApplication([
    ('/', MainPage),
    ('/login', LoginPage),
    ('/logout', LogoutPage),
    ('/api/.*', CrossDomain),
], debug=True)
