import xstream from 'xstream';
import {unique, flatten} from 'lodash'
// import firebase from 'firebase/app'

const makeFirebaseDriver = baseRef => {
  return firebase_state$ => {

    return {
      select: (key) => {
        switch (key) {
          case "database":

            return (path) => xstream.create({
              start: (listener) => {
                baseRef.database().ref.on('value', snapshot => {
                  listener.next(snapshot.val())
                })
              },
              stop: () => {

              }
            })

          case "auth":
            return xstream.create({
              start: (listener) => {
                baseRef.auth().onAuthStateChanged(user => {
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
