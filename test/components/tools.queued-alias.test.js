import React from 'react'
import QueuedAlias from 'fw-components/Tools/components/queued-alias'
import { Tag } from 'antd'
import Enzyme, { shallow, mount, render } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { spy } from 'sinon'

Enzyme.configure({ adapter: new Adapter() })

describe('Tools - QueuedAlias component', () => {
  let wrapper
  let props

  beforeEach(() => {
    props = {
      error: null,
      aliasName: 'test',
      t: string => string
    }
    wrapper = mount(<QueuedAlias {...props} />)
  })

  it('should render correctly', () => {
    expect(wrapper.find('div').length).toBe(1)
    expect(wrapper.find('div').text()).toBe(props.aliasName)
  })

})
