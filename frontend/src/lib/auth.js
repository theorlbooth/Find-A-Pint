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

export function isCurrentUser(user) {
  if (getUserId() === user) {
    return true
  } else {
    return false 
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

export function isUser(pubUserId, user) {
  if (user._id === undefined || pubUserId === undefined) {
    return false
  } else if (pubUserId === user._id) {
    return true
  } else {
    return false
  }
}

export function isLandlord(user) {
  if (user === undefined) {
    return false
  } else if (user.isAdmin === true || user.isLandlord === true) {
    return true
  } else {
    return false
  }
}