import React from 'react'
import SendAssetForm from 'fw-components/Send/components/send-asset'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { spy } from 'sinon'

Enzyme.configure({ adapter: new Adapter() })

describe('Send - Send Asset Form component', () => {
  let wrapper
  let props

  beforeEach(() => {
    props = {
      title: 'Send asset',
      columnSize: 12,
      aliases: ['test_alias'],
      isLoading: false,
      sendAsset: spy(),
      onSelectAlias: spy(),
      form: {
        isLoading: false,
        error: false,
        data: {
          from: 'from_test',
          asset: 'asset_test',
          toAddress: 'toAddress_test',
          amount: '1000',
          comment: 'comment_test'
        }
      },
      assetsFromAlias: {
        isLoading: false,
        error: false,
        data: []
      },
      onChangeForm: spy(),
      assetsFromAlias: {
        isLoading: false,
        error: false,
        data: []
      },
      t: string => string
    }
    wrapper = shallow(<SendAssetForm {...props} />)
  })

  it('should render correctly', () => {
    expect(wrapper.instance()).toBeInstanceOf(SendAssetForm)
  })

  it('should check inputs get the correct values', () => {
    expect(wrapper.find('#asset-form-select-alias').prop('value')).toBe(props.form.data.from)
    expect(wrapper.find('#asset-form-select-asset').prop('value')).toBe(props.form.data.asset)
    expect(wrapper.find('#asset-form-to-address').prop('value')).toBe(props.form.data.toAddress)
    expect(wrapper.find('#asset-form-amount').prop('value')).toBe(props.form.data.amount)
    expect(wrapper.find('#asset-form-comment').prop('value')).toBe(props.form.data.comment)
  })

  it('should call onSelectAlias when onchange is fired in alias select', () => {
    const mockChange = spy()
    wrapper = shallow(<SendAssetForm {...props} onSelectAlias={mockChange} />)

    wrapper.find('#asset-form-select-alias').simulate('change', 'change')

    expect(mockChange.calledOnce).toBe(true)
  })

  it('should not update form if amount change doesnt meet criteria', () => {
    const mockChange = spy()
    wrapper = shallow(<SendAssetForm {...props} onChangeForm={mockChange} />)

    wrapper.find('#asset-form-amount').simulate('change', 'should_not_pass')

    expect(mockChange.called).toBe(false)

    wrapper.find('#asset-form-amount').simulate('change', '123123')

    expect(mockChange.called).toBe(true)
  })

  it('should not allow to submit the form if all required fields are not filled', () => {
    let mockProps = {
      ...props,
      form: {
        ...props.form,
        data: {
          ...props.form.data,
          from: ''
        }
      }
    }
    wrapper = shallow(<SendAssetForm {...mockProps} />)
    expect(wrapper.find('.send-asset-form-btn-send').prop('disabled')).toBe(true)

    mockProps = {
      ...props,
      form: {
        ...props.form,
        data: {
          ...props.form.data,
          asset: ''
        }
      }
    }
    wrapper = shallow(<SendAssetForm {...mockProps} />)
    expect(wrapper.find('.send-asset-form-btn-send').prop('disabled')).toBe(true)

    mockProps = {
      ...props,
      form: {
        ...props.form,
        data: {
          ...props.form.data,
          toAddress: ''
        }
      }
    }
    wrapper = shallow(<SendAssetForm {...mockProps} />)
    expect(wrapper.find('.send-asset-form-btn-send').prop('disabled')).toBe(true)

    mockProps = {
      ...props,
      form: {
        ...props.form,
        data: {
          ...props.form.data,
          amount: ''
        }
      }
    }
    wrapper = shallow(<SendAssetForm {...mockProps} />)
    expect(wrapper.find('.send-asset-form-btn-send').prop('disabled')).toBe(true)

    wrapper = shallow(<SendAssetForm {...props} />)
    expect(wrapper.find('.send-asset-form-btn-send').prop('disabled')).toBe(false)
  })

  it('should allow to submit if optional fields are not filled', () => {
    let mockProps = {
      ...props,
      form: {
        isLoading: false,
        error: false,
        data: {
          from: 'from_test',
          asset: 'asset_test',
          toAddress: 'address',
          amount: '1000',
          comment: ''
        }
      }
    }
    wrapper = shallow(<SendAssetForm {...mockProps} />)
    expect(wrapper.find('.send-asset-form-btn-send').prop('disabled')).toBe(false)
  })

  it('should show balance field when asset is selected', () => {
    let mockProps = {
      ...props,
      assetsFromAlias: {
        isLoading: false,
        error: false,
        data: [{
          balance: '100.00',
          asset: 'asset_test'
        }]
      }
    }
    wrapper = shallow(<SendAssetForm {...mockProps} />)

    expect(wrapper.find('.asset-form-asset-balance').length).toBe(1)
    expect(wrapper.find('.asset-form-asset-balance').text()).toBe('Balance: 100.00')
  })

})
