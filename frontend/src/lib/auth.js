export function getUserId() {
  const token = localStorage.getItem('token')
  if (!token) return false

  const parsedToken = JSON.parse(atob(token.split('.')[1]))
  return parsedToken.sub
}

export function isCreator(compareId, user) {

  if (user === undefined) {
    return false
  } else if (user.isAdmin === true) {
    return true
  } else {
    if (!compareId) return false
    return getUserId() === compareId
  }
}

export function isAdmin(user) {

  if (user === undefined) {
    return false
  } else if (user.isAdmin === true) {
    return true
  } else {
    return false
  }
}
