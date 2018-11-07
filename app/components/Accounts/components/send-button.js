// @flow
import React from 'react'
import { Button } from 'antd'

type Props = {
  className?: string
};

const SendButton = (props: Props) => {
  const { className, ...btnProps} = props
  return (
    <Button
      className={`send-button ${className || ''}`}
      {...btnProps}
    >
      Send
    </Button>
  )
}

SendButton.defaultProps = {
  className: ''
}

export default SendButton
