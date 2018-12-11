// @flow
import fs from 'fs'
import swal from 'sweetalert'

export default (customCssPath: string) => {
  try {
    const css = fs.readFileSync(customCssPath)

    const style = document.createElement("style")
    style.type = "text/css"
    style.innerHTML = css
    document.body.appendChild(style)
  } catch (e) {
    swal('Error', 'Error while loading custom CSS', 'error')
  }
}
