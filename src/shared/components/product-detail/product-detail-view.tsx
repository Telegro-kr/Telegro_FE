import { type ProductDetailResponseDTO } from '@apis/telegro';
import ExploreScrollToTop from '@components/common/explore-scroll-to-top';
import ProductDetailGallery from '@components/product-detail/product-detail-gallery';
import ProductDetailPurchasePanel from '@components/product-detail/product-detail-purchase-panel';
import ProductDetailRecommendationSection from '@components/product-detail/product-detail-recommendation-section';
import ProductDetailTabs from '@components/product-detail/product-detail-tabs';
import {
  type ProductTab,
  type RecommendationItem,
} from '@hooks/use-product-detail';
import { formatPrice } from '@utils/format';
import { useRef } from 'react';

const RETURN_NOTICE_ITEMS = [
  '판매자에게 입금으로 배송비를 지불하실 경우, 교환/반품 택배비는 계좌입금 부탁드립니다. 상품 동봉은 불가합니다.',
  '입금 시에는 주문자명으로 입금해 주세요. 입금자명이 다르면 문의가 필요합니다.',
];

const RETURN_NOTICE_HIGHLIGHTS = [
  '입금계좌: 우리은행 540-263910-02-001 (예금주: 연경진)',
  '반품 및 교환 배송지: 기존 AS 물류배송지',
];

const SHIPPING_NOTICE_ITEMS = [
  '택배비는 기본 3,000원(선불)이며, 반품 시 왕복 6,000원을 부담합니다.',
  '주문 착오, 주소 및 전화번호 오기재, 연락두절 등 고객 부주의로 반품되는 경우 왕복 택배비는 고객 부담입니다.',
  '제품 발송 후 평균 배송 기간은 2~3일입니다. 주말, 공휴일 및 일부 지역은 더 소요될 수 있습니다.',
  '배송 준비 상태의 주문은 택배사 인계 중이므로 주문 취소가 불가합니다.',
];

const SHIPPING_NOTICE_HIGHLIGHTS = [
  '평일 오후 2시 이전 주문 건은 당일, 이후 주문 건은 익일 발송',
  '주말 및 법정 공휴일은 휴무',
  '제품별 재고 여부에 따라 출고일이 변경될 수 있습니다.',
];

const AS_AVAILABLE_ITEMS = [
  '배송된 상품이 주문 내용과 다르거나 상세페이지 내용과 상이한 경우',
  '상품이 파손 또는 손상된 상태로 배송된 경우',
  '그 밖에 판매자 귀책 사유로 인한 교환 및 환불인 경우',
];

const AS_UNAVAILABLE_ITEMS = [
  '제품 개봉 후 단순 변심인 경우. 단, 상품 확인을 위한 택배박스 개봉은 가능합니다.',
  '배송 완료 후 7일이 경과한 경우',
  '소비자 부주의로 제품이 파손 또는 손상된 경우',
  '구매자 오주문인 경우. 이때 택배비는 구매자 부담입니다.',
];

const TRANSACTION_INFO_ROWS = [
  ['재화 등의 배송방법에 관한 정보', '택배'],
  ['주문 이후 예상되는 배송기간', '대금 지급일로부터 3일 이내 발송'],
  [
    '제품하자·오배송 등에 따른 청약철회 등의 경우 청약철회 기한 및 통신판매업자가 부담하는 반품비용 등에 관한 정보',
    '전자상거래 등에서의 소비자보호에 관한 법률 등에 따른 청약철회 제한 사유에 해당하는 경우 및 이에 준하는 객관적 사유가 있으면 청약철회가 제한될 수 있습니다.',
  ],
  [
    '제품하자가 아닌 소비자의 단순변심에 따른 청약철회 시 소비자가 부담하는 반품비용 등에 관한 정보',
    '편도 3,000원, 최초 배송비 무료인 경우 6,000원 부과',
  ],
  [
    '제품하자가 아닌 소비자의 단순변심에 따른 청약철회가 불가능한 경우 그 구체적 사유와 근거',
    '전자상거래 등에서의 소비자보호에 관한 법률 등에 따른 청약철회 제한 사유에 해당하는 경우 및 이에 준하는 객관적 사유가 있으면 청약철회가 제한될 수 있습니다.',
  ],
  [
    '재화 등의 교환·반품 보증 조건 및 품질보증기준',
    '소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.',
  ],
  [
    '재화 등의 A/S 관련 연락',
    '웹사이트 우측 하단 카카오톡 채널로 문의해 주세요.',
  ],
  [
    '대금을 환불받기 위한 방법과 환불 지연 시 지연배상금을 지급받을 수 있다는 지연배상금 지급의 구체적 조건 및 절차',
    '웹사이트 우측 하단 카카오톡 채널로 문의해 주세요.',
  ],
  [
    '소비자피해보상의 처리, 재화 등에 대한 불만 처리 및 소비자와 사업자 사이의 분쟁처리에 관한 사항',
    '소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.',
  ],
  [
    '거래에 관한 약관의 내용 또는 확인할 수 있는 방법',
    '상품상세 페이지 및 페이지 하단의 이용약관 링크를 통해 확인할 수 있습니다.',
  ],
] as const;

