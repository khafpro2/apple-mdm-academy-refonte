export type ValidationSeverity = "error" | "warning";

export type ValidationIssue = {
  code: string;
  message: string;
  path?: string;
  severity: ValidationSeverity;
  subjectId?: string;
};

export type ValidationResult = {
  valid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
};

export function emptyValidationResult(): ValidationResult {
  return { valid: true, errors: [], warnings: [] };
}

export function mergeValidationResults(...results: ValidationResult[]): ValidationResult {
  const errors = results.flatMap((r) => r.errors);
  const warnings = results.flatMap((r) => r.warnings);
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export function issue(
  severity: ValidationSeverity,
  code: string,
  message: string,
  opts?: { path?: string; subjectId?: string }
): ValidationIssue {
  return {
    severity,
    code,
    message,
    path: opts?.path,
    subjectId: opts?.subjectId,
  };
}
