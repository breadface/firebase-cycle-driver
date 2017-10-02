import xstream from 'xstream';
import  pairwise from 'xstream/extra/pairwise';
import Firebase from 'firebase';
import get_changes from './getChanges'
import handleFirebaseAuth from './handleFirebaseAuth'

const create_observable = (ref, value) => {
  let unbind = () => null;
  return  xstream.create({
    start: (listener) => {
      unbind = ref.on(value, snapshot => {
        listener.next(snapshot)
      })
    },
    stop: () => {
      ref.off(value, unbind)
    }
  })
}

const create_auth_observable = (auth) =>  {
    let unbind = () => null;
    return xstream.create({
      start: (listener) => {
        unbind = auth.onAuthStateChanged(user => {
          listener.next(user)
        })
      },
      stop: () => {
        unbind()
      },
    })
}


const makeFirebaseDriver = baseConfig => {
  const baseRef = Firebase.initializeApp(baseConfig);
  const db = baseRef.database()
  const auth = baseRef.auth()
  const error$ = xstream.create()

  return firebase_state$ => {

    const get_changes$ = (state$) => {
      return state$
        .startWith({})
        // Pairwise so we can compare every tree with the previous
        .compose(pairwise)
        // Get a list of actions to transition to the next state
        .map(([prevState, nextState]) => get_changes(prevState, nextState))
    }


    firebase_state$
      .compose(get_changes$)
      .subscribe({
        next: changes => {
          changes.forEach(({path, value}) => {
            if(path.join().slice(0,5) === "$auth"){
              //handle firebase login
                let [method, ...args] = handleFirebaseAuth(value)
                let result = method.apply(auth, args)
                if(result && result.then){
                  result.catch(error => {
                    error$.shamefullySendNext(error)
                  })
                }
            } else {
              db.ref(`/` + path.join('/')).set(value)
            }
          });
        },
        error: err => {
          console.log('err:', err)
        }
      });

      return {
        select: (key) => {
          switch (key) {
            case "database":
              return (path) =>
                create_observable(db.ref(path), 'value')
                .map(x => x.val())

            case "auth":
              return create_auth_observable(auth)

            default:
              return xstream.throw(`you used an incorrect key ${key}`)

          }
        }
      }
  }
}

module.exports = {
  /**
    * @param {Object} firebase config object
    * @function makeFirebaseDriver
    */
  makeFirebaseDriver
}
