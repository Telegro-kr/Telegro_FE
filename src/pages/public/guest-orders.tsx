import { Link } from 'react-router-dom';

const GuestOrdersPage = () => {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-18rem)] w-full max-w-[76rem] flex-col justify-center px-4 py-16 sm:px-6">
      <div className="rounded-[12px] border border-[#E9E9E9] bg-white px-8 py-10 shadow-[0_10px_30px_rgba(18,18,18,0.06)] sm:px-12 sm:py-12">
        <div className="flex flex-col gap-4 text-center sm:text-left">
          <span className="font-[Pretendard,sans-serif] text-[1.4rem] font-semibold tracking-[0.08em] text-[#7B8A3A] uppercase">
            Guest Order
          </span>
          <h1 className="title5 text-gray-900">비회원 주문 조회</h1>
          <p className="font-[Pretendard,sans-serif] text-[1.6rem] leading-[1.7] text-[#555555]">
            주문번호와 주문자 정보를 통해 주문 상태를 확인하는 화면입니다. 아직
            미구현 상태임다..
          </p>
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex h-[4.8rem] cursor-pointer items-center justify-center rounded-[0.8rem] bg-[#FFC633] px-6 font-[Pretendard,sans-serif] text-[1.5rem] font-semibold text-white transition hover:brightness-95"
          >
            홈으로 이동
          </Link>
          <Link
            to="/products"
            className="inline-flex h-[4.8rem] cursor-pointer items-center justify-center rounded-[0.8rem] border border-[#E9E9E9] bg-white px-6 font-[Pretendard,sans-serif] text-[1.5rem] font-semibold text-[#2B2B2B] transition hover:border-[#FFC633]"
          >
            상품 보러가기
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GuestOrdersPage;
