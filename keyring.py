from google.appengine.ext import db
from google.appengine.api import memcache
import pickle
import crypto

KEYRING_SIZE = 14


class Keyring(db.Model):
    data = db.TextProperty()


def refresh():
    keys = [crypto.generate_key() for i in xrange(KEYRING_SIZE)]
    delete()
    set(keys)
    return keys


def set(keys):
    encoded = pickle.dumps(keys)
    db.put(Keyring(data=encoded))
    memcache.set('keyring', encoded)


def rotate():
    keys = [i for i in data()]
    keys.pop()
    for i in xrange(KEYRING_SIZE - len(keys)):
        keys.insert(0, crypto.generate_key())
    delete()
    set(keys)


def delete():
    db.delete(_db_get())


def _db_get():
    query = db.GqlQuery('SELECT * FROM Keyring')
    keyring = query.fetch(1)
    return keyring


def data():
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
    return data().next()
