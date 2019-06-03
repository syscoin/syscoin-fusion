const pushToLogs = require('fw-utils/push-to-logs')

export default (transaction: object) => {
  let row = { ...transaction }
  const fallbackRow = {
    txid: Math.random().toString(16),
    address: 'Failed while parsing transaction. Check debug.log',
    time: Date.now(),
    amount: 0,
    category: 'error',
  }

  if (transaction.systx && transaction.systx.asset_guid) {
    row = {
      txid: transaction.txid,
      address: `Token transaction: ${transaction.systx.asset_guid} from ${transaction.systx.sender}`,
      time: transaction.time,
      amount: transaction.amount,
      ...transaction
    }
  }

  if (
    row.txid &&
    row.address &&
    row.time &&
    typeof row.amount === 'number' &&
    row.category
  ) {
    return row
  }

  pushToLogs(`Failed while parsing transaction: ${JSON.stringify(transaction)}`)

  return fallbackRow
}
