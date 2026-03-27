import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

export interface PaymentInfo {
  vbank_name: string;
  vbank_num: string;
  vbank_holder: string;
  vbank_date: number;
  buyer_name: string;
}

export const getPaymentInfo = async (impUid: string): Promise<PaymentInfo> => {
  const token =
    localStorage.getItem('accessToken') || localStorage.getItem('token');

  if (!token) {
    throw new Error('액세스 토큰이 없습니다.');
  }

  const { data } = await axios.post<{ data: PaymentInfo }>(
    `${baseURL}/api/payments/${impUid}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    },
  );

  return data.data;
};
