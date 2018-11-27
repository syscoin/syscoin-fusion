module.exports = (data) => `
    <p>Unresolved payment ${data.code} for UserID: <b>${data.metadata.userId}</b>. 
    <p>Currency: <b>${data.metadata.method}</b>. 
    <p>Payment: <b>${data.payments}</b>. 
    <p>Timeline: <b>${data.timeline}</b>. 
    <p>Addresses: <b>${data.addresses}</b>. 

    <p>Your</p>
    <p>Masterminer Team.</p>
`
