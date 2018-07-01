// @flow

type startUpType = {
  type: string,
  +walletInfo?: Object
};

export const SYSCOINCONF_ERROR = 'SYSCOINCONF_ERROR';
export const syscoinConfErrorAction = (): startUpType => ({
  type: SYSCOINCONF_ERROR
});

export const RELOAD_CONF = 'RELOAD_CONF';
export const reloadConfAction = (): startUpType => ({
  type: RELOAD_CONF
});

export const SUCCESS_START = 'SUCCESS_START';
export const successStartAction = (info: Object): startUpType => ({
  type: SUCCESS_START,
  walletInfo: info
});

export const confError = () => (dispatch: (action: startUpType) => null) => {
  dispatch(syscoinConfErrorAction());
};

export const reloadSysConf = () => (
  dispatch: (action: startUpType) => null
) => {
  dispatch(reloadConfAction());
};

export const successStart = (info: Object) => (
  dispatch: (action: startUpType) => null
) => {
  dispatch(successStartAction(info));
};
