using System.ComponentModel.DataAnnotations;

namespace GR.Entity.Dto
{
    public class LoginModel
    {
        [Display(Name = "账户")]
        [Required(AllowEmptyStrings = false, ErrorMessage = "账户不能为空")]
        [StringLength(20, MinimumLength = 2, ErrorMessage = "账户长度不能小于{2}")]
        public string username { get; set; }

        [Display(Name = "密码")]
        [DataType(DataType.Password)]
        [Required(AllowEmptyStrings = false, ErrorMessage = "密码不能为空")]
        [StringLength(60, MinimumLength = 6, ErrorMessage = "密码长度不能少于{2}")]
        public string password { get; set; }

        [Display(Name = "记住我")]
        public bool remember { get; set; }
    }
}