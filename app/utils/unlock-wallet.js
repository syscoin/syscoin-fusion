import {
  lockWallet,
  unlockWallet
} from 'fw-sys'
import swal from 'sweetalert2'
import { store } from 'fw/store/configureStore'
import { walletUnlocked } from 'fw-actions/wallet'
import i18n from './i18n'


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
  if (store.getState().wallet.isUnlocked && store.getState().wallet.isEncrypted) {
    return resolve(() => {})
  }

  const pwd = await swal({
    title: i18n.t('tools.unlock_input_password'),
    input: 'password',
    inputPlaceholder: i18n.t('misc.password'),
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
    await swal(i18n.t('misc.error'), i18n.t('tools.unlock_wrong_password'), 'error')
    return reject()
  }

  store.dispatch(walletUnlocked(true))

  resolve(lock)
})
