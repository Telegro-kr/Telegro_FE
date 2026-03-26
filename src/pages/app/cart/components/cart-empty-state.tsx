export function CartEmptyState() {
  return (
    <div className="flex-col-center min-h-[32rem] border border-dashed border-neutral-200 bg-neutral-50 py-[3rem] text-neutral-400">
      <img src="/cart-empty.svg" className="size-[25rem]" />
      <span className="title3">장바구니가 비어 있습니다.</span>
    </div>
  );
}
