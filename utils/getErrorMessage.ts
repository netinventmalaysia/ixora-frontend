export default function getErrorMessage(e: any): string {
  if (!e) return '';
  if (typeof e === 'string') return e;

  // Axios-style error shapes
  const maybeMessage =
    e?.response?.data?.message ??
    e?.response?.data ??
    e?.message ??
    e?.error ??
    null;

  if (typeof maybeMessage === 'string') return maybeMessage;
  if (maybeMessage == null) {
    try {
      return JSON.stringify(e);
    } catch {
      return String(e);
    }
  }

  // If message is an object, try common nested fields
  if (typeof maybeMessage === 'object') {
    if (typeof maybeMessage.message === 'string') return maybeMessage.message;
    if (typeof maybeMessage.msg === 'string') return maybeMessage.msg;
    try {
      return JSON.stringify(maybeMessage);
    } catch {
      return String(maybeMessage);
    }
  }

  return String(maybeMessage);
}
