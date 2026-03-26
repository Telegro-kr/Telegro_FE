import {
  createNotice,
  getPresignedUrl,
  type NoticeFile,
} from '@apis/telegro';
import AdminProfileCard from '@components/admin/profile-card/profile-card';
import queryClient from '@libs/query-client';
import { Editor } from '@toast-ui/react-editor';
import axios from 'axios';
import color from '@toast-ui/editor-plugin-color-syntax';
import { useRef, useState, type ChangeEvent, type MouseEvent } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import '@toast-ui/editor/dist/toastui-editor.css';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';

const isHtmlEmpty = (value: string) => {
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

const AdminNoticeCreate = () => {
  const navigate = useNavigate();
  const editorRef = useRef<Editor>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [noticeFiles, setNoticeFiles] = useState<NoticeFile[]>([]);
  const [error, setError] = useState('');
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      throw new Error('Presigned URL not found');
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
      toast.success('첨부파일 업로드를 완료했습니다.');
    } catch {
      setError('파일 업로드 중 오류가 발생했습니다.');
      toast.error('파일 업로드에 실패했습니다.');
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
      toast.success('이미지 업로드를 완료했습니다.');
    } catch {
      setError('이미지 업로드 중 오류가 발생했습니다.');
      toast.error('이미지 업로드에 실패했습니다.');
    }
  };

  const handleSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const editorInstance = editorRef.current?.getInstance();
    const htmlContent = editorInstance?.getHTML() ?? '';

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
      await createNotice({
        title: title.trim(),
        context: htmlContent,
        noticeFiles,
      });

      await queryClient.invalidateQueries({
        queryKey: ['/notices'],
      });

      toast.success('공지사항이 등록되었습니다.');
      navigate('/admin/notices');
    } catch (submitError) {
      if (
        axios.isAxiosError(submitError) &&
        submitError.response?.status === 403
      ) {
        setError('관리자 계정으로 로그인해 주세요.');
      } else {
        setError('공지사항 등록 중 오류가 발생했습니다.');
      }
      toast.error('공지사항 등록에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-[4rem] bg-[#FAFAFA] px-[2rem] py-[2rem] md:px-[5rem] md:py-[3rem] lg:px-[10rem] lg:py-[5rem]">
      <AdminProfileCard onMove={() => navigate('/')} />

      <section className="overflow-hidden rounded-[3rem] border border-[#EAEAEA] bg-white shadow-[0_22px_60px_rgba(15,23,42,0.06)]">
        <div className="border-b border-[#F1F1F1] bg-[linear-gradient(135deg,#FFF7ED_0%,#FFFFFF_58%)] px-[2.4rem] py-[2.4rem] md:px-[3.2rem]">
          <p className="text-[1.3rem] font-semibold uppercase tracking-[0.24em] text-[#FF8A1F]">
            Admin Notice
          </p>
          <h1 className="mt-[0.8rem] text-[3rem] font-semibold tracking-[-0.04em] text-gray-900">
            공지사항 등록
          </h1>
          <p className="mt-[0.8rem] text-[1.5rem] leading-[1.7] text-gray-500">
            Toast UI 에디터로 본문을 작성하고 첨부파일까지 함께 등록합니다.
          </p>
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
              className="h-[5.6rem] rounded-[1.6rem] border border-[#E3E3E3] px-[1.6rem] text-[1.5rem] text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#FF9B2F] focus:ring-4 focus:ring-[#FFE4C4]"
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
                disabled={isUploadingFiles || isSubmitting}
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
              에디터 이미지 버튼을 사용하면 presigned URL 업로드 후 본문에 즉시 삽입됩니다.
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
              onClick={() => navigate('/admin/notices')}
              disabled={isSubmitting}
              className="inline-flex h-[5.2rem] items-center justify-center rounded-[1.6rem] border border-[#E5E7EB] bg-white px-[2rem] text-[1.5rem] font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || isUploadingFiles}
              className="inline-flex h-[5.2rem] items-center justify-center rounded-[1.6rem] border border-[#FFE2C0] bg-[linear-gradient(135deg,#FF9B2F_0%,#FFB652_100%)] px-[2rem] text-[1.5rem] font-semibold text-white shadow-[0_16px_34px_rgba(255,155,47,0.24)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {isSubmitting ? '등록 중...' : '등록'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminNoticeCreate;
