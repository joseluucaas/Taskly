export function successResponse<T>(
  data: T,
  meta?: unknown,
) {
  if (meta !== undefined) {
    return {
      success: true,
      data,
      meta,
    };
  }

  return {
    success: true,
    data,
  };
}


export function errorResponse(
  code: string,
  message: string,
  details?: unknown,
) {
  return {
    success: false,
    error: {
      code,
      message,
      details: details ?? null,
    },
  };
}