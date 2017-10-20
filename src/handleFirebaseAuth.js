const invariant = (predicate, message) => {
  if(!predicate){
    throw new Error(message)
  }
}

const createUserWithEmailAndPassword = (firebase, {email, password}) =>
  firebase.createUserWithEmailAndPassword(
    email, password
)

const signInWithEmailAndPassword = (firebase, {email, password}) =>
  firebase.signInWithEmailAndPassword(
    email, password
)

const signInAnonymously = (firebase) => firebase.signInAnonymously()

const signInWithCustomToken = (firebase, token) => firebase.signInWithCustomToken(token)

const signOut = (firebase) => firebase.signOut()


const handleFirebaseAuth = (firebase, data) => {

  invariant(
    data === null || typeof data === 'object',
    'handleFirebaseAuth expects an object or a null value argument'
  )

  //signout from firebase when no data is given
  if(data === null){
    return signOut(firebase)
  }


  invariant(typeof data.type === 'string', 'A string Type is required for $auth value')

  switch (data.type.toLowerCase()) {
    case 'password':
      invariant(typeof data.email === 'string', 'An email string is required for password auth')
      invariant(typeof data.password === 'string', 'A password string is required for password auth')
      if(data.create) {
        return createUserWithEmailAndPassword(firebase, data)
      } else {
        return signInWithEmailAndPassword(firebase, data)
      }

    case 'anonymous':
      return signInAnonymously(firebase)

    case 'token':
      invariant(typeof data.token === 'string', 'A token string is required for token auth')
      return .signInWithCustomToken(firebase, data.token)

    case


    default:
      throw new Error(`Unknown type passed to $auth: '${data.type.toLowerCase()}'`)
  }

}

export default handleFirebaseAuth
