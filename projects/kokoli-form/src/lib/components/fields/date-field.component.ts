import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

// PrimeNG Modules
import { CalendarModule } from 'primeng/calendar';
import { TooltipModule } from 'primeng/tooltip';

// Models
import { DateFieldConfig } from '../../models';

// Services
import { ValidationService } from '../../services';

@Component({
  selector: 'kf-date-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CalendarModule, TooltipModule],
  template: `
    <label [for]="field().key" class="block text-900 font-medium mb-2">
      {{ field().label }}
      @if (isRequired()) {
        <span class="text-pink-500">*</span>
      }
    </label>

    <p-calendar
      [id]="field().key"
      [formControl]="control()"
      [placeholder]="field().placeholder || ''"
      [showTime]="field().showTime || false"
      [timeOnly]="field().timeOnly || false"
      [showButtonBar]="field().showButtonBar || false"
      [dateFormat]="field().dateFormat || 'mm/dd/yy'"
      [minDate]="field().minDate"
      [maxDate]="field().maxDate"
      [styleClass]="isInvalid() ? 'ng-invalid ng-dirty' : ''"
      (onSelect)="onValueChange($event)"
    ></p-calendar>

    @if (field().helpText) {
      <small class="block text-600 mt-1">{{ field().helpText }}</small>
    }

    @if (errorMessage()) {
      <small class="p-error block mt-1">{{ errorMessage() }}</small>
    }
  `,
})
export class DateFieldComponent {
  field = input.required<DateFieldConfig>();
  control = input.required<FormControl>();
  submitted = input<boolean>(false);

  valueChange = output<any>();

  private validationService = inject(ValidationService);

  isRequired(): boolean {
    return this.field().validators?.some(v => v.type === 'required') ?? false;
  }

  isInvalid(): boolean {
    return (
      (this.control().invalid &&
        (this.control().dirty || this.control().touched || this.submitted())) ??
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
    this.valueChange.emit(event);
  }
}
