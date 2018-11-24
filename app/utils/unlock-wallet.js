import {
  lockWallet,
  unlockWallet
} from 'fw-sys'
import swal from 'sweetalert2'
import { store } from 'fw/store/configureStore'
import { walletUnlocked } from 'fw-actions/wallet'

const lock = async () => {
  try {
    await lockWallet()
  } catch(err) {
    return
  }

  store.dispatch(walletUnlocked(false))
}

// Uses sweetalert to ask the user for a password.
// If password is correct, will resolve the promise passing a function that needs to be called at the end of the operation.
// The wallet will lock itself if 60 has passed without manually locking it
// If password is incorrect, will show a modal notifying it and rejecting the promise.
export default (time?: number = 10) => new Promise(async (resolve, reject) => {
  if (store.getState().wallet.isUnlocked) {
    return resolve(() => {})
  }

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
    await unlockWallet(pwd.value, time)
  } catch(err) {
    await swal('Error', 'Wrong password', 'error')
    return reject()
  }

  store.dispatch(walletUnlocked(true))

  resolve(lock)
})
