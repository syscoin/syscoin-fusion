import React from 'react'
import SendSysForm from 'fw-components/Send/components/send-sys'
import Enzyme, { shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { spy } from 'sinon'
import { systemPreferences } from 'electron';

Enzyme.configure({ adapter: new Adapter() })

describe('Send - Send SYS Form component', () => {
  let wrapper
  let props

  beforeEach(() => {
    props = {
      title: 'Send SYS',
      columnSize: 12,
      balance: 100,
      isLoading: false,
      sendSys: spy()
    }
    wrapper = shallow(<SendSysForm {...props} />)
  })

  it('should render correctly', () => {
    expect(wrapper.instance()).toBeInstanceOf(SendSysForm)
  })

  it('should render correct values', () => {
    const newState = {
      comment: 'test',
      address: 'test_address',
      amount: '123'
    }
    wrapper.setState(newState)

    expect(wrapper.find('.send-sys-form-to-address').prop('value')).toBe(newState.address)
    expect(wrapper.find('.send-sys-form-amount').prop('value')).toBe(newState.amount)
    expect(wrapper.find('.send-sys-form-comment').prop('value')).toBe(newState.comment)
  })

  it('should not allow you to send if required fields are empty', () => {
    const newState = {
      comment: 'test',
      address: 'test_address',
      amount: ''
    }
    wrapper.setState(newState)
    expect(wrapper.find('.send-sys-form-btn-send').prop('disabled')).toBe(true)

    wrapper.setState({
      address: '',
      amount: '123'
    })
    expect(wrapper.find('.send-sys-form-btn-send').prop('disabled')).toBe(true)

    wrapper.setState({
      address: 'test',
      amount: '123'
    })
    expect(wrapper.find('.send-sys-form-btn-send').prop('disabled')).toBe(false)
  })

  it('should write changes to state', () => {
    wrapper.find('.send-sys-form-amount').simulate('change', '123')
    wrapper.find('.send-sys-form-to-address').simulate('change', 'test')
    wrapper.find('.send-sys-form-comment').simulate('change', 'comment')

    expect(wrapper.state()).toEqual({
      amount: '123',
      address: 'test',
      comment: 'comment'
    })
  })

  it('should fire sendSys when clicking on send', () => {
    const sendMock = spy()
    wrapper = shallow(<SendSysForm {...props} sendSys={sendMock} />)

    wrapper.setState({
      amount: '100',
      address: 'test_address'
    })

    wrapper.find('.send-sys-form-btn-send').simulate('click')

    expect(sendMock.calledOnce).toBe(true)
  })

  it('should should show loading spinner only when isLoading is true', () => {
    expect(wrapper.find('.send-loading').length).toBe(0)

    wrapper = shallow(<SendSysForm {...props} isLoading />)
    expect(wrapper.find('.send-loading').length).toBe(1)
  })

})
