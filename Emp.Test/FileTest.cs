using Emp.Test.Dto;
using Emp.Test.Service;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace Emp.Test
{
    public class FileTest
    {
        public FileTest()
        {
            SiteKeys.APIBase = "http://localhost:42969/";
        }
        [Fact]
        public void A_Create_Fresh_DB_File()
        {
            string sourceFile = @"C:\Database\EmpData\FileStore-templete.db";
            string destinationFile = @"C:\Database\EmpData\FileStore.db";
            try
            {
                File.Delete(destinationFile);
                File.Copy(sourceFile, destinationFile, true);
                Assert.True(true);
            }
            catch
            {
                Assert.True(false);
            }

        }

        [Fact]
        public async Task B_Create_File()
        {
            var service = new FileService();
            var file = GetTestFile();
            var result = await service.CreateUpdateAsync<ResponseDto<string>>(file);
            Assert.Equal(HttpStatusCode.OK, result.Code);
            Assert.Equal("File created", result.Message);
            Assert.NotNull(result.Message);
            Assert.Null(result.Result);
        }

        [Fact]
        public async Task C_Update_File()
        {
            var service = new FileService();
            var file = GetTestFile();
            file.Value = $"{file.Value} edited at {DateTime.Now}";
            var result = await service.CreateUpdateAsync<ResponseDto<string>>(file);
            Assert.Equal(HttpStatusCode.OK, result.Code);
            Assert.Equal("File created", result.Message);
            Assert.NotNull(result.Message);
            Assert.Null(result.Result);
        }



        [Fact]
        public async Task D_GetAll_User()
        {
            var file = GetTestFile();
            var service = new FileService();
            var result = await service.GetAllAsync<ResponseDto<List<FileDto>>>();
            Assert.Equal(HttpStatusCode.OK, result.Code);
            Assert.NotNull(result.Result);
            Assert.Null(result.Message);
            Assert.True(result.Result.Any());
            Assert.Contains(result.Result, a => a.Key == file.Key);
        }

        private FileDto GetTestFile()
        {
            return new FileDto()
            {
                Key = "testfile.pdf",
                Value = "test data for pdf file"
            };
        }
    }
}
