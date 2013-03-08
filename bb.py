import webapp2, os, json
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
    return urlunparse(('https', '%s.%s' % (subdomain, DOMAIN), relative_url, params, query, fragment))


class CacheInfo(db.Model):
    """ Model for the cached response.
    """
    url = db.StringProperty('Fetch URL', required=True)
    status_code = db.IntegerProperty('Response status', required=True, indexed=False)
    headers = db.ListProperty(db.Blob, 'Response headers', indexed=False)
    content = db.BlobProperty('Response content')
    date = db.DateTimeProperty('Date when response was added to the cache', 
                               auto_now=True)


class MainPage(webapp2.RequestHandler):
    def auth_check(self):
        isSessioned = False
        subdomain = None
        if 'ssid' in self.request.cookies:
            data = decodeData(self.request.cookies['ssid'])
            if data:
                isSessioned = True
        if not isSessioned:
            self.redirect('/login')

    def get(self):
        self.auth_check()
        self.response.out.write(template.render(_('index.html'), {'dev':os.environ['SERVER_SOFTWARE'].startswith('Development')}))

class LoginPage(webapp2.RequestHandler):
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
        result = urlfetch.fetch(url=absoluteUrl(subdomain, '/me.xml'), method=urlfetch.GET, headers=headers)
        if result.status_code == 200:
            dom = minidom.parseString(result.content)
            return str(dom.getElementsByTagName('id')[0].firstChild.nodeValue)
        else:
            raise Exception('Can\'t get subject_id')

    def get(self):
        self.response.out.write(template.render(_('login.html'), {}))

    def post(self):
        login = self.request.get('username')
        pwd = self.request.get('password')
        subdomain = self.request.get('subdomain')

        # test login
        if subdomain=='test' and login=='test' and pwd=='test':
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

class LogoutPage(webapp2.RequestHandler):
    def get(self):
        ssid = self.request.cookies.get('ssid', '') 
        self.response.headers['Set-Cookie'] = str('ssid=%s; expires=Fri, 31-Dec-2008 23:59:59 GMT;' % ssid)
        self.response.out.write(template.render(_('logout.html'), {}))

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
        value = True if node.firstChild.nodeValue=="true" else False  
    elif type_ == "float":
        value = float(node.firstChild.nodeValue)
    elif type_ == "array":
        result = []
        for i in filter(lambda x: x.nodeType==1, childs):
            items = filter(lambda x: x.nodeType==1, i.childNodes)
            result.append(dict([convert(i) for i in items]))
        value = result
    else:
        subnodes = filter(lambda x: x.nodeType==1, childs)
        if subnodes:
            value = dict([convert(i) for i in subnodes])
        else:
            value = "".join([i.nodeValue for i in childs])
    return (name, value)

class CrossDomain(webapp2.RequestHandler):  
    def auth_check(self):
        isSessioned = False
        subdomain = None
        if 'ssid' in self.request.cookies:
            data = decodeData(self.request.cookies['ssid'])
            if data:
                isSessioned = True
        if not isSessioned:
            self.redirect('/login')

    def get(self):
        self.auth_check()
        data = decodeData(self.request.cookies['ssid'])
        if data:
            username, password, subjectId, subdomain = data
            import logging
            logging.info("%s %s %s %s %s"%(username, password, subjectId, subdomain, self.request.path_qs))
            if subdomain=='test' and username=='test' and password=='test' and subjectId=='test':
                self.response.headers['Content-Type'] = 'application/json'
                medata = {
                    "phone-number-office": "",
                    "id": 1,
                    "title": "Title",
                    "phone-number-fax": "+000 (00) 000-000",
                    "updated-at": "2000-01-01T00:00:00Z",
                    "time-zone-name": "Europe/Kiev",
                    "avatar-url": "http://asset0.37img.com/global/missing/avatar.gif?r=3",
                    "email-address": "name@domain.com",
                    "deleted": False,
                    "company-id": 1,
                    "im-handle": "example",
                    "phone-number-home": "+000 (00) 000-0000",
                    "first-name": "First",
                    "user-name": "test",
                    "last-name": "Last",
                    "created-at": "2000-00-00T00:00:00Z",
                    "im-service": "Skype",
                    "token": "5421e047f5a5d5b2b765450faf4b274a916da482",
                    "phone-number-mobile": "+000 (00) 000-0000",
                    "phone-number-office-ext": ""
                }
                if self.request.path_qs=="/api/me.xml":
                    self.response.out.write(json.dumps(medata))
                else:
                    self.response.out.write(json.dumps([]))
                return
        DEV = os.environ['SERVER_SOFTWARE'].startswith('Development')
        q = None
        if DEV:
            q=db.GqlQuery("SELECT * FROM CacheInfo WHERE url='%s'"%self.request.path_qs)
        if DEV and q and q.count():
            content = q[0].content
        else:
            #headers = dict(self.request.headers)
            #if not "Authorization" in headers:
                #cookie = dict([i.split("=", 1) for i in headers.pop("Cookie", "").split("; ")])
                #if "authorization" in cookie:
                    #headers["Authorization"] = "Basic %s" % cookie["authorization"]
            #headers.pop("Host", "")
            data = decodeData(self.request.cookies['ssid'])
            if data:
                username, password, subjectId, subdomain = data
            else:
                self.response.set_status(403)
                return
            headers = {
                'Content-Type': 'application/xml',
                'Accept': 'application/xml'
            }
            creds = username + u':' + password
            creds = "Basic " + base64.encodestring(creds.encode('utf-8')).strip()
            headers["Authorization"] = creds
            #url = "https://quintagroup.basecamphq.com%s" % self.request.path_qs[4:]
            url = absoluteUrl(subdomain, self.request.path_qs[4:])
            #BOBO
            #if DEV and os.path.exists(os.path.abspath(self.request.path_qs[1:])):
                #ff = os.path.abspath(self.request.path_qs[1:])
                #f = open(ff)
                #content = f.read()
                #f.close()
                #dom = minidom.parseString(content)
                #parent = dom.firstChild
                #result = convert(parent)[1]
                #self.response.set_status(200)
                #self.response.headers['Content-Type'] = 'application/json'
                #self.response.out.write(json.dumps(result))
                #return
            #self.response.set_status(500)
            #return
            result = urlfetch.fetch(url=url, method=urlfetch.GET, headers=headers)
            if result.status_code != 200:
                self.response.set_status(result.status_code)
                self.response.out.write(result.content)
                return
            content = result.content
            #if DEV and not os.path.exists(os.path.abspath(self.request.path_qs[1:])):
                #ff = os.path.abspath(self.request.path_qs[1:])
                #if not os.path.exists(os.path.dirname(ff)):
                    #os.mkdir(os.path.dirname(ff))
                #f = open(ff, "w")
                #f.write(content)
                #f.close()
            if DEV:
                e = CacheInfo(url=self.request.path_qs,
                    status_code=result.status_code,
                    headers=[db.Blob('%s:%s' % (k, v)) for k, v in result.headers.items()],
                    content=result.content)
                e.put()
            self.response.set_status(result.status_code)
            self.response.headers.update(result.headers)
            #if "Authorization" in self.request.headers:
                #authorization = self.request.headers["Authorization"].split(" ")
                #if len(authorization)==2:
                    #expires = (datetime.datetime.now() + datetime.timedelta(weeks=2)).strftime('%a, %d-%b-%Y %H:%M:%S UTC')
                    #cookie = 'authorization=%s; expires=%s' % (authorization[1], expires)
                    #self.response.headers.add_header('Set-Cookie', str(cookie))
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
