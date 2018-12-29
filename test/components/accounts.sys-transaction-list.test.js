import React from 'react'
import SysTransactionList from 'fw-components/Accounts/components/sys-transaction-list'
import Pagination from 'fw-components/Accounts/components/pagination'
import Table from 'fw-components/Accounts/components/table'
import Enzyme, { shallow, render } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { spy } from 'sinon'

Enzyme.configure({ adapter: new Adapter() })

describe('Accounts - SysTransactionList component', () => {
  let props
  let wrapper

  beforeEach(() => {
    props = {
      data: [],
      error: false,
      isLoading: false,
      refresh: spy(),
      t: string => string
    }
    wrapper = shallow(<SysTransactionList {...props} />)
  })

  it('should render correctly', () => {
    expect(wrapper.find('.wallet-summary-balance-container').length).toBe(1)
  })

  it('should render an instance of Pagination', () => {
    expect(wrapper.find(Pagination).length).toBe(1)
  })

  it('should disable pagination when loading', () => {
    wrapper = shallow(<SysTransactionList {...props} isLoading />)

    expect(wrapper.find(Pagination).length).toBe(0)
  })

  it('should render an instance of Table', () => {
    expect(wrapper.find(Table).length).toBe(1)
  })

  it('should identify incoming and outgoing transactions correctly', () => {
    expect(wrapper.instance().isIncoming({
      amount: '1000'
    })).toBe(true)
    expect(wrapper.instance().isIncoming({
      amount: '-1000'
    })).toBe(false)
  })

  it('should cut long addresses and add periods at the end', () => {
    expect(wrapper.instance().cutTextIfNeeded('1234567890123456')).toBe('123456789012...')
  })

  it('should remove plus and minus signs from amounts', () => {
    expect(wrapper.instance().removeSigns(-123)).toBe(123)
    expect(wrapper.instance().removeSigns(123)).toBe(123)
  })

})