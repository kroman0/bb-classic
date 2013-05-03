"""
keyring module
==============

"""
from google.appengine.ext import db
from google.appengine.api import memcache
import pickle
import base64
import random

KEYRING_SIZE = 14


def generate_raw_key():
    """ generate raw key
    """
    return base64.b64encode(repr(random.uniform(1, 1000)))


def generate_marker():
    """ regenerate_raw_key implementation satisfies needs
    """
    return generate_raw_key()


def generate_key():
    """ generate key
    """
    return (generate_raw_key(), generate_marker())


class Keyring(db.Model):
    """ Keyring db model
    """
    data = db.TextProperty()


def refresh():
    """ refresh keys
    """
    keys = [generate_key() for i in xrange(KEYRING_SIZE)]
    delete()
    setkeys(keys)
    return keys


def setkeys(keys):
    """ set keys
    """
    encoded = pickle.dumps(keys)
    db.put(Keyring(data=encoded))
    memcache.set('keyring', encoded)


def rotate():
    """ rotate keys
    """
    keys = [i for i in data()]
    keys.pop()
    for i in xrange(KEYRING_SIZE - len(keys)):
        keys.insert(0, generate_key())
    delete()
    setkeys(keys)


def delete():
    """ delete keyring
    """
    db.delete(_db_get())


def _db_get():
    """ get keyring from db
    """
    query = db.GqlQuery('SELECT * FROM Keyring')
    keyring = query.fetch(1)
    return keyring


def data():
    """ get keys
    """
    # read from the memcache
    keyring = memcache.get('keyring')
    if keyring is None:
        # read from the database
        keyring = _db_get()
        if len(keyring) > 0:
            memcache.set('keyring', keyring[0].data)
            keyring = pickle.loads(str(keyring[0].data))
        else:
            keyring = refresh()
    else:
        keyring = pickle.loads(str(keyring))
    for key in keyring:
        yield key


def current():
    """ get current key
    """
    return data().next()
