# Fusion Wallet

### Syscoin White Label asset wallet

The Fusion Wallet project provides Syscoin token creators the ability to offer a customized wallet for their specific token(s). Syscoin token project developers can also offer wallet skins to users or branded wallets.

Syscoin Fusion will natively, in it's white label format, allow the user to interact with Syscoin and ALL Syscoin tokens in a wallet. 

Moderate customization is achieved by changing a single file fusion.conf. This can include: Splash screen, Locking the wallet to a single token or an array of tokens, wallet colours, text colours and background logo. Layout and additional customization is possible through CSS modifications.

Project creators can also create and distribute tokens directly in the wallet. 

Fusion is an HTML GUI wallet built in Electron-React-Boilerplate https://github.com/electron-react-boilerplate/electron-react-boilerplate. 


## Instructions

- Clone this repository.
- Run `npm install`.
- Copy syscoin dependencies (syscoind, syscoin-cli from https://github.com/syscoin/syscoin/releases and your OS bins from https://github.com/syscoin/syscoin/tree/master/src/bin) into `extra` folder. If you skip this step, you will receive an error during wallet initialization.

### To run in dev mode

- Run `npm run dev`.

### To build binaries

- Run `npm run package` to build the version for the OS you're currently running. Run `npm run package-all` if you want to attempt building binaries for all platforms.

### Development Team
This project is funded by a Syscoin community governance proposals through the Syscoin Development and Marketing Team (SDMT). Lead developer is Argenis Villasmil with contributions from Andres Cortes,Keyare and the Syscoin Community.
