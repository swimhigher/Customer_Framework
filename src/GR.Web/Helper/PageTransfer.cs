namespace GR.Helper
{
    public class PageTransfer
    {
        public PageTransfer(dynamic pager)
        {
            this.Page = pager.Page;
            this.count = pager.Count;
            this.limit = pager.Limit;
            this.message = pager.Context;
            this.msg = pager.Context;
            this.data = pager.Data;
        }

        public long Page { get; set; }
        public long code { get; set; }
        public long count { get; set; }
        public long limit { get; set; }
        public string msg { get; set; }
        public object message { get; set; }
        public object data { get; set; }
    }

    //public  class NullPage<T>
    //{
    //    public static Page<T> Get
    //    {
    //        get
    //        {
    //            return new Page<T>
    //            {
    //                Items = null,
    //                CurrentPage = 1,
    //                TotalItems = 0,
    //                ItemsPerPage = 20,
    //                TotalPages = 0

    //            };
    //        }
    //    }
    //}
}