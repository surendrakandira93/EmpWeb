
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using QRCoder;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace EMP.Web.Controllers
{
    public class QRCodeController : Controller
    {
        private readonly IHostingEnvironment env;
        private readonly IViewRenderService viewRender;
        public QRCodeController(IHostingEnvironment _env, IViewRenderService _viewRender)
        {
            env = _env;
            viewRender = _viewRender;
        }
        public IActionResult Index()
        {
            string fileName = $"{DateTime.Now.Ticks}.png";
            QRCodeGenerator qrGenerator = new QRCodeGenerator();
            QRCodeData qrCodeData = qrGenerator.CreateQrCode("Surendra Kandira \n Developer & EY \n Gurugram, Haryaran", QRCodeGenerator.ECCLevel.Q);
            QRCode qrCode = new QRCode(qrCodeData);
            Bitmap qrCodeImage = qrCode.GetGraphic(20);
            // Bitmap qrCodeImage = qrCode.GetGraphic(20, "#000ff0", "#0ff000");

            string webRoot = env.WebRootPath;
            if (!Directory.Exists($"{webRoot}/QRCode/"))
            {
                Directory.CreateDirectory($"{webRoot}/QRCode/");
            }
            string Directirypath = $"{webRoot}/QRCode/";
            //Bitmap qrCodeImage = qrCode.GetGraphic(20, Color.Black, Color.White, (Bitmap)Bitmap.FromFile(Path.Combine(Directirypath, fileName)));
            qrCodeImage.Save(Path.Combine(Directirypath, fileName));
            ViewBag.name = fileName;
            return View();
        }

        public async Task<FileResult> Screenshot(string fileName)
        {            
            ViewBag.name = fileName;
            var renderedView = await viewRender.RenderPartialViewToString(this, "_screenshot", fileName);
            var converter = new HtmlToImageConverter();
            var bytes = converter.FromHtmlString(renderedView, 280);            
            return File(bytes, "image/jpeg", fileName);
        }
    }
}
