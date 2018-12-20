import React from 'react'
import AssetBox from 'fw-components/Accounts/components/asset-box'
import Enzyme, { shallow, render } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { spy } from 'sinon'

Enzyme.configure({ adapter: new Adapter() })

describe('Accounts - Asset box component', () => {
  let props
  let wrapper

  beforeEach(() => {
    props = {
      isSelected: false,
      selectAsset: spy(),
      asset: 'some_random_asset',
      symbol: 'ASSET',
      balance: '12.00',
      goToSendAssetForm: spy(),
      selectedAlias: 'testAlias',
      claimInterest: spy()
    }
    wrapper = shallow(<AssetBox {...props} />)
  })

  it('should render correctly', () => {
    expect(wrapper.find('.asset-box').length).toBe(1)
  })

  it('should fire selectAsset when clicked', () => {
    const mockClick = spy()
    wrapper = shallow(<AssetBox {...props} selectAsset={mockClick} />)
    wrapper.find('.asset-box').simulate('click')

    expect(mockClick.calledOnce).toBe(true)
  })

  it('should render data correctly', () => {
    expect(wrapper.find('.asset-box-name').text()).toBe(props.symbol)
    expect(wrapper.find('.asset-box-guid').text()).toBe(props.asset)
    expect(wrapper.find('.asset-box-balance').text()).toBe('Balance: 12.00')
  })

  it('should add selected class to wrapper when isSelected is true', () => {
    wrapper = shallow(<AssetBox {...props} isSelected />)
    expect(wrapper.find('.asset-box.selected').length).toBe(1)
  })

  it('should fire goToSendAssetForm when click on send button', () => {
    const mockClick = spy()
    wrapper = shallow(<AssetBox {...props} goToSendAssetForm={mockClick} />)
    wrapper.find('.asset-box-send').simulate('click')

    expect(mockClick.calledOnce).toBe(true)
  })

  it('should fire claimInterest when click on menu item', () => {
    const interestMock = spy()
    wrapper = shallow(<AssetBox {...props} claimInterest={interestMock} />)

    wrapper.instance().claimInterest()

    expect(interestMock.called).toBeTruthy()
    expect(interestMock.getCall(0).args).toEqual(['some_random_asset', 'testAlias'])
  })
})
