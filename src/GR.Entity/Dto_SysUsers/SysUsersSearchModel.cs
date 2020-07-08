using GR.Entity.Dto;
using System;

namespace GR.Entity.Dto_SysUsers
{
    public partial class SysUsersSearchModel : BaseSearchObject
    {
        /// <summary>
        /// 创建时间-开始
        /// </summary>
        private DateTime CreateonS { get; set; }

        /// <summary>
        /// 创建时间-结束
        /// </summary>
        private DateTime CreateonE { get; set; }

        /// <summary>
        /// 创建时间-开始
        /// </summary>
        private DateTime UpdateonS { get; set; }

        /// <summary>
        /// 创建时间-结束
        /// </summary>
        private DateTime UpdateonE { get; set; }

        /// <summary>
        /// 状态(0正常-1删除1禁用)
        /// </summary>
        public int state { get; set; }

        public string deptment { get; set; }
    }
}