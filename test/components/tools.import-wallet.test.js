import React from 'react'
import ImportWallet from 'fw-components/Tools/components/import-wallet'
import Enzyme, { shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { spy } from 'sinon'

Enzyme.configure({ adapter: new Adapter() })

describe('Tools - ImportWallet component', () => {
  let wrapper
  let props

  beforeEach(() => {
    props = {
      importWallet: spy()
    }
    wrapper = shallow(<ImportWallet {...props} />)
  })

  it('should render correctly', () => {
    expect(wrapper.instance()).toBeInstanceOf(ImportWallet)
  })

  it('should fire importWallet when beforeUpload is fired', () => {
    const importMock = spy()
    wrapper = shallow(<ImportWallet {...props} importWallet={importMock} />)

    expect(wrapper.instance().beforeUpload({
      path: '/test/path/here'
    })).toBeInstanceOf(Promise)
    expect(importMock.calledOnce).toBe(true)
  })

  it('should render loading icon while isLoading is true', () => {
    wrapper = mount(<ImportWallet {...props} />)
    wrapper.setState({
      isLoading: true
    })

    expect(wrapper.find('i.loading-tools').length).toBe(1)
  })
})
