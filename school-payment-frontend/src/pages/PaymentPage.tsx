import { PaymentForm } from '../components/PaymentForm';

export const PaymentPage = () => (
  <div className="space-y-6">
    <header>
      <h1 className="text-2xl font-semibold">Payment orchestration</h1>
      <p className="mt-2 text-sm text-slate-400">
        Generate new payment sessions and inspect payment status for a specific custom order ID.
      </p>
    </header>
    <PaymentForm />
  </div>
);
