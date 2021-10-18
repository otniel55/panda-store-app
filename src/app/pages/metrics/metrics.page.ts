import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

import { arraySum, asyncForeach } from 'src/app/shared/utils/arr';
import { sleep } from 'src/app/shared/utils/sleep';
import { Order } from 'src/app/shared/models/order';
import { MetricHistory } from 'src/app/shared/models/metric-history';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.page.html',
  styleUrls: ['./metrics.page.scss'],
})
export class MetricsPage implements OnInit {
  orders: Order[] = [];
  history: MetricHistory[] = [];

  constructor(private storage: OrderService) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    await sleep(200);
    const keys = await this.storage.keys();
    this.orders = [];

    await asyncForeach(async (key) => {
      const order = await this.storage.get(key);

      if (order.state === 'RB') {
        this.orders.push(order);
      }
    }, keys);

    const dates = [
      ...new Set(
        this.orders.map((item) =>
          moment(item.deliveredDate).format('YYYY-MM-DD')
        )
      ),
    ].sort((a, b) =>
      moment(a).diff(moment(b)) < 0 ? 1 : moment(a).diff(moment(b)) > 0 ? -1 : 0
    );

    this.history = dates.map((date) => {
      const orders = this.orders.filter(
        (item) => moment(item.deliveredDate).format('YYYY-MM-DD') === date
      );
      return {
        date,
        totalItems: orders.length,
        totalWinned: arraySum(
          orders.map((item) => item.soldPrise - item.buyedPrice)
        ),
        totalPayed: arraySum(orders.map((item) => item.buyedPrice)),
      };
    });
  }

  trackByFunc(index, item) {
    return item ? item.id : index;
  }
}
