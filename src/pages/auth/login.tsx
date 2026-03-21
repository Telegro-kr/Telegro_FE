import { LoginCard } from '@components/auth/login-card';
import { SignupCard } from '@components/auth/signup-card';
import { useState } from 'react';

type AuthMode = 'login' | 'signup';

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>('login');

  return (
    <section className="mx-auto flex min-h-[calc(100vh-18rem)] w-full items-center justify-center px-4 py-10 sm:px-6">
      {mode === 'login' ? (
        <LoginCard onSignupClick={() => setMode('signup')} />
      ) : (
        <SignupCard onBackToLogin={() => setMode('login')} />
      )}
    </section>
  );
}
