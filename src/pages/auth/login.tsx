import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/use-auth';
import type { ServerRole } from '@state/session';

type LocationState = {
  from?: {
    pathname?: string;
  };
};

function getDefaultPathByRole(role: ServerRole) {
  return role === 'ADMIN' ? '/admin' : '/';
}

function getErrorMessage(error: unknown) {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof error.response === 'object' &&
    error.response !== null &&
    'data' in error.response &&
    typeof error.response.data === 'object' &&
    error.response.data !== null &&
    'message' in error.response.data &&
    typeof error.response.data.message === 'string'
  ) {
    return error.response.data.message;
  }

  return 'Login failed.';
}

export default function LoginPage() {
  const { login, isLoginPending } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    try {
      const result = await login({ id, password });
      const state = location.state as LocationState | null;
      const nextPath =
        state?.from?.pathname && state.from.pathname !== '/login'
          ? state.from.pathname
          : getDefaultPathByRole(result.role);

      navigate(nextPath, { replace: true });
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    }
  }

  return (
    <section className="mx-auto flex min-h-[60vh] w-full max-w-[48rem] items-center justify-center px-6 py-16">
      <form
        onSubmit={onSubmit}
        className="flex w-full flex-col gap-4 rounded-[2.4rem] border border-black/10 bg-white p-8 shadow-[0_18px_48px_rgba(0,0,0,0.08)]"
      >
        <h1 className="text-[3rem] font-semibold tracking-[-0.03em] text-[#121212]">
          Login
        </h1>

        <input
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="id"
          className="h-14 rounded-2xl border border-black/10 px-4 text-[1.6rem] outline-none transition focus:border-black"
        />

        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="password"
          className="h-14 rounded-2xl border border-black/10 px-4 text-[1.6rem] outline-none transition focus:border-black"
        />

        <button
          type="submit"
          disabled={isLoginPending}
          className="h-14 rounded-2xl bg-black text-[1.6rem] font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoginPending ? 'Logging in...' : 'Login'}
        </button>

        {submitError ? (
          <p className="text-[1.4rem] text-red-600">{submitError}</p>
        ) : null}
      </form>
    </section>
  );
}
