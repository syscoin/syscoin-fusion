import React from 'react'
import Dashboard from 'fw-components/Accounts/components/dashboard'
import DashboardBalance from 'fw-components/Accounts/components/dashboard-balance'
import DashboardTokens from 'fw-components/Accounts/components/dashboard-tokens'
import SysTransactionList from 'fw-components/Accounts/components/sys-transaction-list'
import Enzyme, { shallow, render } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { spy } from 'sinon'

Enzyme.configure({ adapter: new Adapter() })

describe('Accounts - Dashboard component', () => {
  let props
  let wrapper

  beforeEach(() => {
    props = {
      balance: 100,
      backgroundLogo: 'background_url',
      assets: [],
      transactions: {
        isLoading: false,
        error: false,
        data: []
      },
      assets: {
        isLoading: false,
        error: false,
        data: []
      },
      refreshDashboardAssets: spy(),
      refreshDashboardTransactions: spy(),
      goToSysForm: spy()
    }
    wrapper = shallow(<Dashboard {...props} />)
  })

  it('should render correctly', () => {
    expect(wrapper.find('.wallet-summary-container').length).toBe(1)
  })

  it('should render coin logo provided by backgroundLogo prop', () => {
    expect(wrapper.find('.sys-logo-bg').length).toBe(1)
    expect(wrapper.find('.sys-logo-bg').prop('src')).toBe(props.backgroundLogo)
  })

  it('should contain an instance of DashboardBalance', () => {
    expect(wrapper.find(DashboardBalance).length).toBe(1)
  })

  it('should contain an instance of DashboardTokens', () => {
    expect(wrapper.find(DashboardTokens).length).toBe(1)
  })

  it('should contain an instance of SysTransactionList', () => {
    expect(wrapper.find(SysTransactionList).length).toBe(1)
  })

})