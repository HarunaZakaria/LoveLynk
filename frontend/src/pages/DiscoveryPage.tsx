import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { discoveryApi } from '../services/api';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { addMatch } from '../store/slices/matchSlice';

const DiscoveryPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const dispatch = useAppDispatch();

  const { data: stack = [], isLoading } = useQuery({
    queryKey: ['discovery-stack'],
    queryFn: () => discoveryApi.getStack(50),
  });

  const currentCard = stack[currentIndex];

  const handleSwipe = async (action: 'like' | 'pass' | 'superSwipe') => {
    if (!currentCard) return;

    const swipeData = {
      swipedId: currentCard._id,
      action,
      compatibilityScore: currentCard.soulDensityScore || 75,
    };

    try {
      const result = await discoveryApi.swipe(swipeData);
      if (result.matched) {
        dispatch(addMatch(result.match));
        // Show match animation
      }
    } catch (error) {
      console.error('Swipe failed:', error);
    }

    setDirection(action === 'like' ? 1 : -1);
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setDirection(0);
    }, 300);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cosmic-purple"></div>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-heading mb-4">You've seen everyone nearby!</h2>
        <p className="text-gray-400">Check back tomorrow or expand your preferences</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="relative h-[600px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1, x: direction * 300 }}
            exit={{ opacity: 0, scale: 0.9, x: direction * 300 }}
            className="card absolute inset-0 cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, { offset, velocity }) => {
              if (Math.abs(offset.x) > 100 || Math.abs(velocity.x) > 500) {
                handleSwipe(offset.x > 0 ? 'like' : 'pass');
              }
            }}
          >
            {/* Profile Card Content */}
            <div className="h-full flex flex-col">
              {/* Soul Density Score */}
              <div className="absolute top-4 right-4 bg-cosmic-gradient px-4 py-2 rounded-full text-sm font-bold">
                {Math.round(currentCard.soulDensityScore || 0)}% Match
              </div>

              {/* Photos */}
              {currentCard.profile?.photos?.[0] && (
                <img
                  src={currentCard.profile.photos[0]}
                  alt={currentCard.profile.firstName}
                  className="w-full h-64 object-cover rounded-t-2xl"
                />
              )}

              {/* Profile Info */}
              <div className="p-6 flex-1">
                <h3 className="text-2xl font-heading font-bold mb-2">
                  {currentCard.profile?.firstName}, {currentCard.profile?.age}
                </h3>
                <p className="text-gray-300 mb-4">{currentCard.profile?.bio}</p>

                {/* Interests */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {currentCard.profile?.interests?.slice(0, 5).map((interest: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-cosmic-purple/20 text-cosmic-purple rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>

                {/* Voice Intro Button */}
                {currentCard.profile?.voiceIntro && (
                  <button className="btn-secondary w-full mb-4">
                    🎤 Play Voice Intro
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-6 mt-8">
        <button
          onClick={() => handleSwipe('pass')}
          className="w-16 h-16 rounded-full bg-cosmic-slate border-2 border-gray-600 hover:border-red-500 flex items-center justify-center text-2xl"
        >
          ✕
        </button>
        <button
          onClick={() => handleSwipe('superSwipe')}
          className="w-16 h-16 rounded-full bg-cosmic-gradient flex items-center justify-center text-2xl shadow-lg"
        >
          ⭐
        </button>
        <button
          onClick={() => handleSwipe('like')}
          className="w-16 h-16 rounded-full bg-cosmic-slate border-2 border-gray-600 hover:border-green-500 flex items-center justify-center text-2xl"
        >
          ♥
        </button>
      </div>
    </div>
  );
};

export default DiscoveryPage;

