using EMP.Common;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Tweetinvi;
using Tweetinvi.Models;

namespace EMP.Web.Controllers
{
    public class TwitterController : Controller
    {
       
        public async Task<IActionResult> Index()
        {
            //var client = new TwitterClient(Environment.GetEnvironmentVariable("TWITTER_TOKEN"));
            //var a = await client.GetTweetAsync("1510157413218930693", new TweetSearchOptions
            //{
            //    TweetOptions = new[] { TweetOption.Reply_Settings }
            //});


            string tweetMessage = "Hello tweetinvi world!";
            string filePath = @"D:\SQL.jpg";
            var client = new TwitterClient(TwitterKeys.APIKey, TwitterKeys.APIKeySecret, TwitterKeys.AccessToken, TwitterKeys.AccessTokenSecret);

            //var user = await client.Users.GetAuthenticatedUserAsync();
            var tweet = await client.Tweets.PublishTweetAsync(tweetMessage);

            var videoBinary = System.IO.File.ReadAllBytes(filePath);
            var videoMedia = await client.Upload.UploadTweetImageAsync(videoBinary);
          

            return View();
        }
    }
}
