import React from 'react'
import SendButton from 'fw-components/Accounts/components/send-button'
import Enzyme, { shallow, render } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { spy } from 'sinon'

Enzyme.configure({ adapter: new Adapter() })

describe('Accounts - SendButton component', () => {
  let props
  let wrapper

  beforeEach(() => {
    props = {
      className: 'test-class'
    }
    wrapper = shallow(<SendButton {...props} />)
  })

  it('should render correctly', () => {
    expect(wrapper.find('.send-button').length).toBe(1)
  })

  it('should append class names using className prop', () => {
    expect(wrapper.prop('className')).toBe('send-button test-class')
  })
})