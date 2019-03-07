import React from 'react'
import Pagination from 'fw-components/Accounts/components/pagination'
import Enzyme, { shallow, render } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { spy } from 'sinon'

Enzyme.configure({ adapter: new Adapter() })

describe('Accounts - Pagination component', () => {
  let props
  let wrapper

  beforeEach(() => {
    props = {
      prevDisabled: false,
      nextDisabled: false,
      onChange: spy(),
      showPage: true,
      currentPage: 0,
      t: string => string
    }
    wrapper = shallow(<Pagination {...props} />)
  })

  it('should render correctly', () => {
    expect(wrapper.find('.fw-table-pagination-container').length).toBe(1)
  })

  it('should now show page if showPage is not present', () => {
    wrapper = shallow(<Pagination {...props} showPage={false} />)
    expect(wrapper.find('.fw-table-pagination-page').length).toBe(0)
  })

  it('should disable prev button when prevDisabled is present', () => {
    wrapper = shallow(<Pagination {...props} prevDisabled />)
    expect(wrapper.find('.fw-table-pagination-prev').prop('className')).toBe('fw-table-pagination-prev disabled')
  })

  it('should disable next button when nextDisabled is present', () => {
    wrapper = shallow(<Pagination {...props} nextDisabled />)
    expect(wrapper.find('.fw-table-pagination-next').prop('className')).toBe('fw-table-pagination-next disabled')
  })

  it('should fire onChange when clicking on prev or next', () => {
    const onChangeMock = spy()
    wrapper = shallow(<Pagination {...props} onChange={onChangeMock} />)
    wrapper.find('.fw-table-pagination-next').simulate('click')
    wrapper.find('.fw-table-pagination-prev').simulate('click')

    expect(onChangeMock.calledTwice).toBe(true)
    expect(onChangeMock.getCall(0).args[0]).toBe('next')
    expect(onChangeMock.getCall(1).args[0]).toBe('prev')
  })

})