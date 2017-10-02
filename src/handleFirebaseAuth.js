import firebase from 'firebase';

const {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} = firebase.auth.Auth.prototype

const handleFirebaseAuth = (data) => {
  //signout from firebase when no data is given
  if(data === null){
    return [signOut]
  }

  switch (data.type.toLowerCase()) {
    case 'password':
      const { email, password } = data
      if(data.create) {
        return [
          createUserWithEmailAndPassword,
          email, password
        ]
      } else {
        return [
          signInWithEmailAndPassword,
          email, password
        ]
      }

    default:
      throw new Error(`Unknown type passed to $auth: '${data.type.toLowerCase()}'`)
  }


}

export default handleFirebaseAuth
