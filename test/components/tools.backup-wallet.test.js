import React from 'react'
import BackupWallet from 'fw-components/Tools/components/backup-wallet'
import Enzyme, { shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { spy } from 'sinon'

Enzyme.configure({ adapter: new Adapter() })

describe('Tools - BackupWallet component', () => {
  let wrapper
  let props

  beforeEach(() => {
    props = {
      exportWallet: spy(),
      getFolder: cb => cb(['/path/to/somewhere'])
    }
    wrapper = shallow(<BackupWallet {...props} />)
  })

  it('should render correctly', () => {
    expect(wrapper.instance()).toBeInstanceOf(BackupWallet)
  })

  it('should fire exportWallet when backupWallet is executed', () => {
    const exportMock = spy()
    wrapper = shallow(<BackupWallet {...props} exportWallet={exportMock} />)

    wrapper.find('.backup-wallet-btn').simulate('click')

    expect(exportMock.calledOnce).toBe(true)
    expect(typeof exportMock.getCall(0).args[0]).toBe('string')
  })

  it('should render loading icon while isLoading is true', () => {
    wrapper = mount(<BackupWallet {...props} />)
    wrapper.setState({
      isLoading: true
    })

    expect(wrapper.find('i.loading-tools').length).toBe(1)
  })
})
