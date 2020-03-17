using GR.entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace GR.IServices
{
    public interface ISysUserServices : IService
    {
         List<TbSysUsers> GetList();
    }
}
