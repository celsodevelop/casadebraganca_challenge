import { CardController } from './controller/CardController';

export const Routes = [
  {
    method: 'get',
    route: '/cards',
    controller: CardController,
    action: 'all',
  },
  {
    method: 'get',
    route: '/cards/:id',
    controller: CardController,
    action: 'one',
  },
  {
    method: 'post',
    route: '/cards',
    controller: CardController,
    action: 'save',
  },
  {
    method: 'delete',
    route: '/cards/:id',
    controller: CardController,
    action: 'remove',
  },
];
