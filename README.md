# Fusion Wallet

### Syscoin White Label asset wallet

The Fusion Wallet project provides Syscoin token creators the ability to offer a customized wallet for their specific token(s). Syscoin token project developers can also offer wallet skins to users or branded wallets.

Syscoin Fusion will natively, in it's white label format, allow the user to interact with Syscoin and ALL Syscoin tokens in a wallet. 

Moderate customization is achieved by changing a single file fusion.conf. This can include: Splash screen, Locking the wallet to a single token or an array of tokens, wallet colours, text colours and background logo. Layout and additional customization is possible through CSS modifications.

Project creators can also create and distribute tokens directly in the wallet. 

Fusion is an HTML GUI wallet built in Electron-React-Boilerplate https://github.com/electron-react-boilerplate/electron-react-boilerplate.   


## Instructions

- Clone this repository.
- Run `npm install`
- Copy syscoin dependencies (syscoin* files from https://github.com/syscoin/syscoin/releases and your OS bins from https://github.com/syscoin/syscoin/tree/master/src/bin) into `extra` folder. If you skip this step, you will receive an error during wallet initialization. You should copy `bin` folder into the repo root directory as well.

### To run in dev mode

- Run `npm run dev`

### To build binaries

- Run `npm run package` to build the version for the OS you're currently running. Run `npm run package-all` if you want to attempt building binaries for all platforms.

### Development Team
This project is funded by a Syscoin community governance proposals through the Syscoin Development and Marketing Team (SDMT). Lead developer is Argenis Villasmil with contributions from Andres Cortes, Keyare and the Syscoin Community.  



# Upgrading from Syscoin 3

_If you have already upgraded to Syscoin 4.0.0 successfully, you only need to install the latest version of [Syscoin 4.x](https://github.com/syscoin/syscoin/releases) and skip these steps._



### This upgrade procedure has TWO parts:

**1.** You will DUMP your existing Syscoin 3.x wallet keys from Blockmarket or Syscoin QT 3.x into a text file in your public folder.   
  
**2.** You will then need to IMPORT the newly created file into a Syscoin 4.x wallet. 
>  
> **WARNING:** If you have a DATA FOLDER called `Syscoin` from a previous installation of **Syscoin 2.x**, you will need to rename it `Syscoin2` or you will encounter errors attempting to read incompatible data.  
>  
>

<details>
<summary><B>GETTING STARTED (click to expand):</B><br></summary>  
   
  
  <br>

TO START, open either Blockmarket or Syscoin Qt 3.x and unlock the wallet. You do NOT need to synchronise to the Syscoin 3 chain. Syscoin 4.x will create a DATA FOLDER called `Syscoin` if you do not have one.   
  
<details>
<summary>Find your DATA FOLDER</summary>

>
The DATA FOLDER is found here:
> * MAC: `/Users/[USERNAME]/Library/Application Support/Syscoin`  
> Note: the Library directory is hidden by default, you can quickly access this directory by pressing: CMD + Shift + G in Finder then typing:  `~/Library/Application Support/Syscoin`
>
> * WINDOWS: `C:\Users[USERNAME]\AppData\Roaming\Syscoin`
>
> * LINUX: `/home/[USERNAME]/.Syscoin` or `~/.syscoin/` 
>  You may need to do a "ls -a" to see directories that start with a dot.
>
</details>

<details>
<summary>Getting your system ready</summary>

>
If you have already installed Syscoin Qt 4, Spark 4 or Fusion 4, you can skip these steps.
> * Rename any existing `Syscoin` DATA FOLDER from Syscoin 2.x to `Syscoin2`.
> * If you do not have a `Syscoin` DATA FOLDER, Syscoin 4 will create one for you when run.
> * Syscoin 3 uses a DATA FOLDER called `SyscoinCore` which should be one level higher in your folders list - _leave this folder alone_ or you will not be able to run your current Syscoin 3.x wallet!


</details>

<details>
<summary>Unlocking your wallet</summary>

> * In Syscoin Qt 3.x go to Console: Tools->Debug Console and type:  
> `walletpassphrase “mypasswordorpassphrase” 180`  
> And press ENTER (180 = this the amount of time to remain open in seconds)
>
> * In Blockmarket: Click the Lock icon in the upper right menu.  
> Enter your password/passphrase in the form field and press the Unlock button
>
</details>

</details>

---
### 1. DUMPING YOUR WALLET TO A FILE (choose your existing wallet):

<details>
<summary>Dumping your wallet from Blockmarket</summary>

>
> * Unlock your wallet
>
> * Go to Wallet and select ‘Dump Wallet’ (Top left) and enter path to save the file:
>
> On WINDOWS type: 
> `C:\Users\Public\sys3dump.bmwalletdump`
> And press SAVE
>
> On MAC type:
> `/Users/[USERNAME]/Public/sys3dump.bmwalletdump`
> And press SAVE 

* Once complete, you are done Step 1. Please move on to CHECK YOUR WORK
</details>



<details>
<summary>Dumping your wallet from Syscoin Qt 3.x</summary>

>
> * Unlock your wallet.
>
> * You may already be in the Console. If you are not, then open the console: Go to Tools->Debug Console
>
> On WINDOWS type:
> `dumpwallet "C:\Users\Public\sys3dump.bmwalletdump"`
> And press ENTER
>
> On MAC type: 
> `dumpwallet "/Users/[USERNAME]/Public/sys3dump.bmwalletdump"`
> And press ENTER
> * On some versions of QT you will get ‘null’ this means it has worked.
* Once complete, you are done Step 1. Please move on to CHECK YOUR WORK
</details>

<details>
<summary>CHECK YOUR WORK</summary>

>
Navigate to where you saved your `sys3dump.bmwalletdump` file.
>
> On WINDOWS, navigate to:
> `C:\Users\Public`
> You should see the `sys3dump.bmwalletdump` file.
>
> On MAC, navigate to
> `/Users/[USERNAME]/Public/`
> You should see the `sys3dump.bmwalletdump` file.
>
* If you see the `sys3dump.bmwalletdump` file, you have completed this step and may move on to Step 2: IMPORTING YOUR DUMP FILE.
</details>

---

### 2. IMPORTING YOUR DUMP FILE (choose your upgrade wallet):
<details> <summary> Importing into Syscoin Qt 4.x </summary>

>
Install and Run the latest version of [Syscoin 4.x](https://github.com/syscoin/syscoin/releases)
>
> * Allow it to fully sync.
>
> * Open the Console, Go to Window->Console
>
>On WINDOWS type:
>`importwallet "C:\Users\Public\sys3dump.bmwalletdump"`
>
>On MAC type:
>`importwallet "/Users/xxxxx/Public/sys3dump.bmwalletdump"`
>
Add press ENTER
>
> * This import will take a while (can be 10 minutes or so)and you will see ‘null’ in the console when finished.
>
* You can now move to FINISHING UP!
</details>

<details> <summary> Importing into Spark </summary>

>
If you have any existing syscoin.conf in your DATA FOLDER, rename it or remove it. Spark will write a new configuration file. The new configuration file is compatible with Syscoin-QT.
>
> * Install and Run the latest version of [Spark](https://github.com/blockchainfoundryinc/syscoin-spark-wallet/releases)
>
> * Allow it to fully sync.
> 
> * Go to Wallet->Import Wallet and navigate to the `sys3dump.bmwalletdump` file you created in Step 1.
>
> On WINDOWS, navigate to:
> `C:\Users\Public\sys3dump.bmwalletdump`
 >And press ENTER
>
> On MAC, navigate to:
> `/Users/xxxxx/Public/sys3dump.bmwalletdump"`
> And press ENTER
>
> * This import will take a while (can be 10 minutes or so)and you will see ‘null’ in the console when finished.
> 
* You can now move to FINISHING UP!
</details>
<details> <summary> Importing into Fusion </summary>

>
Install and Run the latest version of [Fusion](https://github.com/syscoin/Syscoin-Fusion/releases)
>
> * Allow it to fully sync.
> 
> * Go to Tools->Wallet Tools->Import Wallet and navigate to the `sys3dump.bmwalletdump` file you created in Step 1.
>
> On WINDOWS, navigate to:
> `C:\Users\Public\sys3dump.bmwalletdump`
> And press ENTER
>
> On MAC, navigate to:
> `/Users/xxxxx/Public/sys3dump.bmwalletdump"`
> Add press ENTER
>
> * This import will take a while (can be 10 minutes or so)and you will see ‘null’ in the console when finished.
>
* You can now move to FINISHING UP!
</details>

<details><summary> FINISHING UP </summary>

>
> * Check that your Syscoin balance is correct!
>
> * You should now create a new address and send your entire balance to this new address to ensure that your [HD keys](https://www.w3.org/2016/04/blockchain-workshop/interest/robles.html) are up-to-date.
> 
> * Delete the `sys3dump.bmwalletdump` file that you created in Step 2.  
>  It is an openly readable text file that displays your private keys. Be sure to remove it from your Trash (MAC) or Recycle Bin (WINDOWS)
>
* You are done! If you wish to encrypt your wallet, move on to ENCRYPTING YOUR WALLET.
</details>

---

<details>
<summary><B>ENCRYPTING YOUR WALLET (click to expand):</B><br></summary>  
   
  
  <br>

You can use either a password (one word or string of characters) or a passphrase (multiple words or characters with spaces between) to encrypt your wallet.

<details>

<summary> Encrypting your wallet in Syscoin Qt 4.x</summary>  

>  
> * In Syscoin QT 4.x, go to Console: Window->Console and type:  
> walletpassphrase "yourpasswordorpassphrase"  
> Press Enter
>
> * Be sure to write down your password or passphrase and save it in a safe place.  
>  
> * You are done! Enjoy your Syscoin Wallet!
>    
</details>

<details><summary> Encrypting your wallet in Spark</summary>

>  
> * In Spark, press the Lock icon in the top right menu, then hit Encrypt Wallet  
> Enter your password or passphrase, twice to confirm.
> Then press Encrypt Wallet button when you are done.
>
> * Be sure to write down your password or passphrase and save it in a safe place.  
>  
> * You are done! Enjoy your Syscoin Wallet!
>  
</details>
<details><summary> Encrypting your wallet in Fusion</summary>

>  
> * In Syscoin Fusion 4.x, go to Tools>Wallet Tools->Lock Wallet  
> Enter your new password or passphrase in the form field  
> Press the OK button
>
> * Be sure to write down your password or passphrase and save it in a safe place.  
>  
> * You are done! Enjoy your Syscoin Wallet!
> 
</details>
</details>

