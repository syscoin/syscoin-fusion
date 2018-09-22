module.exports = (email, tier, shares, comments) => `
    <p>Username ${email} has requested ${shares} shares in tier ${tier}.</p>

    ${comments ? '<p>Additional comments: ' + comments + '</p>' : ''}

    <p>Masterminer Team.</p>
`
