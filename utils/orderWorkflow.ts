import { Order } from '../types';

const ORDER_STATUS_MAP: Record<string, Order['status']> = {
  'قيد المعالجة': 'قيد المعالجة',
  'تم التأكيد': 'تم التأكيد',
  'تم الشحن': 'تم الشحن',
  'تم التوصيل': 'تم التوصيل',
  pending: 'قيد المعالجة',
  processing: 'قيد المعالجة',
  review: 'قيد المعالجة',
  confirmed: 'تم التأكيد',
  shipped: 'تم الشحن',
  delivered: 'تم التوصيل',
  completed: 'تم التوصيل',
};

const PAYMENT_STATUS_MAP: Record<string, Order['paymentVerificationStatus']> = {
  'قيد المراجعة': 'قيد المراجعة',
  'مقبول': 'مقبول',
  'مرفوض': 'مرفوض',
  review: 'قيد المراجعة',
  pending: 'قيد المراجعة',
  approved: 'مقبول',
  accepted: 'مقبول',
  rejected: 'مرفوض',
};

export const ORDER_STATUS_FLOW: Order['status'][] = [
  'قيد المعالجة',
  'تم التأكيد',
  'تم الشحن',
  'تم التوصيل',
];

export function normalizeOrderStatus(value?: string): Order['status'] {
  return ORDER_STATUS_MAP[String(value || '').trim()] || 'قيد المعالجة';
}

export function normalizePaymentStatus(value?: string): Order['paymentVerificationStatus'] {
  return PAYMENT_STATUS_MAP[String(value || '').trim()] || 'قيد المراجعة';
}

export function getOrderStatusClasses(status: Order['status']): string {
  switch (normalizeOrderStatus(status)) {
    case 'تم التوصيل':
      return 'bg-green-500/10 text-green-400 border-green-500/20';
    case 'تم الشحن':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    case 'تم التأكيد':
      return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
    default:
      return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
  }
}

export function getPaymentStatusClasses(status: Order['paymentVerificationStatus']): string {
  switch (normalizePaymentStatus(status)) {
    case 'مقبول':
      return 'bg-green-500/10 text-green-400 border-green-500/20';
    case 'مرفوض':
      return 'bg-red-500/10 text-red-400 border-red-500/20';
    default:
      return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
  }
}

export function getPaymentStatusIcon(status: Order['paymentVerificationStatus']): string {
  switch (normalizePaymentStatus(status)) {
    case 'مقبول':
      return '✓';
    case 'مرفوض':
      return '✕';
    default:
      return '⏳';
  }
}

export function canProgressOrder(order: Pick<Order, 'paymentVerificationStatus'>): boolean {
  return normalizePaymentStatus(order.paymentVerificationStatus) === 'مقبول';
}

export function getCustomerDisplayName(order: Order): string {
  return order.customerName?.trim() || 'عميل المتجر';
}

export function getShippingSummary(order: Order): string {
  const parts = [order.shippingAddress, order.shippingCity, order.shippingCountry]
    .map((part) => String(part || '').trim())
    .filter(Boolean);

  return parts.length ? parts.join('، ') : 'لم تُسجل بيانات الشحن بعد';
}

export function getOrderStatusLabel(status: Order['status']): string {
  return normalizeOrderStatus(status);
}

export function getNextOrderStatus(status: Order['status']): Order['status'] | null {
  const normalized = normalizeOrderStatus(status);
  const currentIndex = ORDER_STATUS_FLOW.indexOf(normalized);
  if (currentIndex === -1 || currentIndex === ORDER_STATUS_FLOW.length - 1) {
    return null;
  }

  return ORDER_STATUS_FLOW[currentIndex + 1];
}

export function canMoveOrderToStatus(order: Order, nextStatus: Order['status']): boolean {
  const normalizedNextStatus = normalizeOrderStatus(nextStatus);
  const paymentStatus = normalizePaymentStatus(order.paymentVerificationStatus);

  if (paymentStatus !== 'مقبول' && normalizedNextStatus !== 'قيد المعالجة') {
    return false;
  }

  const currentIndex = ORDER_STATUS_FLOW.indexOf(normalizeOrderStatus(order.status));
  const nextIndex = ORDER_STATUS_FLOW.indexOf(normalizedNextStatus);
  if (currentIndex === -1 || nextIndex === -1) {
    return false;
  }

  return nextIndex >= currentIndex;
}

export function isShippingOrder(order: Order): boolean {
  const status = normalizeOrderStatus(order.status);
  const paymentStatus = normalizePaymentStatus(order.paymentVerificationStatus);
  return paymentStatus === 'مقبول' && (status === 'تم التأكيد' || status === 'تم الشحن');
}

export function isDeliveredToday(order: Order, today = new Date()): boolean {
  if (normalizeOrderStatus(order.status) !== 'تم التوصيل') {
    return false;
  }

  const orderDate = new Date(order.date);
  return (
    orderDate.getFullYear() === today.getFullYear() &&
    orderDate.getMonth() === today.getMonth() &&
    orderDate.getDate() === today.getDate()
  );
}
