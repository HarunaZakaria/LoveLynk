import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../store/slices/authSlice';
import { useForm } from 'react-hook-form';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      await dispatch(login(data)).unwrap();
      navigate('/discovery');
    } catch (error: any) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-soul-gradient flex items-center justify-center px-4">
      <div className="card max-w-md w-full">
        <h1 className="text-4xl font-heading font-bold text-center mb-2 bg-cosmic-gradient bg-clip-text text-transparent">
          Welcome Back
        </h1>
        <p className="text-center text-gray-400 mb-8">Sign in to continue your journey</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              {...register('email', { required: 'Email is required' })}
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
              {...register('password', { required: 'Password is required' })}
              className="input-field w-full"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password.message as string}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-cosmic-blue hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

