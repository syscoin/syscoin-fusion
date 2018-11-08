// @flow
import React from 'react'
import { Icon } from 'antd'

type Props = {
  onClick: Function,
  disabled: boolean,
  className: string
};

export default (props: Props) => {
  const { onClick, disabled, className = '',  ...otherProps } = props
  return <Icon type='home' onClick={onClick} {...otherProps} className={`home-icon ${disabled ? 'disabled' : ''} ${className}`} />
}