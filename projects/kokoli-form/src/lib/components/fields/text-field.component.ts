import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

// PrimeNG Modules
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TooltipModule } from 'primeng/tooltip';

// Models
import { TextFieldConfig } from '../../models';

// Services
import { ValidationService } from '../../services';

@Component({
  selector: 'kf-text-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, InputTextareaModule, TooltipModule],
  template: `
    <label [for]="field().key" class="block text-900 font-medium mb-2">
      {{ field().label }}
      @if (isRequired()) {
        <span class="text-pink-500">*</span>
      }
    </label>

    @if (field().type === 'textarea') {
      <textarea
        [id]="field().key"
        pInputTextarea
        [formControl]="control()"
        [placeholder]="field().placeholder || ''"
        [rows]="field().rows || 3"
        [cols]="field().cols || 30"
        [maxlength]="field().maxLength ?? null"
        [class.ng-invalid]="isInvalid()"
        [class.ng-dirty]="isInvalid()"
        (input)="onValueChange($event)"
      ></textarea>
    } @else {
      <input
        [id]="field().key"
        [type]="field().type"
        pInputText
        [formControl]="control()"
        [placeholder]="field().placeholder || ''"
        [maxlength]="field().maxLength ?? null"
        [class.ng-invalid]="isInvalid()"
        [class.ng-dirty]="isInvalid()"
        (input)="onValueChange($event)"
      />
    }

    @if (field().helpText) {
      <small class="block text-600 mt-1">{{ field().helpText }}</small>
    }

    @if (errorMessage()) {
      <small class="p-error block mt-1">{{ errorMessage() }}</small>
    }
  `,
})
export class TextFieldComponent {
  field = input.required<TextFieldConfig>();
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

  onValueChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.valueChange.emit(input.value);
  }
}
