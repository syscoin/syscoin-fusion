import React from 'react'
import LockWallet from 'fw-components/Tools/components/lock-wallet'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { spy } from 'sinon'

Enzyme.configure({ adapter: new Adapter() })

describe('Tools - LockWallet component', () => {
  let wrapper
  let props

  beforeEach(() => {
    props = {
      currentBlock: 500,
      unfinishedAliases: [],
      createNewAlias: spy(),
      importWallet: spy(),
      exportWallet: spy()
    }
    wrapper = shallow(<LockWallet {...props} />)
  })

  it('should render correctly', () => {
    expect(wrapper.instance()).toBeInstanceOf(LockWallet)
  })

})
