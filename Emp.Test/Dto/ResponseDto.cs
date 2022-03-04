using System.Net;

namespace Emp.Test.Dto
{
    public class ResponseDto<T>
    {
        public T Result { get; set; }
        public string Message { get; set; }
        public bool IsSuccess { get; set; }
        public HttpStatusCode Code { get; set; }
    }
}