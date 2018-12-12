import React from 'react'
import Home from 'fw-components/Accounts/components/home'
import Enzyme, { shallow, render } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { spy } from 'sinon'

Enzyme.configure({ adapter: new Adapter() })

describe('Accounts - Home component', () => {
  let props
  let wrapper

  beforeEach(() => {
    props = {
      onClick: spy(),
      disabled: false,
      className: ''
    }
    wrapper = shallow(<Home {...props} />)
  })

  it('should render correctly', () => {
    expect(wrapper.find('.home-icon').length).toBe(1)
  })

  it('should fire onClick when clicked', () => {
    const mockClick = spy()
    wrapper = shallow(<Home {...props} onClick={mockClick} />)
    wrapper.find('.home-icon').simulate('click')

    expect(mockClick.calledOnce).toBe(true)
  })

  it('should append disabled class when disabled prop is present', () => {
    wrapper = shallow(<Home {...props} disabled/>)
    expect(wrapper.find('.disabled').length).toBe(1)
  })

})