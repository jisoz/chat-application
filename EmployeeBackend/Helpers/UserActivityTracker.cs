using System.Collections.Concurrent;

namespace EmployeeBackend.Helpers
{
    public static class UserActivityTracker
    {
        private static readonly ConcurrentDictionary<int, DateTime> userActivity = new ConcurrentDictionary<int, DateTime>();

        public static void UpdateUserActivity(int userId) 
        {
            userActivity[userId] = DateTime.Now;
        }

        public static bool IsUserOnline(int userId)
        {
            if (userActivity.TryGetValue(userId, out DateTime lastActivity))
            {
                // Consider a user online if their last activity was within the last 5 minutes
                var fiveMinutesAgo = DateTime.Now.AddMinutes(-8);
                return lastActivity > fiveMinutesAgo;
            }
            return false;
        }

        public static void RemoveUser(int userId)
        {
            userActivity.TryRemove(userId, out _);
        }

        public static IEnumerable<KeyValuePair<int, DateTime>> GetAllEntries()
        {
            return userActivity;
        }

    }
}
