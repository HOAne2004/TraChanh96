import axios from 'axios';

const API_URL = 'http://localhost:3000/users';

export const login = async (phone, password) => {
  const res = await axios.get(`${API_URL}?phone=${phone}&password=${password}`);
  if (res.data.length > 0) {
    const user = res.data[0];
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  } else {
    throw new Error('Số điện thoại hoặc mật khẩu không đúng');
  }
};

export const logout = () => {
  localStorage.removeItem('user');
};
