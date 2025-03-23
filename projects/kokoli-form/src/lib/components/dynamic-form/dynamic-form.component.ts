import { Component, computed, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

// Models
import { FieldConfig, FormConfig } from '../../models';

// Services
import { TransformationService, ValidationService } from '../../services';

// Components
import { DynamicFieldComponent } from '../dynamic-field/dynamic-field.component';

@Component({
  selector: 'kf-dynamic-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    MessagesModule,
    MessageModule,
    ProgressSpinnerModule,
    DynamicFieldComponent,
  ],
  template: `
    <form [formGroup]="form()" (ngSubmit)="onSubmit()" class="p-fluid">
      @if (config().title) {
        <h2>{{ config().title }}</h2>
      }
      @if (config().description) {
        <p class="p-mb-3">{{ config().description }}</p>
      }

      <div [ngClass]="getContainerClass()">
        @for (field of visibleFields(); track field.key) {
          <div [ngClass]="getFieldGridClass(field)" class="field p-mb-3">
            <kf-dynamic-field
              [field]="field"
              [control]="getControl(field.key)"
              [formGroup]="form()"
              [submitted]="submitted()"
              (valueChange)="onFieldValueChange(field.key, $event)"
            ></kf-dynamic-field>
          </div>
        }
      </div>

      <div class="p-d-flex p-jc-between p-mt-4">
        @if (submitting()) {
          <p-progressSpinner [style]="{ width: '2rem', height: '2rem' }"></p-progressSpinner>
        } @else {
          <div>
            <button
              pButton
              type="submit"
              [label]="config().submitLabel || 'Submit'"
              class="p-button-primary"
            ></button>

            @if (config().showReset) {
              <button
                pButton
                type="button"
                [label]="config().resetLabel || 'Reset'"
                class="p-button-secondary p-ml-2"
                (click)="resetForm()"
              ></button>
            }
          </div>

          <button
            pButton
            type="button"
            [label]="config().cancelLabel || 'Cancel'"
            class="p-button-outlined p-button-secondary"
            (click)="cancel()"
          ></button>
        }
      </div>

      @if (formError()) {
        <p-messages severity="error">
          <ng-template pTemplate="content">
            <div class="p-ml-2">{{ formError() }}</div>
          </ng-template>
        </p-messages>
      }
    </form>
  `,
  styles: [
    `
      :host ::ng-deep .field-error {
        color: var(--red-500);
        font-size: 0.875rem;
        margin-top: 0.25rem;
      }

      :host ::ng-deep .p-field {
        margin-bottom: 1rem;
      }
    `,
  ],
})
export class DynamicFormComponent {
  private fb = inject(FormBuilder);
  private transformationService = inject(TransformationService);
  private validationService = inject(ValidationService);

  // Input signals
  config = signal<FormConfig>({ id: 'default', title: '', description: '', fields: [], layout: 'vertical' });

  // Internal signals
  form = signal<FormGroup>(this.fb.group({}));
  initialValues = signal<Record<string, any>>({});
  submitted = signal<boolean>(false);
  submitting = signal<boolean>(false);
  formError = signal<string>('');

  // Output signals
  formValue = output<Record<string, any>>({});
  formValid = output<boolean>();


  // Computed values
  visibleFields = computed(() => {
    return this.config()?.fields.filter(field => !field.hidden) || [];
  });

  /**
   * Initialize form with configuration
   */
  initForm(config: FormConfig, initialData?: Record<string, any>): void {
    this.config.set(config);

    const formControls: Record<string, FormControl> = {};
    const initialValues: Record<string, any> = {};

    // Process each field configuration
    config.fields.forEach(field => {
      // Get field value, priority: initialData > defaultValue > null
      let fieldValue =
        initialData && initialData[field.key] !== undefined
          ? initialData[field.key]
          : field.defaultValue !== undefined
            ? field.defaultValue
            : null;

      // Apply input transformation if specified
      if (field.transformer) {
        fieldValue = this.transformationService.applyInTransform(field.transformer, fieldValue);
      }

      initialValues[field.key] = fieldValue;

      // Create form control with validators
      const validators = field.validators
        ? this.validationService.getValidators(field.validators)
        : [];

      formControls[field.key] = new FormControl(
        { value: fieldValue, disabled: field.disabled },
        validators,
      );
    });

    this.initialValues.set(initialValues);
    this.form.set(this.fb.group(formControls));
    this.submitted.set(false);
    this.formError.set('');
  }

  /**
   * Reset form to initial values
   */
  resetForm(): void {
    const form = this.form();
    if (form) {
      form.reset(this.initialValues());
      this.submitted.set(false);
      this.formError.set('');
    }
  }

  /**
   * Get container class based on layout
   */
  getContainerClass(): string {
    const layout = this.config()?.layout || 'vertical';

    switch (layout) {
      case 'horizontal':
        return 'p-grid p-fluid';
      case 'grid':
        return 'p-grid';
      default:
        return '';
    }
  }

  /**
   * Get grid class for field
   */
  getFieldGridClass(field: FieldConfig): string {
    const layout = this.config()?.layout || 'vertical';

    if (layout === 'vertical') {
      return field.gridClass || '';
    }

    return field.gridClass || 'p-col-12 p-md-6 p-lg-4';
  }

  /**
   * Get form control by field key
   */
  getControl(key: string): FormControl {
    return this.form()?.get(key) as FormControl;
  }

  /**
   * Handle field value changes
   */
  onFieldValueChange(key: string, value: any): void {

  }

  /**
   * Transform output values using field transformers
   */
  transformOutputValues(values: Record<string, any>): Record<string, any> {
    const transformedValues: Record<string, any> = {};
    const fields = this.config()?.fields || [];

    Object.keys(values).forEach(key => {
      const field = fields.find(f => f.key === key);
      const value = values[key];

      if (field && field.transformer) {
        transformedValues[key] = this.transformationService.applyOutTransform(
          field.transformer,
          value,
        );
      } else {
        transformedValues[key] = value;
      }
    });

    return transformedValues;
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    this.submitted.set(true);
    this.formValid.emit(this.form().valid);
    if (this.form().invalid) {
      // Highlight all invalid fields
      Object.keys(this.form().controls).forEach(key => {
        const control = this.form().get(key);
        if (control) {
          control.markAsDirty();
          control.markAsTouched();
        }
      });

      this.formError.set('Please correct the errors before submitting.');
      return;
    }
    this.submitting.set(true);

    const rawValues = this.form().getRawValue();
    const transformedValues = this.transformOutputValues(rawValues);
    this.formValue.emit(transformedValues);
  }

  /**
   * Handle form cancellation
   */
  cancel(): void {
    console.log('Form cancelled');
  }
}
