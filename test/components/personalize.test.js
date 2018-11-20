import React from 'react'
import Personalize from 'fw-components/Personalize'
import EditAlias from 'fw-components/Personalize/components/edit-alias'
import Enzyme, { shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { spy } from 'sinon'

Enzyme.configure({ adapter: new Adapter() })

describe('Personalize component tests', () => {
  let wrapper
  let props

  beforeEach(() => {
    props = {
      aliasInfo: spy(),
      currentAliases: [],
      editAlias: spy()
    }
    wrapper = shallow(<Personalize {...props} />)
  })

  it('should render correctly', () => {
    expect(wrapper.instance()).toBeInstanceOf(Personalize)
  })

  it('should render an instance of EditAlias', () => {
    expect(wrapper.find(EditAlias).length).toBe(1)
  })

  

})
