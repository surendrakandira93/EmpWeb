using EMP.Common;
using EMP.Dto;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using RestSharp;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace EMP.Web.Controllers
{
    public class FacebookController : Controller
    {
        private readonly RestClient restClient;
        public FacebookController()
        {
            restClient = new RestClient(FacebookKeys.BaseUrl);
        }

        public async Task<IActionResult> Index()
        {
            List<FacebookDto> response = new List<FacebookDto>();
            if (string.IsNullOrEmpty(FacebookKeys.UserToken))
            {
                FacebookKeys.UserToken = await GetUserToken();
            }

            if (string.IsNullOrEmpty(FacebookKeys.PageToken))
            {
                FacebookKeys.PageToken = await GetPageToken(FacebookKeys.UserToken);
            }

            //  var details = await PostmageonPage(FacebookKeys.PageToken);
            if (!string.IsNullOrEmpty(FacebookKeys.PageToken))
            {
                response = await GetMessagePage(FacebookKeys.PageToken);
            }

            return View(response);
        }

        [HttpPost]
        public async Task<IActionResult> Index(IFormCollection fc)
        {
            if (string.IsNullOrEmpty(FacebookKeys.UserToken))
            {
                FacebookKeys.UserToken = await GetUserToken();
            }

            if (string.IsNullOrEmpty(FacebookKeys.PageToken))
            {
                FacebookKeys.PageToken = await GetPageToken(FacebookKeys.UserToken);
            }


            string message = fc["message"];
            if (Request.Form.Files.Any())
            {
                IFormFile file = Request.Form.Files[0];
                using (var ms = new MemoryStream())
                {
                    file.CopyTo(ms);
                    var fileBytes = ms.ToArray();
                    string postId = await PostmageonPage(FacebookKeys.UserToken, message, fileBytes, file.FileName);
                }

            }
            else
            {
                string postId = await PostTextonPage(FacebookKeys.PageToken, message);

            }

            return RedirectToAction("index");
        }

        private async Task<string> GetUserToken()
        {
            RestRequest request = new RestRequest("/oauth/access_token", Method.Get);
            request.AddParameter("grant_type", "fb_exchange_token");
            request.AddParameter("client_id", FacebookKeys.ClientId);
            request.AddParameter("client_secret", FacebookKeys.ClientSecret);
            request.AddParameter("fb_exchange_token", FacebookKeys.ExchangeToken);
            RestResponse response = await restClient.ExecuteAsync(request);
            var jsreader = new JsonTextReader(new StringReader(response.Content));
            var json = (JObject)new JsonSerializer().Deserialize(jsreader);
            return json["access_token"].ToString();
        }

        private async Task<string> GetPageToken(string access_token)
        {
            RestRequest request = new RestRequest($"/{FacebookKeys.PageId}", Method.Get);
            request.AddParameter("fields", "access_token");
            request.AddParameter("access_token", access_token);
            RestResponse response = await restClient.ExecuteAsync(request);
            var jsreader = new JsonTextReader(new StringReader(response.Content));
            var json = (JObject)new JsonSerializer().Deserialize(jsreader);
            return json["access_token"].ToString();
        }

        private async Task<string> PostTextonPage(string access_token, string message)
        {
            RestRequest request = new RestRequest($"/v13.0/{FacebookKeys.PageId}/feed", Method.Post);
            request.AddParameter("message", message);
            request.AddParameter("access_token", access_token);
            RestResponse response = await restClient.ExecuteAsync(request);
            var jsreader = new JsonTextReader(new StringReader(response.Content));
            var json = (JObject)new JsonSerializer().Deserialize(jsreader);
            return json["id"].ToString();
        }

        private async Task<string> PostmageonPage(string access_token, string message, byte[] stream, string fileName)
        {
            RestRequest request = new RestRequest($"/v13.0/{FacebookKeys.PageId}/photos", Method.Post);
            request.AddParameter("message", message);
            request.AddHeader("Content-Type", "multipart/form-data");
            request.AddFile("source", stream, fileName);
            request.AddParameter("access_token", access_token);
            RestResponse response = await restClient.ExecuteAsync(request);
            var jsreader = new JsonTextReader(new StringReader(response.Content));
            var json = (JObject)new JsonSerializer().Deserialize(jsreader);
            return json["id"].ToString();
        }

        private async Task<List<FacebookDto>> GetMessagePage(string access_token)
        {
            RestRequest request = new RestRequest($"/v13.0/{FacebookKeys.PageId}/feed", Method.Get);

            request.AddParameter("access_token", access_token);
            RestResponse response = await restClient.ExecuteAsync(request);
            var jsreader = new JsonTextReader(new StringReader(response.Content));
            var json = (JObject)new JsonSerializer().Deserialize(jsreader);
            var data = json["data"].ToString();
            return !string.IsNullOrEmpty(data) ? (JsonConvert.DeserializeObject<List<FacebookDto>>(data)).OrderByDescending(o => o.created_time).ToList() : new List<FacebookDto>();
        }



    }
}
