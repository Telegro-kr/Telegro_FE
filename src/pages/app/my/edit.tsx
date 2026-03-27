import {
  telegroInvalidate,
  type UserRequestDTO,
  useGetMyPage,
  useUpdateUser,
} from '@apis/telegro';
import LoadingPage from '@components/common/loading-page';
import { toastError, toastSuccess } from '@components/common/toast/toast';
import { useQueryClient } from '@tanstack/react-query';
import { formatPhoneNumber } from '@utils/format';
import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

type EditForm = {
  username: string;
  userId: string;
  email: string;
  phone: string;
  password: string;
};

const INITIAL_FORM: EditForm = {
  username: '',
  userId: '',
  email: '',
  phone: '',
  password: '',
};

function Field({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string;
  name: keyof EditForm;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-[1.3rem] font-semibold text-[#5D5D5D]">
        {label}
      </span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        inputMode={name === 'phone' ? 'numeric' : undefined}
        placeholder={placeholder}
        className="focus:border-primary mt-3 h-[5.6rem] w-full rounded-[1.2rem] border border-gray-300 px-5 text-[1.5rem] text-[#1F1F1F] transition-colors outline-none placeholder:text-gray-500"
      />
    </label>
  );
}

const MyEditPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const myPageQuery = useGetMyPage({
    query: {
      staleTime: 60_000,
    },
  });
  const updateUserMutation = useUpdateUser();
  const [form, setForm] = useState<EditForm>(INITIAL_FORM);

  useEffect(() => {
    const user = myPageQuery.data?.data;

    if (!user) {
      return;
    }

    setForm({
      username: user.userName?.trim() ?? '',
      userId: user.userId?.trim() ?? '',
      email: user.email?.trim() ?? '',
      phone: formatPhoneNumber(user.phone?.trim() ?? ''),
      password: '',
    });
  }, [myPageQuery.data]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === 'phone' ? formatPhoneNumber(value) : value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const user = myPageQuery.data?.data;

    if (!user?.id) {
      toastError('수정할 사용자 정보를 찾을 수 없습니다.');
      return;
    }

    if (
      !form.username.trim() ||
      !form.userId.trim() ||
      !form.email.trim() ||
      !form.phone.trim()
    ) {
      toastError('이름, 아이디, 이메일, 연락처를 모두 입력해 주세요.');
      return;
    }

    const payload: UserRequestDTO = {
      user: {
        username: form.username.trim(),
        userId: form.userId.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        ...(form.password.trim() ? { password: form.password } : {}),
      },
    };

    try {
      await updateUserMutation.mutateAsync({
        userId: user.id,
        data: payload,
      });

      await Promise.all([
        telegroInvalidate.myPage(queryClient),
        telegroInvalidate.authBoundaries(queryClient),
      ]);

      toastSuccess('내 정보가 수정되었습니다.');
      navigate('/app/my', { replace: true });
    } catch {
      toastError('내 정보 수정에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  if (myPageQuery.isLoading) {
    return <LoadingPage />;
  }

  if (myPageQuery.isError || !myPageQuery.data?.data) {
    return (
      <section className="min-h-screen bg-[#F7F4EE] px-8 py-10">
        <div className="mx-auto max-w-[72rem] rounded-[1.8rem] border border-[#EAE3D8] bg-white px-10 py-12 text-center shadow-[0_24px_60px_rgba(30,30,30,0.06)]">
          <p className="text-[2.2rem] font-semibold text-[#1E1E1E]">
            사용자 정보를 불러오지 못했습니다.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => myPageQuery.refetch()}
              className="rounded-[999px] bg-[#202020] px-8 py-3 text-[1.4rem] font-semibold text-white"
            >
              다시 불러오기
            </button>
            <Link
              to="/app/my"
              className="rounded-[999px] border border-[#D9D2C6] px-8 py-3 text-[1.4rem] font-semibold text-[#353535]"
            >
              마이페이지로
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen px-6 py-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-[72rem]">
        <div className="rounded-[2rem] border border-white/70 p-8 shadow-[0_24px_60px_rgba(22,22,22,0.08)] lg:p-10">
          <div>
            <Link
              to="/app/my"
              className="inline-flex items-center gap-2 text-[1.4rem] font-semibold text-[#6C6C6C]"
            >
              <FiArrowLeft className="text-[1.6rem]" />
              마이페이지
            </Link>
            <h1 className="mt-4 text-[3rem] font-semibold tracking-[-0.04em] text-[#171717]">
              내 정보 수정
            </h1>
            <p className="mt-2 text-[1.5rem] text-[#6C6C6C]">
              기본 회원 정보를 수정할 수 있습니다.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-10 space-y-8">
            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="이름"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="이름을 입력해 주세요"
              />
              <Field
                label="아이디"
                name="userId"
                value={form.userId}
                onChange={handleChange}
                placeholder="아이디를 입력해 주세요"
              />
              <Field
                label="이메일"
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                placeholder="example@telegro.com"
              />
              <Field
                label="연락처"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="연락처를 입력해 주세요"
              />
            </div>

            <div className="rounded-[1.4rem] border border-gray-300 p-6">
              <Field
                label="비밀번호"
                name="password"
                value={form.password}
                onChange={handleChange}
                type="password"
                placeholder="변경할 때만 입력해 주세요"
              />
              <p className="mt-3 text-[1.3rem] text-gray-600">
                비밀번호를 비워두면 기존 비밀번호를 유지합니다.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate('/app/my')}
                className="rounded-[999px] border border-gray-300 px-7 py-3 text-[1.4rem] font-semibold text-[#4D4D4D]"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={updateUserMutation.isPending}
                className="bg-primary rounded-[999px] px-8 py-3 text-[1.4rem] font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#A8B792]"
              >
                {updateUserMutation.isPending ? '저장 중...' : '저장하기'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default MyEditPage;
