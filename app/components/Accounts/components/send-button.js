// @flow
import React from 'react'
import { Button } from 'antd'

type Props = {
  className?: string,
  t: Function
};

const SendButton = ({t, ...props}: Props) => {
  const { className, ...btnProps} = props
  return (
    <Button
      className={`send-button ${className || ''}`}
      {...btnProps}
    >
      {t('misc.send')}
    </Button>
  )
}

SendButton.defaultProps = {
  className: ''
}

export default SendButton
