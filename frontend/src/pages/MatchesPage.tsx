import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { fetchMatches } from '../store/slices/matchSlice';
import { RootState } from '../store/store';
import { useAppDispatch } from '../hooks/useAppDispatch';

const MatchesPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { matches, loading } = useSelector((state: RootState) => state.matches);

  useEffect(() => {
    dispatch(fetchMatches());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cosmic-purple"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-heading font-bold mb-8">Your Matches</h1>

      {matches.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">No matches yet. Start swiping to find your soulmate!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match: any) => {
            const otherUser = match.users.find((u: any) => u._id !== match.users[0]._id);
            return (
              <div
                key={match._id}
                onClick={() => navigate(`/chat/${match._id}`)}
                className="card cursor-pointer hover:scale-105 transition-transform"
              >
                <div className="flex items-center gap-4">
                  {otherUser?.profile?.photos?.[0] && (
                    <img
                      src={otherUser.profile.photos[0]}
                      alt={otherUser.profile.firstName}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <h3 className="text-xl font-heading font-bold">
                      {otherUser?.profile?.firstName}
                    </h3>
                    <p className="text-gray-400">
                      {Math.round(match.soulDensityScore)}% Match
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MatchesPage;

