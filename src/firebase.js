import xstream from 'xstream';
import {unique, flatten} from 'lodash';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

const makeFirebaseDriver = baseConfig => {
  firebase.initializeApp(baseConfig);
  const db = firebase.database()
  const auth = firebase.auth()

  return firebase_state$ => {

    return {
      select: (key) => {
        switch (key) {
          case "database":
            return (path) => xstream.create({
              start: (listener) => {
                db.ref(path).on('value', snapshot => {
                  listener.next(snapshot.val())
                })
              },
              stop: () => {
                //TODO -  unsubscribe from firebase database
              }
            })

          case "auth":
            return xstream.create({
              start: (listener) => {
                auth.onAuthStateChanged(user => {
                  listener.next(user)
                })
              },
              stop: () => {
                // TODO Unsubscribe from firebase authentication
              },
            })

          default:

        }
      }
    }
  }
}

module.exports = {
  makeFirebaseDriver
}
