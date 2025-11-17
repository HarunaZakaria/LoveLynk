import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile } from '../store/slices/userSlice';
import { RootState } from '../store/store';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { profile } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(fetchUserProfile() as any);
  }, [dispatch]);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-heading font-bold mb-8">Your Profile</h1>

      {profile && (
        <div className="card">
          <div className="flex items-center gap-6 mb-6">
            {profile.photos?.[0] && (
              <img
                src={profile.photos[0]}
                alt={profile.firstName}
                className="w-32 h-32 rounded-full object-cover"
              />
            )}
            <div>
              <h2 className="text-2xl font-heading font-bold">
                {profile.firstName}, {profile.age}
              </h2>
              <p className="text-gray-400">{profile.bio}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {profile.interests?.map((interest: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-cosmic-purple/20 text-cosmic-purple rounded-full"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            <button className="btn-primary">Edit Profile</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;

