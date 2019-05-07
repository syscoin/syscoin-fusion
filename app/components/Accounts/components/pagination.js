import React from 'react'
import { Button, Icon } from 'antd'

type Props = {
  prevDisabled: boolean,
  nextDisabled: boolean,
  onChange: Function,
  showPage?: boolean,
  currentPage?: number,
  t: Function
};

const Pagination = (props: Props) => (
  <div className='fw-table-pagination-container'>
    {props.showPage && (
      <span className='fw-table-pagination-page'>{props.t('misc.showing_page', { number: props.currentPage + 1 })}</span>
    )}
    <Button
      className={`fw-table-pagination-prev ${props.prevDisabled ? 'disabled' : ''}`}
      onClick={() => props.onChange(props.currentPage - 1)}
      disabled={props.prevDisabled}
    >
      <Icon type='left' />
    </Button>
    <Button
      className={`fw-table-pagination-next ${props.nextDisabled ? 'disabled' : ''}`}
      onClick={() => props.onChange(props.currentPage + 1)}
      disabled={props.nextDisabled}
    >
      <Icon type='right' />
    </Button>
  </div>
)

Pagination.defaultProps = {
  showPage: false,
  currentPage: 0
}

export default Pagination
