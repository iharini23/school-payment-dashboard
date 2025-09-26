import { SubmitHandler, useForm } from 'react-hook-form';
import { useMemo, useState } from 'react';
import { nanoid } from 'nanoid/non-secure';
import { PaymentCreatePayload } from '../types';
import { createPayment, fetchTransactionStatus } from '../api/payment';

const DEFAULT_STUDENT = {
  name: '',
  id: '',
  email: '',
};

const DEFAULT_FORM: PaymentCreatePayload = {
  school_id: '',
  trustee_id: '',
  gateway_name: '',
  custom_order_id: '',
  order_amount: 0,
  payment_mode: 'card',
  student_info: DEFAULT_STUDENT,
};

type PaymentFormValues = PaymentCreatePayload;

type StatusResult = {
  status: string;
  message: string;
};

export const PaymentForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<PaymentFormValues>({
    defaultValues: DEFAULT_FORM,
  });
  const [result, setResult] = useState<StatusResult | null>(null);
  const [statusCheck, setStatusCheck] = useState<StatusResult | null>(null);

  const placeholderCustomOrderId = useMemo(() => nanoid(8), []);

  const onSubmit: SubmitHandler<PaymentFormValues> = async (values) => {
    const payload: PaymentCreatePayload = {
      ...values,
      custom_order_id: values.custom_order_id || nanoid(10),
      order_amount: Number(values.order_amount),
      student_info: {
        name: values.student_info.name,
        id: values.student_info.id,
        email: values.student_info.email,
      },
    };

    const response = await createPayment(payload);
    setResult({
      status: 'success',
      message: response.data.redirect_url
        ? `Payment initiated. Redirect URL: ${response.data.redirect_url}`
        : 'Payment initiated successfully.',
    });
    reset(DEFAULT_FORM);
  };

  const handleStatusCheck = async (customOrderId: string) => {
    if (!customOrderId) {
      return;
    }

    const response = await fetchTransactionStatus(customOrderId);
    const data = response.data;
    setStatusCheck({
      status: data.status ?? 'unknown',
      message: data.payment_message ?? 'No message available',
    });
  };

  return (
    <div className="grid gap-8 md:grid-cols-[2fr,1fr]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 rounded-lg border border-slate-800 bg-slate-900 p-6"
      >
        <div>
          <h2 className="text-xl font-semibold">Create payment</h2>
          <p className="text-sm text-slate-400">
            Provide the required details to generate a payment session.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm">
            <span>School ID</span>
            <input
              type="text"
              {...register('school_id', { required: true })}
              className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-base"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span>Trustee ID</span>
            <input
              type="text"
              {...register('trustee_id', { required: true })}
              className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-base"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span>Gateway name</span>
            <input
              type="text"
              {...register('gateway_name', { required: true })}
              className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-base"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span>Order amount</span>
            <input
              type="number"
              step="0.01"
              min="0"
              {...register('order_amount', { required: true, valueAsNumber: true })}
              className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-base"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span>Payment mode</span>
            <select
              {...register('payment_mode', { required: true })}
              className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-base"
            >
              <option value="card">Card</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="upi">UPI</option>
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span>Custom order ID</span>
            <input
              type="text"
              placeholder={placeholderCustomOrderId}
              {...register('custom_order_id')}
              className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-base"
            />
          </label>
        </div>

        <fieldset className="grid gap-4 rounded border border-slate-800 p-4">
          <legend className="px-2 text-sm font-semibold text-slate-300">Student information</legend>
          <label className="flex flex-col gap-2 text-sm">
            <span>Name</span>
            <input
              type="text"
              {...register('student_info.name', { required: true })}
              className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-base"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span>Student ID</span>
            <input
              type="text"
              {...register('student_info.id', { required: true })}
              className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-base"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span>Email</span>
            <input
              type="email"
              {...register('student_info.email', { required: true })}
              className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-base"
            />
          </label>
        </fieldset>

        <button
          type="submit"
          className="self-start rounded bg-sky-500 px-5 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting…' : 'Create payment'}
        </button>

        {result && (
          <div className="rounded border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-200">
            <div className="font-semibold uppercase text-sky-400">{result.status}</div>
            <p>{result.message}</p>
          </div>
        )}
      </form>

      <aside className="flex flex-col gap-4 rounded-lg border border-slate-800 bg-slate-900 p-6">
        <h3 className="text-lg font-semibold">Check transaction status</h3>
        <p className="text-sm text-slate-400">
          Enter a custom order ID to retrieve the latest transaction status.
        </p>
        <input
          type="text"
          placeholder="Custom order ID"
          onBlur={(event) => handleStatusCheck(event.target.value)}
          className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-base"
        />
        {statusCheck && (
          <div className="rounded border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-200">
            <div className="font-semibold uppercase text-sky-400">{statusCheck.status}</div>
            <p>{statusCheck.message}</p>
          </div>
        )}
      </aside>
    </div>
  );
};
