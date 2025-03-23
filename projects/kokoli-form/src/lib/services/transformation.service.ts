import { Injectable } from '@angular/core';
import { ValueTransformer } from '../models';

@Injectable({
  providedIn: 'root',
})
export class TransformationService {
  /**
   * Common transformers for various data types
   */
  public readonly commonTransformers = {
    /**
     * Multiplies/divides a number by a factor
     */
    numberScale: (factor: number): ValueTransformer<number, number> => ({
      in: (value: number) => value / factor,
      out: (value: number) => value * factor,
    }),

    /**
     * Converts between Date objects and ISO strings
     */
    dateString: (): ValueTransformer<Date | null, string | null> => ({
      in: (value: Date | null): string | null => {
        if (!value) return null;
        // Check for valid date
        if (isNaN(value.getTime())) return null;
        return value.toISOString();
      },
      out: (value: string | null): Date | null => {
        if (!value) return null;
        const date = new Date(value);
        // Check for invalid date parsing
        return isNaN(date.getTime()) ? null : date;
      },
    }),

    /**
     * Converts between Date objects and Unix timestamps
     */
    dateTimestamp: (): ValueTransformer<Date | null, number | null> => ({
      in: (value: Date | null): number | null => {
        if (!value) return null;
        // Check for valid date
        return isNaN(value.getTime()) ? null : value.getTime();
      },
      out: (value: number | null): Date | null => {
        if (value === null || value === undefined) return null;
        const date = new Date(value);
        // Check for invalid date parsing
        return isNaN(date.getTime()) ? null : date;
      },
    }),

    /**
     * Formats numbers to fixed decimal places
     */
    numberFormat: (decimals: number): ValueTransformer<number, string> => ({
      in: (value: number) => value.toFixed(decimals),
      out: (value: string) => parseFloat(value),
    }),
  };

  /**
   * Apply transformer to input value
   * @throws Error if transformer.in() fails
   */
  public applyInTransform<T, R>(
    transformer: ValueTransformer<T, R> | null | undefined,
    value: T | null | undefined
  ): R | T | null | undefined {
    if (!transformer || value === undefined || value === null) {
      return value;
    }

    try {
      if (typeof transformer.in !== 'function') {
        console.warn('Invalid transformer: missing "in" method');
        return value;
      }
      return transformer.in(value as T);
    } catch (error) {
      console.error('Error applying transformer:', error);
      throw error; // or handle differently based on requirements
    }
  }

  /**
   * Apply transformer to output value
   * @throws Error if transformer.out() fails
   */
  public applyOutTransform<R, T>(
    transformer: ValueTransformer<T, R> | null | undefined,
    value: R | null | undefined
  ): T | R | null | undefined {
    if (!transformer || value === undefined || value === null) {
      return value;
    }

    try {
      if (typeof transformer.out !== 'function') {
        console.warn('Invalid transformer: missing "out" method');
        return value;
      }
      return transformer.out(value as R);
    } catch (error) {
      console.error('Error applying output transformer:', error);
      throw error; // or handle differently based on requirements
    }
  }
}
