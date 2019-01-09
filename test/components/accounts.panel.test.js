import React from 'react'
import Panel from 'fw-components/Accounts/components/panel'
import AliasContainer from 'fw-components/Accounts/components/alias-container'
import Home from 'fw-components/Accounts/components/home'
import UserBalance from 'fw-components/Accounts/components/balance'
import Enzyme, { shallow, render } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { spy } from 'sinon'

Enzyme.configure({ adapter: new Adapter() })

describe('Accounts - Panel component tests', () => {
  let wrapper
  let props

  beforeEach(() => {
    props = {
      t: string => string,
      aliases: [],
      aliasAssets: {
        data: [],
        isLoading: false,
        error: false
      },
      transactions: {
        data: [],
        isLoading: false,
        error: false
      },
      currentBalance: 0,
      goToHome: spy(),
      syncPercentage: 0,
      headBlock: 0,
      currentBlock: 0,
      updateSelectedAlias: spy(),
      claimInterest: spy(),
      selectedAlias: '',
      getPrivateKey: spy()
    }
    wrapper = shallow(<Panel {...props} />)
  })

  it('should render an instance of AliasContainer', () => {
    expect(wrapper.find(AliasContainer).length).toBe(1)
  })

  it('should render an instance of Home', () => {
    expect(wrapper.find(Home).length).toBe(1)
  })

  it('should render an instance of UserBalance', () => {
    expect(wrapper.find(UserBalance).length).toBe(1)
  })

})
