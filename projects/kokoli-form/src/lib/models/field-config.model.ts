/**
 * Types of form field components available in the system
 */
export type FieldType =
  | 'text'
  | 'number'
  | 'password'
  | 'textarea'
  | 'dropdown'
  | 'multiselect'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'calendar'
  | 'slider'
  | 'toggle'
  | 'rating'
  | 'colorpicker'
  | 'editor';

/**
 * Interface for value transformers that can transform values in/out of a form field
 */
export interface ValueTransformer<T = any, R = any> {
  /**
   * Transform value when setting into the form
   */
  in: (value: T) => R;

  /**
   * Transform value when retrieving from the form
   */
  out: (value: R) => T;
}

/**
 * Validation rule definition that can be applied to form fields
 */
export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'min' | 'max' | 'email' | 'pattern' | 'custom';
  value?: any;
  message: string;
  validator?: (value: any) => boolean | Promise<boolean>;
}

/**
 * Options for dropdown, multiselect, and radio fields
 */
export interface SelectOption {
  label: string;
  value: any;
  disabled?: boolean;
}

/**
 * Base field configuration shared by all field types
 */
export interface BaseFieldConfig {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  defaultValue?: any;
  disabled?: boolean;
  hidden?: boolean;
  validators?: ValidationRule[];
  transformer?: ValueTransformer;
  gridClass?: string; // PrimeFlex grid class for layout
  styleClass?: string; // Additional CSS classes
  helpText?: string;
}

/**
 * Configuration for text fields
 */
export type TextFieldConfig = BaseFieldConfig & {
  type: 'text' | 'password' | 'textarea';
  rows?: number; // For textarea
  cols?: number; // For textarea
  maxLength?: number;
};

/**
 * Configuration for number fields
 */
export type NumberFieldConfig = BaseFieldConfig & {
  type: 'number' | 'slider';
  min?: number;
  max?: number;
  step?: number;
  showButtons?: boolean; // For number input
  range?: boolean; // For slider
};

/**
 * Configuration for select fields
 */
export type SelectFieldConfig = BaseFieldConfig & {
  type: 'dropdown' | 'multiselect' | 'radio';
  options: SelectOption[];
  filter?: boolean; // For dropdown/multiselect
  optionLabel?: string; // For complex objects
  optionValue?: string; // For complex objects
};

/**
 * Configuration for date fields
 */
export type DateFieldConfig = BaseFieldConfig & {
  type: 'date' | 'calendar';
  showTime?: boolean;
  timeOnly?: boolean;
  showButtonBar?: boolean;
  dateFormat?: string;
  minDate?: Date;
  maxDate?: Date;
};

/**
 * Configuration for checkbox fields
 */
export type CheckboxFieldConfig = BaseFieldConfig & {
  type: 'checkbox' | 'toggle';
  binary?: boolean;
};

/**
 * Configuration for other specialized fields
 */
export type OtherFieldConfig = BaseFieldConfig & {
  type: 'rating' | 'colorpicker' | 'editor';
  stars?: number; // For rating
  format?: string; // For colorpicker
  modules?: any; // For editor
};

/**
 * Union type for all field configurations
 */
export type FieldConfig =
  | TextFieldConfig
  | NumberFieldConfig
  | SelectFieldConfig
  | DateFieldConfig
  | CheckboxFieldConfig
  | OtherFieldConfig;
