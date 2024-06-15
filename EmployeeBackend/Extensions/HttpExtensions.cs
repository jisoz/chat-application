using Microsoft.CodeAnalysis.CSharp.Syntax;
using System.Text.Json;

namespace EmployeeBackend.Helpers
{
    public static class HttpExtensions
    {

        public static void AddPaginationHeader(this HttpResponse response , int CurrentPage, int ItemsPerPage,  int TotalItems, int TotalPages)
        {
            var paginationheader = new PaginationHeader(CurrentPage, ItemsPerPage, TotalItems, TotalPages);
            response.Headers.Add("Pagination",JsonSerializer.Serialize(paginationheader));
            response.Headers.Add("Acess-Control-Expose-Headers", "Pagination");


        }
    }
}
