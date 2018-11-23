import {
  lockWallet,
  unlockWallet
} from 'fw-sys'
import swal from 'sweetalert2'


// Uses sweetalert to ask the user for a password.
// If password is correct, will resolve the promise passing a function that needs to be called at the end of the operation.
// The wallet will lock itself if 60 has passed without manually locking it
// If password is incorrect, will show a modal notifying it and rejecting the promise.
export default () => new Promise(async (resolve, reject) => {
  const pwd = await swal({
    title: 'Input wallet password',
    input: 'password',
    inputPlaceholder: 'Password',
    allowOutsideClick: false,
    allowEscapeKey: false,
    showCancelButton: true
  })

  if (pwd.dismiss) {
    return reject()
  }

  try {
    await unlockWallet(pwd.value)
  } catch(err) {
    await swal('Error', 'Wrong password', 'error')
    return reject()
  }

  resolve(lockWallet)
})
