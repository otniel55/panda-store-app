import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, tap } from 'rxjs/operators';
import * as moment from 'moment';

import { uuidv4 } from 'src/app/shared/utils/get-uuid';
import { sleep } from 'src/app/shared/utils/sleep';
import { Customer } from 'src/app/shared/models/customer';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.page.html',
  styleUrls: ['./customer-form.page.scss'],
})
export class CustomerFormPage implements OnInit {
  form: FormGroup;
  id: string;
  customer: Customer;

  constructor(
    private fb: FormBuilder,
    private storage: CustomerService,
    public toastController: ToastController,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      location: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      sexo: ['', [Validators.required]],
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
        this.customer = customer;
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

    await this.storage.set(data.id, data);

    const toast2 = await this.toastController.create({
      message: `Cliente ${!this.id ? 'creado' : 'editado'} con éxito`,
      duration: 2000,
      color: 'success',
    });
    toast2.present();

    await sleep(200);
    this.router.navigate(['/customers']);
  }
}
