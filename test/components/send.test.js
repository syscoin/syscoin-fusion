import React from 'react'
import Send from 'fw-components/Send'
import SendAssetForm from 'fw-components/Send/components/send-asset'
import SendSysForm from 'fw-components/Send/components/send-sys'
import Enzyme, { shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { spy } from 'sinon'

Enzyme.configure({ adapter: new Adapter() })

describe('Send component tests', () => {
  let wrapper
  let props

  beforeEach(() => {
    props = {
      aliases: [],
      sendAsset: spy(),
      sendSys: spy(),
      balance: 100,
      getAssetsFromAlias: spy(),
      assetsForm: {
        data: {
          from: '',
          asset: '',
          toAddress: '',
          amount: '',
          comment: ''
        },
        isLoading: false,
        error: false,
        states: {
          assetsFromAlias: {
            isLoading: false,
            error: false,
            data: []
          }
        }
      },
      sysForm: {
        data: {
          amount: '',
          address: '',
          comment: ''
        },
        isLoading: false,
        error: false
      },
      onChangeForm: spy(),
      t: string => string
    }
    wrapper = shallow(<Send {...props} />)
  })

  it('should render correctly', () => {
    expect(wrapper.instance()).toBeInstanceOf(Send)
  })

  it('should render a SendAssetForm and a SendSysForm instance', () => {
    expect(wrapper.find(SendAssetForm).length).toBe(1)
    expect(wrapper.find(SendSysForm).length).toBe(1)
  })

  it('should fire sendAssets when sendAsset is executed', () => {
    wrapper.instance().sendAsset(props.assetsForm.data)

    expect(wrapper.instance().props.sendAsset.calledOnce).toBe(true)
    expect(wrapper.instance().props.sendAsset.getCall(0).args[0]).toBe(props.assetsForm.data)
  })

  it('should fire sendSys when sendSys is executed', () => {
    wrapper.instance().sendSys(props.sysForm.data)

    expect(wrapper.instance().props.sendSys.calledOnce).toBe(true)
    expect(wrapper.instance().props.sendSys.getCall(0).args[0]).toBe(props.sysForm.data)
  })

})