type ProductDetailViewProps = {
  product: ProductDetailResponseDTO;
  activeTab: ProductTab;
  selectedImage: string;
  quantity: number;
  selectedOption: string;
  inputOption: string;
  galleryImages: string[];
  isDetailOpen: boolean;
  isLiked: boolean;
  likeCount: number;
  isShareCopied: boolean;
  totalPriceLabel: string;
  rewardPointLabel: string;
  recommendations: RecommendationItem[];
  isAdminMode?: boolean;
  isDeletePending?: boolean;
  recommendationDetailBasePath?: string;
  onChangeTab: (tab: ProductTab) => void;
  onSelectImage: (image: string) => void;
  onDecreaseQuantity: () => void;
  onIncreaseQuantity: () => void;
  onSelectOption: (option: string) => void;
  onInputOptionChange: (value: string) => void;
  onAddCart?: () => void;
  onPurchase?: () => void;
  onToggleDetail: () => void;
  onToggleLike: () => void;
  onShare: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

const ProductDetailView = ({
  product,
  activeTab,
  selectedImage,
  quantity,
  selectedOption,
  inputOption,
  galleryImages,
  isDetailOpen,
  isLiked,
  likeCount,
  isShareCopied,
  totalPriceLabel,
  rewardPointLabel,
  recommendations,
  isAdminMode = false,
  isDeletePending = false,
  recommendationDetailBasePath = '/products',
  onChangeTab,
  onSelectImage,
  onDecreaseQuantity,
  onIncreaseQuantity,
  onSelectOption,
  onInputOptionChange,
  onAddCart,
  onPurchase,
  onToggleDetail,
  onToggleLike,
  onShare,
  onEdit,
  onDelete,
}: ProductDetailViewProps) => {
  const pageRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={pageRef} className="min-h-screen bg-[#FBFBF8] text-gray-900">
      <main className="mx-auto flex w-full max-w-[124rem] flex-col px-6 pt-10 pb-24">
        <div className="mb-8 flex items-center gap-3 text-[1.05rem] text-[#9CA3AF]">
          <span>상품</span>
          <span>/</span>
          <span className="text-gray-500">{product.productName}</span>
        </div>

        <section className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,28rem)] lg:gap-16">
          <ProductDetailGallery
            selectedImage={selectedImage}
            images={galleryImages}
            productName={product.productName}
            onSelectImage={onSelectImage}
          />
          <ProductDetailPurchasePanel
            productName={product.productName}
            price={formatPrice(product.price)}
            rewardPointLabel={rewardPointLabel}
            quantity={quantity}
            category={product.category}
            options={product.options ?? []}
            selectedOption={selectedOption}
            inputOption={inputOption}
            isLiked={isLiked}
            likeCount={likeCount}
            isShareCopied={isShareCopied}
            totalPriceLabel={totalPriceLabel}
            onDecrease={onDecreaseQuantity}
            onIncrease={onIncreaseQuantity}
            onSelectOption={onSelectOption}
            onInputOptionChange={onInputOptionChange}
            onAddCart={onAddCart}
            onPurchase={onPurchase}
            onToggleLike={onToggleLike}
            onShare={onShare}
            isAdminMode={isAdminMode}
            isDeletePending={isDeletePending}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </section>

        <ProductDetailTabs activeTab={activeTab} onChange={onChangeTab} />

        <section className="mx-auto mt-12 flex w-full flex-col gap-16">
          {activeTab === 'detail' && (
            <>
              <button
                type="button"
                onClick={onToggleDetail}
                className="flex-row-center h-[4.8rem] w-full cursor-pointer gap-2 border-[2px] border-gray-600 bg-white text-[1.5rem] font-semibold text-[#263238] transition-colors hover:bg-gray-100"
              >
                <span>
                  {isDetailOpen ? '상품 상세 접기' : '상품 상세 보기'}
                </span>
                <span className={isDetailOpen ? 'rotate-0' : 'rotate-180'}>
                  <ChevronUpIcon />
                </span>
              </button>

              {isDetailOpen ? (
                product.content?.trim().startsWith('<') ? (
                  <div
                    className="text-[1.18rem] leading-[2] text-gray-700 [&_h1]:text-[2rem] [&_h1]:font-semibold [&_h2]:text-[1.7rem] [&_h2]:font-semibold [&_h3]:text-[1.45rem] [&_h3]:font-semibold [&_h4]:text-[1.3rem] [&_h4]:font-semibold [&_h5]:text-[1.18rem] [&_h5]:font-semibold [&_img]:my-6 [&_img]:rounded-[1.6rem] [&_img]:shadow-[0_12px_24px_rgba(15,23,42,0.08)] [&_li]:ml-6 [&_ol]:list-decimal [&_p]:min-h-[1.5rem] [&_strong]:font-semibold [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-[#E5E7EB] [&_td]:px-3 [&_td]:py-2 [&_th]:border [&_th]:border-[#E5E7EB] [&_th]:bg-[#F8FAFC] [&_th]:px-3 [&_th]:py-2 [&_ul]:list-disc"
                    dangerouslySetInnerHTML={{ __html: product.content }}
                  />
                ) : (
                  <div className="text-[1.18rem] leading-[2] whitespace-pre-line text-gray-700">
                    {product.content}
                  </div>
                )
              ) : null}
            </>
          )}
          {activeTab === 'review' ? (
            <EmptyPanel title="아직 등록된 리뷰가 없습니다." />
          ) : null}
          {activeTab === 'return' ? <ReturnPolicyPanel /> : null}
          {activeTab === 'qna' ? (
            <EmptyPanel title="아직 등록된 문의가 없습니다." />
          ) : null}
        </section>

        <ProductDetailRecommendationSection
          recommendations={recommendations}
          detailBasePath={recommendationDetailBasePath}
        />
      </main>
      <ExploreScrollToTop targetRef={pageRef} />
    </div>
  );
};

