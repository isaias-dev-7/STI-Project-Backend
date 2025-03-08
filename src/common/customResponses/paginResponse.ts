import { MyResponse } from './response';

export class PaginResponse extends MyResponse {
  constructor(
    private code: number,
    private data: any,
    private total: number,
    private page: number,
    private limit: number,
    private totalPages: number,
  ) {
    super();
  }

  toJSON() {
    return {
      data: this.data,
      total: this.total,
      page: this.page,
      limit: this.limit,
      totalPages: this.totalPages,
    };
  }

  getCode(): number {
    return this.code;
  }

  static build({
    code = null,
    data = null,
    total = 0,
    page = 0,
    limit = 0,
    totalPages = 0,
  }: {
    code?: number | null;
    data: any;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }) {
    return new PaginResponse(
      code !== null ? code : 200,
      data !== null ? data : [],
      total !== null ? total : 0,
      page !== null ? page : 0,
      limit !== null ? limit : 0,
      totalPages !== null ? totalPages : 0,
    );
  }
}