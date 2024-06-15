using EmployeeBackend.Dto.Res;
using EmployeeBackend.Interfaces;
using EmployeeBackend.Models;

namespace EmployeeBackend.Data.Repo
{
    public class MessageRepository : IMessageRepository
    {

        private readonly AppDbContext dc;

        public MessageRepository(AppDbContext dc)
        {
            this.dc = dc;
        }
        public  void AddMessage(Message message)
        {
            dc.Messages.Add(message);
        }

        public void DeleteMessage(Message message)
        {
            dc.Messages.Remove(message);
        }

        public Task<Message> GetMessage(int id)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<MessageDto>> GetMessageThread(int currentuserid, int recipientid)
        {
            throw new NotImplementedException();
        }
    }
}
