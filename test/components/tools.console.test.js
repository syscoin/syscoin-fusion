import React from 'react'
import Console from 'fw-components/Tools/components/console'
import Enzyme, { shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { spy } from 'sinon'

Enzyme.configure({ adapter: new Adapter() })

describe('Tools - Console component', () => {
  let wrapper
  let props

  beforeEach(() => {
    props = {
      toggleConsole: spy()
    }
    wrapper = shallow(<Console {...props} />)
  })

  it('should fire toggleConsole when button is clicked', () => {
    const toggleMock = spy()
    wrapper = shallow(<Console {...props} toggleConsole={toggleMock} />)

    wrapper.find('.toggle-console-btn').simulate('click')
    expect(toggleMock.calledOnce).toBe(true)
  })
})
