import React from 'react'
import LockWallet from 'fw-components/Tools/components/lock-wallet'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { spy, spyOn } from 'sinon'

Enzyme.configure({ adapter: new Adapter() })

describe('Tools - LockWallet component', () => {
  let wrapper
  let props

  beforeEach(() => {
    props = {
      lockWallet: spy(),
      isEncrypted: false
    }
    wrapper = shallow(<LockWallet {...props} />)
  })

  it('should render correctly', () => {
    expect(wrapper.instance()).toBeInstanceOf(LockWallet)
  })

  it('should render lock wallet button if not encrypted', () => {
    expect(wrapper.find('.tools-lock').length).toBe(1)
  })

  it('should render change pwd and unlock for a session buttons if encrypted', () => {
    wrapper = shallow(<LockWallet {...props} isEncrypted />)
    expect(wrapper.find('.tools-change-pwd').length).toBe(1)
    expect(wrapper.find('.tools-unlock').length).toBe(1)
  })

})
