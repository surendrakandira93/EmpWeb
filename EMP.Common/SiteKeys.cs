using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMP.Common
{
    public static class SiteKeys
    {
        public static string Domain { get; set; }
        public static string APIBase { get; set; }
        public static string APIFileBase{get;set;}
        public enum ApiType
        {
            GET,
            POST,
            PUT,
            DELETE
        }

    }


    public static class TwitterKeys {
        public static string APIKey { get; set; }
        public static string APIKeySecret { get; set; }
        public static string BearerToken { get; set; }
        public static string AccessToken { get; set; }
        public static string AccessTokenSecret { get; set; }
        public static string ClientId { get; set; }
        public static string ClientSecret { get; set; }
    }

    public static class FacebookKeys
    {
        public static string ExchangeToken { get; set; }
        public static string PageId { get; set; }
        public static string BaseUrl { get; set; }
        public static string ClientId { get; set; }
        public static string ClientSecret { get; set; }
        public static string UserToken { get; set; }
        public static string PageToken { get; set; }
    }
}
