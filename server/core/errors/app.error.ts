export class AppError extends Error {
  constructor(message: string, public readonly code: number) {
    super(message);
  }
}
