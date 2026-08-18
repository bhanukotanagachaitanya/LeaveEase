/**
 * Validation Helper Functions
 */

export const validateEmail = (email) => {
  const re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(String(email).toLowerCase());
};

export const validatePasswordStrength = (password) => {
  if (!password) return { isValid: false, message: 'Password is required' };
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long' };
  }
  return { isValid: true, message: 'Strong password' };
};

export const validateEmployeeId = (empId) => {
  if (!empId || empId.trim().length === 0) return false;
  return empId.trim().length >= 3;
};
