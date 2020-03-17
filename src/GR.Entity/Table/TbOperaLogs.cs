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
	/// 操作日志
		/// 
	/// </summary>
	[JsonObject(MemberSerialization.OptIn), Table(Name = "tb_opera_logs")]
	public partial class TbOperaLogs {

		/// <summary>
		/// 主键
		/// </summary>
		[JsonProperty, Column(Name = "id", DbType = "varchar(36)", IsPrimary = true)]
		public string Id { get; set; }

		/// <summary>
		/// 操作人
		/// </summary>
		[JsonProperty, Column(Name = "create_by", DbType = "varchar(50)")]
		public string CreateBy { get; set; }

		/// <summary>
		/// 操作时间
		/// </summary>
		[JsonProperty, Column(Name = "create_on", DbType = "datetime")]
		public DateTime? CreateOn { get; set; }

		/// <summary>
		/// 传入参数
		/// </summary>
		[JsonProperty, Column(Name = "input", DbType = "text")]
		public string Input { get; set; }

		/// <summary>
		/// ip地址
		/// </summary>
		[JsonProperty, Column(Name = "ip", DbType = "varchar(32)")]
		public string Ip { get; set; }

		/// <summary>
		/// 操作描述
		/// </summary>
		[JsonProperty, Column(Name = "operate", DbType = "varchar(50)")]
		public string Operate { get; set; }

		/// <summary>
		/// 输出结果
		/// </summary>
		[JsonProperty, Column(Name = "output", DbType = "text")]
		public string Output { get; set; }

		/// <summary>
		/// 备注
		/// </summary>
		[JsonProperty, Column(Name = "remark")]
		public string Remark { get; set; }

		/// <summary>
		/// 操作url
		/// </summary>
		[JsonProperty, Column(Name = "url", DbType = "varchar(100)")]
		public string Url { get; set; }


		#region 外键 => 导航属性，ManyToMany

		#endregion
	}

}
