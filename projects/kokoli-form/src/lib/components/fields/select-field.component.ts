import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

// PrimeNG Modules
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TooltipModule } from 'primeng/tooltip';

// Models
import { SelectFieldConfig } from '../../models';

// Services
import { ValidationService } from '../../services';

@Component({
  selector: 'kf-select-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DropdownModule,
    MultiSelectModule,
    RadioButtonModule,
    TooltipModule,
  ],
  template: `
    <label [for]="field().key" class="block text-900 font-medium mb-2">
      {{ field().label }}
      @if (isRequired()) {
        <span class="text-pink-500">*</span>
      }
    </label>

    @if (field().type === 'dropdown') {
      <p-dropdown
        [id]="field().key"
        [formControl]="control()"
        [options]="field().options"
        [optionLabel]="field().optionLabel || 'label'"
        [optionValue]="field().optionValue || 'value'"
        [placeholder]="field().placeholder || 'Select an option'"
        [filter]="field().filter"
        [showClear]="true"
        [ngClass]="{ 'ng-invalid ng-dirty': isInvalid() }"
        (onChange)="onValueChange($event)"
      ></p-dropdown>
    } @else if (field().type === 'multiselect') {
      <p-multiSelect
        [id]="field().key"
        [formControl]="control()"
        [options]="field().options"
        [optionLabel]="field().optionLabel || 'label'"
        [optionValue]="field().optionValue || 'value'"
        [placeholder]="field().placeholder || 'Select options'"
        [filter]="field().filter"
        [showToggleAll]="true"
        [showClear]="true"
        [ngClass]="{ 'ng-invalid ng-dirty': isInvalid() }"
        (onChange)="onValueChange($event)"
      ></p-multiSelect>
    } @else if (field().type === 'radio') {
      <div class="p-field-radiobutton">
        @for (option of field().options; track option.value) {
          <div class="p-mb-2">
            <p-radioButton
              [id]="field().key + '_' + option.value"
              [name]="field().key"
              [value]="option.value"
              [formControl]="control()"
              [disabled]="option.disabled ?? false"
              (onClick)="onValueChange(option.value)"
            ></p-radioButton>
            <label [for]="field().key + '_' + option.value" class="p-ml-2">{{ option.label }}</label>
          </div>
        }
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
export class SelectFieldComponent {
  field = input.required<SelectFieldConfig>();
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
    const value = event.value !== undefined ? event.value : event;
    this.valueChange.emit(value);
  }
}
