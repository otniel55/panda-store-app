import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, tap } from 'rxjs/operators';
import * as moment from 'moment';

import { uuidv4 } from 'src/app/shared/utils/get-uuid';
import { sleep } from 'src/app/shared/utils/sleep';
import { Order } from 'src/app/shared/models/order';
import { FilesystemService } from 'src/app/services/filesystem.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.page.html',
  styleUrls: ['./order-detail.page.scss'],
})
export class OrderDetailPage implements OnInit {
  form: FormGroup;
  id: string;
  test: string;
  order: Order;

  constructor(
    private fb: FormBuilder,
    private storage: OrderService,
    public toastController: ToastController,
    private route: ActivatedRoute,
    private router: Router,
    private fs: FilesystemService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      location: [''],
      phone: [''],
      model: ['', [Validators.required]],
      size: ['', [Validators.required]],
      buyedPrice: ['', [Validators.required]],
      soldPrise: ['', [Validators.required]],
      abono: ['', [Validators.required]],
      observations: [''],
    });
  }

  async ionViewWillEnter() {
    this.form.reset();

    this.route.params
      .pipe(
        map((params) => params.id),
        filter((id) => id),
        tap((id) => (this.id = id))
      )
      .subscribe(async (id) => {
        await sleep();
        const customer = await this.storage.get(id);
        this.form.patchValue(customer);
        this.order = customer;
      });
  }

  async save() {
    if (this.form.invalid) {
      const toast1 = await this.toastController.create({
        message: 'Complete los campos requeridos',
        duration: 2000,
        color: 'danger',
      });
      toast1.present();

      return;
    }

    const data = this.form.getRawValue();
    data.id = this.id || uuidv4();
    data.date = moment().format('YYYY-MM-DD HH:mm');

    data.state = !this.order ? 'PD' : this.order.state;
    data.deliveredDate = !this.order ? '' : this.order.deliveredDate;

    await this.storage.set(data.id, data);

    const toast2 = await this.toastController.create({
      message: `Pedido ${!this.id ? 'guardado' : 'editado'} con éxito`,
      duration: 2000,
      color: 'success',
    });
    toast2.present();

    await sleep(200);
    this.router.navigate(['/orders']);
  }

  async openChooser() {
    this.test = await this.fs.openFile();
  }
}
