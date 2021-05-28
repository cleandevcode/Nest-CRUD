import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';

import { AbstractEntity } from '../abstract.entity';
import { generateRandomId } from '../utils/string.util';

@EventSubscriber()
export class Subscriber implements EntitySubscriberInterface<AbstractEntity> {
  listenTo() {
    return AbstractEntity;
  }
  beforeInsert(event: InsertEvent<AbstractEntity>) {
    event.entity.id = generateRandomId(15);
  }
}
