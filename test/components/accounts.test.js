import React from 'react'
import Accounts from 'fw-components/Accounts'
import Enzyme, { shallow, render } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { spy } from 'sinon'

Enzyme.configure({ adapter: new Adapter() })

describe('Accounts component tests', () => {
    let wrapper
    let props

    beforeEach(() => {
        props = {
            backgroundLogo: '',
            balance: 123,
            aliases: [],
            transactions: {
                data: [],
                error: false,
                isLoading: false
            },
            selectedAlias: '',
            aliasAssets: {
                data: [],
                error: false,
                isLoading: false
            },
            updateSelectedAlias: spy(),
            selectAsset: spy(),
            headBlock: 9999,
            currentBlock: 500,
            syncPercentage: parseInt((500 / 9999) * 100, 10)
        }
        wrapper = shallow(<Accounts {...props} />)
    })

    it('should render successfully', () => {
        expect(wrapper.find('.accounts-container').length).toEqual(1)
    })

    it('should render coin logo if there is no selectedAlias/error', () => {
        expect(wrapper.find('img.sys-logo-bg').length).toEqual(1)
    })

    it('should not render coin logo if an alias is selected', () => {
        props.selectedAlias = 'test'
        wrapper = shallow(<Accounts {...props} />)

        expect(wrapper.find('img.sys-logo-bg').length).toEqual(0)
    })

    it('should render coin logo if an error happens while selecting alias', () => {
        props.selectedAlias = 'test'
        props.aliasAssets.error = true
        wrapper = shallow(<Accounts {...props} />)

        expect(wrapper.find('img.sys-logo-bg').length).toEqual(1)
    })

    it('should render loader if syncPercentage is not 100%', () => {
        wrapper = render(<Accounts {...props} />)
        expect(wrapper.find('div.sync-loader').length).toEqual(1)
    })

    it('should not render loader if syncPercentage is 100%', () => {
        props.currentBlock = 9999
        props.syncPercentage = parseInt((props.currentBlock / props.headBlock) * 100, 10)
        wrapper = render(<Accounts {...props} />)

        expect(wrapper.find('div.sync-loader').length).toEqual(0)
    })
})