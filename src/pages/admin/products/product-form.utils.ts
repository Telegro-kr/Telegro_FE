import {
  ProductRequestDTOCategory,
  type ProductDetailResponseDTO,
  type ProductRequestDTO,
} from '@apis/telegro';
import type { ProductFormValues } from '@components/admin/product/product-form';
import { normalizePriceValue } from '@utils/format';

export type UpdateProductPayload = Omit<
  ProductRequestDTO,
  'price' | 'priceBussiness' | 'priceBest' | 'priceDealer' | 'priceCustomer'
> & {
  priceBussiness?: number;
  priceBest?: number;
  priceDealer?: number;
  priceCustomer?: number;
};

export const createDefaultProductFormValues = (): ProductFormValues => ({
  productModel: '',
  productName: '',
  category: ProductRequestDTOCategory.HEADSET,
  content: '',
  optionsText: '',
  price: '',
  priceBussiness: '',
  priceBest: '',
  priceDealer: '',
  priceCustomer: '',
  coverImage: '',
  pictures: [],
});

export const mapProductDetailToFormValues = (
  product: ProductDetailResponseDTO,
): ProductFormValues => ({
  productModel: product.productModel?.trim() || '',
  productName: product.productName?.trim() || '',
  category: product.category ?? ProductRequestDTOCategory.HEADSET,
  content: product.content?.trim() || '',
  optionsText: (product.options ?? []).join(', '),
  price: product.price?.trim() || '',
  priceBussiness: product.priceBussiness?.trim() || '',
  priceBest: product.priceBest?.trim() || '',
  priceDealer: product.priceDealer?.trim() || '',
  priceCustomer: product.priceCustomer?.trim() || '',
  coverImage: product.coverImage?.trim() || '',
  pictures: (product.pictures ?? []).filter(Boolean),
});

export const normalizeCreateProductPayload = (
  values: ProductFormValues,
): ProductRequestDTO => ({
  productModel: values.productModel.trim(),
  productName: values.productName.trim(),
  category: values.category,
  content: values.content.trim(),
  options: values.optionsText
    .split(',')
    .map((option) => option.trim())
    .filter(Boolean),
  price: values.price.trim(),
  priceBussiness: values.priceBussiness.trim(),
  priceBest: values.priceBest.trim(),
  priceDealer: values.priceDealer.trim(),
  priceCustomer: values.priceCustomer.trim(),
  coverImage: values.coverImage.trim(),
  pictures: values.pictures,
});

export const normalizeUpdateProductPayload = (
  values: ProductFormValues,
): UpdateProductPayload => ({
  productModel: values.productModel.trim(),
  productName: values.productName.trim(),
  category: values.category,
  content: values.content.trim(),
  options: values.optionsText
    .split(',')
    .map((option) => option.trim())
    .filter(Boolean),
  priceBussiness: normalizePriceValue(values.priceBussiness),
  priceBest: normalizePriceValue(values.priceBest),
  priceDealer: normalizePriceValue(values.priceDealer),
  priceCustomer: normalizePriceValue(values.priceCustomer),
  coverImage: values.coverImage.trim(),
  pictures: values.pictures,
});

export const validateProductFormValues = (
  values: ProductFormValues,
  mode: 'create' | 'edit',
) => {
  if (!values.productName.trim()) {
    return 'Please enter a product name.';
  }

  if (!values.productModel.trim()) {
    return 'Please enter a model name.';
  }

  if (!values.content.trim()) {
    return 'Please enter product description content.';
  }

  if (mode === 'create' && !values.price.trim()) {
    return 'Please enter the base price.';
  }

  if (!values.priceBussiness.trim()) {
    return 'Please enter the business price.';
  }

  if (!values.priceBest.trim()) {
    return 'Please enter the best price.';
  }

  if (!values.priceDealer.trim()) {
    return 'Please enter the dealer price.';
  }

  if (!values.priceCustomer.trim()) {
    return 'Please enter the customer price.';
  }

  if (!values.coverImage.trim()) {
    return 'Please upload a cover image.';
  }

  return '';
};
