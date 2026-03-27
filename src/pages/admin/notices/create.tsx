import {
  createNotice,
  getPresignedUrl,
  updateNotice,
  useGetNoticeDetail,
  type NoticeFile,
} from '@apis/telegro';
import queryClient from '@libs/query-client';
import { Editor } from '@toast-ui/react-editor';
import axios from 'axios';
import color from '@toast-ui/editor-plugin-color-syntax';
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type MouseEvent,
} from 'react';
import { toastError, toastSuccess } from '@components/common/toast/toast';
import { useNavigate, useParams } from 'react-router-dom';
import '@toast-ui/editor/dist/toastui-editor.css';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';

const isHtmlEmpty = (value: string) => {
  const hasMediaContent = /<(img|video|iframe|audio|object|embed)\b/i.test(
    value,
  );
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
  return `notice-image-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;
};

const invalidateNoticeQueries = () =>
  queryClient.invalidateQueries({
    predicate: (query) =>
      Array.isArray(query.queryKey) &&
      typeof query.queryKey[0] === 'string' &&
      query.queryKey[0].startsWith('/notices'),
  });

const AdminNoticeCreate = () => {
  const navigate = useNavigate();
  const { noticeId } = useParams();
  const resolvedNoticeId = Number(noticeId);
  const isEditMode = Number.isFinite(resolvedNoticeId) && resolvedNoticeId > 0;

  const editorRef = useRef<Editor>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);
  const isHydratedRef = useRef(false);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [noticeFiles, setNoticeFiles] = useState<NoticeFile[]>([]);
  const [error, setError] = useState('');
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const noticeDetailQuery = useGetNoticeDetail(resolvedNoticeId, {
    query: {
      enabled: isEditMode,
      staleTime: 60_000,
    },
  });

  useEffect(() => {
    isHydratedRef.current = false;
  }, [resolvedNoticeId]);

  useEffect(() => {
    if (!isEditMode || isHydratedRef.current) {
      return;
    }

    const detail = noticeDetailQuery.data?.data;
    const editorInstance = editorRef.current?.getInstance();

    if (!detail || !editorInstance) {
      return;
    }

    setTitle(detail.noticeTitle?.trim() || '');
    setNoticeFiles(
      (detail.noticeFiles ?? []).map((file) => ({
        id: file.id,
        fileName: file.fileName?.trim() || '',
        fileUrl: file.fileUrl?.trim() || '',
      })),
    );
    const nextContent = detail.noticeContent?.trim() || '';
    editorInstance.setHTML(nextContent);
    setContent(nextContent);
    isHydratedRef.current = true;
  }, [isEditMode, noticeDetailQuery.data?.data]);

  const uploadToPresignedUrl = async (
    file: Blob | File,
    fileName = getUploadFileName(file),
  ): Promise<NoticeFile> => {
    const response = await getPresignedUrl({
      prefix: 'notice',
      fileName,
    });

    const presignedUrl = response.data?.url;

    if (!presignedUrl) {
      throw new Error('Presigned URL을 찾을 수 없습니다.');
    }

    await axios.put(presignedUrl, file, {
      headers: {
        'Content-Type': file.type || 'application/octet-stream',
      },
    });

    return {
      fileName,
      fileUrl: presignedUrl.split('?')[0],
    };
  };

  const handleAddFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    if (!selectedFiles.length) return;

    setError('');
    setIsUploadingFiles(true);

    try {
      const uploadedFiles = await Promise.all(
        selectedFiles.map((file) => uploadToPresignedUrl(file, file.name)),
      );

      setNoticeFiles((prev) => [...prev, ...uploadedFiles]);
      toastSuccess('첨부파일 업로드를 완료했습니다.');
    } catch {
      setError('파일 업로드 중 오류가 발생했습니다.');
      toastError('파일 업로드에 실패했습니다.');
    } finally {
      setIsUploadingFiles(false);
      event.target.value = '';
    }
  };

  const handleDeleteFile = (indexToDelete: number) => {
    setNoticeFiles((prev) =>
      prev.filter((_, index) => index !== indexToDelete),
    );
  };

  const addImageBlobHook = async (
    blob: Blob | File,
    callback: (url: string, text?: string) => void,
  ) => {
    setError('');

    try {
      const uploadedImage = await uploadToPresignedUrl(blob);
      callback(uploadedImage.fileUrl ?? '', 'image');
      toastSuccess('이미지 업로드를 완료했습니다.');
    } catch {
      setError('이미지 업로드 중 오류가 발생했습니다.');
      toastError('이미지 업로드에 실패했습니다.');
    }
  };

  const handleSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const editorInstance = editorRef.current?.getInstance();
    const htmlContent = editorInstance?.getHTML() ?? content;

    if (!title.trim()) {
      setError('제목을 입력해 주세요.');
      return;
    }

    if (isHtmlEmpty(htmlContent)) {
      setError('내용을 입력해 주세요.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      if (isEditMode) {
        await updateNotice(resolvedNoticeId, {
          title: title.trim(),
          context: htmlContent,
          noticeFiles,
        });
      } else {
        await createNotice({
          title: title.trim(),
          context: htmlContent,
          noticeFiles,
        });
      }

      await invalidateNoticeQueries();

      toastSuccess(
        isEditMode ? '공지사항을 수정했습니다.' : '공지사항이 등록되었습니다.',
      );
      navigate(
        isEditMode ? `/admin/notices/${resolvedNoticeId}` : '/admin/notices',
      );
    } catch (submitError) {
      if (
        axios.isAxiosError(submitError) &&
        submitError.response?.status === 403
      ) {
        setError('관리자 계정으로 로그인해 주세요.');
      } else {
        setError(
          isEditMode
            ? '공지사항 수정 중 오류가 발생했습니다.'
            : '공지사항 등록 중 오류가 발생했습니다.',
        );
      }
      toastError(
        isEditMode
          ? '공지사항 수정에 실패했습니다.'
          : '공지사항 등록에 실패했습니다.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-[4rem] bg-[#FAFAFA] px-[2rem] py-[2rem] md:px-[5rem] md:py-[3rem] lg:px-[10rem] lg:py-[5rem]">
      <section className="overflow-hidden rounded-[3rem] border border-[#EAEAEA] bg-white shadow-[0_22px_60px_rgba(15,23,42,0.06)]">
        <div className="border-b border-[#F1F1F1] bg-[#FFFAF5] px-[3rem] py-[1.8rem]">
          <h1 className="title5 mt-[0.8rem] text-gray-900">
            {isEditMode ? '공지사항 수정' : '공지사항 등록'}
          </h1>
        </div>

        <div className="flex flex-col gap-[2.4rem] px-[2rem] py-[2.4rem] md:px-[3.2rem] md:py-[3.2rem]">
          <label className="flex flex-col gap-[0.8rem]">
            <span className="text-[1.5rem] font-semibold tracking-[-0.03em] text-gray-900">
              제목 *
            </span>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="제목을 입력해 주세요."
              disabled={isEditMode && noticeDetailQuery.isLoading}
              className="h-[5.6rem] rounded-[1.6rem] border border-[#E3E3E3] px-[1.6rem] text-[1.5rem] text-gray-900 transition outline-none placeholder:text-gray-400 focus:border-[#FF9B2F] focus:ring-4 focus:ring-[#FFE4C4] disabled:cursor-not-allowed disabled:bg-[#F7F7F7]"
            />
          </label>

          <div className="flex flex-col gap-[1.2rem]">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[1.5rem] font-semibold tracking-[-0.03em] text-gray-900">
                첨부파일
              </span>
              <button
                type="button"
                onClick={() => attachmentInputRef.current?.click()}
                disabled={
                  isUploadingFiles ||
                  isSubmitting ||
                  (isEditMode && noticeDetailQuery.isLoading)
                }
                className="inline-flex h-[4.4rem] items-center justify-center rounded-[1.4rem] border border-[#FFD8B0] bg-[#FFF5EA] px-[1.6rem] text-[1.4rem] font-semibold text-[#D86B00] transition hover:bg-[#FFEBD4] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUploadingFiles ? '업로드 중...' : '파일 추가'}
              </button>
            </div>

            <input
              ref={attachmentInputRef}
              type="file"
              multiple
              onChange={handleAddFile}
              className="hidden"
            />

            {noticeFiles.length ? (
              <ul className="flex flex-col gap-[0.8rem] rounded-[2rem] border border-[#F0F0F0] bg-[#FCFCFC] p-[1.4rem]">
                {noticeFiles.map((file, index) => (
                  <li
                    key={`${file.fileUrl ?? file.fileName ?? index}-${index}`}
                    className="flex items-center justify-between gap-4 rounded-[1.4rem] border border-[#F2F2F2] bg-white px-[1.4rem] py-[1.2rem]"
                  >
                    <span className="min-w-0 truncate text-[1.4rem] text-gray-700">
                      {file.fileName || '첨부파일'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteFile(index)}
                      disabled={isSubmitting}
                      className="text-[1.3rem] font-semibold text-red-500 transition hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      삭제
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-[2rem] border border-dashed border-[#E2E2E2] bg-[#FCFCFC] px-[1.6rem] py-[1.8rem] text-[1.4rem] text-gray-500">
                업로드한 첨부파일이 없습니다.
              </div>
            )}
          </div>

          <div className="flex flex-col gap-[1.2rem]">
            <span className="text-[1.5rem] font-semibold tracking-[-0.03em] text-gray-900">
              내용 *
            </span>
            <div className="overflow-hidden rounded-[2.4rem] border border-[#E3E3E3] bg-white">
              <Editor
                ref={editorRef}
                initialValue=" "
                previewStyle="vertical"
                height="500px"
                initialEditType="wysiwyg"
                useCommandShortcut
                hooks={{ addImageBlobHook }}
                onChange={() => {
                  const nextContent =
                    editorRef.current?.getInstance().getHTML() ?? '';
                  setContent(nextContent);
                }}
                toolbarItems={[
                  ['heading', 'bold', 'italic', 'strike'],
                  ['hr', 'quote'],
                  ['ul', 'ol', 'task', 'indent', 'outdent'],
                  ['table', 'link', 'image'],
                ]}
                plugins={[color]}
              />
            </div>
            <p className="text-[1.3rem] leading-[1.7] text-gray-500">
              에디터 이미지 버튼을 사용하면 presigned URL 업로드 후 본문에 즉시
              삽입됩니다.
            </p>
          </div>

          {error ? (
            <div className="rounded-[1.8rem] border border-[#FFD5D5] bg-[#FFF5F5] px-[1.6rem] py-[1.3rem] text-[1.4rem] text-red-600">
              {error}
            </div>
          ) : null}

          <div className="flex flex-col-reverse gap-[1rem] pt-[0.8rem] sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() =>
                navigate(
                  isEditMode
                    ? `/admin/notices/${resolvedNoticeId}`
                    : '/admin/notices',
                )
              }
              disabled={isSubmitting}
              className="inline-flex h-[5.2rem] items-center justify-center rounded-[1.6rem] border border-[#E5E7EB] bg-white px-[2rem] text-[1.5rem] font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={
                isSubmitting ||
                isUploadingFiles ||
                (isEditMode && noticeDetailQuery.isLoading)
              }
              className="inline-flex h-[5.2rem] items-center justify-center rounded-[1.6rem] border border-[#FFB86B] bg-[#FF9B2F] px-[2rem] text-[1.5rem] font-semibold text-white shadow-[0_16px_34px_rgba(255,155,47,0.18)] transition hover:bg-[#F08D22] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? isEditMode
                  ? '수정 중...'
                  : '등록 중...'
                : isEditMode
                  ? '수정'
                  : '등록'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminNoticeCreate;
