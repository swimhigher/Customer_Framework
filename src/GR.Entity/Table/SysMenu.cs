//------------------------------------------------------------------------------
// <auto-generated>
//     此代码由工具生成。
//     运行时版本:4.0.30319.42000
//     Website: http://www.freesql.net
//     对此文件的更改可能会导致不正确的行为，并且如果
//     重新生成代码，这些更改将会丢失。
// </auto-generated>
//------------------------------------------------------------------------------
using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using FreeSql.DataAnnotations;

namespace GR.Entity
{

    [JsonObject(MemberSerialization.OptIn), Table(Name = "sys_menu")]
    public partial class SysMenu
    {
		[JsonProperty, Column(DbType = "varchar(40)", IsPrimary = true)]
		public string Id { get; set; }

		[JsonProperty, Column(Name = "Create_By", DbType = "varchar(40)")]
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

		[JsonProperty, Column(DbType = "varchar(100)")]
		public string Icon { get; set; }

		[JsonProperty, Column(Name = "Is_Delete", DbType = "int(1)")]
		public int IsDelete { get; set; }

		[JsonProperty, Column(Name = "Menu_Type", DbType = "int(1)")]
		public int? MenuType { get; set; }

		[JsonProperty, Column(DbType = "varchar(100)")]
		public string Name { get; set; }

		[JsonProperty, Column(Name = "Open_Type", DbType = "int(1)")]
		public int? OpenType { get; set; }

		[JsonProperty, Column(Name = "Order_By")]
		public float? OrderBy { get; set; }

		[JsonProperty, Column(Name = "Parent_Id", DbType = "varchar(40)")]
		public string ParentId { get; set; }

		[JsonProperty, Column(DbType = "varchar(200)")]
		public string Remark { get; set; }

		[JsonProperty, Column(DbType = "int(1)")]
		public int State { get; set; }

		[JsonProperty, Column(DbType = "int(1)")]
		public int? Status { get; set; }

		[JsonProperty, Column(Name = "Update_By", DbType = "varchar(40)")]
		public string UpdateBy { get; set; }


		[JsonProperty, Column(DbType = "varchar(200)")]
		public string Url { get; set; }



		#region 外键 => 导航属性，ManyToMany

		/// <summary>
		/// 子菜单
		/// </summary>
		[Column(IsIgnore = true)]
        public List<SysMenu> Children { get; set; }

        /// <summary>
        /// 上级菜单
        /// </summary>
        [Column(IsIgnore = true)]
        public SysMenu Parent { get; set; }
        #endregion
    }

}