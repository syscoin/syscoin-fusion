import React from 'react'
import DashboardBalance from 'fw-components/Accounts/components/dashboard-balance'
import Enzyme, { shallow, render } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { spy } from 'sinon'

Enzyme.configure({ adapter: new Adapter() })

describe('Accounts - DashboardBalance component', () => {
  let props
  let wrapper

  beforeEach(() => {
    props = {
      balance: 100,
      goToSysForm: spy(),
      t: string => string
    }
    wrapper = shallow(<DashboardBalance {...props} />)
  })

  it('should render correctly', () => {
    expect(wrapper.find('.wallet-summary-balance-container').length).toBe(1)
  })

  it('should render balance', () => {
    expect(wrapper.find('.wallet-summary-balance-number').text()).toContain(props.balance.toFixed(2))
  })

  it('should fire goToSysForm when send button is clicked', () => {
    const mockClick = spy()
    wrapper = shallow(<DashboardBalance {...props} goToSysForm={mockClick} />)
    wrapper.find('.wallet-summary-balance-send-btn').simulate('click')

    expect(mockClick.calledOnce).toBe(true)
  })
})