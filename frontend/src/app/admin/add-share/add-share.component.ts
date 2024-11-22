import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDatepicker, MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { DateAdapter, MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
// import { MatTimepickerModule } from '@angular/material/';

@Component({
    selector: 'app-add-share',
    providers: [
        { provide: DateAdapter, useClass: NativeDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS }
    ],
    imports: [
        MatFormFieldModule,
        FormsModule,
        MatCardModule,
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatDatepickerModule,
        MatDatepicker,
        // MatTimepickerModule,
    ],
    templateUrl: './add-share.component.html',
    styleUrl: './add-share.component.scss'
})
export class AddShareComponent {

  public expiry = new Date();

  onSubmit(): void {

  }

  setPicker(hours: number): void {
    var date = new Date(Date.now())
    date.setTime(date.getTime() + hours * 1000 * 60 * 60)
    this.expiry = date
  }

  onDateChange(event: MatDatepickerInputEvent<any>): void {
    console.log(event);
  }
}
