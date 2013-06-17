"""
crypto module
=============

* `/genkeys` - `Generate keys handler <#crypto.GenkeysPage>`_
* `/addkey` - `Add key handler <#crypto.AddkeyPage>`_

"""
from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app
from Crypto.Cipher import ARC4 as Crypter
import base64

import keys

# ARC4/XOR require two instances to encode/decode


def encrypt(source, key):
    """ encrypt
    """
    return Crypter.new(key).encrypt(source)


def decrypt(source, key):
    """ decrypt
    """
    return Crypter.new(key).decrypt(source)


def decode_data(source, delimiter='\n'):
    """ decode data
    """
    for keymarkerpair in keys.data():
        try:
            source_decoded = base64.b64decode(source)
            values = decrypt(source_decoded, keymarkerpair[0]).split(delimiter)
            if values[0] == keymarkerpair[1]:
                return tuple(values[1:])
        except (TypeError, IndexError):
            break
    return None


def encode_data(values, delimiter='\n'):
    """ encode data
    """
    data = ''
    values = list(values)
    current = keys.current()
    values.insert(0, current[1])
    for i in xrange(len(values)):
        if i > 0:
            data += delimiter
        data += str(values[i])
    return base64.b64encode(encrypt(data, current[0]))


class BaseHandler(webapp.RequestHandler):
    """ Base crypto module handler

    * :http:get:`/.*` - `BaseHandler GET <#crypto.BaseHandler.get>`_
    * :http:post:`/.*` - `BaseHandler POST <#crypto.BaseHandler.post>`_
    """

    def get(self):
        """ GET request
        """
        self.action()

    def post(self):
        """ POST request
        """
        self.action()


class AddkeyPage(BaseHandler):
    """ Add key handler

    * :http:get:`/addkey` - `AddkeyPage GET <#crypto.AddkeyPage.action>`_
    * :http:post:`/addkey` - `AddkeyPage POST <#crypto.AddkeyPage.action>`_
    """

    action = keys.rotate  # GET/POST request action


class GenkeysPage(BaseHandler):
    """ Generate keys handler

    * :http:get:`/genkeys` - `GenkeysPage GET <#crypto.GenkeysPage.action>`_
    * :http:post:`/genkeys` - `GenkeysPage POST <#crypto.GenkeysPage.action>`_
    """

    action = keys.refresh  # GET/POST request action


APPLICATION = webapp.WSGIApplication([
    ('/genkeys', GenkeysPage),
    ('/addkey', AddkeyPage),
], debug=True)


def main():
    """ main
    """
    run_wsgi_app(APPLICATION)

if __name__ == "__main__":
    main()
