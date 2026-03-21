import { cn } from '@libs/cn';
import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from 'react';
import loginImage from '/login-logo.svg';

type AuthCardShellProps = {
  className?: string;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  header?: ReactNode;
};

type AuthFieldProps = ComponentProps<'input'> & {
  label: string;
  hint?: string;
};

type AuthActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: 'primary' | 'secondary' | 'ghost';
};

type AuthProgressBarProps = {
  step: number;
  total: number;
};

export function AuthCardShell({
  className,
  title,
  description,
  children,
  footer,
  header,
}: AuthCardShellProps) {
  return (
    <section
      className={cn(
        'flex w-full max-w-[45rem] flex-col rounded-t-[2rem] bg-white px-[4rem] py-[5rem] shadow-[0_4px_21px_rgba(85,128,20,0.2)]',
        className,
      )}
    >
      <div className="flex h-full flex-col gap-8">
        {header ? (
          <div>{header}</div>
        ) : (
          <div className="flex-col-center gap-6 sm:gap-8">
            <img
              src={loginImage}
              alt="Telegro"
              className="h-[8.8rem] w-[8.8rem] rounded-[1.6rem] object-cover sm:h-[10.6rem] sm:w-[10.6rem]"
            />

            <div className="flex-col-center w-full gap-4">
              <div className="flex-col-center gap-2 text-center">
                {title ? (
                  <h1 className="text-[2rem] font-semibold text-gray-900">
                    {title}
                  </h1>
                ) : null}
                {description ? (
                  <div className="body4 text-gray-700">{description}</div>
                ) : null}
              </div>

              <div className="h-px w-full bg-[#E9E9E9]" />
            </div>
          </div>
        )}

        <div className="flex flex-1 flex-col justify-between gap-8">
          <div>{children}</div>
          {footer ? <div>{footer}</div> : null}
        </div>
      </div>
    </section>
  );
}

export function AuthField({
  label,
  hint,
  className,
  ...props
}: AuthFieldProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-['Pretendard',sans-serif] text-[1.25rem] font-semibold text-[#2B2B2B]">
        {label}
      </span>
      <input
        className={cn(
          "h-[4.2rem] rounded-[0.7rem] border border-[#E9E9E9] px-4 font-['Pretendard',sans-serif] text-[1.25rem] text-[#2B2B2B] transition outline-none placeholder:text-[#B7B7B7] focus:border-[#FFC633]",
          className,
        )}
        {...props}
      />
      {hint ? (
        <span className="text-[1.2rem] leading-[1.5] text-[#8B8B8B]">
          {hint}
        </span>
      ) : null}
    </label>
  );
}

export function AuthActionButton({
  tone = 'primary',
  className,
  type = 'button',
  ...props
}: AuthActionButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "h-[4.8rem] rounded-[0.5rem] font-['Pretendard',sans-serif] text-[1.5rem] font-bold tracking-[-0.01em] transition disabled:cursor-not-allowed disabled:opacity-60",
        tone === 'primary' &&
          'bg-[#FFC633] text-white hover:brightness-95 disabled:hover:brightness-100',
        tone === 'secondary' &&
          'bg-[#FFF4D8] text-[#2B2B2B] hover:bg-[#FFEAB5]',
        tone === 'ghost' &&
          'border border-[#E9E9E9] bg-white text-[1.2rem] text-[#2B2B2B] hover:border-[#FFC633]',
        className,
      )}
      {...props}
    />
  );
}

export function AuthProgressBar({ step, total }: AuthProgressBarProps) {
  const segments = Array.from({ length: total }, (_, index) => index + 1);

  return (
    <div className="flex items-center gap-2">
      {segments.map((segment) => (
        <div
          key={segment}
          className={cn(
            'h-[1rem] flex-1 rounded-[0.8rem]',
            segment <= step ? 'bg-[#FFC633]' : 'bg-[#F0F1F4]',
          )}
        />
      ))}
    </div>
  );
}
