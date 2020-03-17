using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Text.Json;

namespace GR.Core
{
    public static class ConfigHelper
    {
        static JsonElement root;
        static ConfigHelper()
        {
            BuildRoot();


        }

        static void BuildRoot()
        {
            using (var stream = File.OpenRead("appsettings.json"))
            {

                var doc = JsonDocument.Parse(stream);
                root = doc.RootElement;
            }
        }
        //public static T Get<T>(string str)
        //{

        //    string[] arr = str.Split(':');
        //    if (!str.Contains(":"))
        //    {
        //        return JsonSerializer.Deserialize<T>(root.GetProperty(str).GetString());
        //    }
        //    else
        //    {
        //        return JsonSerializer.Deserialize<T>(GetDeep(str, root));
        //    }
        //}

        //private static T GetDeep<T>(string str, JsonElement element)
        //{
        //    if (!str.Contains(":"))
        //    {
        //        return JsonSerializer.Deserialize<T>(element.GetProperty(str).GetString());
        //    }
        //    else
        //    {
        //        var newElement = element.GetProperty(str.Split(':')[0]);
        //        var next = str.Substring(str.IndexOf(":") + 1);
        //        return JsonSerializer.Deserialize<T>(GetDeep(next, newElement));
        //    }
        //}
        public static string GetString(string str)
        {

            string[] arr = str.Split(':');
            if (!str.Contains(":"))
            {
                return root.GetProperty(str).GetString();
            }
            else
            {
                return GetDeep(str, root);
            }
        }

        private static string GetDeep(string str, JsonElement element)
        {
            if (!str.Contains(":"))
            {
                return element.GetProperty(str).GetString();
            }
            else
            {
                var newElement = element.GetProperty(str.Split(':')[0]);
                var next = str.Substring(str.IndexOf(":") + 1);
                return GetDeep(next, newElement);
            }
        }
        public static int GetInt(string str)
        {
            return Convert.ToInt32(GetString(str));
        }
        public static bool GetBool(string str)
        {
            return Convert.ToBoolean(GetString(str));
        }
    }
}
