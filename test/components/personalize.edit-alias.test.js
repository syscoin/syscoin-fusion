import React from 'react'
import EditAlias from 'fw-components/Personalize/components/edit-alias'
import { Select } from 'antd'
import Enzyme, { shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { spy } from 'sinon'
import { resolve } from 'dns';

Enzyme.configure({ adapter: new Adapter() })

describe('Personalize - EditAlias component', () => {
  let wrapper
  let props

  beforeEach(() => {
    props = {
      aliasInfo: () => new Promise(resolve => ({
        publicValue: data.publicvalue,
        address: data.address,
        encPrivKey: data.encryption_privatekey,
        encPubKey: data.encryption_publickey,
        acceptTransferFlag: data.accepttransferflags,
        expireTimestamp: data.expires_on
      })),
      currentAliases: [{ alias: 'test1' }, { alias: 'test2' }, { alias: 'test3' }],
      editAlias: spy(),
      t: string => string
    }
    wrapper = shallow(<EditAlias {...props} />)
  })

  it('should render correctly', () => {
    expect(wrapper.instance()).toBeInstanceOf(EditAlias)
  })

  it('should render aliases passed by currentAliases', () => {
    expect(wrapper.find(Select.Option).length).toBe(3)
  })

  it('should fire aliasInfo on alias change', () => {
    const aliasInfoMock = spy(props.aliasInfo)
    wrapper = shallow(<EditAlias {...props} aliasInfo={aliasInfoMock} />)

    wrapper.find('.edit-alias-form-alias').simulate('change', 'test3')

    expect(aliasInfoMock.calledOnce).toBe(true)
    expect(aliasInfoMock.getCall(0).args[0]).toBe('test3')
    expect(wrapper.instance().state.isLoading).toBe(true)
  })

  it('should not update state if input does not meet criteria', () => {
    wrapper.setState({
      aliasToEdit: 'test1'
    })
    wrapper.find('.edit-alias-form-publicvalue').simulate('change', new Array(500).join('a'))
    wrapper.find('.edit-alias-form-timestamp').simulate('change', 'should not update')
    wrapper.find('.edit-alias-form-address').simulate('change', new Array(100).join('b'))

    expect(wrapper.state().editValues).toEqual({
      publicValue: '',
      acceptTransferFlag: 3,
      expireTimestamp: 1548184538,
      address: '',
      encPrivKey: '',
      encPubKey: '',
      witness: ''
    })

    wrapper.find('.edit-alias-form-publicvalue').simulate('change', new Array(100).join('a'))
    wrapper.find('.edit-alias-form-timestamp').simulate('change', '12345')
    wrapper.find('.edit-alias-form-address').simulate('change', new Array(20).join('b'))

    expect(wrapper.state().editValues).toEqual({
      publicValue: new Array(100).join('a'),
      acceptTransferFlag: 3,
      expireTimestamp: '12345',
      address: new Array(20).join('b'),
      encPrivKey: '',
      encPubKey: '',
      witness: ''
    })
  })

  it('should disable send button if loading', () => {
    wrapper.setState({
      isLoading: true,
      aliasToEdit: 'test1'
    })

    expect(wrapper.find('.edit-alias-form-btn-send').prop('disabled')).toBe(true)

    wrapper.setState({
      isLoading: false
    })

    expect(wrapper.find('.edit-alias-form-btn-send').prop('disabled')).toBe(false)
  })

  it('should fire updateAlias when click on Send button', () => {
    const editAliasMock = spy()
    wrapper = shallow(<EditAlias {...props} editAlias={editAliasMock} />)
    wrapper.setState({
      aliasToEdit: 'test1'
    })

    wrapper.find('.edit-alias-form-btn-send').simulate('click')

    expect(editAliasMock.calledOnce).toBe(true)
  })
})
