import React from 'react'
import Accounts from 'fw-components/Accounts'
import SyncLoader from 'fw-components/Accounts/components/sync-loader'
import Dashboard from 'fw-components/Accounts/components/dashboard'
import AssetDetails from 'fw-components/Accounts/components/asset-details'
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
      goToSysForm: spy(),
      t: string => string
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

  it('should render an AssetDetails instance', () => {
    expect(wrapper.find(AssetDetails).length).toEqual(1)
  })

  it('should show spinning loader if assets are loading', () => {
    props.aliasAssets.isLoading = true
    wrapper = shallow(<Accounts {...props} />)

    expect(wrapper.find('.loading-container').length).toBe(1)
  })
})
