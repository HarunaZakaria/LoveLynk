import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<any>({});

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      navigate('/discovery');
    }
  };

  return (
    <div className="min-h-screen bg-soul-gradient flex items-center justify-center px-4">
      <div className="card max-w-2xl w-full">
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-400">Step {step} of 5</span>
            <span className="text-sm text-gray-400">{Math.round((step / 5) * 100)}%</span>
          </div>
          <div className="w-full bg-cosmic-slate rounded-full h-2">
            <div
              className="bg-cosmic-gradient h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        <h2 className="text-3xl font-heading font-bold mb-4">
          {step === 1 && 'Welcome to SoulSync!'}
          {step === 2 && 'Tell us about yourself'}
          {step === 3 && 'What are you passionate about?'}
          {step === 4 && 'Your communication style'}
          {step === 5 && 'Almost there!'}
        </h2>

        <p className="text-gray-400 mb-8">
          {step === 1 && 'Let\'s build your personality profile to find your perfect match'}
          {step === 2 && 'Help us understand your values and preferences'}
          {step === 3 && 'Share your interests and hobbies'}
          {step === 4 && 'How do you prefer to communicate?'}
          {step === 5 && 'Upload a photo to complete your profile'}
        </p>

        <div className="space-y-4">
          {/* Placeholder for quiz questions */}
          <div className="input-field">
            <input type="text" placeholder="Your answer..." className="w-full bg-transparent" />
          </div>
        </div>

        <button onClick={handleNext} className="btn-primary w-full mt-8">
          {step === 5 ? 'Complete Profile' : 'Continue'}
        </button>
      </div>
    </div>
  );
};

export default OnboardingPage;

