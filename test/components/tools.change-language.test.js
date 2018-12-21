import React from 'react'
import ChangeLanguage from 'fw-components/Tools/components/change-language'
import Enzyme, { shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { spy } from 'sinon'
import { get } from 'http';

import { Select } from 'antd'

const { Option } = Select

Enzyme.configure({ adapter: new Adapter() })

describe('Tools - Change language component', () => {
  let wrapper
  let props

  beforeEach(() => {
    props = {
      changeLanguage: spy(),
      currentLanguage: 'en_US',
      t: string => string
    }
    wrapper = shallow(<ChangeLanguage {...props} />)
  })

  it('should check if current language is shown correctly', () => {
    expect(wrapper.find('span').contains('en_US')).toBeTruthy()
  })

  it('should fire changeLanguage when dropdown option is selected', () => {
    const changeLangMock = spy()
    wrapper = shallow(<ChangeLanguage {...props} changeLanguage={changeLangMock} />)

    wrapper.find('.change-language-dropdown').prop('onChange')('es_ES')

    expect(changeLangMock.called).toBeTruthy()
    expect(changeLangMock.getCall(0).args).toEqual(['es_ES'])
  })
})
