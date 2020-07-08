using System;

namespace GR.Entity.Dto
{
    [Serializable]
    public class Result<T>
    {
        protected Result()
        {
            //this.Message = "操作失败";
        }

        public bool Success { get; set; }
        public int Code { get; set; } = 0;
        public string Message { get; set; }
        public T Data { get; set; }

        /// <summary>
        /// 将键转小写
        /// </summary>
        /// <returns></returns>
        public virtual object ToObject()
        {
            return new
            {
                success = this.Success,
                code = this.Code,
                message = this.Message,
                data = this.Data
            };
        }

        public static Result<U> Create<U>(string message = "")
        {
            return new Result<U>()
            {
                Message = message
            };
        }
    }

    [Serializable]
    public sealed class Result : Result<object>
    {
        private Result()
        {
        }

        public static Result Create(string message = "")
        {
            return new Result()
            {
                Message = message
            };
        }

        public new static Result Create(bool success, string message = "")
        {
            return new Result
            {
                Success = success,
                Message = message
            };
        }
    }
}