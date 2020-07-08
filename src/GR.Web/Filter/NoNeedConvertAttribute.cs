using Microsoft.AspNetCore.Mvc.Filters;
using System;

namespace GR.Web.Filter
{
    public class NoNeedConvertAttribute : Attribute, IFilterMetadata
    {
    }
}