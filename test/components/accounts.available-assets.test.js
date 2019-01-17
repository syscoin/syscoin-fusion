import React from 'react'
import AvailableAssets from 'fw-components/Accounts/components/available-assets'
import AssetBox from 'fw-components/Accounts/components/asset-box'
import Enzyme, { shallow, render } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { spy } from 'sinon'

Enzyme.configure({ adapter: new Adapter() })

describe('Accounts - AvailableAssets component tests', () => {
  let wrapper
  let props

  beforeEach(() => {
    props = {
      t: string => string,
      assets: [],
      selectedAsset: '',
      selectAsset: spy(),
      goToSendAssetForm: spy(),
      claimInterest: spy()
    }
    wrapper = shallow(<AvailableAssets {...props} />)
  })

  it('should render AvailableAssets if assets prop is populated', () => {
    props.assets = [{
      '_id': '0c9df9a04d306e02-argvil19',
      'asset': '0c9df9a04d306e02',
      'symbol': 'PEPITA',
      'interest_rate': 0,
      'txid': '8a5d701e9cb7190e73cb737afba410d6f21036d8b85858109e945554bd173361',
      'height': 216,
      'alias': 'argvil19',
      'balance': '100.00000000',
      'interest_claim_height': 216,
      'memo': 'memo',
      'inputs': [],
      'accumulated_interest': '0.00000000'
    }]
    wrapper = shallow(<AvailableAssets {...props} />)

    expect(wrapper.find(AssetBox).length).toBe(1)
  })

  it('should display text in case that assets is empty', () => {
    wrapper = shallow(<AvailableAssets {...props} assets={[]} />)

    expect(wrapper.find('.available-assets-no-asset').length).toBe(1)
    expect(wrapper.find('.available-assets-no-asset').text()).toBe('accounts.asset.no_available_assets')
  })

})
