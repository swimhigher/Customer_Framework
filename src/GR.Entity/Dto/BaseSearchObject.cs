namespace GR.Entity.Dto
{
    public class BaseSearchObject
    {
        /// <summary>
        /// 当前页码
        /// </summary>
        public int page { get; set; }

        /// <summary>
        /// 每页条数
        /// </summary>
        public int limit { get; set; }

        /// <summary>
        /// 排序字段
        /// </summary>
        public string sort { get; set; }

        /// <summary>
        /// 排序方式：desc、asc
        /// </summary>
        public string order { get; set; }

        /// <summary>
        /// 搜索字段（且当只有一个搜索框时，可直接使用此类）
        /// 使用子类继承此类时可忽略
        /// </summary>
        public string keyword { get; set; }
    }
}