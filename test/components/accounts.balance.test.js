import React from 'react'
import Balance from 'fw-components/Accounts/components/balance'
import Enzyme, { shallow, render } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { spy } from 'sinon'

Enzyme.configure({ adapter: new Adapter() })

describe('Accounts - Balance component', () => {
  let props
  let wrapper

  beforeEach(() => {
    props = {
      currentBalance: 100,
      t: string => string
    }
    wrapper = shallow(<Balance {...props} />)
  })

  it('should render correctly', () => {
    expect(wrapper.find('.balance-container').length).toBe(1)
  })
  
  it('should render correct balance', () => {
    expect(wrapper.find('.your-balance-amount').contains(props.currentBalance)).toBeTruthy()
  })

})