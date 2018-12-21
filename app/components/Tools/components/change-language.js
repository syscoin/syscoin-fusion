// @flow
import React, { Component } from 'react'
import { Select } from 'antd'

const { Option } = Select

type Props = {
  currentLanguage: string,
  changeLanguage: Function,
  t: Function
};

export default (props: Props) => (
  <div className='change-language-container'>
    <h3 className='change-language-title'>{props.t('tools.change_language_title')}</h3>
    <p>{props.t('tools.change_language_current_language')}: <span>{props.currentLanguage}</span></p>
    <Select
      onChange={props.changeLanguage}
      placeholder={props.t('misc.language')}
      className='change-language-dropdown'
    >
        <Option value='en_US' key='en_US'>
          {props.t('misc.english')}
        </Option>
        <Option value='es_ES' key='es_ES'>
          {props.t('misc.spanish')}
        </Option>
    </Select>
  </div>
)
