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

namespace GR.entity {

	/// <summary>
	/// 角色
	/// </summary>
	[JsonObject(MemberSerialization.OptIn), Table(Name = "tb_sys_roles")]
	public partial class TbSysRoles {

		/// <summary>
		/// 主键
		/// </summary>
		[JsonProperty, Column(Name = "id", DbType = "varchar(36)", IsPrimary = true)]
		public string Id { get; set; }

		/// <summary>
		/// 创建人
		/// </summary>
		[JsonProperty, Column(Name = "create_by", DbType = "varchar(50)")]
		public string CreateBy { get; set; }

		/// <summary>
		/// 创建时间
		/// </summary>
		[JsonProperty, Column(Name = "create_on", DbType = "datetime")]
		public DateTime? CreateOn { get; set; }

		/// <summary>
		/// 名称
		/// </summary>
		[JsonProperty, Column(Name = "name", DbType = "varchar(50)")]
		public string Name { get; set; }

		/// <summary>
		/// 备注
		/// </summary>
		[JsonProperty, Column(Name = "remark")]
		public string Remark { get; set; }

		/// <summary>
		/// 状态(0正常-1删除1禁用)
		/// </summary>
		[JsonProperty, Column(Name = "state")]
		public int? State { get; set; }

		/// <summary>
		/// 更新人
		/// </summary>
		[JsonProperty, Column(Name = "update_by", DbType = "varchar(50)")]
		public string UpdateBy { get; set; }

		/// <summary>
		/// 更新时间
		/// </summary>
		[JsonProperty, Column(Name = "update_on", DbType = "timestamp")]
		public DateTime? UpdateOn { get; set; }


		#region 外键 => 导航属性，ManyToMany

		#endregion
	}

}
