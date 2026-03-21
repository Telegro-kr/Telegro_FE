import { useState } from 'react';
import { LoginCard } from '@components/auth/login-card';
import { SignupCard } from '@components/auth/signup-card';
import { useLoginForm } from '@hooks/use-login-form';
import { useSignupForm } from '@hooks/use-signup-form';

export type AuthMode = 'login' | 'signup';

type AuthFlowProps = {
  className?: string;
  initialMode?: AuthMode;
};

const AuthFlow = ({ className, initialMode = 'login' }: AuthFlowProps) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const loginForm = useLoginForm();
  const signupForm = useSignupForm({ onSignupSuccess: () => setMode('login') });

  if (mode === 'signup') {
    return (
      <SignupCard
        className={className}
        form={signupForm.form}
        step={signupForm.step}
        isPostcodeReady={signupForm.isPostcodeReady}
        isSignupPending={signupForm.isSignupPending}
        onFieldChange={signupForm.handleFieldChange}
        onAddressSearch={signupForm.handleAddressSearch}
        onBack={signupForm.handleStepBack}
        onNext={signupForm.handleStepNext}
        onSubmit={signupForm.handleSubmit}
        onBackToLogin={() => setMode('login')}
      />
    );
  }

  return (
    <LoginCard
      className={className}
      id={loginForm.id}
      password={loginForm.password}
      isPending={loginForm.isLoginPending}
      onIdChange={loginForm.setId}
      onPasswordChange={loginForm.setPassword}
      onSubmit={loginForm.handleSubmit}
      onSignupClick={() => setMode('signup')}
    />
  );
};

export default AuthFlow;
