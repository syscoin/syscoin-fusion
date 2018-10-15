// @flow
/* eslint-disable camelcase */

type CssProps = {
    main_white: string,
    full_white: string,
    main_blue: string,
    main_background: string,
    accounts_background: string,
    asset_guid: string,
    main_red: string,
    main_green: string,
    title_color: string
};

export default async (obj: CssProps) => {
    const {
        main_white = '#ddd',
        full_white = '#fff',
        main_blue = '#7fb2ec',
        main_background = '#333',
        accounts_background = '#525252',
        asset_guid = '#999',
        main_red = '#f55',
        main_green = '#afa',
        title_color = '#ccc'
    } = obj

    const cssEl = document.querySelectorAll('link')[document.querySelectorAll('link').length - 1]
    let css

    if (process.env.HOT === '1') {
        css = await window.fetch(cssEl.href).then(res => res.text())
    } else {
        css = cssEl.innerHTML
    }

    css = css.replace(/\/\*[\w\W\d]+\*\//g, '')

    css.replace('#ddd', main_white)
    css.replace('#fff', full_white)
    css.replace('#7fb2ec', main_blue)
    css.replace('#333', main_background)
    css.replace('#525252', accounts_background)
    css.replace('#999', asset_guid)
    css.replace('#f55', main_red)
    css.replace('#afa', main_green)
    css.replace('#ccc', title_color)

    const style = document.createElement("style")
    style.type = "text/css"
    style.innerHTML = css

    document.body.appendChild(style)
}
