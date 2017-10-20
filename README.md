# firebase-cycle-driver
A simple cycle-driver for firebase!

#Installation
`npm install firebase-cycle-driver`

#Example 
```
import Cycle from '@cycle/core'
import {makeFirebaseDriver} from 'cycle-firebase'
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

Cycle.run(main, {
  firebase: makeFirebaseDriver(config),
  // ... Other drivers
})
```
