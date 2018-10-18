module.exports = {
    css: `
/*\r\n
    Custom CSS file. User can customize his wallet from here.\r\n
    \r\n
    Class list:\r\n
    \r\n
    App body: .app-body\r\n
    Tabs container: .tabs-app\r\n
        Tabs: .tab\r\n
            Accounts: .tab-accounts\r\n
            Send: .tab-send\r\n
            Tools: .tab-tools\r\n
            Personalize: .tab-personalize\r\n
        Accounts: .accounts-container\r\n
            Your aliases text: .accounts-your-aliases-text\r\n
            Aliases (boxes):\r\n
                Container: .alias-box\r\n
                Image: .alias-img\r\n
                Text column: .text-col\r\n
                    Type: .alias-type\r\n
                    Alias name: .alias-name\r\n
                    Alias balance: .alias-balance\r\n
                    Alias address: .alias-address\r\n
            Assets list: .assets-table-container\r\n
                Title: .assets-table-title\r\n
                    Selected alias/address: .assets-table-title-selected\r\n
                Table container: .assets-table\r\n
                    Table: .assets-table\r\n
            Assets transactions: .assets-transaction-container\r\n
                Title: .assets-transaction-title\r\n
                    Selected alias/address: .assets-transaction-title-selected\r\n
                Table container: .assets-transaction-table-container\r\n
                    Table: .assets-transaction-table\r\n
        Send: .send-container\r\n
            Send asset: .send-container\r\n
                Form: .send-asset-form-container\r\n
                    Title: .send-asset-form-title\r\n
                    Inputs:\r\n
                        Send from select: .send-asset-form-control send-asset-form-type-from\r\n
                        From address: .send-asset-form-control .send-asset-form-from-address\r\n
                        Asset ID: .send-asset-form-control .send-asset-form-asset-id\r\n
                        To address: .send-asset-form-control .send-asset-form-to-address\r\n
                        Amount: .send-asset-form-control .send-asset-form-asset\r\n
                    Buttons: .send-asset-form-btn-container\r\n
                        Send: .send-asset-form-btn-send\r\n
            Send SYS: .send-sys-container\r\n
                Form: .send-sys-form\r\n
                    Title: .send-sys-form-title\r\n
                    Balance: .send-sys-form-balance\r\n
                        Number: .send-sys-form-balance-number\r\n
                    Inputs:\r\n
                        To address: .send-sys-form-control .send-sys-form-to-address\r\n
                        Amount: .send-sys-form-control .send-sys-form-amount\r\n
                        Comment: .send-sys-form-control .send-sys-form-comment\r\n
                    Buttons: .send-asset-form-btn-container\r\n
                        Send: .send-sys-form-btn-send\r\n
        Tools: .tools-container\r\n
            Create alias: .create-alias-container\r\n
                Title: .create-alias-title\r\n
                Unfinished aliases: .create-alias-unfinished-aliases\r\n
                    ul tag: .create-alias-unfinished-aliases-ul\r\n
                        Text: .create-alias-unfinished-aliases-text\r\n
                        li tags: .create-alias-unfinished-aliases-li\r\n
                Inputs:.create-alias-form-container\r\n
                    New alias name: .create-alias-control create-alias-form-name\r\n
                    Public value: .create-alias-control .create-alias-form-public-value\r\n
                    Accept Transfer Flag: .create-alias-control .create-alias-form-transferflag\r\n
                    Expire timestamp: .create-alias-control .create-alias-form-timestamp\r\n
                    Address: .create-alias-control .create-alias-form-address\r\n
                    Encryption Private Key: .create-alias-control .create-alias-form-privkey\r\n
                    Encryption Public Key: .create-alias-control .create-alias-form-pubkey\r\n
                    Witness: .create-alias-control .create-alias-form-witness\r\n
                    Buttons: .create-alias-form-btn-container\r\n
                        Send: .create-alias-form-btn-send\r\n
            Backup Wallet: .backup-wallet-container\r\n
                Title: .backup-wallet-title\r\n
                Button: .backup-wallet-btn\r\n
            Import Wallet: .import-wallet-container\r\n
                Title: .import-wallet-title\r\n
                Button: .import-wallet-btn\r\n
            Get Private Key: .get-priv-key-container\r\n
                Title: .get-priv-key-title\r\n
                Button: .get-priv-key-btn\r\n
        Personalize: .personalize-container\r\n
            Edit alias: .edit-alias-container\r\n
                Title: .edit-alias-title\r\n
                Form: .edit-alias-form-container\r\n
                    Inputs:\r\n
                        Alias: .edit-alias-form-control .edit-alias-form-alias\r\n
                        Editing alias text: .edit-alias-form-active-alias\r\n
                        Public Value: .edit-alias-form-control .edit-alias-form-publicvalue\r\n
                        Accept Transfer Flag: .edit-alias-form-control .edit-alias-form-transferflag\r\n
                        Expire timestamp: .edit-alias-form-control .edit-alias-form-timestamp\r\n
                        Address: .edit-alias-form-control .edit-alias-form-address\r\n
                        Encryption Private Key: .edit-alias-form-control .edit-alias-form-privkey\r\n
                        Encryption Public Key: .edit-alias-form-control .edit-alias-form-pubkey\r\n
                        Witness: .edit-alias-form-control .edit-alias-form-witness\r\n
                        Buttons: .edit-alias-form-btn-container\r\n
                            Send: .edit-alias-form-btn-send\r\n
                            \r\n
        General:\r\n
            Separator: .separator-container\r\n
                hr: .separator\r\n
*/\r\n`,
    cfg: `
# Place your assets here separated by a comma (Ex. guid=asset1,asset2,asset3...)\r\n
guid=none\r\n
\r\n
# Color palette
main_white=none\r\n
full_white=none\r\n
main_blue=none\r\n
main_background=none\r\n
accounts_background=none\r\n
asset_guid=none\r\n
main_red=none\r\n
main_green=none\r\n
title_color=none\r\n
progress_bar_color=none\r\n
\r\n
\r\n
# Recommended dimensions for splash image: 350x420\r\n
splashscreen_url=none\r\n
\r\n
# Logo shown in Acounts tab background
background_logo=none\r\n
`
}