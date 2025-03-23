# Kokoli Form

A comprehensive dynamic form generation system for Angular 18+ applications using PrimeNG components and standalone architecture.

## ✨ Features

- **🔧 Configuration-Driven Forms**: Generate complex forms from JSON configurations
- **🎨 PrimeNG Integration**: Uses PrimeNG UI components for all form elements
- **📱 Responsive Design**: Uses PrimeFlex for responsive layouts
- **✅ Form Validation**: Supports both built-in and custom validations
- **🔄 Value Transformation**: Transform values on input and output
- **⚡ Modern Angular**: Leverages Angular 18 features including signals
- **🧩 Standalone Components**: Uses Angular's standalone component pattern
- **🔒 Type-Safe**: Comprehensive TypeScript typing

## 📦 Installation

```bash
npm install kokoli-form primeng primeflex @angular/forms
```

## 🚀 Usage

### Basic Usage with Standalone Components

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KokoliFormComponent, FormConfig } from 'kokoli-form';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule, KokoliFormComponent],
  template: `
    <kokoli-form [config]="formConfig" (submit)="onSubmit($event)"></kokoli-form>
  `
})
export class ExampleComponent {
  formConfig: FormConfig = {
    id: 'registrationForm',
    title: 'User Registration',
    fields: [
      {
        key: 'username',
        type: 'text',
        label: 'Username',
        validators: [
          { type: 'required', message: 'Username is required' },
          { type: 'minLength', value: 5, message: 'Username must be at least 5 characters' }
        ]
      },
      {
        key: 'email',
        type: 'email',
        label: 'Email',
        validators: [
          { type: 'required', message: 'Email is required' },
          { type: 'email', message: 'Please enter a valid email address' }
        ]
      }
    ],
    submitLabel: 'Register'
  };

  onSubmit(formValue: any) {
    console.log('Form submitted:', formValue);
  }
}
```

## 📝 Form Configuration

### FormConfig

The main configuration object for the form:

```typescript
export type FormConfig = {
  id: string;
  title?: string;
  description?: string;
  fields: FieldConfig[];
  layout?: 'horizontal' | 'vertical' | 'grid';
  submitLabel?: string;
  cancelLabel?: string;
  showReset?: boolean;
  resetLabel?: string;
};
```

### Field Types

The library supports various field types:

| Category | Field Types |
|----------|-------------|
| **Text Input** | `text`, `password`, `textarea` |
| **Number Input** | `number`, `slider` |
| **Selection** | `dropdown`, `multiselect`, `radio` |
| **Date** | `date`, `calendar` |
| **Boolean** | `checkbox`, `toggle` |
| **Other** | `rating`, `colorpicker`, `editor` |

### Field Configuration

Each field is configured with properties like:

```typescript
{
  key: 'fieldName',
  label: 'Field Label',
  type: 'text',
  placeholder: 'Enter a value',
  defaultValue: 'Initial value',
  validators: [
    { type: 'required', message: 'This field is required' }
  ],
  transformer: {
    in: (value) => transformForDisplay(value),
    out: (value) => transformForStorage(value)
  },
  gridClass: 'col-12 md:col-6'
}
```

## 🔄 Value Transformers

Transform values when setting into or retrieving from the form:

```typescript
const transformers = {
  numberScale: (factor: number) => ({
    in: (value: number) => value / factor,
    out: (value: number) => value * factor
  }),
  
  dateString: () => ({
    in: (value: Date) => value ? value.toISOString().split('T')[0] : null,
    out: (value: string) => value ? new Date(value) : null
  })
};

// Usage in field config
{
  key: 'salary',
  label: 'Salary (K)',
  type: 'number',
  transformer: transformers.numberScale(1000)
}
```

## ✅ Validation

Support for built-in and custom validations:

```typescript
{
  key: 'password',
  label: 'Password',
  type: 'password',
  validators: [
    { type: 'required', message: 'Password is required' },
    { type: 'minLength', value: 8, message: 'Password must be at least 8 characters' },
    { 
      type: 'custom', 
      message: 'Password must contain a number',
      validator: (value) => /\d/.test(value)
    }
  ]
}
```

## 📐 Form Layout

Control form layout with the `layout` property and field `gridClass`:

```typescript
{
  id: 'contactForm',
  layout: 'grid',
  fields: [
    {
      key: 'firstName',
      label: 'First Name',
      type: 'text',
      gridClass: 'col-12 md:col-6'
    },
    {
      key: 'lastName',
      label: 'Last Name',
      type: 'text',
      gridClass: 'col-12 md:col-6'
    },
    {
      key: 'address',
      label: 'Full Address',
      type: 'textarea',
      gridClass: 'col-12'
    }
  ]
}
```

## 🎨 Styling

Kokoli Form uses PrimeFlex for responsive layouts. You can customize the appearance by:

1. Setting the `gridClass` property on individual fields
2. Applying global styles to the form components
3. Using PrimeNG's theming capabilities

## 🔍 Advanced Usage

### Conditional Fields

Show or hide fields based on conditions:

```typescript
{
  key: 'hasDiscount',
  label: 'Apply Discount?',
  type: 'checkbox'
},
{
  key: 'discountCode',
  label: 'Discount Code',
  type: 'text',
  visible: (formValues) => formValues.hasDiscount === true
}
```

### Nested Forms

Group related fields together:

```typescript
{
  key: 'address',
  type: 'group',
  fields: [
    {
      key: 'street',
      label: 'Street',
      type: 'text'
    },
    {
      key: 'city',
      label: 'City',
      type: 'text'
    },
    {
      key: 'zipCode',
      label: 'ZIP Code',
      type: 'text'
    }
  ]
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.
