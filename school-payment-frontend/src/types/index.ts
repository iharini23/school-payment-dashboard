export type LoginPayload = {
  username: string;
  password: string;
};

export type AuthResponse = {
  access_token: string;
};

export type StudentInfo = {
  name: string;
  id: string;
  email: string;
};

export type OrderPayload = {
  school_id: string;
  trustee_id: string;
  gateway_name: string;
  custom_order_id: string;
  order_amount: number;
  payment_mode?: string;
  student_info: StudentInfo;
};

export type PaymentCreatePayload = OrderPayload;

export type PaymentCreateResponse = {
  collect_id: string;
  redirect_url: string | null;
};

export type TransactionItem = {
  collect_id: string;
  school_id: string;
  gateway: string;
  order_amount: number;
  transaction_amount: number;
  status: string;
  custom_order_id: string;
  payment_time?: string;
};

export type TransactionStatusView = {
  collect_id: string;
  status: string;
  payment_time?: string;
  transaction_amount?: number;
  order_amount?: number;
  school_id: string;
  gateway: string;
  custom_order_id: string;
  payment_details?: string;
  bank_reference?: string;
  payment_mode?: string;
  payment_message?: string;
  error_message?: string;
};

export type TransactionsResponse = {
  data: TransactionItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};
