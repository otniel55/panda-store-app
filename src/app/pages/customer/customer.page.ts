import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from 'src/app/services/storage.service';
import { uuidv4 } from 'src/app/shared/utils/get-uuid';
import { ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, tap } from 'rxjs/operators';
import { sleep } from 'src/app/shared/utils/sleep';
import * as moment from 'moment';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.page.html',
  styleUrls: ['./customer.page.scss'],
})
export class CustomerPage implements OnInit {
  form: FormGroup;
  id: string;
  order: any;

  constructor(
    private fb: FormBuilder,
    private storage: StorageService,
    public toastController: ToastController,
    private route: ActivatedRoute,
    private router: Router
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
        tap((id) => (this.id = id)),
        filter((id) => id)
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
    this.router.navigate(['/home']);
  }
}
