import {
  ProductRequestDTOCategory,
  type ProductRequestDTOCategory as ProductCategory,
} from '@apis/telegro';
import type { ChangeEvent, FormEvent, ReactNode } from 'react';

export type ProductFormValues = {
  productModel: string;
  productName: string;
  category: ProductCategory;
  content: string;
  optionsText: string;
  price: string;
  priceBussiness: string;
  priceBest: string;
  priceDealer: string;
  priceCustomer: string;
  coverImage: string;
  pictures: string[];
};

type ProductFormProps = {
  mode: 'create' | 'edit';
  values: ProductFormValues;
  error: string;
  isSubmitting: boolean;
  isUploadingCover: boolean;
  isUploadingPictures: boolean;
  contentEditor: ReactNode;
  onChange: <K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K],
  ) => void;
  onUploadCover: (event: ChangeEvent<HTMLInputElement>) => Promise<void> | void;
  onUploadPictures: (
    event: ChangeEvent<HTMLInputElement>,
  ) => Promise<void> | void;
  onRemovePicture: (index: number) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
};

const CATEGORY_OPTIONS = [
  ProductRequestDTOCategory.HEADSET,
  ProductRequestDTOCategory.PHONE_AMP,
  ProductRequestDTOCategory.LINE_CORD,
  ProductRequestDTOCategory.RECORDER,
  ProductRequestDTOCategory.ACCESSORY,
] as const;

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  HEADSET: '헤드셋',
  PHONE_AMP: '폰 앰프',
  LINE_CORD: '라인 코드',
  RECORDER: '레코더',
  ACCESSORY: '액세서리',
};

const PRICE_FIELDS: Array<{
  key:
    | 'price'
    | 'priceBussiness'
    | 'priceBest'
    | 'priceDealer'
    | 'priceCustomer';
  label: string;
  placeholder: string;
}> = [
  { key: 'price', label: '기본 가격', placeholder: '예: 24000' },
  { key: 'priceBussiness', label: '비즈니스 가격', placeholder: '예: 22000' },
  { key: 'priceBest', label: '베스트 가격', placeholder: '예: 21000' },
  { key: 'priceDealer', label: '딜러 가격', placeholder: '예: 20000' },
  { key: 'priceCustomer', label: '고객 가격', placeholder: '예: 24000' },
];

const inputClassName =
  'h-[5.6rem] rounded-[1.6rem] border border-[#E3E3E3] px-[1.6rem] text-[1.5rem] text-gray-900 transition outline-none placeholder:text-gray-400 focus:border-[#FF9B2F] focus:ring-4 focus:ring-[#FFE4C4] disabled:cursor-not-allowed disabled:bg-[#F7F7F7]';

