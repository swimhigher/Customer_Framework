using FreeSql;
using System;

namespace DataBase
{
    public static class PageExt
    {
        public static Page<T> ToPage<T>(this ISelect<T> select, int page, int size) where T : class
        {
            Page<T> result = new Page<T>();

            var data = select.Page(page, size).Count(out long total).ToList<T>();
            result.TotalItems = total;
            result.Items = data;
            result.ItemsPerPage = size;
            result.CurrentPage = page;
            result.TotalPages = (long)Math.Ceiling(result.TotalItems / (double)size);
            return result;
        }
      
    }
}