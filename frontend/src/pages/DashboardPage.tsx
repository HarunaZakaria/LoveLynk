const DashboardPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-heading font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Matches</h3>
          <p className="text-3xl font-bold text-cosmic-purple">0</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Messages</h3>
          <p className="text-3xl font-bold text-cosmic-blue">0</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Quests Completed</h3>
          <p className="text-3xl font-bold text-cosmic-orange">0</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
