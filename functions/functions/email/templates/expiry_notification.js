module.exports = (name, minBalance, days, balance) => `
    <p>Hi <b>${name}</b> Your wallet is approaching the minimum daily balance of ${minBalance}. Please fund your wallet to avoid disruption in service, your nodes will run for another ${days} days. Your current wallet balance is ${balance}.</b></p>

    <p>Your</p>
    <p>Masterminer Team.</p>
`
