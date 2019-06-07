import React from 'react'
import AliasContainer from 'fw-components/Accounts/components/alias-container'
import AliasAddressItem from 'fw-components/Accounts/components/alias-address-item'
import SyncLoader from 'fw-components/Accounts/components/sync-loader'
import Enzyme, { shallow, render } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { spy } from 'sinon'

Enzyme.configure({ adapter: new Adapter() })

describe('Accounts - AliasContainer component tests', () => {
  let wrapper
  let props

  beforeEach(() => {
    props = {
      t: string => string,
      aliases: [],
      aliasAssets: {
        data: [],
        isLoading: false,
        error: false
      },
      transactions: {
        data: [],
        isLoading: false,
        error: false
      },
      currentBalance: 0,
      goToHome: spy(),
      headBlock: 9999,
      currentBlock: 500,
      syncPercentage: parseInt((500 / 9999) * 100, 10),
      updateSelectedAlias: spy(),
      claimInterest: spy(),
      selectedAlias: '',
      getPrivateKey: spy()
    }
    wrapper = shallow(<AliasContainer {...props} />)
  })

  it('should render an instance of AliasContainer', () => {
    expect(wrapper.instance()).toBeInstanceOf(AliasContainer)
  })

  it('should render AliasAddressItem when aliases is populated', () => {
    props.aliases = [{ "_id": "777845ced7b6022b-camelio03", "txid": "0db438832793ff78d53853fbab58c49462ed105b26e9a20c774a21b502830351", "time": 1546990324, "asset": "777845ced7b6022b", "symbol": "CPS", "interest_rate": 0.25, "height": 347160, "sender": "coinpaymentsnet", "sender_balance": "2050168540.97540739", "receiver": "camelio03", "receiver_balance": "33130.00000000", "memo": "", "confirmed": true, "category": "", "amount": "9000.00000000" }]
    wrapper = shallow(<AliasContainer {...props} />)
    expect(wrapper.find(AliasAddressItem).length).toBe(1)
  })

  it('should render loader if syncPercentage is not 100%', () => {
    expect(wrapper.find(SyncLoader).length).toEqual(1)
  })

  it('should not render loader if syncPercentage is 100%', () => {
    props.currentBlock = 9999
    props.syncPercentage = parseInt((props.currentBlock / props.headBlock) * 100, 10)
    wrapper = shallow(<AliasContainer {...props} />)

    expect(wrapper.find(SyncLoader).length).toEqual(0)
  })

})
