using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;

namespace GR.IServices
{
   public static class ServicesExtent
    {
        /// <summary>
        /// RegisterAssemblyTypes
        /// </summary>
        /// <param name="services">services</param>
        /// <param name="typesFilter">filter types to register</param>
        /// <param name="serviceLifetime">service lifetime</param>
        /// <param name="assemblies">assemblies</param>
        /// <returns>services</returns>
        public static IServiceCollection RegisterAssemblyTypes(this IServiceCollection services, Func<Type, bool> typesFilter, ServiceLifetime serviceLifetime, params Assembly[] assemblies)
        {
            //if (assemblies == null || assemblies.Length == 0)
            //{
            //    assemblies = ReflectHelper.GetAssemblies();
            //}

            var types = assemblies
                .Select(assembly => assembly.GetExportedTypes())
                .SelectMany(t => t);
            if (typesFilter != null)
            {
                types = types.Where(typesFilter);
            }
           // Console.WriteLine(assemblies[0].GetTypes().Count());

            foreach (var item in assemblies[0].GetTypes().Where(p => p.IsClass && p.GetInterfaces().Contains(typeof(IService))))
            {
                services.Add(new ServiceDescriptor(item.GetInterfaces().Where(p => p.Name != "IService").FirstOrDefault(), item, serviceLifetime));
            }


            return services;
        }
    }
}
