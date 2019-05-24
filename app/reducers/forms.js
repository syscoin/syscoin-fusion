// @flow
import {
  CHANGE_FORM_TAB,
  EDIT_SEND_ASSET_FORM,
  EDIT_SEND_SYS_FORM,
  SEND_ASSET_IS_LOADING,
  SEND_ASSET_RECEIVE,
  SEND_ASSET_ERROR,
  SEND_SYS_IS_LOADING,
  SEND_SYS_RECEIVE,
  SEND_SYS_ERROR,
  GET_ASSETS_FROM_ALIAS_IS_LOADING,
  GET_ASSETS_FROM_ALIAS_RECEIVE,
  GET_ASSETS_FROM_ALIAS_ERROR,
  CHANGE_ASSET_TOOLS_ACTION,
  CHANGE_ASSET_TOOLS_UPDATE_GUID,
  CHANGE_ASSET_TOOLS_FORM_FIELD
} from 'fw-types/forms'

type actionType = {
  +type: string,
  payload ?: any
};

type StateType = {
  sendTab: {
    activeTab: string
  },
  toolsTab: {
    activeTab: string,
    assets: {
      action: string,
      updateGuid: number,
      form: {
        address: string,
        symbol: string,
        publicValue: string,
        contract: string,
        precision: number,
        supply: number,
        maxSupply: number,
        updateFlags: number,
        witness: string
      }
    }
  },
  sendAsset: {
    data: {
      from: string,
      asset: string,
      toAddress: string,
      amount: string
    },
    isLoading: boolean,
    error: boolean,
    states: {
      assetsFromAlias: {
        isLoading: boolean,
        error: boolean,
        data: Array<Object>
      }
    }
  },
  sendSys: {
    data: {
      comment: string,
      address: string,
      amount: string
    },
    isLoading: boolean,
    error: boolean
  }
};

export const initialState = {
  sendTab: {
    activeTab: 'asset'
  },
  toolsTab: {
    activeTab: '',
    assets: {
      action: '',
      updateGuid: 0,
      form: {
        address: '',
        symbol: '',
        publicValue: '',
        contract: '',
        precision: 0,
        supply: 0,
        maxSupply: 0,
        updateFlags: 0,
        witness: ''
      }
    }
  },
  sendAsset: {
    data: {
      from: '',
      asset: '',
      toAddress: '',
      amount: ''
    },
    isLoading: false,
    error: false,
    states: {
      assetsFromAlias: {
        isLoading: false,
        error: false,
        data: []
      }
    }
  },
  sendSys: {
    data: {
      comment: '',
      address: '',
      amount: ''
    },
    isLoading: false,
    error: false
  }
}

export default function forms(state: StateType = initialState, action: actionType) {
  switch (action.type) {
    case EDIT_SEND_ASSET_FORM:
      return {
        ...state,
        sendAsset: {
          ...state.sendAsset,
          data: {
            ...action.payload
          }
        }
      }
    case EDIT_SEND_SYS_FORM:
      return {
        ...state,
        sendSys: {
          ...state.sendSys,
          data: {
            ...action.payload
          }
        }
      }
    case SEND_ASSET_IS_LOADING:
      return {
        ...state,
        sendAsset: {
          ...state.sendAsset,
          isLoading: true,
          error: false
        }
      }
    case SEND_ASSET_RECEIVE:
      return {
        ...state,
        sendAsset: {
          ...state.sendAsset,
          data: {
            ...initialState.sendAsset.data
          },
          isLoading: false,
          error: false
        }
      }
    case SEND_ASSET_ERROR:
      return {
        ...state,
        sendAsset: {
          ...state.sendAsset,
          isLoading: false,
          error: true
        }
      }
    case SEND_SYS_IS_LOADING:
      return {
        ...state,
        sendSys: {
          ...state.sendSys,
          isLoading: true,
          error: false
        }
      }
    case SEND_SYS_RECEIVE:
      return {
        ...state,
        sendSys: {
          data: {
            ...initialState.sendSys.data
          },
          isLoading: false,
          error: false
        }
      }
    case SEND_SYS_ERROR:
      return {
        ...state,
        sendSys: {
          ...state.sendSys,
          isLoading: false,
          error: true
        }
      }
    case GET_ASSETS_FROM_ALIAS_IS_LOADING:
      return {
        ...state,
        sendAsset: {
          ...state.sendAsset,
          states: {
            ...state.sendAsset.states,
            assetsFromAlias: {
              isLoading: true,
              error: false,
              data: []
            }
          }
        }
      }
      case GET_ASSETS_FROM_ALIAS_RECEIVE:
        return {
          ...state,
          sendAsset: {
            ...state.sendAsset,
            states: {
              ...state.sendAsset.states,
              assetsFromAlias: {
                isLoading: false,
                error: false,
                data: action.payload
              }
            }
          }
        }
        case GET_ASSETS_FROM_ALIAS_ERROR:
          return {
            ...state,
            sendAsset: {
              ...state.sendAsset,
              states: {
                ...state.sendAsset.states,
                assetsFromAlias: {
                  isLoading: false,
                  error: true,
                  data: []
                }
              }
            }
          }
        case CHANGE_FORM_TAB:
          return {
            ...state,
            [action.payload.tab]: {
              ...state[action.payload.tab],
              activeTab: action.payload.val
            }
          }
        case CHANGE_ASSET_TOOLS_ACTION:
          return {
            ...state,
            toolsTab: {
              ...state.toolsTab,
              assets: {
                ...state.toolsTab.assets,
                action: action.payload
              }
            }
          }
        case CHANGE_ASSET_TOOLS_UPDATE_GUID:
            return {
              ...state,
              toolsTab: {
                ...state.toolsTab,
                assets: {
                  ...state.toolsTab.assets,
                  updateGuid: action.payload
                }
              }
            }
        case CHANGE_ASSET_TOOLS_FORM_FIELD:
          return {
            ...state,
            toolsTab: {
              ...state.toolsTab,
              assets: {
                ...state.toolsTab.assets,
                form: {
                  ...state.toolsTab.assets.form,
                  [action.payload.field]: action.payload.value
                }
              }
            }
          }
    default:
      return state
  }
}
