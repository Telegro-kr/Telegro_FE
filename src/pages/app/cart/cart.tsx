import LoadingPage from '@components/common/loading-page';
import ErrorView from '@components/errors/error-view';
import { FiCheck, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import { CartEmptyState } from './components/cart-empty-state';
import { CartItemSection } from './components/cart-item-section';
import { CartStepIndicator } from './components/cart-step-indicator';
import { CartSummary } from './components/cart-summary';
import { useCart } from './use-cart';
import { useCartItemsQuery } from './use-cart-items-query';

const Cart = () => {
  const navigate = useNavigate();
  const { items: fetchedItems, isLoading, isError } = useCartItemsQuery();
  const {
    items,
    selectedOptionIds,
    summary,
    allSelected,
    toggleAll,
    toggleOption,
    toggleItem,
    updateQuantity,
    removeOption,
    removeItem,
    removeSelected,
    purchaseSelected,
    purchaseAll,
  } = useCart(fetchedItems);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <ErrorView onGoHome={() => navigate('/')} />;
  }

  return (
    <div className="min-h-screen bg-[#f6f6f6] px-5 py-10 text-[#111] sm:px-8 lg:px-12">
      <div className="mx-auto w-full max-w-[1100px] bg-white px-5 py-8 shadow-[0_12px_40px_rgba(0,0,0,0.04)] sm:px-8 lg:px-12 lg:py-12">
        <header className="mb-12 flex flex-col items-center">
          <h1 className="title1 mb-8">장바구니</h1>
          <CartStepIndicator />
        </header>

        {items.length ? (
          <>
            <div className="hidden border-y border-black lg:grid lg:grid-cols-[60px_minmax(0,1.8fr)_1fr_1fr_1fr_140px] lg:items-center lg:text-center lg:text-[14px] lg:font-medium">
              <button
                type="button"
                onClick={toggleAll}
                className="flex items-center justify-center py-4"
                aria-label="전체 선택"
              >
                <span
                  className={[
                    'flex size-[2rem] items-center justify-center rounded-full border',
                    allSelected
                      ? 'border-black bg-black text-white'
                      : 'border-neutral-300 bg-white text-transparent',
                  ].join(' ')}
                >
                  <FiCheck className="size-[1.2rem]" />
                </span>
              </button>
              <div className="py-4">제품정보</div>
              <div className="py-4">적립예정 포인트</div>
              <div className="py-4">할인금액</div>
              <div className="py-4">결제금액</div>
              <div className="py-4">선택</div>
            </div>

            <div className="divide-y divide-neutral-200 border-b border-neutral-200">
              {items.map((item) => (
                <CartItemSection
                  key={item.id}
                  item={item}
                  selectedOptionIds={selectedOptionIds}
                  onToggleItem={toggleItem}
                  onToggleOption={toggleOption}
                  onUpdateQuantity={updateQuantity}
                  onRemoveOption={removeOption}
                  onRemoveItem={removeItem}
                />
              ))}
            </div>

            <div className="mt-5">
              <button
                type="button"
                onClick={removeSelected}
                className="inline-flex h-9 items-center gap-2 border border-neutral-300 px-3 text-sm text-neutral-600 hover:bg-neutral-50"
              >
                <FiTrash2 className="h-4 w-4" />
                선택삭제
              </button>
            </div>

            <CartSummary summary={summary} />

            <div className="flex-row-center mt-8 gap-4">
              <button
                type="button"
                onClick={() => navigate('/products')}
                className="rounded-full border border-neutral-400 px-8 py-4 text-[15px] font-medium text-neutral-800 transition hover:bg-neutral-50"
              >
                쇼핑하러 가기
              </button>
              <button
                type="button"
                onClick={purchaseSelected}
                className="rounded-full border border-neutral-400 px-8 py-4 text-[15px] font-medium text-neutral-800 transition hover:bg-neutral-50"
              >
                선택상품구매
              </button>
              <button
                type="button"
                onClick={purchaseAll}
                className="rounded-full bg-black px-8 py-4 text-[15px] font-medium text-white transition hover:bg-neutral-800"
              >
                전체상품구매
              </button>
            </div>
          </>
        ) : (
          <CartEmptyState />
        )}
      </div>
    </div>
  );
};

export default Cart;
