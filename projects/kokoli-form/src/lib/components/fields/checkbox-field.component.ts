import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

// PrimeNG Modules
import { CheckboxModule } from 'primeng/checkbox';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TooltipModule } from 'primeng/tooltip';

// Models
import { CheckboxFieldConfig } from '../../models';

// Services
import { ValidationService } from '../../services';

@Component({
  selector: 'kf-checkbox-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CheckboxModule, InputSwitchModule, TooltipModule],
  template: `
    @if (field().type === 'checkbox') {
      <div class="p-field-checkbox">
        <p-checkbox
          [id]="field().key"
          [formControl]="control()"
          [binary]="field().binary || true"
          (onChange)="onValueChange($event)"
        ></p-checkbox>
        <label [for]="field().key" class="p-ml-2">
          {{ field().label }}
          @if (isRequired()) {
            <span class="text-pink-500">*</span>
          }
        </label>
      </div>
    } @else if (field().type === 'toggle') {
      <div class="p-field-checkbox">
        <label [for]="field().key" class="block text-900 font-medium mb-2">
          {{ field().label }}
          @if (isRequired()) {
            <span class="text-pink-500">*</span>
          }
        </label>
        <p-inputSwitch
          [id]="field().key"
          [formControl]="control()"
          (onChange)="onValueChange($event)"
        ></p-inputSwitch>
      </div>
    }

    @if (field().helpText) {
      <small class="block text-600 mt-1">{{ field().helpText }}</small>
    }

    @if (errorMessage()) {
      <small class="p-error block mt-1">{{ errorMessage() }}</small>
    }
  `,
})
export class CheckboxFieldComponent {
  field = input.required<CheckboxFieldConfig>();
  control = input.required<FormControl>();
  submitted = input<boolean>(false);

  valueChange = output<any>();

  private validationService = inject(ValidationService);

  isRequired(): boolean {
    return this.field().validators?.some(v => v.type === 'required') ?? false;
  }

  isInvalid(): boolean {
    return (
      (this.control().invalid && (this.control().dirty || this.control().touched || this.submitted())) ??
      false
    );
  }

  errorMessage(): string {
    if (!this.isInvalid()) {
      return '';
    }

    return this.validationService.getErrorMessage(this.control(), this.field().validators || []);
  }

  onValueChange(event: any): void {
    const value = event.checked !== undefined ? event.checked : event;
    this.valueChange.emit(value);
  }
}
