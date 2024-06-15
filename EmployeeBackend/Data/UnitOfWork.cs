using EmployeeBackend.Data.Repo;
using EmployeeBackend.Interfaces;
using EmployeeBackend.Services;

namespace EmployeeBackend.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext dc;
        private readonly IphotoService _photoService;

        public UnitOfWork(AppDbContext dc)
        {
            this.dc = dc;
            _photoService = new PhotoService(
                "public_UoITDx2RnJfUkTLv1KDBooh7x1Q=",
                "private_JXjwVKx+91PVfP2C8RF/M+HPN8U=",
                "https://ik.imagekit.io/kzrdgwznu"
            );
        }

        public IUserRepository UserRepository => new UserRepository(dc);

        public IphotoService PhotoService => _photoService;

     

        public ILikeRepository likeRepository => new LikesRepository(dc);

        public IMessageRepository MessageRepository => new  MessageRepository(dc);

        public async Task<bool> SaveAsync()
        {
            return await dc.SaveChangesAsync() > 0;
        }
    }
}
