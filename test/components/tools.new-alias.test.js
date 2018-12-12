import React from 'react'
import NewAlias from 'fw-components/Tools/components/new-alias'
import QueuedAlias from 'fw-components/Tools/components/queued-alias'
import Enzyme, { shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { spy } from 'sinon'

Enzyme.configure({ adapter: new Adapter() })

describe('Tools - NewAlias component', () => {
  let wrapper
  let props

  beforeEach(() => {
    props = {
      currentBlock: 500,
      unfinishedAliases: [],
      createNewAlias: spy(),
      title: 'New alias'
    }
    wrapper = shallow(<NewAlias {...props} />)
  })

  it('should render correctly', () => {
    expect(wrapper.instance()).toBeInstanceOf(NewAlias)
  })

  it('should disable Send button unless required fields are filled', () => {
    expect(wrapper.find('.create-alias-form-btn-send').prop('disabled')).toBe(true)

    wrapper.setState({
      aliasName: 'test_alias'
    })

    expect(wrapper.find('.create-alias-form-btn-send').prop('disabled')).toBe(false)
  })

  it('should not update state if input does not meet criteria', () => {
    wrapper.find('.create-alias-form-name').simulate('change', new Array(100).join('a'))
    wrapper.find('.create-alias-form-publicvalue').simulate('change', new Array(500).join('a'))
    wrapper.find('.create-alias-form-timestamp').simulate('change', 'should not update')
    wrapper.find('.create-alias-form-address').simulate('change', new Array(100).join('b'))

    expect(wrapper.state()).toEqual({
      aliasName: '',
      publicValue: '',
      acceptTransferFlags: -1,
      expireTimestamp: '',
      address: '',
      encryptionPrivKey: '',
      encryptionPublicKey: '',
      witness: '',
      isLoading: false
    })

    wrapper.find('.create-alias-form-name').simulate('change', new Array(12).join('a'))
    wrapper.find('.create-alias-form-publicvalue').simulate('change', new Array(100).join('a'))
    wrapper.find('.create-alias-form-timestamp').simulate('change', '12345')
    wrapper.find('.create-alias-form-address').simulate('change', new Array(20).join('b'))

    expect(wrapper.state()).toEqual({
      aliasName: new Array(12).join('a'),
      publicValue: new Array(100).join('a'),
      acceptTransferFlags: -1,
      expireTimestamp: '12345',
      address: new Array(20).join('b'),
      encryptionPrivKey: '',
      encryptionPublicKey: '',
      witness: '',
      isLoading: false
    })
  })

  it('should render pending aliases as tags', () => {
    const unfinishedAliases = [
      {
        aliasName: 'alias1',
        block: 25,
        round: 0
      },
      {
        aliasName: 'alias2',
        block: 123,
        round: 1
      }
    ]

    wrapper = shallow(<NewAlias {...props} unfinishedAliases={unfinishedAliases} />)

    expect(wrapper.find(QueuedAlias).length).toBe(2)
  })

})
