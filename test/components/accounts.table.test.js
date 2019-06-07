import React from 'react'
import Table from 'fw-components/Accounts/components/table'
import Enzyme, { shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { spy } from 'sinon'

Enzyme.configure({ adapter: new Adapter() })

describe('Accounts - Table component', () => {
  let props
  let wrapper

  beforeEach(() => {
    props = {
      data: [],
      error: false,
      isLoading: false,
      columns: [],
      rowKey: 'txid',
      pageSize: 10,
      t: string => string
    }
    wrapper = shallow(<Table {...props} />)
  })

  it('should render correctly', () => {
    expect(wrapper.instance()).toBeInstanceOf(Table)
  })

  it('should render one column', () => {
    const column = [{
      title: 'test',
      key: 'txid',
      dataIndex: 'txid',
      render: text => text
    }]
    const data = [{ txid: '123123123' }]
    wrapper = mount(<Table {...props} columns={column} data={data} />)

    expect(wrapper.find('thead tr th').length).toBe(1)
    expect(wrapper.find('thead tr th').text()).toBe('test')
  })

  it('should render a number of rows equal to pageSize', () => {
    const column = [{
      title: 'test',
      key: 'txid',
      dataIndex: 'txid',
      render: text => text
    }]
    const data = []

    for (let i = 0 ; i < 50 ; i++) {
      data.push({ txid: i })
    }
    wrapper = mount(<Table {...props} columns={column} data={data} />)

    expect(wrapper.find('tbody tr').length).toBe(10)

    wrapper = mount(<Table {...props} columns={column} data={data} pageSize={30} />)

    expect(wrapper.find('tbody tr').length).toBe(30)
  })
})
