# firebase-cycle-driver
A simple cycle-driver for firebase 4!

#Installation
```npm install firebase-cycle-driver```

#Example 
```
import {run} from '@cycle/core'
import {makeFirebaseDriver} from 'firebase-cycle-driver'
import Firebase from 'firebase'

const config = {
  apiKey: ...,
  authDomain: ...,
  databaseURL: "https://...",
  projectId: "firebase-app",
  storageBucket: "",
  messagingSenderId: "38347343433.."
};

let main = ({firebase}) => {
// ... Code that uses firebase driver
}

run(main, {
  firebase: makeFirebaseDriver(config),
  // ... Other drivers
})
```

#Usage

```
  //from main
  //select datatbase sources
  const data$ = sources.firebase.select("database")("/path/to/resource")
  
  //select auth sources
  const auth$ =  sources.firebase.select("auth")
  auth$.addListener({next: user => console.log('user:', user)})
  data$.addListener({next: x => console.log(x, 'value')})

  const sinks = {
    firebase: xs.of({
      $auth: { type: 'password', email: 'example@gmail.com', password: 'password'}
    }),
    DOM: .. //vtree$
  }
  return sinks
```

#API
#Sink 

```
  use $auth key for authentication sinks
    a. { type: 'password', email, password } uses signInWithEmailAndPassword
    b. { type: 'password', create: true, email, password } 
    creates a new user using createUserWithEmailAndPassword
    c. { type: 'token', token } uses signInWithCustomToken
    d. { type: 'anonymously' } uses signInAnonymously
    
     to sign out with signOut create an observable xs.of({$auth: null})
```

