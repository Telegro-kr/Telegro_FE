import type {
  DeliveryAddressDetailDTO,
  OrderRequestDTOPaymentMethod,
  TemporaryOrderDTO,
} from '@apis/telegro';
import {
  useCancelPayment,
  useCompleteOrder,
  useGetMyPage,
  useValidatePayment,
} from '@apis/telegro';
import { verifyPayment } from '@apis/verifyPayment';
import {
  getStoredUserRole,
  hasDeliveryFee,
  isOnlinePaymentRole as isOnlinePaymentRoleByRole,
} from '@state/session';
import { formatPhoneNumber, getTodayDate } from '@utils/format';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

declare global {
  interface Window {
    IMP?: {
      init: (code: string) => void;
      request_pay: (
        params: Record<string, unknown>,
        callback: (response: {
          error_code?: string;
          error_msg?: string;
          imp_uid?: string;
        }) => void,
      ) => void;
    };
  }
}

type CheckoutLocationState = {
  orderData?: TemporaryOrderDTO;
};

type DaumPostcodeData = {
  zonecode: string;
  address: string;
  addressType: 'R' | 'J';
  bname: string;
  buildingName: string;
  apartment: 'Y' | 'N';
};

type PaymentMethodKey = 'card' | 'vbank' | 'trans' | null;

type CheckoutCompleteState = {
  orderPk: number;
  orderId: string;
  orderDate: string;
  orderDetails: {
    products: Array<{
      name: string;
      quantity: number;
      coverImage: string;
      totalPrice: number;
    }>;
    total: number;
  };
  userDetails: {
    name: string;
    phone: string;
    email: string;
  };
  shippingInfo: {
    postalCode: string;
    address: string;
    detailedAddress: string;
    request: string;
  };
  pointsToUse: number;
  pointsToEarn: number;
  shippingCost: number;
  vbankInfo?: Awaited<ReturnType<typeof verifyPayment>>;
};

const POSTCODE_SCRIPT_ID = 'daum-postcode-script';
const POSTCODE_SCRIPT_SRC =
  'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
const IMP_SCRIPT_ID = 'iamport-script';
const IMP_SCRIPT_SRC = 'https://cdn.iamport.kr/v1/iamport.js';
const IMP_MERCHANT_CODE = 'imp06338577';
const SHIPPING_FEE = 3000;
const CHANNEL_KEY = 'channel-key-0c462650-5c1a-4f74-86d5-80a67cb512c2';
const STORE_ID = 'store-a85691d3-8516-48fe-985b-03d01942b7d7';

const formatPrice = (price: number) =>
  `₩${new Intl.NumberFormat('ko-KR').format(price)}`;

const buildRoadAddress = (data: DaumPostcodeData) => {
  if (data.addressType !== 'R') {
    return data.address;
  }

  const extras = [
    data.bname,
    data.apartment === 'Y' ? data.buildingName : '',
  ].filter(Boolean);

  return extras.length
    ? `${data.address} (${extras.join(', ')})`
    : data.address;
};

