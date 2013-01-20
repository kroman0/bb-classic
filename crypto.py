from google.appengine.ext import webapp
from google.appengine.ext import db
from google.appengine.ext.webapp.util import run_wsgi_app
from google.appengine.api import memcache
from Crypto.Cipher import ARC4 as Crypter
import base64
import random
import sys
import keyring
 
def generate_raw_key():
    return base64.b64encode(repr(random.uniform(1, 1000)))

def generate_marker():
    # regenerate_raw_key implementation satisfies needs
    return generate_raw_key()

def generate_key():
    return (generate_raw_key(), generate_marker())

# ARC4/XOR require two instances to encode/decode
def encrypt(source, key):
    return Crypter.new(key).encrypt(source)

def decrypt(source, key):
    return Crypter.new(key).decrypt(source)

def decodeData(source, delimiter='\n'):
    for keymarkerPair in keyring.data():
        try:
            source_decoded = base64.b64decode(source)
            values = decrypt(source_decoded, keymarkerPair[0]).split(delimiter)
            if values[0] == keymarkerPair[1]: 
                return tuple(values[1:])
        except:
            break 

    return None

def encodeData(values, delimiter='\n'):
    data = ''
    values = list(values)
    current = keyring.current()
    values.insert(0, current[1])
    for i in xrange(len(values)):
        if i > 0:
             data += delimiter
        data += str(values[i])
    return base64.b64encode(encrypt(data, current[0]))


class AddkeyPage(webapp.RequestHandler):
    
    def __init__(self, *args, **kwargs):
        super(AddkeyPage, self).__init__(*args, **kwargs)

    def get(self):
        self.post()

    def post(self):
        keyring.rotate()

class GenkeysPage(webapp.RequestHandler):
    
    def __init__(self, *args, **kwargs):
        super(GenkeysPage, self).__init__(*args, **kwargs)

    def get(self):
        self.post()

    def post(self):
        keyring.refresh()
        #import pdb; pdb.Pdb(stdin=sys.__stdin__, stdout=sys.__stdout__).set_trace()


application = webapp.WSGIApplication([
    ('/genkeys', GenkeysPage),
    ('/addkey', AddkeyPage),
], debug=True)

def main():
    run_wsgi_app(application)
    
if __name__ == "__main__":
    main()   
