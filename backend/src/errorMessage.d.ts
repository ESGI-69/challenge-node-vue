export interface ErrorMessage {
  /** Array of missing fields */
  missingFields?: string[];
  /** Array of invalid fields */
  invalidFields?: string[];
  /** Array of non-unique fields */
  nonUniqueFields?: string[];
  /** Is the token invalid */
  invalidToken?: boolean;
  /** Filled if the error has an Error Type */
  reason?: string;
}
