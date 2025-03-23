import { Component, input, output, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

// PrimeNG Modules
import { RatingModule } from 'primeng/rating';
import { ColorPickerModule } from 'primeng/colorpicker';
import { EditorModule } from 'primeng/editor';
import { TooltipModule } from 'primeng/tooltip';

// Models
import { OtherFieldConfig } from '../../models';

// Services
import { ValidationService } from '../../services';

@Component({
  selector: 'kf-other-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RatingModule,
    ColorPickerModule,
    EditorModule,
    TooltipModule,
  ],
  template: `
    <label [for]="field().key" class="block text-900 font-medium mb-2">
      {{ field().label }}
      @if (isRequired()) {
        <span class="text-pink-500">*</span>
      }
    </label>

    @if (field().type === 'rating') {
      <p-rating
        [id]="field().key"
        [formControl]="control()"
        [stars]="field().stars || 5"
        [cancel]="false"
        (onRate)="onValueChange($event)"
      ></p-rating>
    } @else if (field().type === 'colorpicker') {
      <p-colorPicker
        [id]="field().key"
        [formControl]="control()"
        [format]="colorPickerFieldFormat()"
        (onChange)="onValueChange($event)"
      ></p-colorPicker>
    } @else if (field().type === 'editor') {
      <p-editor
        [id]="field().key"
        [formControl]="control()"
        [style]="{ height: '320px' }"
        [modules]="field().modules"
        (onTextChange)="onEditorValueChange($event)"
      ></p-editor>
    }

    @if (field().helpText) {
      <small class="block text-600 mt-1">{{ field().helpText }}</small>
    }

    @if (errorMessage()) {
      <small class="p-error block mt-1">{{ errorMessage() }}</small>
    }
  `,
})
export class OtherFieldComponent {
  field = input.required<OtherFieldConfig>();
  control = input.required<FormControl>();
  submitted = input<boolean>(false);
  colorPickerFieldFormat = computed(() => this.field().format as "hex" | "rgb" | "hsb" || 'hex');

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

  onEditorValueChange(event: any): void {
    this.valueChange.emit(event.htmlValue);
  }
}
