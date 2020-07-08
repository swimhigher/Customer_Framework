using FreeSql.DataAnnotations;
using Newtonsoft.Json;
using System;

namespace GR.Entity
{
    /// <summary>
    /// 机构
    /// </summary>
    [JsonObject(MemberSerialization.OptIn), Table(Name = "sys_deptment")]
    public partial class SysDeptment
    {
        /// <summary>
        /// 主键
        /// </summary>
        [JsonProperty, Column(DbType = "varchar(36)", IsPrimary = true)]
        public string Id { get; set; }

        /// <summary>
        /// 创建人
        /// </summary>
        [JsonProperty, Column(Name = "Create_By", DbType = "varchar(50)")]
        public string CreateBy { get; set; }

        /// <summary>
        /// 创建时间
        /// </summary>
        [JsonProperty, Column(Name = "create_on", DbType = "datetime", ServerTime = DateTimeKind.Utc, CanUpdate = false)]
        public DateTime? CreateOn { get; set; }

        /// <summary>
        /// 更新时间
        /// </summary>
        [JsonProperty, Column(Name = "update_on", DbType = "timestamp", ServerTime = DateTimeKind.Utc)]
        public DateTime? UpdateOn { get; set; }

        /// <summary>
        /// 层级
        /// </summary>
        [JsonProperty]
        public int? Floor { get; set; }

        /// <summary>
        /// 名称
        /// </summary>
        [JsonProperty, Column(DbType = "varchar(50)")]
        public string Name { get; set; }

        /// <summary>
        /// 父级id
        /// </summary>
        [JsonProperty, Column(DbType = "varchar(36)")]
        public string Parent { get; set; }

        /// <summary>
        /// 备注
        /// </summary>
        [JsonProperty]
        public string Remark { get; set; }

        /// <summary>
        /// 状态(0正常-1删除1禁用)
        /// </summary>
        [JsonProperty]
        public int? State { get; set; }

        /// <summary>
        /// 更新人
        /// </summary>
        [JsonProperty, Column(Name = "Update_By", DbType = "varchar(50)")]
        public string UpdateBy { get; set; }
    }
}