import React from 'react'
import DashboardTokens from 'fw-components/Accounts/components/dashboard-tokens'
import Enzyme, { shallow, render } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { spy } from 'sinon'

Enzyme.configure({ adapter: new Adapter() })

describe('Accounts - DashboardTokens component', () => {
  let props
  let wrapper

  beforeEach(() => {
    props = {
      assets: [{
        balance: 100,
        symbol: 'TEST',
        asset: 'random_asset',
      }],
      isLoading: false,
      error: false,
      refresh: spy(),
      t: string => string
    }
    wrapper = shallow(<DashboardTokens {...props} />)
  })

  it('should render correctly', () => {
    expect(wrapper.find('.wallet-summary-balance-container').length).toBe(1)
  })

  it('should render refresh button if not loading', () => {
    expect(wrapper.find('.dashboard-refresh').length).toBe(1)
  })
})