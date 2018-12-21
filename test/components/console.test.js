import React from 'react'
import Console from 'fw-components/Console'
import ConsoleLine from 'fw-components/Console/components/console-line'
import Enzyme, { shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { spy } from 'sinon'

Enzyme.configure({ adapter: new Adapter() })

describe('Console component tests', () => {
  let wrapper
  let props

  beforeEach(() => {
    props = {
      handleConsoleSubmit: spy(),
      data: [],
      history: [],
      t: string => string
    }
    wrapper = shallow(<Console {...props} />)
  })

  it('should render correctly', () => {
    expect(wrapper.instance()).toBeInstanceOf(Console)
  })

  /*it('should parse params correctly with parseParam method', () => {
    expect(wrapper.instance().parseParam.parseParam('123')).toBe(123)
    expect(wrapper.instance().parseParam.parseParam('qwe')).toBe('qwe')
    expect(wrapper.instance().parseParam.parseParam('1qwe')).toBe('1qwe')
    expect(wrapper.instance().parseParam.parseParam('{"test": "test"}')).toEqual({
      test: 'test'
    })
    expect(wrapper.instance().parseParam.parseParam('false')).toBe(false)
    expect(wrapper.instance().parseParam.parseParam('true')).toBe(true)
  })*/

  it('should fire handleConsoleSubmit when pressing enter', () => {
    const sendMock = spy()
    wrapper = mount(<Console {...props} handleConsoleSubmit={sendMock} />)

    wrapper.find('input').simulate('change', {target: {value: 'getinfo', name: 'cmd'}})
    expect(wrapper.state().cmd).toBe('getinfo')

    wrapper.find('input').simulate('keydown', { keyCode: 13 })

    expect(sendMock.called).toBe(true)
    expect(sendMock.getCall(0).args[0]).toBe('getinfo')
  })

  it('should render instances of ConsoleLine if there is any data', () => {
    const data = [{
      cmd: '',
      result: 'Welcome to Fusion Wallet console!',
      error: false,
      time: Date.now()
    }]
    wrapper = mount(<Console {...props} data={data} />)

    expect(wrapper.find(ConsoleLine).length).toBe(1)
  })

})