const EmptyPanel = ({ title }: { title: string }) => (
  <div className="flex h-[18rem] items-center justify-center border border-dashed border-[#D6DCE1] bg-white text-[1.3rem] text-[#7B8794]">
    {title}
  </div>
);

const ReturnPolicyPanel = () => (
  <div className="flex flex-col gap-8">
    <div className="grid gap-6 xl:grid-cols-2">
      <PolicyCard
        title="교환 반품 안내"
        items={RETURN_NOTICE_ITEMS}
        highlights={RETURN_NOTICE_HIGHLIGHTS}
      />
      <PolicyCard
        title="배송 안내"
        items={SHIPPING_NOTICE_ITEMS}
        highlights={SHIPPING_NOTICE_HIGHLIGHTS}
      />
    </div>

    <div className="rounded-[5px] border border-[#E5E7EB] bg-white px-7 py-6">
      <h3 className="text-[1.55rem] font-semibold text-[#263238]">
        A/S 정책 안내
      </h3>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <PolicyCard
          title="교환/환불이 가능한 경우"
          items={AS_AVAILABLE_ITEMS}
          tone="blue"
        />
        <PolicyCard
          title="교환/환불이 불가능한 경우"
          items={AS_UNAVAILABLE_ITEMS}
          tone="red"
        />
      </div>
    </div>

    <div className="overflow-hidden rounded-[5px] border border-[#E5E7EB] bg-white">
      <div className="border-b border-[#EEF2F6] px-7 py-5">
        <h3 className="text-[1.55rem] font-semibold text-[#263238]">
          거래 조건에 관한 정보
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[52rem] border-collapse">
          <tbody>
            {TRANSACTION_INFO_ROWS.map(([label, value]) => (
              <tr
                key={label}
                className="border-b border-[#EEF2F6] last:border-b-0"
              >
                <th className="w-[34%] bg-[#F8FAFC] px-6 py-5 text-left align-top text-[1.02rem] leading-[1.7] font-semibold text-[#334155]">
                  {label}
                </th>
                <td className="px-6 py-5 text-[1.02rem] leading-[1.8] text-[#4B5563]">
                  {value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const PolicyCard = ({
  title,
  items,
  highlights,
  tone = 'default',
}: {
  title: string;
  items: string[];
  highlights?: string[];
  tone?: 'default' | 'blue' | 'red';
}) => {
  const titleColor =
    tone === 'blue'
      ? 'text-[#2563EB]'
      : tone === 'red'
        ? 'text-[#DC2626]'
        : 'text-[#263238]';

  return (
    <div className="rounded-[5px] border border-[#E5E7EB] bg-white px-7 py-6">
      <h3 className={`text-[1.45rem] font-semibold ${titleColor}`}>{title}</h3>
      <ul className="mt-5 flex list-disc flex-col gap-3 pl-5">
        {items.map((item) => (
          <li
            key={item}
            className="text-[1.06rem] leading-[1.85] text-[#4B5563]"
          >
            {item}
          </li>
        ))}
      </ul>
      {highlights?.length ? (
        <div className="mt-5 rounded-[1.4rem] bg-[#F8FAFC] px-5 py-4">
          <ul className="flex flex-col gap-2">
            {highlights.map((item) => (
              <li
                key={item}
                className="text-[1rem] leading-[1.75] font-medium text-[#334155]"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

const ChevronUpIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
    <path
      d="M6 15L12 9L18 15"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ProductDetailView;
