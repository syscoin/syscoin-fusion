// @flow
/* eslint-disable camelcase, prefer-template */

const loadCustomColor = (color: string) => global.appStorage.get(color)

export default async () => {
    const main_white = loadCustomColor('main_white') || '#ddd'
    const full_white = loadCustomColor('full_white') || '#fff'
    const main_blue = loadCustomColor('main_blue') || '#7fb2ec'
    const main_background = loadCustomColor('main_background') || '#333'
    const accounts_background = loadCustomColor('accounts_background') || '#525252'
    const asset_guid = loadCustomColor('asset_guid') || '#999'
    const main_red = loadCustomColor('main_red') || '#f55'
    const main_green = loadCustomColor('main_green') || '#afa'
    const title_color = loadCustomColor('title_color') || '#ccc'

    const cssEl = document.querySelectorAll('link')[document.querySelectorAll('link').length - 1]

    let css

    if (process.env.HOT === '1') {
        css = await window.fetch(cssEl.href).then(res => res.text())
    } else {
        css = await window.fetch('./dist/style.css').then(res => res.text())
    }

    css = css.replace(/#ddd/g, main_white + ' !important')
        .replace(/#fff/g, full_white + ' !important')
        .replace(/#7fb2ec/g, main_blue + ' !important')
        .replace(/#333/g, main_background + ' !important')
        .replace(/#525252/g, accounts_background + ' !important')
        .replace(/#999/g, asset_guid + ' !important')
        .replace(/#f55/g, main_red + ' !important')
        .replace(/#afa/g, main_green + ' !important')
        .replace(/#ccc/g, title_color + ' !important')

    const style = document.createElement("style")
    style.type = "text/css"
    style.innerHTML = css

    document.body.appendChild(style)
}
