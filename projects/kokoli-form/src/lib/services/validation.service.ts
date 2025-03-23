import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn, ValidationErrors, Validators } from '@angular/forms';
import { ValidationRule } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  /**
   * Get validator function from validation rule
   */
  public getValidator(rule: ValidationRule): ValidatorFn | null {
    switch (rule.type) {
      case 'required':
        return Validators.required;
      case 'minLength':
        return Validators.minLength(rule.value);
      case 'maxLength':
        return Validators.maxLength(rule.value);
      case 'min':
        return Validators.min(rule.value);
      case 'max':
        return Validators.max(rule.value);
      case 'email':
        return Validators.email;
      case 'pattern':
        return Validators.pattern(rule.value);
      case 'custom':
        return (control: AbstractControl): ValidationErrors | null => {
          return rule.validator && !rule.validator(control.value) ? { custom: rule.message } : null;
        };
      default:
        return null;
    }
  }

  /**
   * Get all validators for a field
   */
  public getValidators(rules: ValidationRule[]): ValidatorFn[] {
    if (!rules || rules.length === 0) {
      return [];
    }

    return rules.map(rule => this.getValidator(rule)).filter(validator => validator !== null);
  }

  /**
   * Get error message for a field
   */
  public getErrorMessage(control: AbstractControl, rules: ValidationRule[]): string {
    if (!control || !control.errors || !rules) {
      return '';
    }

    const errorKeys = Object.keys(control.errors);
    if (errorKeys.length === 0) {
      return '';
    }

    const errorKey = errorKeys[0];
    const matchingRule = rules.find(rule => {
      switch (rule.type) {
        case 'required':
          return errorKey === 'required';
        case 'minLength':
          return errorKey === 'minlength';
        case 'maxLength':
          return errorKey === 'maxlength';
        case 'min':
          return errorKey === 'min';
        case 'max':
          return errorKey === 'max';
        case 'email':
          return errorKey === 'email';
        case 'pattern':
          return errorKey === 'pattern';
        case 'custom':
          return errorKey === 'custom';
        default:
          return false;
      }
    });

    return matchingRule ? matchingRule.message : 'Invalid value';
  }
}
