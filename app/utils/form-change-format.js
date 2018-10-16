export default (e, name) => {
  if (e.target) {
    const { name: fieldName, value } = e.target

    return {
      [fieldName]: value
    }
  }

  return {
    [name]: e
  }
}
