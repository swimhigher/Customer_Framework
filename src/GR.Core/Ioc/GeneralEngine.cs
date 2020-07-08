using System;
using System.Runtime.CompilerServices;

namespace GR.Core.Ioc
{
    public class GeneralEngine : IEngine
    {
        private IServiceProvider _provider;

        public GeneralEngine(IServiceProvider provider)
        {
            this._provider = provider;
        }

        /// <summary>
        /// 构建实例
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public T Resolve<T>() where T : class
        {
            return (_provider.GetService(typeof(T)) as T);
        }
    }

    public interface IEngine
    {
        T Resolve<T>() where T : class;
    }

    /// <summary>
    /// 引擎上下文,在项目初始化过程中实例化一个引擎实例
    /// </summary>
    public class EngineContext
    {
        private static IEngine _engine;

        [MethodImpl(MethodImplOptions.Synchronized)]
        public static IEngine initialize(IEngine engine)
        {
            if (_engine == null)
            {
                _engine = engine;
            }
            return _engine;
        }

        /// <summary>
        /// 当前引擎
        /// </summary>
        public static IEngine Current
        {
            get
            {
                return _engine;
            }
        }
    }
}