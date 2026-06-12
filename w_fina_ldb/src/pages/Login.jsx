/**
 * Login Page
 * User authentication using new hooks and patterns
 */
import React, { useState } from 'react';
import { useAuth } from '@/hooks/auth/useAuth';
import { useForm } from '@/hooks/form/useForm';
import { useToast } from '@/hooks/ui/useToast';
import { INPUT_LABELS, VALIDATION_MESSAGES } from '@/config/constants';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const { login, loading } = useAuth();
  const { showError } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const validationRules = {
    employeeId: { required: VALIDATION_MESSAGES.REQUIRED },
    password: { required: VALIDATION_MESSAGES.REQUIRED },
  };

  const { form, handleChange, validate, errors } = useForm(
    { employeeId: '', password: '' },
    validationRules
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const result = await login(form);
    if (!result.success) {
      showError(result.error || VALIDATION_MESSAGES.LOGIN_FAILED);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-orange-100">
      <form
        onSubmit={handleSubmit}
        className="max-w-sm w-full mx-auto mt-10 p-8 bg-white rounded-2xl shadow-xl transform transition-all duration-300 hover:shadow-2xl"
      >
        {/* Logo Section */}
        <div className="flex justify-center mb-8">
          <img
            src="/fina-logo-color.png"
            alt="Fina Logo"
            className="h-16 w-16 object-contain mx-2"
          />
          <img
            src="/im1.png"
            alt="LDB Logo"
            className="h-16 w-16 object-contain mx-2"
          />
        </div>

        {/* Error Display */}
        {errors.form && (
          <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg text-center font-noto-sans-lao">
            {errors.form}
          </div>
        )}

        {/* Employee ID Input */}
        <div className="mb-6">
          <label
            htmlFor="employeeId"
            className="block text-gray-700 font-semibold mb-2"
          >
            {INPUT_LABELS.EMPLOYEE_ID}
          </label>
          <input
            type="text"
            id="employeeId"
            name="employeeId"
            value={form.employeeId}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-colors duration-200 ${
              errors.employeeId ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your Employee ID"
            disabled={loading}
            autoComplete="username"
          />
          {errors.employeeId && (
            <p className="mt-1 text-sm text-red-600">{errors.employeeId}</p>
          )}
        </div>

        {/* Password Input */}
        <div className="mb-6 relative">
          <label
            htmlFor="password"
            className="block text-gray-700 font-semibold mb-2"
          >
            {INPUT_LABELS.PASSWORD}
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-colors duration-200 pr-20 ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your Password"
            disabled={loading}
            autoComplete="current-password"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-10 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 font-noto-sans-lao ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={loading}
        >
          {loading ? 'ກຳລັງເຂົ້າສູ່ລະບົບ...' : 'ເຂົ້າສູ່ລະບົບ'}
        </button>
      </form>
    </div>
  );
};

export default Login;
