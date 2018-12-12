import React from 'react'
import Accounts from 'fw-components/Accounts'
import SyncLoader from 'fw-components/Accounts/components/sync-loader'
import Dashboard from 'fw-components/Accounts/components/dashboard'
import TransactionList from 'fw-components/Accounts/components/transaction-list'
import Enzyme, { shallow, render } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { spy } from 'sinon'

Enzyme.configure({ adapter: new Adapter() })

describe('Accounts component tests', () => {
  let wrapper
  let props

  beforeEach(() => {
    props = {
      backgroundLogo: '',
      balance: 123,
      aliases: [],
      transactions: {
        isLoading: false,
        data: [],
        error: false
      },
      dashboardSysTransactions: {
        data: [],
        error: false,
        isLoading: false
      },
      dashboardAssets: {
        isLoading: false,
        error: false,
        data: []
      },
      selectedAlias: '',
      aliasAssets: {
        data: [],
        error: false,
        isLoading: false
      },
      updateSelectedAlias: spy(),
      selectAsset: spy(),
      headBlock: 9999,
      currentBlock: 500,
      syncPercentage: parseInt((500 / 9999) * 100, 10),
      getPrivateKey: spy(),
      goToHome: spy(),
      getDashboardAssets: spy(),
      getDashboardTransactions: spy(),
      goToAssetForm: spy(),
      goToSysForm: spy()
    }
    wrapper = shallow(<Accounts {...props} />)
  })

  it('should render successfully', () => {
    expect(wrapper.find('.accounts-container').length).toEqual(1)
  })

  it('should render dashboard if there is no selectedAlias/error', () => {
    expect(wrapper.find(Dashboard).length).toEqual(1)
  })

  it('should not render coin logo if an alias is selected', () => {
    props.selectedAlias = 'test'
    wrapper = shallow(<Accounts {...props} />)

    expect(wrapper.find(Dashboard).length).toEqual(0)
  })

  it('should render Dashboard if an error happens while selecting alias', () => {
    props.aliasAssets.error = true
    wrapper = shallow(<Accounts {...props} />)

    expect(wrapper.find(Dashboard).length).toEqual(1)
  })

  it('should render loader if syncPercentage is not 100%', () => {
    expect(wrapper.find(SyncLoader).length).toEqual(1)
  })

  it('should not render loader if syncPercentage is 100%', () => {
    props.currentBlock = 9999
    props.syncPercentage = parseInt((props.currentBlock / props.headBlock) * 100, 10)
    wrapper = shallow(<Accounts {...props} />)

    expect(wrapper.find(SyncLoader).length).toEqual(0)
  })

  it('should display available assets if valid alias is selected and it owns any token', () => {
    props.selectedAlias = 'test'
    props.aliasAssets.data = [{
      "_id": "0c9df9a04d306e02-argvil19",
      "asset": "0c9df9a04d306e02",
      "symbol": "PEPITA",
      "interest_rate": 0,
      "txid": "8a5d701e9cb7190e73cb737afba410d6f21036d8b85858109e945554bd173361",
      "height": 216,
      "alias": "argvil19",
      "balance": "100.00000000",
      "interest_claim_height": 216,
      "memo": "memo",
      "inputs": [],
      "accumulated_interest": "0.00000000"
    }]
    wrapper = shallow(<Accounts {...props} />)

    expect(wrapper.find('.asset-box-container').length).toBe(1)
  })

  it('should display asset transactions table when an asset is selected', () => {
    props.selectedAlias = 'test'
    props.aliasAssets.data = [{
      "_id": "0c9df9a04d306e02-argvil19",
      "asset": "0c9df9a04d306e02",
      "symbol": "PEPITA",
      "interest_rate": 0,
      "txid": "8a5d701e9cb7190e73cb737afba410d6f21036d8b85858109e945554bd173361",
      "height": 216,
      "alias": "argvil19",
      "balance": "100.00000000",
      "interest_claim_height": 216,
      "memo": "memo",
      "inputs": [],
      "accumulated_interest": "0.00000000"
    }]
    props.aliasAssets.selected = '0c9df9a04d306e02'
    props.aliasAssets.selectedSymbol = 'PEPITA'
    wrapper = shallow(<Accounts {...props} />)

    expect(wrapper.find('.transactions-table-title').text()).toBe('Transactions for PEPITA')
    expect(wrapper.find(TransactionList).length).toBe(1)
  })

  it('should show spinning loader if assets are loading', () => {
    props.aliasAssets.isLoading = true
    wrapper = shallow(<Accounts {...props} />)

    expect(wrapper.find('.loading-container').length).toBe(1)
  })
})
