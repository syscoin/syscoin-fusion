// @flow
module.exports = (transactions: Array<Object>) => {
  const notifs = []

  transactions.forEach(transaction => {
    if (transaction.systx && transaction.systx.asset_guid) {
      return notifs.push(transaction.systx)
    }

    if (transaction.category !== 'send') {
      notifs.push(transaction)
    }
  })

  notifs.forEach(transaction => new Notification('New transaction', {
    body: `Amount: ${transaction.total || transaction.amount} ${transaction.symbol || 'SYS'}`
  }))
}
