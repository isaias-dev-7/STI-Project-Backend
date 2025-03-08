import { MyResponse } from './response';

export class SuccessResponse extends MyResponse {
  constructor(
    private code: number,
    private type?: string | null,
    private message?: string | null,
    private data?: any,
  ) {
    super();
  }

  toJSON() {
    return {
      message: this.message,
      type: this.type,
      data: this.data,
    };
  }

  getCode(): number{
    return this.code;
  }

  static build({
    code = null,
    type = null,
    message = null,
    data = null,
  }: {
    code?: number | null;
    type?: string | null,
    message?: string | null;
    data?: any;
  }) {
    return new SuccessResponse(
      code !== null ? code : 200,
      type,
      message,
      data,
    );
  }
}