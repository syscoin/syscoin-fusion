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
      sendSys: spy(),
      form: {
        data: {
          comment: '',
          address: '',
          amount: ''
        }
      },
      onChangeForm: spy(),
      t: string => string
    }
    wrapper = shallow(<SendSysForm {...props} />)
  })

  it('should render correctly', () => {
    expect(wrapper.instance()).toBeInstanceOf(SendSysForm)
  })

  it('should render correct values', () => {
    const newValues = {
      data: {
        comment: 'test',
        address: 'test_address',
        amount: '123'
      }
    }
    wrapper = shallow(<SendSysForm {...props} form={newValues} />)

    expect(wrapper.find('.send-sys-form-to-address').prop('value')).toBe(newValues.data.address)
    expect(wrapper.find('.send-sys-form-amount').prop('value')).toBe(newValues.data.amount)
    expect(wrapper.find('.send-sys-form-comment').prop('value')).toBe(newValues.data.comment)
  })

  it('should not allow you to send if required fields are empty', () => {
    let newValues = {
      data: {
        comment: 'test',
        address: 'test_address',
        amount: ''
      }
    }
    wrapper = shallow(<SendSysForm {...props} form={newValues} />)
    expect(wrapper.find('.send-sys-form-btn-send').prop('disabled')).toBe(true)

    newValues = {
      data: {
        comment: '',
        address: '',
        amount: '123'
      }
    }
    wrapper = shallow(<SendSysForm {...props} form={newValues} />)
    expect(wrapper.find('.send-sys-form-btn-send').prop('disabled')).toBe(true)

    newValues = {
      data: {
        comment: '',
        address: 'test',
        amount: '123'
      }
    }
    wrapper = shallow(<SendSysForm {...props} form={newValues} />)
    expect(wrapper.find('.send-sys-form-btn-send').prop('disabled')).toBe(false)
  })

  it('should write changes to store', () => {
    const onChangeMock = spy()
    wrapper = shallow(<SendSysForm {...props} onChangeForm={onChangeMock} />)

    wrapper.find('.send-sys-form-amount').simulate('change', '123')
    wrapper.find('.send-sys-form-to-address').simulate('change', 'test')
    wrapper.find('.send-sys-form-comment').simulate('change', 'comment')

    expect(onChangeMock.calledThrice).toBe(true)
    expect(onChangeMock.getCall(0).args[0]).toEqual({
      amount: '123',
      address: '',
      comment: ''
    })
    expect(onChangeMock.getCall(1).args[0]).toEqual({
      amount: '',
      address: 'test',
      comment: ''
    })
    expect(onChangeMock.getCall(2).args[0]).toEqual({
      amount: '',
      address: '',
      comment: 'comment'
    })
  })

  it('should filter amount field by only numbers', () => {
    const onChangeMock = spy()
    wrapper = shallow(<SendSysForm {...props} onChangeForm={onChangeMock} />)

    wrapper.find('.send-sys-form-amount').simulate('change', 'tr2')

    expect(onChangeMock.called).toBe(false)
  })

  it('should fire sendSys when clicking on send', () => {
    const sendMock = spy()
    const form = {
      data: {
        address: 'test',
        amount: '123'
      }
    }
    wrapper = shallow(<SendSysForm {...props} sendSys={sendMock} form={form} />)
    wrapper.find('.send-sys-form-btn-send').simulate('click')

    expect(sendMock.calledOnce).toBe(true)
  })

  it('should should show loading spinner only when isLoading is true', () => {
    expect(wrapper.find('.send-loading').length).toBe(0)

    wrapper = shallow(<SendSysForm {...props} isLoading />)
    expect(wrapper.find('.send-loading').length).toBe(1)
  })

})
