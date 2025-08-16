import axios from 'axios';

export interface PaymentInfo {
  vbank_name: string;
  vbank_num: string;
  vbank_holder: string;
  vbank_date: number;
  buyer_name: string;
}

export const getPaymentInfo = async (impUid: string): Promise<PaymentInfo> => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('토큰이 존재하지 않습니다');
  }

  const { data } = await axios.post<{ data: PaymentInfo }>(
    `https://api.telegro.kr/api/payments/${impUid}`,
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
