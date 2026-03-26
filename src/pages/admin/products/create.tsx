import {
  createProduct,
  getPresignedUrl,
  updateProduct,
  useGetProductDetail,
  type ProductRequestDTO,
} from '@apis/telegro';
import ProductForm, {
  type ProductFormValues,
} from '@components/admin/product/product-form';
import AdminProfileCard from '@components/admin/profile-card/profile-card';
import LoadingPanel from '@components/common/loading-panel';
import { toastError, toastSuccess } from '@components/common/toast/toast';
import queryClient from '@libs/query-client';
import { Editor } from '@toast-ui/react-editor';
import color from '@toast-ui/editor-plugin-color-syntax';
import axios from 'axios';
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createDefaultProductFormValues,
  mapProductDetailToFormValues,
  normalizeProductPayload,
  validateProductFormValues,
} from './product-form.utils';
import '@toast-ui/editor/dist/toastui-editor.css';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';

const isHtmlEmpty = (value: string) => {
  const hasMediaContent = /<(img|video|iframe|audio|object|embed)\b/i.test(value);
  if (hasMediaContent) {
    return false;
  }

  const normalized = value
    .replace(/<br\s*\/?>/gi, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .trim();

  return normalized.length === 0;
};

const getUploadFileName = (file: Blob | File) => {
  if ('name' in file && file.name) {
    return file.name;
  }

  const extension = file.type.split('/')[1] || 'png';
  return `product-image-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;
};

const invalidateProductQueries = () =>
  queryClient.invalidateQueries({
    predicate: (query) =>
      Array.isArray(query.queryKey) &&
      typeof query.queryKey[0] === 'string' &&
      query.queryKey[0].startsWith('/products'),
  });

const AdminProductCreate = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const resolvedProductId = Number(productId);
  const isEditMode = Number.isFinite(resolvedProductId) && resolvedProductId > 0;
  const isHydratedRef = useRef(false);
  const editorRef = useRef<Editor>(null);

  const [values, setValues] = useState<ProductFormValues>(
    createDefaultProductFormValues,
  );
  const [error, setError] = useState('');
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingPictures, setIsUploadingPictures] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const productDetailQuery = useGetProductDetail(resolvedProductId, {
    query: {
      enabled: isEditMode,
      staleTime: 60_000,
    },
  });

  useEffect(() => {
    isHydratedRef.current = false;
    setValues(createDefaultProductFormValues());
    setError('');
  }, [resolvedProductId]);

  useEffect(() => {
    if (!isEditMode || isHydratedRef.current) {
      return;
    }

    const detail = productDetailQuery.data?.data;
    const editorInstance = editorRef.current?.getInstance();

    if (!detail || !editorInstance) {
      return;
    }

    const nextValues = mapProductDetailToFormValues(detail);
    setValues(nextValues);
    editorInstance.setHTML(nextValues.content || ' ');
    isHydratedRef.current = true;
  }, [isEditMode, productDetailQuery.data?.data]);

  const updateField = <K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K],
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const uploadImage = async (file: Blob | File) => {
    const response = await getPresignedUrl({
      prefix: 'product',
      fileName: getUploadFileName(file),
    });

    const presignedUrl = response.data?.url;

    if (!presignedUrl) {
      throw new Error('Presigned URL not found');
    }

    await axios.put(presignedUrl, file, {
      headers: {
        'Content-Type': file.type || 'application/octet-stream',
      },
    });

    return presignedUrl.split('?')[0];
  };

  const handleUploadCover = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setError('');
    setIsUploadingCover(true);

    try {
      const imageUrl = await uploadImage(file);
      updateField('coverImage', imageUrl);
      toastSuccess('Cover image uploaded.');
    } catch {
      setError('Failed to upload the cover image.');
      toastError('Cover image upload failed.');
    } finally {
      setIsUploadingCover(false);
      event.target.value = '';
    }
  };

  const handleUploadPictures = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    if (!selectedFiles.length) {
      return;
    }

    setError('');
    setIsUploadingPictures(true);

    try {
      const imageUrls = await Promise.all(selectedFiles.map(uploadImage));
      setValues((prev) => ({
        ...prev,
        pictures: [...prev.pictures, ...imageUrls],
      }));
      toastSuccess('Detail images uploaded.');
    } catch {
      setError('Failed to upload detail images.');
      toastError('Detail image upload failed.');
    } finally {
      setIsUploadingPictures(false);
      event.target.value = '';
    }
  };

  const addImageBlobHook = async (
    blob: Blob | File,
    callback: (url: string, text?: string) => void,
  ) => {
    setError('');

    try {
      const imageUrl = await uploadImage(blob);
      callback(imageUrl, 'image');
      toastSuccess('Editor image uploaded.');
    } catch {
      setError('Failed to upload an editor image.');
      toastError('Editor image upload failed.');
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const editorInstance = editorRef.current?.getInstance();
    const htmlContent = editorInstance?.getHTML() ?? values.content;
    const nextValues = {
      ...values,
      content: htmlContent,
    };

    const validationMessage = validateProductFormValues(nextValues);

    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    if (isHtmlEmpty(htmlContent)) {
      setError('Please enter product description content.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const payload: ProductRequestDTO = normalizeProductPayload(nextValues);

      if (isEditMode) {
        await updateProduct(resolvedProductId, payload);
      } else {
        await createProduct(payload);
      }

      await invalidateProductQueries();

      toastSuccess(isEditMode ? 'Product updated.' : 'Product created.');
      navigate(isEditMode ? `/admin/products/${resolvedProductId}` : '/admin/products');
    } catch (submitError) {
      if (axios.isAxiosError(submitError) && submitError.response?.status === 403) {
        setError('Admin permission is required.');
      } else {
        setError(
          isEditMode
            ? 'Failed to update the product.'
            : 'Failed to create the product.',
        );
      }
      toastError(isEditMode ? 'Product update failed.' : 'Product creation failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEditMode && productDetailQuery.isLoading) {
    return <LoadingPanel fullScreen size={140} />;
  }

  if (isEditMode && (productDetailQuery.isError || !productDetailQuery.data?.data)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FBFBF8] px-6 text-[1.1rem] text-[#4B5563]">
        Failed to load product details.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[4rem] bg-[#FAFAFA] px-[2rem] py-[2rem] md:px-[5rem] md:py-[3rem] lg:px-[10rem] lg:py-[5rem]">
      <AdminProfileCard onMove={() => navigate('/')} />
      <ProductForm
        mode={isEditMode ? 'edit' : 'create'}
        values={values}
        error={error}
        isSubmitting={isSubmitting}
        isUploadingCover={isUploadingCover}
        isUploadingPictures={isUploadingPictures}
        contentEditor={
          <Editor
            ref={editorRef}
            initialValue=" "
            previewStyle="vertical"
            height="500px"
            initialEditType="wysiwyg"
            useCommandShortcut
            hooks={{ addImageBlobHook }}
            onChange={() => {
              const nextContent = editorRef.current?.getInstance().getHTML() ?? '';
              updateField('content', nextContent);
            }}
            toolbarItems={[
              ['heading', 'bold', 'italic', 'strike'],
              ['hr', 'quote'],
              ['ul', 'ol', 'task', 'indent', 'outdent'],
              ['table', 'link', 'image'],
            ]}
            plugins={[color]}
          />
        }
        onChange={updateField}
        onUploadCover={handleUploadCover}
        onUploadPictures={handleUploadPictures}
        onRemovePicture={(index) =>
          setValues((prev) => ({
            ...prev,
            pictures: prev.pictures.filter((_, pictureIndex) => pictureIndex !== index),
          }))
        }
        onSubmit={handleSubmit}
        onCancel={() =>
          navigate(isEditMode ? `/admin/products/${resolvedProductId}` : '/admin/products')
        }
      />
    </div>
  );
};

export default AdminProductCreate;
