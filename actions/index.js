export const LOGIN = 'LOGIN';
export function login(username, password) {
  const fakeUser = {
    id: 1,
    username: username,
  };
  localStorage.setItem('user', JSON.stringify(fakeUser));
  return {
    type: LOGIN,
    payload: {
      user: fakeUser,
    },
  };
}

export const LOGOUT = 'LOGOUT';
export function logout() {
  localStorage.setItem('user', JSON.stringify(null));
  return {
    type: LOGOUT,
    payload: {},
  };
}
