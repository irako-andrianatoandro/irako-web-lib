import { FieldConfig } from './field-config.model';

/**
 * Complete form configuration
 */
export interface FormConfig {
  id: string;
  title?: string;
  description?: string;
  fields: FieldConfig[];
  layout?: 'horizontal' | 'vertical' | 'grid';
  submitLabel?: string;
  cancelLabel?: string;
  showReset?: boolean;
  resetLabel?: string;
}
