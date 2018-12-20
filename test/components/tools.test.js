import React from 'react'
import Tools from 'fw-components/Tools'
import NewAlias from 'fw-components/Tools/components/new-alias'
import BackupWallet from 'fw-components/Tools/components/backup-wallet'
import ImportWallet from 'fw-components/Tools/components/import-wallet'
import LockWallet from 'fw-components/Tools/components/lock-wallet'
import Console from 'fw-components/Tools/components/console'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { spy } from 'sinon'

Enzyme.configure({ adapter: new Adapter() })

describe('Tools component tests', () => {
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
    wrapper = shallow(<Tools {...props} />)
  })

  it('should render correctly', () => {
    expect(wrapper.instance()).toBeInstanceOf(Tools)
  })

  it('should render an instance of NewAlias', () => {
    expect(wrapper.find(NewAlias).length).toBe(0)
  })

  it('should render an instance of BackupWallet', () => {
    expect(wrapper.find(BackupWallet).length).toBe(1)
  })

  it('should render an instance of ImportWallet', () => {
    expect(wrapper.find(ImportWallet).length).toBe(1)
  })

  it('should render an instance of LockWallet', () => {
    expect(wrapper.find(LockWallet).length).toBe(1)
  })

  it('should render an instance of Console', () => {
    expect(wrapper.find(Console).length).toBe(1)
  })

})
