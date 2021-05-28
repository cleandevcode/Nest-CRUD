import { Injectable } from '@nestjs/common';

import { ActionService } from '../action/action.service';
import { ProductService } from '../product/product.service';
import { ClientService } from '../client/client.service';
import { SearchResult, SearchResultType } from '../core/models/search';

@Injectable()
export class SearchService {
  constructor(
    private productService: ProductService,
    private clientService: ClientService,
  ) {}

  async find(keyword = ''): Promise<SearchResult[]> {
    const res: SearchResult[] = [];
    const products = await this.productService.findProductsByKeyword(keyword);
    const clients = await this.clientService.findClientsByKeyword(keyword);

    res.push({
      type: SearchResultType.client,
      data: clients || [],
    });

    res.push({
      type: SearchResultType.product,
      data: products || [],
    });
    return res;
  }
}
