/**
 * Erro de aplicação com metadados HTTP embutidos.
 * Permite que o error handler centralizado monte a resposta (status, code, details)
 * sem precisar de lógica de mapeamento espalhada pelos controllers.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(
    message: string,
    statusCode: number,
    code = 'APP_ERROR', // fallback para erros que não especificam um código próprio
    details?: unknown
  ) {
    super(message);

    this.statusCode = statusCode;
    this.code = code;
    this.details = details;

    // Necessário ao estender classes nativas (Error) com target de compilação
    // mais antigo, sem isso `instanceof AppError` pode falhar e o error
    // handler passaria a tratar esses erros como desconhecidos (500 genérico).
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
