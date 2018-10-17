module.exports = (amount, address, type) => `

    <html>
<head>
  <meta http-equiv="content-type" content="text/html; charset=utf-8">
</head>

<body text="#000000" bgcolor="#FFFFFF" style="font-family:arial;">
  <meta http-equiv="content-type" content="text/html; charset=utf-8">
  <table cellspacing="0" cellpadding="15%" align="center" width="80%" border="0">
    <tbody>
      <tr style="height: 80px;">
        <td style="height: 80px;"><img style="display: block;
              margin-left: auto; margin-right: auto;" src="https://s3.amazonaws.com/masterminer/MM.png"
            alt="MasterMiner.tech" height="67" width="266"></td>
      </tr>
      <tr style="height: 20px;" bgcolor="#0192a0">
        <td style="height: 20px;"><br>
        </td>
      </tr>
      <tr style="height: 18px;">
        <td style="height: 18px;">
          <h4 style="text-align: left;"><span style="color: #000000;">Hey
              There!</span></h4>
          <p>
            A reward of ${amount} ${type} has been received at ${address}!
          </p>

          <p><span style="color: #808080;">
              If you have any questions, simply reach out to us through our
              <a href="https://t.me/joinchat/HL9uVRK4iDSI6y0Y_VCYjg">Telegram Channel</a>.
            </span></p>

          <p><span style="color: #808080;">Best regards, <br>
              The Masterminer team</span></p>
        </td>
      </tr>
      <tr style="height: 20px;" bgcolor="#0192a0">
        <td style="height: 20px;"><br>
        </td>
      </tr>
      <tr style="height: 12px;">
        <td style="height: 12px;">
          <p style="text-align: center;"><span style="color: #999999;
                font-size: 11px;"> You are
              receiving this email as part
              of MasterMiner's reward notfication subscriber's list. <br>
              Please add <span style="color: #3366ff;"><a style="color: #3366ff;">max@masterminer.tech</a></span>
              to your address book or safe sender list so our emails
              get to your inbox.</span></p>
        </td>
      </tr>
    </tbody>
  </table>
</body>
</html>

    
`
