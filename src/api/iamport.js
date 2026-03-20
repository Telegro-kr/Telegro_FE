import axios from 'axios';
import { API_BASE_URL } from '../constants/api';

export const getPaymentInfo = async (impUid) => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('토큰이 존재하지 않습니다');
  }

  const { data } = await axios.post(
    `${API_BASE_URL}/api/payments/${impUid}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return data.data;
};
