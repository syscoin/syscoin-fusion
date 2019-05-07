export default (transaction: object) => {
  if (transaction.category === 'send') {
    return {
      txid: transaction.txid,
      address: `Token transaction: ${transaction.systx.asset_guid} from ${transaction.systx.sender}`,
      time: transaction.time,
      amount: transaction.amount,
      ...transaction
    }
  }

  return transaction
}
