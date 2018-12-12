import React from 'react'
import SyncLoader from 'fw-components/Accounts/components/sync-loader'
import Enzyme, { shallow, render } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { spy } from 'sinon'

Enzyme.configure({ adapter: new Adapter() })

describe('Accounts - SyncLoader component', () => {
  let props
  let wrapper

  beforeEach(() => {
    props = {
      syncPercentage: 100,
      currentBlock: 100,
      headBlock: 100
    }
    wrapper = shallow(<SyncLoader {...props} />)
  })

  it('should render correctly', () => {
    expect(wrapper.find('.sync-loader').length).toBe(1)
  })

})