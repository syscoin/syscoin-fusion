import React from 'react'
import ConsoleLine from 'fw-components/Console/components/console-line'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import moment from 'moment'

Enzyme.configure({ adapter: new Adapter() })

describe('Console - ConsoleLine component tests', () => {
  let wrapper
  let props

  beforeEach(() => {
    props = {
      cmd: 'getinfo',
      error: false,
      time: Date.now(),
      result: {}
    }
    wrapper = shallow(<ConsoleLine {...props} />)
  })

  it('should render correctly', () => {
    expect(wrapper.instance()).toBeInstanceOf(ConsoleLine)
  })

  it('should show log hour in hh:ss:mm format', () => {
    expect(wrapper.find('.console-line-date-container span').text()).toBe(moment(props.time).format('HH:mm:ss'))
  })

  it('should render JSON result in pre tags', () => {
    expect(wrapper.find('pre').length).toBe(1)
  })

  it('should render non JSON result in span tags', () => {
    wrapper = shallow(<ConsoleLine {...props} result='test' />)
    expect(wrapper.find('span').length).toBe(2)
  })

  it('should add error line class if returned value is an error', () => {
    wrapper = shallow(<ConsoleLine {...props} error />)
    expect(wrapper.find('.error-line').length).toBe(1)
  })
})
