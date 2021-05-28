import { Module } from '@nestjs/common';

import { ActionModule } from '../action/action.module';
import { ClientModule } from '../client/client.module';
import { ProductModule } from '../product/product.module';

import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  imports: [
    ActionModule,
    ClientModule,
    ProductModule
  ],
  controllers: [SearchController],
  providers: [SearchService]
})
export class SearchModule {}