const ProductForm = ({
  mode,
  values,
  error,
  isSubmitting,
  isUploadingCover,
  isUploadingPictures,
  contentEditor,
  onChange,
  onUploadCover,
  onUploadPictures,
  onRemovePicture,
  onSubmit,
  onCancel,
}: ProductFormProps) => {
  return (
    <section className="overflow-hidden rounded-[3rem] border border-[#EAEAEA] bg-white shadow-[0_22px_60px_rgba(15,23,42,0.06)]">
      <div className="border-b border-[#F1F1F1] bg-[#FFFAF5] px-[3rem] py-[1.8rem] md:px-[3.2rem]">
        <h1 className="title5 mt-[0.8rem] text-gray-900">
          {mode === 'edit' ? '상품 수정' : '상품 등록'}
        </h1>
      </div>

      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-[2.4rem] px-[2rem] py-[2.4rem] md:px-[3.2rem] md:py-[3.2rem]"
      >
        <div className="grid gap-[1.6rem] md:grid-cols-2">
          <Field label="상품명 *">
            <input
              type="text"
              value={values.productName}
              onChange={(event) => onChange('productName', event.target.value)}
              placeholder="상품명을 입력해 주세요."
              disabled={isSubmitting}
              className={inputClassName}
            />
          </Field>

          <Field label="모델명 *">
            <input
              type="text"
              value={values.productModel}
              onChange={(event) => onChange('productModel', event.target.value)}
              placeholder="모델명을 입력해 주세요."
              disabled={isSubmitting}
              className={inputClassName}
            />
          </Field>
        </div>

        <div className="grid gap-[1.6rem] md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
          <Field label="카테고리 *">
            <select
              value={values.category}
              onChange={(event) =>
                onChange('category', event.target.value as ProductCategory)
              }
              disabled={isSubmitting}
              className={inputClassName}
            >
              {CATEGORY_OPTIONS.map((category) => (
                <option key={category} value={category}>
                  {CATEGORY_LABELS[category]}
                </option>
              ))}
            </select>
          </Field>

          <Field label="옵션">
            <input
              type="text"
              value={values.optionsText}
              onChange={(event) => onChange('optionsText', event.target.value)}
              placeholder="콤마(,)로 옵션을 구분해 입력해 주세요."
              disabled={isSubmitting}
              className={inputClassName}
            />
          </Field>
        </div>

        <div className="flex flex-col gap-[1.2rem]">
          <span className="text-[1.5rem] font-semibold tracking-[-0.03em] text-gray-900">
            상세 설명 *
          </span>
          <div className="overflow-hidden rounded-[2.4rem] border border-[#E3E3E3] bg-white">
            {contentEditor}
          </div>
          <p className="text-[1.3rem] leading-[1.7] text-gray-500">
            에디터 이미지 버튼을 사용하면 presigned URL 업로드 후 본문에 즉시
            삽입됩니다.
          </p>
        </div>

        <div className="grid gap-[1.6rem] md:grid-cols-2 xl:grid-cols-3">
          {PRICE_FIELDS.map((field) => (
            <Field key={field.key} label={field.label}>
              <input
                type="text"
                inputMode="numeric"
                value={values[field.key]}
                onChange={(event) => onChange(field.key, event.target.value)}
                placeholder={field.placeholder}
                disabled={isSubmitting}
                className={inputClassName}
              />
            </Field>
          ))}
        </div>

        <div className="grid gap-[2rem] xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="flex flex-col gap-[1.2rem]">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[1.5rem] font-semibold tracking-[-0.03em] text-gray-900">
                대표 이미지
              </span>
              {values.coverImage ? (
                <button
                  type="button"
                  onClick={() => onChange('coverImage', '')}
                  disabled={isSubmitting}
                  className="text-[1.3rem] font-semibold text-red-500 transition hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  삭제
                </button>
              ) : null}
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-[#F0F0F0] bg-[#FCFCFC]">
              {values.coverImage ? (
                <img
                  src={values.coverImage}
                  alt={values.productName || '상품 대표 이미지'}
                  className="h-[24rem] w-full object-cover"
                />
              ) : (
                <div className="flex h-[24rem] items-center justify-center px-[1.6rem] text-center text-[1.4rem] text-gray-500">
                  업로드한 대표 이미지가 없습니다.
                </div>
              )}
            </div>

            <label className="inline-flex h-[4.4rem] w-fit cursor-pointer items-center justify-center rounded-[1.4rem] border border-[#FFD8B0] bg-[#FFF5EA] px-[1.6rem] text-[1.4rem] font-semibold text-[#D86B00] transition hover:bg-[#FFEBD4]">
              {isUploadingCover ? '업로드 중...' : '대표 이미지 업로드'}
              <input
                type="file"
                accept="image/*"
                onChange={onUploadCover}
                disabled={isSubmitting || isUploadingCover}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex flex-col gap-[1.2rem]">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[1.5rem] font-semibold tracking-[-0.03em] text-gray-900">
                상세 이미지
              </span>
              <label className="inline-flex h-[4.4rem] cursor-pointer items-center justify-center rounded-[1.4rem] border border-[#FFD8B0] bg-[#FFF5EA] px-[1.6rem] text-[1.4rem] font-semibold text-[#D86B00] transition hover:bg-[#FFEBD4]">
                {isUploadingPictures ? '업로드 중...' : '이미지 추가'}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={onUploadPictures}
                  disabled={isSubmitting || isUploadingPictures}
                  className="hidden"
                />
              </label>
            </div>

            {values.pictures.length ? (
              <div className="grid gap-[1rem] sm:grid-cols-2">
                {values.pictures.map((picture, index) => (
                  <div
                    key={`${picture}-${index}`}
                    className="overflow-hidden rounded-[1.8rem] border border-[#F0F0F0] bg-white"
                  >
                    <img
                      src={picture}
                      alt={`상세 이미지 ${index + 1}`}
                      className="h-[14rem] w-full object-cover"
                    />
                    <div className="flex items-center justify-between gap-3 px-[1.2rem] py-[1rem]">
                      <span className="min-w-0 truncate text-[1.3rem] text-gray-500">
                        이미지 {index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => onRemovePicture(index)}
                        disabled={isSubmitting}
                        className="text-[1.3rem] font-semibold text-red-500 transition hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[2rem] border border-dashed border-[#E2E2E2] bg-[#FCFCFC] px-[1.6rem] py-[1.8rem] text-[1.4rem] text-gray-500">
                업로드한 상세 이미지가 없습니다.
              </div>
            )}
          </div>
        </div>

        {error ? (
          <div className="rounded-[1.8rem] border border-[#FFD5D5] bg-[#FFF5F5] px-[1.6rem] py-[1.3rem] text-[1.4rem] text-red-600">
            {error}
          </div>
        ) : null}

        <div className="flex flex-col-reverse gap-[1rem] pt-[0.8rem] sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="inline-flex h-[5.2rem] items-center justify-center rounded-[1.6rem] border border-[#E5E7EB] bg-white px-[2rem] text-[1.5rem] font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isUploadingCover || isUploadingPictures}
            className="inline-flex h-[5.2rem] items-center justify-center rounded-[1.6rem] border border-[#FFB86B] bg-[#FF9B2F] px-[2rem] text-[1.5rem] font-semibold text-white shadow-[0_16px_34px_rgba(255,155,47,0.18)] transition hover:bg-[#F08D22] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? mode === 'edit'
                ? '수정 중...'
                : '등록 중...'
              : mode === 'edit'
                ? '수정'
                : '등록'}
          </button>
        </div>
      </form>
    </section>
  );
};

const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <label className="flex flex-col gap-[0.8rem]">
    <span className="text-[1.5rem] font-semibold tracking-[-0.03em] text-gray-900">
      {label}
    </span>
    {children}
  </label>
);

export default ProductForm;
