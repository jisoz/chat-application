namespace EmployeeBackend.Interfaces
{
    public interface IUnitOfWork
    {
        IUserRepository UserRepository { get; }
        IphotoService PhotoService { get; }

        ILikeRepository likeRepository { get; }

        IMessageRepository MessageRepository { get; }
        Task<bool> SaveAsync();
    }
}
