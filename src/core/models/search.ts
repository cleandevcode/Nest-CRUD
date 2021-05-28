import { Client } from 'src/client/entities/client.entity';
import { Action } from '../../action/entities/action.entity';
import { Product } from '../../product/entities/product.entity';

export enum SearchResultType {
  action = 'ACTION',
  product = 'PRODUCT',
  client = 'CLIENT'
}

export interface SearchResult {
  type: SearchResultType,
  data: Action[] | Product[] | Client[]
}
