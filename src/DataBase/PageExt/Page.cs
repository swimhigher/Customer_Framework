﻿using System.Collections.Generic;

namespace DataBase
{
    public class Page<T>
    {
        /// <summary>
        ///     The current page number contained in this page of result set
        /// </summary>
        public long CurrentPage { get; set; }

        /// <summary>
        ///     The total number of pages in the full result set
        /// </summary>
        public long TotalPages { get; set; }

        /// <summary>
        ///     The total number of records in the full result set
        /// </summary>
        public long TotalItems { get; set; }

        /// <summary>
        ///     The number of items per page
        /// </summary>
        public long ItemsPerPage { get; set; }

        /// <summary>
        ///     The actual records on this page
        /// </summary>
        public List<T> Items { get; set; }

        /// <summary>
        ///     User property to hold anything.
        /// </summary>
        public object Context { get; set; }

        public object ToLayuiPageResult()
        {
            if (this == null)
            {
                return new { data = string.Empty, page = this.CurrentPage, pageCount = this.TotalPages, limit = this.ItemsPerPage, count = this.TotalItems, code = 0, message = this.Context };
            }
            return new { data = this.Items, page = this.CurrentPage, pageCount = this.TotalPages, limit = this.ItemsPerPage, count = this.TotalItems, code = 0, message = this.Context };
        }
    }
}