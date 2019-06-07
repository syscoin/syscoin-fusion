import React from 'react'
import TransactionList from 'fw-components/Accounts/components/transaction-list'
import AvailableAssets from 'fw-components/Accounts/components/available-assets'
import AssetDetails from 'fw-components/Accounts/components/asset-details'
import Enzyme, { shallow, render } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { spy } from 'sinon'

Enzyme.configure({ adapter: new Adapter() })

describe('Accounts - AssetDetails component tests', () => {
  let wrapper
  let props

  beforeEach(() => {
    props = {
      t: string => string,
      aliasAssets: {
        selected: '',
        selectedSymbol: '',
        isLoading: false,
        data: [],
        error: false
      },
      aliasInfo: {
        alias: 'test',
        address: 'test',
        balance: 0,
        isAlias: true
      },
      selectAsset: spy(),
      goToSendAssetForm: spy(),
      selectedAlias: '',
      claimInterest: spy(),
      transactions: {
        data: [],
        isLoading: false,
        error: false
      }
    }
    wrapper = shallow(<AssetDetails {...props} />)
  })

  it('should render AvailableAssets if aliasAssets.data is populated', () => {
    props.aliasAssets.data = [{
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
    wrapper = shallow(<AssetDetails {...props} selectedAlias='test' />)

    expect(wrapper.find(AvailableAssets).length).toBe(1)
  })

  it('should render TransactionList if asset is selected', () => {
    props.aliasAssets.selected = 'test'
    wrapper = shallow(<AssetDetails {...props} selectedAlias='some_alias' />)

    expect(wrapper.find(TransactionList).length).toBe(1)
  })

})
