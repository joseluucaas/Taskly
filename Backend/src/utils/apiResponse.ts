/**
 * Envelope padrão de resposta para chamadas bem-sucedidas.
 * Mantém o formato de retorno consistente entre todas as rotas da API.
 */
export function successResponse<T>(data: T, meta?: unknown) {
  // meta só é incluído quando existe, mantendo o payload enxuto
  // em endpoints que não precisam de paginação ou metadados extras
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

/**
 * Envelope padrão de resposta para erros.
 * `code` permite que o cliente trate o erro programaticamente
 * (ex: redirecionar no caso de token expirado) sem depender do texto de `message`.
 */
export function errorResponse(
  code: string,
  message: string,
  details?: unknown
) {
  return {
    success: false,
    error: {
      code,
      message,
      // details sempre presente na resposta, padronizado como null quando ausente,
      // evitando inconsistência entre "campo ausente" e "campo vazio"
      details: details ?? null,
    },
  };
}
