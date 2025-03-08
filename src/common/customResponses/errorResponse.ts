import { MyResponse } from "./response";

export class ErrorResponse extends MyResponse {
  constructor(
    private code: number,
    private message: string | null,
    private type: string | null,
  ) {
    super();
  }

  toJSON() {
    return {
      message: this.message,
      type: this.type,
    };
  }

  getCode(): number{
    return this.code;
  }

  static build({
    code = null,
    message = null,
    type = null,
  }: {
    code?: number | null;
    message?: string | null;
    type?: string | null;
  }) {
    return new ErrorResponse(
      code !== null ? code : 400,
      message,
      type,
    );
  }
}
