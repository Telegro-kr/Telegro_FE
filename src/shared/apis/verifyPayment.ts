import { getPaymentInfo } from './iamport';

interface VerifiedPayment {
  vbank_name: string;
  vbank_num: string;
  vbank_holder: string;
  vbank_date: number;
  buyer_name: string;
}

export const verifyPayment = async (imp_uid: string): Promise<VerifiedPayment | null> => {
  try {
    const paymentData = await getPaymentInfo(imp_uid);

    const { vbank_name, vbank_num, vbank_holder, vbank_date, buyer_name } = paymentData;

    return {
      vbank_name,
      vbank_num,
      vbank_holder,
      vbank_date,
      buyer_name,
    };
  } catch (error) {
    console.error('결제 정보 조회 실패:', error);
    return null;
  }
};
