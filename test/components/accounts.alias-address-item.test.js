import React from 'react'
import AliasAddressItem from 'fw-components/Accounts/components/alias-address-item'
import Enzyme, { shallow, render, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { spy } from 'sinon'

Enzyme.configure({ adapter: new Adapter() })

describe('Accounts - AliasAddressItem component', () => {
  let props
  let wrapper

  beforeEach(() => {
    props = {
      alias: 'test-alias',
      address: null,
      isLoading: false,
      isSelected: false,
      updateSelectedAlias: spy(),
      getPrivateKey: spy(),
      avatarUrl: '',
      t: string => string
    }
    wrapper = shallow(<AliasAddressItem {...props} />)
  })

  it('should render the component', () => {
    expect(wrapper.find('.alias-box').length).toBe(1)
  })

  it('should fire updateSelectedAlias on click', () => {
    const mockClick = spy()
    wrapper = shallow(<AliasAddressItem {...props} updateSelectedAlias={mockClick} isSelected={false} />)
    wrapper.find('.alias-box').simulate('click')

    expect(mockClick.calledOnce).toBe(true)
  })

  it('should not show get private key icon if not selected', () => {
    wrapper = shallow(<AliasAddressItem {...props} isSelected={false} />)

    expect(wrapper.find('.alias-toolbox').length).toBe(0)
  })

  it('should show get private key icon if selected', () => {
    wrapper = shallow(<AliasAddressItem {...props} isSelected />)

    expect(wrapper.find('.alias-toolbox').length).toBe(1)
  })

  it('should fire getPrivateKey when clicking on key icon', () => {
    const mockClick = spy()
    wrapper = mount(<AliasAddressItem {...props} getPrivateKey={mockClick} isSelected />)
    wrapper.find('div.alias-toolbox i').simulate('click')

    expect(mockClick.calledOnce).toBe(true)
  })

  it('should fire getPrivateKey when clicking on key icon', () => {
    wrapper = mount(<AliasAddressItem {...props} isSelected />)
    wrapper.setState({ isLoading: true })

    expect(wrapper.find('.anticon-spin').length).toBe(1)
  })

  it('should render alias if provided', () => {
    expect(wrapper.find('.alias-name').contains('test-alias')).toBe(true)
  })

  it('should render address if alias is not provided', () => {
    wrapper = shallow(<AliasAddressItem {...props} address='some_address' alias='' />)
    expect(wrapper.find('.alias-name').contains('some_address')).toBe(true)
  })

  it('should display custom avatar if avatarUrl is provided', () => {
    wrapper = shallow(<AliasAddressItem {...props} avatarUrl='some_url' />)
    expect(wrapper.find('.alias-img').prop('src')).toBe('some_url')
  })

  it('should display default avatar if avatarUrl is not provided', () => {
    wrapper = shallow(<AliasAddressItem {...props} />)
    expect(wrapper.find('.alias-img').prop('src')).toBe(`https://ui-avatars.com/api/?name=${props.alias}&length=3&font-size=0.33&background=7FB2EC&color=FFFFFF`)
  })

  it('should add loading and expanded classes to parent div when isLoading or isSelected are true', () => {
    wrapper = shallow(<AliasAddressItem {...props} isSelected isLoading />)

    expect(wrapper.prop('className')).toContain('expanded')
    expect(wrapper.prop('className')).toContain('loading')
  })
})