// @flow
import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
import { Row, Col, Input } from 'antd'
import {
  getAssetInfo
} from '../../../utils/sys-helpers'

const Searcher = Input.Search

type Props = {
  currentAddress: string,
  currentBalance: string,
  currentAliases: Array<any>
};
type State = {
  selectedAlias: string,
  checkAliasResult: any
};

export default class Accounts extends Component<Props, State> {
  props: Props;

  constructor(props) {
    super(props)

    this.state = {
      selectedAlias: '',
      checkAliasResult: null
    }
  }

  generateAliasesBoxes() {
    return this.props.currentAliases.filter(i => i.alias).map((i, key) => (
      <Row className='alias-box' key={key} onClick={() => this.updateSelectedAlias(i.alias)}>
        <Col xs={4} offset={7}>
          <img className='alias-img' src={`https://api.adorable.io/avatars/125/${i.address}@ert.io`} alt='Alias' />
        </Col>
        <Col xs={6} className='text-col'>
          <div className='alias-name'>{i.alias || 'Unnamed alias'}</div>
          <div className='alias-balance'>{i.balance} SYS</div>
          <div className='alias-address'>{i.address}</div>
        </Col>
      </Row>
    ))
  }

  checkAssetId(val: string) {
    getAssetInfo({
      assetId: val,
      aliasName: this.state.selectedAlias
    }, (err, info) => {
      if (err) {
        this.setState({
          checkAliasResult: 'No asset found with that ID'
        })
        return false
      }

      this.setState({
        checkAliasResult: info
      })
    })
  }

  updateSelectedAlias(alias: string) {
    this.setState({
      selectedAlias: alias
    })
  }

  renderAliasResult(info: Object) {
    const result = []
    const keys = Object.keys(info)

    keys.forEach((i, key) => result.push(
      <p key={key} style={{fontSize: 15}}>{i}: {info[i]}</p>
    ))

    return result
  }

  generateAssetSearcher() {
    return (
      <Row>
        <Col xs={6} offset={9}>
          <div style={{marginBottom: 20}}>
            <h3 style={{color: 'white'}}>Asset checker</h3>
            <p>{this.state.selectedAlias.length ? `Selected alias: ${this.state.selectedAlias}` : 'No alias selected.'}</p>
            {this.state.selectedAlias.length ? (
              <Searcher
                enterButton='Search'
                name='assetUid'
                onSearch={this.checkAssetId.bind(this)}
                onChange={() => this.setState({checkAliasResult: null})}
                placeholder='Insert your Asset ID'
              />
            ) : null}

            {this.state.checkAliasResult ? this.renderAliasResult(this.state.checkAliasResult) : null}
          </div>
        </Col>
      </Row>
    )
  }

  render() {
    return (
      <Row>
        <Col
          xs={24}
          style={{
            textAlign: 'center'
          }}
        >
          <p>This is your current address:</p>
          <p>{this.props.currentAddress}</p>
          <p>Current balance:</p>
          <p>{this.props.currentBalance}</p>
          <p>Your aliases:</p>
          {this.generateAliasesBoxes()}
          {this.props.currentAliases.length ? this.generateAssetSearcher() : null}
        </Col>
      </Row>
    )
  }
}