const ensureImpLoaded = () =>
  new Promise<void>((resolve, reject) => {
    if (window.IMP) {
      resolve();
      return;
    }

    const existingScript =
      (document.getElementById(IMP_SCRIPT_ID) as HTMLScriptElement | null) ??
      (document.querySelector(
        `script[src="${IMP_SCRIPT_SRC}"]`,
      ) as HTMLScriptElement | null);

    const handleLoad = () => {
      if (window.IMP) {
        resolve();
        return;
      }

      reject(new Error('결제 모듈을 불러오지 못했습니다.'));
    };
    const handleError = () =>
      reject(new Error('결제 모듈 스크립트 로드에 실패했습니다.'));

    if (existingScript) {
      existingScript.id = IMP_SCRIPT_ID;

      if (window.IMP) {
        resolve();
        return;
      }

      existingScript.addEventListener('load', handleLoad, { once: true });
      existingScript.addEventListener('error', handleError, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = IMP_SCRIPT_ID;
    script.src = IMP_SCRIPT_SRC;
    script.async = true;
    script.addEventListener('load', handleLoad, { once: true });
    script.addEventListener('error', handleError, { once: true });
    document.body.appendChild(script);
  });

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as CheckoutLocationState | null;
  const orderData = state?.orderData;
  const userRole = getStoredUserRole();
  const isOnlinePaymentRole = isOnlinePaymentRoleByRole(userRole);

  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [pointsToUse, setPointsToUse] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethodKey>('card');
  const [isAgreementChecked, setIsAgreementChecked] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [isPostcodeReady, setIsPostcodeReady] = useState(false);
  const [isImpReady, setIsImpReady] = useState(() => Boolean(window.IMP));
  const [formData, setFormData] = useState({
    userName: '',
    phoneNumber: '',
    address: '',
    postalCode: '',
    detailedAddress: '',
    request: '',
  });

  const myPageQuery = useGetMyPage({
    query: {
      staleTime: 60_000,
      enabled: Boolean(orderData),
    },
  });
  const completeOrderMutation = useCompleteOrder();
  const validatePaymentMutation = useValidatePayment();
  const cancelPaymentMutation = useCancelPayment();

  useEffect(() => {
    if (!orderData) {
      navigate('/app/cart', { replace: true });
    }
  }, [navigate, orderData]);

  useEffect(() => {
    if (window.daum?.Postcode) {
      setIsPostcodeReady(true);
      return;
    }

    const existingScript = document.getElementById(
      POSTCODE_SCRIPT_ID,
    ) as HTMLScriptElement | null;
    const handleLoad = () => setIsPostcodeReady(true);

    if (existingScript) {
      existingScript.addEventListener('load', handleLoad);
      return () => existingScript.removeEventListener('load', handleLoad);
    }

    const script = document.createElement('script');
    script.id = POSTCODE_SCRIPT_ID;
    script.src = POSTCODE_SCRIPT_SRC;
    script.async = true;
    script.addEventListener('load', handleLoad);
    document.body.appendChild(script);

    return () => script.removeEventListener('load', handleLoad);
  }, []);

  useEffect(() => {
    void ensureImpLoaded()
      .then(() => setIsImpReady(true))
      .catch(() => setIsImpReady(false));
  }, []);

  const addressList = myPageQuery.data?.data?.addressList ?? [];
  const point = myPageQuery.data?.data?.point ?? 0;
  const userName = myPageQuery.data?.data?.userName?.trim() ?? '';
  const userPhone = formatPhoneNumber(
    myPageQuery.data?.data?.phone?.trim() ?? '',
  );
  const userEmail = myPageQuery.data?.data?.email?.trim() ?? '';

  useEffect(() => {
    if (!formData.userName && userName) {
      setFormData((prev) => ({
        ...prev,
        userName,
        phoneNumber: prev.phoneNumber || userPhone,
      }));
    }
  }, [formData.userName, userName, userPhone]);

  const products = useMemo(
    () =>
      (orderData?.cartProductDTOS ?? []).map((product, index) => ({
        key: `${product.cartId ?? index}`,
        name: product.productName?.trim() || '상품',
        option:
          product.selectOption?.trim() ||
          product.inputOption?.trim() ||
          '기본 옵션',
        quantity: product.quantity ?? 0,
        coverImage: product.coverImage?.trim() || '/product1.png',
        totalPrice: product.totalPrice ?? 0,
      })),
    [orderData],
  );

  const totalProductPrice = useMemo(
    () => products.reduce((acc, product) => acc + product.totalPrice, 0),
    [products],
  );
  const shippingCost = orderData && hasDeliveryFee(userRole) ? SHIPPING_FEE : 0;
  const maxUsablePoints = Math.min(point, totalProductPrice + shippingCost);
  const totalPayable = Math.max(
    totalProductPrice + shippingCost - pointsToUse,
    0,
  );

  const updateAddressForm = (address: DeliveryAddressDetailDTO) => {
    setFormData((prev) => ({
      ...prev,
      userName: address.recipientName?.trim() || prev.userName || userName,
      phoneNumber: formatPhoneNumber(
        address.phoneNumber?.trim() || prev.phoneNumber || userPhone,
      ),
      address: address.address?.trim() || '',
      postalCode: address.zipcode?.trim() || '',
      detailedAddress: address.addressDetail?.trim() || '',
    }));
  };

  useEffect(() => {
    if (selectedAddressId || !addressList.length) {
      return;
    }

    const defaultAddress =
      addressList.find((address) => address.isDefault) ?? addressList[0];

    if (!defaultAddress?.deliveryAddressId) {
      return;
    }

    setSelectedAddressId(String(defaultAddress.deliveryAddressId));
    updateAddressForm(defaultAddress);
  }, [addressList, selectedAddressId, userName, userPhone]);

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId);
    const selected = addressList.find(
      (address) => String(address.deliveryAddressId) === addressId,
    );

    if (selected) {
      updateAddressForm(selected);
    }
  };

  const handleSearchAddress = () => {
    if (!window.daum?.Postcode) {
      alert('주소 검색을 아직 사용할 수 없습니다.');
      return;
    }

    new window.daum.Postcode({
      oncomplete: (data) => {
        setFormData((prev) => ({
          ...prev,
          address: buildRoadAddress(data),
          postalCode: data.zonecode,
        }));
      },
    }).open();
  };

  const handlePointsChange = (value: string) => {
    const nextValue = Number.parseInt(value || '0', 10);
    if (Number.isNaN(nextValue)) {
      setPointsToUse(0);
      return;
    }

    if (nextValue < 0 || nextValue > maxUsablePoints) {
      alert(`사용 가능한 포인트는 0원부터 ${maxUsablePoints}P까지입니다.`);
      return;
    }

    setPointsToUse(nextValue);
  };

  const resolveOrderPaymentMethod = (): OrderRequestDTOPaymentMethod => {
    if (selectedPaymentMethod === 'vbank') {
      return 'V_BANK';
    }

    if (selectedPaymentMethod === 'trans') {
      return 'BANK_TRANSFER';
    }

    return 'CREDIT_CARD';
  };

  const validateForm = () => {
    if (!formData.userName.trim()) {
      alert('받는 분 성함을 입력해주세요.');
      return false;
    }
    if (!formData.phoneNumber.trim()) {
      alert('연락처를 입력해주세요.');
      return false;
    }
    if (!formData.address.trim()) {
      alert('주소를 입력해주세요.');
      return false;
    }
    if (!formData.postalCode.trim()) {
      alert('우편번호를 입력해주세요.');
      return false;
    }
    if (!formData.detailedAddress.trim()) {
      alert('상세주소를 입력해주세요.');
      return false;
    }
    if (!isAgreementChecked) {
      alert('주문 내용을 확인하고 동의해주세요.');
      return false;
    }
    if (!products.length) {
      alert('주문할 상품이 없습니다.');
      return false;
    }
    if (isOnlinePaymentRole && !selectedPaymentMethod) {
      alert('결제 수단을 선택해주세요.');
      return false;
    }

    return true;
  };

  const buildCompleteState = (params: {
    orderPk: number;
    orderIdentifier: string;
    orderDate?: string;
    pointsToEarn?: number;
    vbankInfo?: Awaited<ReturnType<typeof verifyPayment>>;
  }): CheckoutCompleteState => ({
    orderPk: params.orderPk,
    orderId: params.orderIdentifier,
    orderDate: params.orderDate ?? new Date().toISOString(),
    orderDetails: {
      products: products.map((product) => ({
        name: product.name,
        quantity: product.quantity,
        coverImage: product.coverImage,
        totalPrice: product.totalPrice,
      })),
      total: totalProductPrice,
    },
    userDetails: {
      name: formData.userName,
      phone: formData.phoneNumber,
      email: userEmail,
    },
    shippingInfo: {
      postalCode: formData.postalCode,
      address: formData.address,
      detailedAddress: formData.detailedAddress,
      request: formData.request,
    },
    pointsToUse,
    pointsToEarn: params.pointsToEarn ?? orderData?.pointToEarn ?? 0,
    shippingCost,
    vbankInfo: params.vbankInfo ?? undefined,
  });

  const completeOrder = async () => {
    const response = await completeOrderMutation.mutateAsync({
      data: {
        deliveryAddress: {
          recipientName: formData.userName.trim(),
          phoneNumber: formData.phoneNumber.trim(),
          address: formData.address.trim(),
          addressDetail: formData.detailedAddress.trim(),
          zipcode: formData.postalCode.trim(),
        },
        request: formData.request.trim(),
        shoppingCost: shippingCost,
        pointsToUse,
        pointsToEarn: orderData?.pointToEarn ?? 0,
        paymentMethod: resolveOrderPaymentMethod(),
      },
    });

    const createdOrder = response.data;
    if (!createdOrder?.id) {
      throw new Error('주문 생성 결과에 주문 ID가 없습니다.');
    }

    return createdOrder;
  };

  const requestPayment = async (orderId: number) => {
    if (!window.IMP) {
      await ensureImpLoaded();
      setIsImpReady(true);
    }

    if (!window.IMP) {
      throw new Error('결제 모듈을 불러오지 못했습니다.');
    }

    const productLabel =
      products.length > 1
        ? `${products[0].name} 외 ${products.length - 1}건`
        : products[0].name;
    const merchantUid = `order-${orderId}-${Date.now()}`;
    const payMethod =
      selectedPaymentMethod === 'vbank'
        ? 'vbank'
        : selectedPaymentMethod === 'trans'
          ? 'trans'
          : 'card';
    const paymentOptions: Record<string, unknown> = {
      pg: 'nice_v2',
      channelKey: CHANNEL_KEY,
      storeId: STORE_ID,
      pay_method: payMethod,
      merchant_uid: merchantUid,
      amount: totalPayable,
      name: productLabel,
      buyer_name: formData.userName,
      buyer_tel: formData.phoneNumber,
      buyer_email: userEmail || 'no-reply@telegro.co.kr',
      buyer_addr: formData.address,
      buyer_postcode: formData.postalCode,
      m_redirect_url: `${window.location.origin}/app/checkout/complete`,
      vbank_due: getTodayDate(),
      escrow: true,
      digital: false,
      custom_data: { orderId },
    };

    if (payMethod === 'card') {
      paymentOptions.card = {
        installmentMonth: totalPayable >= 50000 ? 3 : 0,
        useCardPoint: false,
        useFreeInterestFromMerchant: true,
      };
    }

    if (payMethod === 'vbank') {
      paymentOptions.virtualAccount = {
        vbank_due: getTodayDate(),
      };
    }

    return new Promise<{ imp_uid: string }>((resolve, reject) => {
      window.IMP?.init(IMP_MERCHANT_CODE);
      window.IMP?.request_pay(paymentOptions, (response) => {
        if (response.error_code || !response.imp_uid) {
          reject(new Error(response.error_msg || '결제에 실패했습니다.'));
          return;
        }

        resolve({ imp_uid: response.imp_uid });
      });
    });
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsPaying(true);
    let createdOrderId: number | null = null;

    try {
      const createdOrder = await completeOrder();
      const resolvedOrderId = createdOrder.id;

      if (resolvedOrderId == null) {
        throw new Error('주문 ID를 확인할 수 없습니다.');
      }

      createdOrderId = resolvedOrderId;

      if (!isOnlinePaymentRole) {
        navigate('/app/checkout/complete', {
          replace: true,
          state: buildCompleteState({
            orderPk: resolvedOrderId,
            orderIdentifier:
              createdOrder.orderNumber || String(resolvedOrderId),
            orderDate: createdOrder.createdAt,
            pointsToEarn: orderData?.pointToEarn ?? 0,
          }),
        });
        return;
      }

      const paymentResult = await requestPayment(resolvedOrderId);
      await validatePaymentMutation.mutateAsync({
        impUid: paymentResult.imp_uid,
      });

      const vbankInfo =
        selectedPaymentMethod === 'vbank'
          ? await verifyPayment(paymentResult.imp_uid)
          : undefined;

      navigate('/app/checkout/complete', {
        replace: true,
        state: buildCompleteState({
          orderPk: resolvedOrderId,
          orderIdentifier: paymentResult.imp_uid,
          orderDate: createdOrder.createdAt,
          pointsToEarn: orderData?.pointToEarn ?? 0,
          vbankInfo,
        }),
      });
    } catch (error) {
      if (createdOrderId) {
        try {
          await cancelPaymentMutation.mutateAsync({ orderId: createdOrderId });
        } catch (cancelError) {
          console.error('결제 또는 주문 취소에 실패했습니다:', cancelError);
        }
      }

      console.error(error);
      alert(error instanceof Error ? error.message : '결제에 실패했습니다.');
    } finally {
      setIsPaying(false);
    }
  };

  if (!orderData) {
    return null;
  }

  if (myPageQuery.isLoading) {
    return (
      <section className="min-h-screen bg-[#f6f6f6] px-5 py-10">
        <div className="mx-auto max-w-[1100px] rounded-[2rem] bg-white px-8 py-16 text-center shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
          <p className="text-[1.6rem] text-neutral-600">
            주문 정보를 불러오는 중입니다...
          </p>
        </div>
      </section>
    );
  }

  if (myPageQuery.isError) {
    return (
      <section className="min-h-screen bg-[#f6f6f6] px-5 py-10">
        <div className="mx-auto max-w-[1100px] rounded-[2rem] bg-white px-8 py-16 text-center shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
          <p className="text-[1.8rem] font-semibold text-neutral-800">
            사용자 정보를 불러오지 못했습니다.
          </p>
          <button
            type="button"
            onClick={() => myPageQuery.refetch()}
            className="mt-6 rounded-full bg-black px-6 py-3 text-[1.4rem] font-medium text-white"
          >
            다시 시도
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#f6f6f6] px-5 py-10 text-[#111] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1180px]">
        <header className="mb-8">
          <h1 className="text-[3.2rem] font-semibold tracking-[-0.04em] text-[#171717]">
            주문/결제
          </h1>
          <p className="mt-2 text-[1.4rem] text-neutral-500">
            배송지와 결제 정보를 확인한 뒤 주문을 진행해주세요.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-6">
            <section className="rounded-[1.8rem] bg-white p-7 shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
              <h2 className="text-[2rem] font-semibold text-[#171717]">
                주문 상품
              </h2>
              <div className="mt-6 space-y-4">
                {products.map((product) => (
                  <article
                    key={product.key}
                    className="flex gap-4 rounded-[1.4rem] border border-neutral-200 p-4"
                  >
                    <img
                      src={product.coverImage}
                      alt={product.name}
                      className="h-24 w-24 rounded-[1.2rem] border border-neutral-200 object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[1.6rem] font-semibold text-[#171717]">
                        {product.name}
                      </p>
                      <p className="mt-1 text-[1.3rem] text-neutral-500">
                        {product.option}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-[1.3rem] text-neutral-600">
                        <span>수량 {product.quantity}개</span>
                        <span>{formatPrice(product.totalPrice)}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-[1.8rem] bg-white p-7 shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
              <h2 className="text-[2rem] font-semibold text-[#171717]">
                주문자 정보
              </h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-[1.2rem] bg-[#f8f8f8] px-5 py-4">
                  <p className="text-[1.2rem] text-neutral-500">이름</p>
                  <p className="mt-2 text-[1.6rem] font-medium text-[#171717]">
                    {userName}
                  </p>
                </div>
                <div className="rounded-[1.2rem] bg-[#f8f8f8] px-5 py-4">
                  <p className="text-[1.2rem] text-neutral-500">이메일</p>
                  <p className="mt-2 text-[1.6rem] font-medium text-[#171717]">
                    {userEmail}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-[1.8rem] bg-white p-7 shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-[2rem] font-semibold text-[#171717]">
                    배송 정보
                  </h2>
                  <p className="mt-2 text-[1.3rem] text-neutral-500">
                    저장된 배송지를 선택하거나 새 주소를 입력해주세요.
                  </p>
                </div>
                <div className="flex gap-3">
                  <select
                    value={selectedAddressId}
                    onChange={(event) =>
                      handleAddressSelect(event.target.value)
                    }
                    className="min-w-[220px] rounded-full border border-neutral-300 bg-white px-4 py-3 text-[1.4rem]"
                  >
                    <option value="">배송지 선택</option>
                    {addressList.map((address) => (
                      <option
                        key={address.deliveryAddressId}
                        value={String(address.deliveryAddressId)}
                      >
                        {(address.name?.trim() || '배송지') +
                          (address.isDefault ? ' (기본 배송지)' : '')}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleSearchAddress}
                    disabled={!isPostcodeReady}
                    className="rounded-full border border-black px-5 py-3 text-[1.4rem] font-medium text-black disabled:cursor-not-allowed disabled:border-neutral-300 disabled:text-neutral-400"
                  >
                    주소 검색
                  </button>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <input
                  value={formData.userName}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      userName: event.target.value,
                    }))
                  }
                  placeholder="받는 분 성함"
                  className="rounded-[1.2rem] border border-neutral-300 px-4 py-4 text-[1.5rem]"
                />
                <input
                  value={formData.phoneNumber}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      phoneNumber: formatPhoneNumber(event.target.value),
                    }))
                  }
                  inputMode="numeric"
                  placeholder="연락처"
                  className="rounded-[1.2rem] border border-neutral-300 px-4 py-4 text-[1.5rem]"
                />
                <input
                  value={formData.address}
                  readOnly
                  placeholder="주소"
                  className="rounded-[1.2rem] border border-neutral-300 px-4 py-4 text-[1.5rem] md:col-span-2"
                />
                <input
                  value={formData.postalCode}
                  readOnly
                  placeholder="우편번호"
                  className="rounded-[1.2rem] border border-neutral-300 px-4 py-4 text-[1.5rem]"
                />
                <input
                  value={formData.detailedAddress}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      detailedAddress: event.target.value,
                    }))
                  }
                  placeholder="상세주소"
                  className="rounded-[1.2rem] border border-neutral-300 px-4 py-4 text-[1.5rem]"
                />
                <textarea
                  value={formData.request}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      request: event.target.value,
                    }))
                  }
                  placeholder="배송 요청사항"
                  rows={4}
                  className="rounded-[1.2rem] border border-neutral-300 px-4 py-4 text-[1.5rem] md:col-span-2"
                />
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-[1.8rem] bg-white p-7 shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
              <h2 className="text-[2rem] font-semibold text-[#171717]">
                결제 금액
              </h2>
              <div className="mt-6 space-y-4 text-[1.5rem]">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">상품 금액</span>
                  <span>{formatPrice(totalProductPrice)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">배송비</span>
                  <span>{formatPrice(shippingCost)}</span>
                </div>
                <div className="space-y-3 rounded-[1.2rem] bg-[#f8f8f8] p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">포인트 사용</span>
                    <span className="text-[#d93a32]">
                      - {formatPrice(pointsToUse)}
                    </span>
                  </div>
                  <input
                    type="number"
                    min={0}
                    max={maxUsablePoints}
                    value={pointsToUse === 0 ? '' : pointsToUse}
                    onChange={(event) => handlePointsChange(event.target.value)}
                    placeholder={`0 / ${maxUsablePoints}P`}
                    className="w-full rounded-[1rem] border border-neutral-300 bg-white px-4 py-3 text-[1.4rem]"
                  />
                  <button
                    type="button"
                    onClick={() => setPointsToUse(maxUsablePoints)}
                    className="text-[1.3rem] font-medium text-[#1f5eff]"
                  >
                    전액 사용
                  </button>
                </div>
                <div className="border-t border-dashed border-neutral-200 pt-4">
                  <div className="flex items-end justify-between">
                    <span className="text-[1.7rem] font-semibold">
                      최종 결제금액
                    </span>
                    <span className="text-[2.2rem] font-semibold text-[#d93a32]">
                      {formatPrice(totalPayable)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">적립 예정 포인트</span>
                  <span>{orderData.pointToEarn ?? 0}P</span>
                </div>
              </div>
            </section>

            <section className="rounded-[1.8rem] bg-white p-7 shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
              <h2 className="text-[2rem] font-semibold text-[#171717]">
                {isOnlinePaymentRole ? '결제 수단' : '입금 계좌 정보'}
              </h2>

              {isOnlinePaymentRole ? (
                <div className="mt-6 space-y-3">
                  {[
                    { key: 'card', label: '카드 / 간편결제' },
                    { key: 'vbank', label: '가상계좌' },
                    { key: 'trans', label: '실시간 계좌이체' },
                  ].map((method) => {
                    const selected = selectedPaymentMethod === method.key;
                    return (
                      <button
                        key={method.key}
                        type="button"
                        onClick={() =>
                          setSelectedPaymentMethod(
                            method.key as PaymentMethodKey,
                          )
                        }
                        className={[
                          'flex w-full items-center justify-between rounded-[1.2rem] border px-4 py-4 text-left text-[1.5rem]',
                          selected
                            ? 'border-black bg-black text-white'
                            : 'border-neutral-300 bg-white text-[#171717]',
                        ].join(' ')}
                      >
                        <span>{method.label}</span>
                        <span className="text-[1.3rem]">
                          {selected ? '선택됨' : '선택'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-6 rounded-[1.4rem] bg-[#f8f8f8] p-5 text-[1.45rem] leading-[1.7] text-neutral-700">
                  <p className="text-[1.8rem] font-semibold text-[#171717]">
                    우리은행 540-263910-02-001
                  </p>
                  <p className="mt-2">예금주: 연경진</p>
                  <p className="mt-4 text-[#1f5eff]">
                    세금계산서는 월말 일괄 발행됩니다.
                  </p>
                  <p>표기 금액은 부가세 별도 금액입니다.</p>
                </div>
              )}

              <label className="mt-6 flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={isAgreementChecked}
                  onChange={(event) =>
                    setIsAgreementChecked(event.target.checked)
                  }
                  className="mt-1 h-5 w-5"
                />
                <span className="text-[1.4rem] text-neutral-600">
                  주문 조건 및 결제 내용을 확인했으며, 이에 동의합니다.
                </span>
              </label>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isPaying}
                className="mt-6 w-full rounded-full bg-black px-6 py-4 text-[1.55rem] font-semibold text-white disabled:cursor-not-allowed disabled:bg-neutral-400"
              >
                {isPaying
                  ? '처리 중...'
                  : isOnlinePaymentRole
                    ? '결제하기'
                    : '주문 완료'}
              </button>
            </section>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Checkout;
