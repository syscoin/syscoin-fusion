import React from 'react'
import SendAssetForm from 'fw-components/Send/components/send-asset'
import Enzyme, { shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { spy } from 'sinon'

Enzyme.configure({ adapter: new Adapter() })

describe('Send component tests', () => {
  let wrapper
  let props

  beforeEach(() => {
    props = {
      title: 'Send asset',
      columnSize: 12,
      aliases: ['test_alias'],
      assets: [{ symbol: 'test_asset', asset: 'asset_test' }],
      isLoading: false,
      sendAsset: spy(),
      onSelectAlias: spy(),
      assetsFromAliasIsLoading: false,
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
      onChangeForm: spy()
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

    wrapper.find('#asset-form-select-alias').simulate('change', {
      target: { value: 'change' }
    })

    expect(mockChange.calledOnce).toBe(true)
  })

})
