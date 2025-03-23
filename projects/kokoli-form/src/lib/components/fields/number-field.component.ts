import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

// PrimeNG Modules
import { InputNumberModule } from 'primeng/inputnumber';
import { SliderModule } from 'primeng/slider';
import { TooltipModule } from 'primeng/tooltip';

// Models
import { NumberFieldConfig } from '../../models';

// Services
import { ValidationService } from '../../services';

@Component({
  selector: 'kf-number-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputNumberModule, SliderModule, TooltipModule],
  template: `
    <label [for]="field().key" class="block text-900 font-medium mb-2">
      {{ field().label }}
      @if (isRequired()) {
        <span class="text-pink-500">*</span>
      }
    </label>

    @if (field().type === 'slider') {
      <p-slider
        [id]="field().key"
        [formControl]="control()"
        [min]="field().min || 0"
        [max]="field().max || 100"
        [step]="field().step || 1"
        [range]="field().range"
        (onChange)="onValueChange($event)"
      ></p-slider>
    } @else {
      <p-inputNumber
        [id]="field().key"
        [formControl]="control()"
        [placeholder]="field().placeholder || ''"
        [min]="field().min"
        [max]="field().max"
        [step]="field().step || 1"
        [showButtons]="field().showButtons || false"
        [ngClass]="{ 'ng-invalid ng-dirty': isInvalid() }"
        (onInput)="onValueChange($event)"
      ></p-inputNumber>
    }

    @if (field().helpText) {
      <small class="block text-600 mt-1">{{ field().helpText }}</small>
    }

    @if (errorMessage()) {
      <small class="p-error block mt-1">{{ errorMessage() }}</small>
    }
  `,
})
export class NumberFieldComponent {
  field = input.required<NumberFieldConfig>();
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
    this.valueChange.emit(event.value);
  }
}
