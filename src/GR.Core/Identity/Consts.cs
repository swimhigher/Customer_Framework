namespace GR.Core.Identity
{
    public class Consts
    {
        //claim登录用户名
        public const string Claim_Login_Name = "GR_Commer_ClaimUserName";

        //claim登录id
        public const string Claim_Login_Id = "GR_Commer_ClaimUserId";

        //redis下的操作用户
        public const string Redis_Login_User = "GR_Commer_RedisUserNme_";

        //redis下的用户权限  包括菜单和按钮
        public const string Redis_User_AuthMenu = "GR_Commer_RedisUserAuthMenu_";

        public const string Redis_User_AuthButton = "GR_Commer_RedisUserAuthButton_";
    }
}