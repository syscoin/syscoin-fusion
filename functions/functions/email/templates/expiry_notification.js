module.exports = (list) => `
    <p>Dear user,<br> Your following nodes are expiring soon. <br> 
    <table>
        ${list.map(item => `<tr><td>Masternode Name: <b>${item.name}</b></td><td>Coin: <b
        >${item.type}</b></td></tr>`).join('')}
    </table>
    </p>
    <p>Your</p>
    <p>Masterminer Team.</p>
`