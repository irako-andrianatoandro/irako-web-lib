import { Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

// Field components
import { TextFieldComponent } from '../fields/text-field.component';
import { NumberFieldComponent } from '../fields/number-field.component';
import { SelectFieldComponent } from '../fields/select-field.component';
import { DateFieldComponent } from '../fields/date-field.component';
import { CheckboxFieldComponent } from '../fields/checkbox-field.component';
import { OtherFieldComponent } from '../fields/other-field.component';
import {
  CheckboxFieldConfig,
  DateFieldConfig,
  FieldConfig,
  NumberFieldConfig,
  OtherFieldConfig,
  SelectFieldConfig,
  TextFieldConfig,
} from '../../models';

@Component({
  selector: 'kf-dynamic-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TextFieldComponent,
    NumberFieldComponent,
    SelectFieldComponent,
    DateFieldComponent,
    CheckboxFieldComponent,
    OtherFieldComponent,
  ],
  template: `
    @switch (field().type) {
      @case ('text') {
        <kf-text-field
          [field]="textFieldConfig()"
          [control]="control()"
          [submitted]="submitted()"
          (valueChange)="onValueChange($event)"
        ></kf-text-field>
      }
      @case ('password') {
        <kf-text-field
          [field]="textFieldConfig()"
          [control]="control()"
          [submitted]="submitted()"
          (valueChange)="onValueChange($event)"
        ></kf-text-field>
      }
      @case ('textarea') {
        <kf-text-field
          [field]="textFieldConfig()"
          [control]="control()"
          [submitted]="submitted()"
          (valueChange)="onValueChange($event)"
        ></kf-text-field>
      }
      @case ('number') {
        <kf-number-field
          [field]="numberFieldConfig()"
          [control]="control()"
          [submitted]="submitted()"
          (valueChange)="onValueChange($event)"
        ></kf-number-field>
      }
      @case ('slider') {
        <kf-number-field
          [field]="numberFieldConfig()"
          [control]="control()"
          [submitted]="submitted()"
          (valueChange)="onValueChange($event)"
        ></kf-number-field>
      }
      @case ('dropdown') {
        <kf-select-field
          [field]="selectFieldConfig()"
          [control]="control()"
          [submitted]="submitted()"
          (valueChange)="onValueChange($event)"
        ></kf-select-field>
      }
      @case ('multiselect') {
        <kf-select-field
          [field]="selectFieldConfig()"
          [control]="control()"
          [submitted]="submitted()"
          (valueChange)="onValueChange($event)"
        ></kf-select-field>
      }
      @case ('radio') {
        <kf-select-field
          [field]="selectFieldConfig()"
          [control]="control()"
          [submitted]="submitted()"
          (valueChange)="onValueChange($event)"
        ></kf-select-field>
      }
      @case ('date') {
        <kf-date-field
          [field]="dateFieldConfig()"
          [control]="control()"
          [submitted]="submitted()"
          (valueChange)="onValueChange($event)"
        ></kf-date-field>
      }
      @case ('calendar') {
        <kf-date-field
          [field]="dateFieldConfig()"
          [control]="control()"
          [submitted]="submitted()"
          (valueChange)="onValueChange($event)"
        ></kf-date-field>
      }
      @case ('checkbox') {
        <kf-checkbox-field
          [field]="checkboxFieldConfig()"
          [control]="control()"
          [submitted]="submitted()"
          (valueChange)="onValueChange($event)"
        ></kf-checkbox-field>
      }
      @case ('toggle') {
        <kf-checkbox-field
          [field]="checkboxFieldConfig()"
          [control]="control()"
          [submitted]="submitted()"
          (valueChange)="onValueChange($event)"
        ></kf-checkbox-field>
      }
      @default {
        <kf-other-field
          [field]="otherFieldConfig()"
          [control]="control()"
          [submitted]="submitted()"
          (valueChange)="onValueChange($event)"
        ></kf-other-field>
      }
    }
  `,
})
export class DynamicFieldComponent {
  field = input.required<FieldConfig>();
  control = input.required<FormControl>();
  formGroup = input<FormGroup>();
  submitted = input<boolean>(false);

  textFieldConfig = computed(() => this.field() as TextFieldConfig);
  numberFieldConfig = computed(() => this.field() as NumberFieldConfig);
  selectFieldConfig = computed(() => this.field() as SelectFieldConfig);
  dateFieldConfig = computed(() => this.field() as DateFieldConfig);
  checkboxFieldConfig = computed(() => this.field() as CheckboxFieldConfig);
  otherFieldConfig = computed(() => this.field() as OtherFieldConfig);

  valueChange = output<any>();

  onValueChange(value: any): void {
    this.valueChange.emit(value);
  }
}
