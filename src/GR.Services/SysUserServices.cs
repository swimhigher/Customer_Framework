using GR.entity;
using GR.IServices;
using System;
using System.Collections.Generic;
using System.Text;
using static DataBase.ConfigDb;
namespace GR.Services
{
    public class SysUserServices : ISysUserServices
    {
        public List<TbSysUsers> GetList()
        {
            return Ser_SysUsers.Where(p => p.State == 0).ToList();
        }
    }
}
