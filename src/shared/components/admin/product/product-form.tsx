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
  HEADSET: 'Headset',
  PHONE_AMP: 'Phone Amp',
  LINE_CORD: 'Line Cord',
  RECORDER: 'Recorder',
  ACCESSORY: 'Accessory',
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
  { key: 'price', label: 'Base price', placeholder: 'ex. 24000' },
  { key: 'priceBussiness', label: 'Business price', placeholder: 'ex. 22000' },
  { key: 'priceBest', label: 'Best price', placeholder: 'ex. 21000' },
  { key: 'priceDealer', label: 'Dealer price', placeholder: 'ex. 20000' },
  { key: 'priceCustomer', label: 'Customer price', placeholder: 'ex. 24000' },
];

const inputClassName =
  'h-[5.4rem] rounded-[1.6rem] border border-[#E3E3E3] bg-white px-[1.6rem] text-[1.5rem] text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#FF9B2F] focus:ring-4 focus:ring-[#FFE4C4] disabled:cursor-not-allowed disabled:bg-[#F7F7F7]';

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
      <div className="border-b border-[#F1F1F1] bg-[linear-gradient(135deg,#F3F8FF_0%,#FFFFFF_60%)] px-[2.4rem] py-[2.4rem] md:px-[3.2rem]">
        <p className="text-[1.3rem] font-semibold uppercase tracking-[0.24em] text-[#2D6CDF]">
          Admin Product
        </p>
        <h1 className="mt-[0.8rem] text-[3rem] font-semibold tracking-[-0.04em] text-gray-900">
          {mode === 'edit' ? 'Edit Product' : 'Create Product'}
        </h1>
        <p className="mt-[0.8rem] text-[1.5rem] leading-[1.7] text-gray-500">
          Manage product info, pricing, and editor content in one place.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-[2.4rem] px-[2rem] py-[2.4rem] md:px-[3.2rem] md:py-[3.2rem]"
      >
        <div className="grid gap-[1.6rem] md:grid-cols-2">
          <Field label="Product name *">
            <input
              type="text"
              value={values.productName}
              onChange={(event) => onChange('productName', event.target.value)}
              placeholder="Enter product name"
              disabled={isSubmitting}
              className={inputClassName}
            />
          </Field>

          <Field label="Model name *">
            <input
              type="text"
              value={values.productModel}
              onChange={(event) => onChange('productModel', event.target.value)}
              placeholder="Enter model name"
              disabled={isSubmitting}
              className={inputClassName}
            />
          </Field>
        </div>

        <div className="grid gap-[1.6rem] md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
          <Field label="Category *">
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

          <Field label="Options">
            <textarea
              value={values.optionsText}
              onChange={(event) => onChange('optionsText', event.target.value)}
              placeholder="Enter one option per line"
              disabled={isSubmitting}
              className="min-h-[10rem] rounded-[1.8rem] border border-[#E3E3E3] bg-white px-[1.6rem] py-[1.4rem] text-[1.5rem] leading-[1.7] text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#FF9B2F] focus:ring-4 focus:ring-[#FFE4C4] disabled:cursor-not-allowed disabled:bg-[#F7F7F7]"
            />
          </Field>
        </div>

        <Field label="Description *">
          <div className="flex flex-col gap-[1.2rem]">
            <div className="overflow-hidden rounded-[2.4rem] border border-[#E3E3E3] bg-white">
              {contentEditor}
            </div>
            <p className="text-[1.3rem] leading-[1.7] text-gray-500">
              The editor image button uploads files through a presigned URL and inserts them into the body immediately.
            </p>
          </div>
        </Field>

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
          <Field label="Cover image">
            <div className="flex flex-col gap-[1.2rem]">
              <div className="overflow-hidden rounded-[2rem] border border-[#E5E7EB] bg-[#F8FAFC]">
                {values.coverImage ? (
                  <img
                    src={values.coverImage}
                    alt={values.productName || 'Product cover image'}
                    className="h-[24rem] w-full object-cover"
                  />
                ) : (
                  <div className="flex h-[24rem] items-center justify-center text-[1.4rem] text-gray-500">
                    No cover image
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-[1rem]">
                <label className="inline-flex cursor-pointer items-center justify-center rounded-[1.4rem] border border-[#CFE0FF] bg-[#EEF4FF] px-[1.6rem] py-[1.2rem] text-[1.4rem] font-semibold text-[#2457B8] transition hover:bg-[#E4EEFF]">
                  {isUploadingCover ? 'Uploading...' : 'Upload cover image'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onUploadCover}
                    disabled={isSubmitting || isUploadingCover}
                    className="hidden"
                  />
                </label>
                {values.coverImage ? (
                  <button
                    type="button"
                    onClick={() => onChange('coverImage', '')}
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center rounded-[1.4rem] border border-[#F5C2C2] bg-[#FFF5F5] px-[1.6rem] py-[1.2rem] text-[1.4rem] font-semibold text-[#D64545] transition hover:bg-[#FFEAEA] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Remove cover image
                  </button>
                ) : null}
              </div>
            </div>
          </Field>

          <Field label="Detail images">
            <div className="flex flex-col gap-[1.2rem]">
              <label className="inline-flex w-fit cursor-pointer items-center justify-center rounded-[1.4rem] border border-[#FFD8B0] bg-[#FFF5EA] px-[1.6rem] py-[1.2rem] text-[1.4rem] font-semibold text-[#D86B00] transition hover:bg-[#FFEBD4]">
                {isUploadingPictures ? 'Uploading...' : 'Add detail images'}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={onUploadPictures}
                  disabled={isSubmitting || isUploadingPictures}
                  className="hidden"
                />
              </label>

              {values.pictures.length ? (
                <div className="grid gap-[1rem] sm:grid-cols-2">
                  {values.pictures.map((picture, index) => (
                    <div
                      key={`${picture}-${index}`}
                      className="overflow-hidden rounded-[1.8rem] border border-[#E5E7EB] bg-white"
                    >
                      <img
                        src={picture}
                        alt={`Detail image ${index + 1}`}
                        className="h-[14rem] w-full object-cover"
                      />
                      <div className="flex items-center justify-between gap-3 px-[1.2rem] py-[1rem]">
                        <span className="min-w-0 truncate text-[1.3rem] text-gray-500">
                          Image {index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => onRemovePicture(index)}
                          disabled={isSubmitting}
                          className="text-[1.3rem] font-semibold text-red-500 transition hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-[1.8rem] border border-dashed border-[#E2E8F0] bg-[#FCFCFC] px-[1.6rem] py-[2rem] text-[1.4rem] text-gray-500">
                  No detail images
                </div>
              )}
            </div>
          </Field>
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
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isUploadingCover || isUploadingPictures}
            className="inline-flex h-[5.2rem] items-center justify-center rounded-[1.6rem] border border-[#CFE0FF] bg-[linear-gradient(135deg,#2D6CDF_0%,#4A8DFF_100%)] px-[2rem] text-[1.5rem] font-semibold text-white shadow-[0_16px_34px_rgba(45,108,223,0.24)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {isSubmitting
              ? mode === 'edit'
                ? 'Saving...'
                : 'Creating...'
              : mode === 'edit'
                ? 'Save'
                : 'Create'}
          </button>
        </div>
      </form>
    </section>
  );
};

const Field = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <div className="flex flex-col gap-[0.8rem]">
    <span className="text-[1.5rem] font-semibold tracking-[-0.03em] text-gray-900">
      {label}
    </span>
    {children}
  </div>
);

export default ProductForm;
