import { SubmitHandler, useForm } from 'react-hook-form';
import { isAxiosError } from 'axios';
import { useAuth } from '../hooks/useAuth';
import { LoginPayload } from '../types';

export const LoginForm = () => {
  const { login } = useAuth();
  const {
    handleSubmit,
    register,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<LoginPayload>({
    defaultValues: { username: '', password: '' },
  });

  const onSubmit: SubmitHandler<LoginPayload> = async (data) => {
    try {
      await login(data.username, data.password);
      clearErrors('root');
    } catch (error) {
      const fallbackMessage = 'Unable to sign in. Please check your credentials and try again.';

      if (isAxiosError(error)) {
        const apiMessage =
          error.response?.data?.message ||
          (Array.isArray(error.response?.data?.message)
            ? error.response?.data?.message.join('\n')
            : undefined);

        setError('root', {
          type: 'server',
          message: typeof apiMessage === 'string' ? apiMessage : fallbackMessage,
        });
        return;
      }

      setError('root', {
        type: 'server',
        message: fallbackMessage,
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto flex w-full max-w-sm flex-col gap-4 rounded-lg border border-slate-800 bg-slate-900 p-6 shadow-lg"
    >
      <h1 className="text-2xl font-semibold">Welcome back</h1>
      <p className="text-sm text-slate-400">
        Sign in to access the payment dashboard. Demo credentials: <code>admin</code> / <code>admin123</code>.
      </p>
      <label className="flex flex-col gap-1 text-sm">
        <span>Username</span>
        <input
          type="text"
          className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-base text-slate-100 focus:border-sky-400 focus:outline-none"
          {...register('username', { required: 'Username is required' })}
        />
        {errors.username && <span className="text-xs text-red-400">{errors.username.message}</span>}
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span>Password</span>
        <input
          type="password"
          className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-base text-slate-100 focus:border-sky-400 focus:outline-none"
          {...register('password', { required: 'Password is required' })}
        />
        {errors.password && <span className="text-xs text-red-400">{errors.password.message}</span>}
      </label>
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 rounded bg-sky-500 px-4 py-2 font-semibold text-slate-950 transition-colors hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? 'Signing in…' : 'Sign in'}
      </button>
      {errors.root && (
        <p className="text-sm text-red-400" role="alert">
          {errors.root.message}
        </p>
      )}
    </form>
  );
};
