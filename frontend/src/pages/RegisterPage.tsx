import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../store/slices/authSlice';
import { useForm } from 'react-hook-form';
import { useAppDispatch } from '../hooks/useAppDispatch';

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { register: registerField, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      firstName: '',
      email: '',
      password: '',
      age: 18,
      gender: '',
    },
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      await dispatch(register(data)).unwrap();
      navigate('/onboarding');
    } catch (error: any) {
      console.error('Registration failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-soul-gradient flex items-center justify-center px-4">
      <div className="card max-w-md w-full">
        <h1 className="text-4xl font-heading font-bold text-center mb-2 bg-cosmic-gradient bg-clip-text text-transparent">
          Join SoulSync
        </h1>
        <p className="text-center text-gray-400 mb-8">Start your journey to authentic connections</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="First Name"
              {...registerField('firstName', { required: 'First name is required' })}
              className="input-field w-full"
            />
          {errors.firstName && (
            <p className="text-red-400 text-sm mt-1">{errors.firstName.message as string}</p>
          )}
          </div>

          <div>
            <input
              type="email"
              placeholder="Email"
              {...registerField('email', { required: 'Email is required' })}
              className="input-field w-full"
            />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email.message as string}</p>
          )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              {...registerField('password', { required: 'Password is required', minLength: 6 })}
              className="input-field w-full"
            />
          {errors.password && (
            <p className="text-red-400 text-sm mt-1">{errors.password.message as string}</p>
          )}
          </div>

          <div>
            <input
              type="number"
              placeholder="Age"
              {...registerField('age', { required: 'Age is required', min: 18, max: 100 })}
              className="input-field w-full"
            />
          {errors.age && (
            <p className="text-red-400 text-sm mt-1">{errors.age.message as string}</p>
          )}
          </div>

          <div>
            <select
              {...registerField('gender', { required: 'Gender is required' })}
              className="input-field w-full"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-binary</option>
              <option value="other">Other</option>
            </select>
          {errors.gender && (
            <p className="text-red-400 text-sm mt-1">{errors.gender.message as string}</p>
          )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-cosmic-blue hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;

