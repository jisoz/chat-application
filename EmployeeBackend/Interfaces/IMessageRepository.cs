using EmployeeBackend.Dto.Res;
using EmployeeBackend.Helpers;
using EmployeeBackend.Models;

namespace EmployeeBackend.Interfaces
{
    public interface IMessageRepository
    {

        void AddMessage(Message message);
        void DeleteMessage(Message message);

        Task<Message> GetMessage(int id);

        //Task<PagedList<MessageDto>> GetMessagesforuser();

        Task<IEnumerable<MessageDto>> GetMessageThread(int currentuserid,  int recipientid);


    }
}
