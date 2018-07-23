// @flow

type startUpType = {
    type: string,
    +syscoinDataDir?: string
  };
  
  export const SYSCOINCONF_DATADIR = 'SYSCOINCONF_DATADIR'
  export const changeSyscoinDataDirAction = (path: string): startUpType => ({
    type: SYSCOINCONF_DATADIR,
    syscoinDataDir: path
  })
  
  export const changeSyscoinDataDir = (path: string) => (dispatch: (action: startUpType) => null) => {
    dispatch(changeSyscoinDataDirAction(path))
  }