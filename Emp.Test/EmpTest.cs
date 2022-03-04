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
    public class EmpTest
    {
        public EmpTest()
        {
            SiteKeys.APIBase = "http://localhost:46938/";
        }
        [Fact]
        public void A_Create_Fresh_DB_File()
        {
            string sourceFile = @"C:\Database\EmpData\EmpManagement-templete.db";
            string destinationFile = @"C:\Database\EmpData\EmpManagement.db";
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
        public async Task B_Create_User()
        {
            var service = new EmployeeService();
            var emp = GetTestEmp();
            var result = await service.CreateEmployeeAsync<ResponseDto<string>>(emp);
            Assert.Equal(HttpStatusCode.OK, result.Code);
            Assert.Equal("Employee created", result.Message);
            Assert.NotNull(result.Message);
            Assert.Null(result.Result);
        }

        [Fact]
        public async Task C_Update_User()
        {
            var service = new EmployeeService();
            var emp = GetTestEmp();
            var user = (await service.GetEmployeeByEmailAsync<ResponseDto<EmployeeDto>>(emp.Email)).Result;
            user = (await service.GetEmployeeByIdAsync<ResponseDto<EmployeeDto>>(user.Id.Value)).Result;
            user.Name = "Surendra Sharma";
            user.DateOfBrith = new DateTime(1993, 02, 02);
            user.Password = "1234567";
            var result = await service.UpdateEmployeeAsync<ResponseDto<string>>(user);
            Assert.Equal(HttpStatusCode.OK, result.Code);
            Assert.Equal("Employee updated", result.Message);
            Assert.NotNull(result.Message);
            Assert.Null(result.Result);
        }

        [Fact]
        public async Task D_Update_Password()
        {
            var service = new EmployeeService();
            var emp = GetTestEmp();
            var user = (await service.GetEmployeeByEmailAsync<ResponseDto<EmployeeDto>>(emp.Email)).Result;
            var result = await service.ChangePasswordAsync<ResponseDto<string>>(user.Id.Value, "123456789");
            Assert.Equal(HttpStatusCode.OK, result.Code);
            Assert.Equal("Password Changed", result.Message);
            Assert.NotNull(result.Message);
            Assert.Null(result.Result);
        }

        [Fact]
        public async Task E_GetAll_User()
        {
            var emp = GetTestEmp();
            var service = new EmployeeService();
            var result = await service.GetAllEmployeeAsync<ResponseDto<List<EmployeeAddDto>>>();
            Assert.Equal(HttpStatusCode.OK, result.Code);
            Assert.NotNull(result.Result);
            Assert.Null(result.Message);
            Assert.True(result.Result.Any());
            Assert.Contains(result.Result, a => a.Name == emp.Name);

        }


        [Fact]
        public async Task F_Create_Scheme()
        {
            var empService = new EmployeeService();
            var service = new EmployeeGroupService();
            var emp = GetTestEmp();
            var user = (await empService.GetEmployeeByEmailAsync<ResponseDto<EmployeeDto>>(emp.Email)).Result;
            var scheme = GetTestScheme();
            scheme.AdminId = user.Id.Value;
            var result = await service.CreateEmployeeGroupAsync<ResponseDto<string>>(scheme);
            Assert.Equal(HttpStatusCode.OK, result.Code);
            Assert.Equal("Employee Group created", result.Message);
            Assert.NotNull(result.Message);
            Assert.Null(result.Result);
        }

        [Fact]
        public async Task G_Update_Scheme()
        {
            var service = new EmployeeGroupService();
            var groups = (await service.GetAllEmployeeGroupAsync<ResponseDto<List<EmployeeGroupAddDto>>>()).Result;
            if (groups != null && groups.Any())
            {
                var group = (await service.GetEmployeeGroupByIdAsync<ResponseDto<EmployeeGroupAddDto>>(groups.FirstOrDefault().Id.Value)).Result;
                group.Description = $"This is .Net core group for testing purpose edited at {DateTime.Now}";
                var result = await service.UpdateEmployeeGroupAsync<ResponseDto<string>>(group);
                Assert.Equal(HttpStatusCode.OK, result.Code);
                Assert.Equal("Employee Group updated", result.Message);
                Assert.NotNull(result.Message);
                Assert.Null(result.Result);
            }
            else
            {
                Assert.True(false);
            }

        }

        [Fact]
        public async Task H_GetAll_Scheme()
        {
            var scheme = GetTestScheme();
            EmployeeGroupService service = new EmployeeGroupService();
            var result = await service.GetAllEmployeeGroupAsync<ResponseDto<List<EmployeeGroupAddDto>>>();
            Assert.Equal(HttpStatusCode.OK, result.Code);
            Assert.NotNull(result.Result);
            Assert.Null(result.Message);
            Assert.True(result.Result.Any());
            Assert.Contains(result.Result, a => a.Name == scheme.Name);

        }


        [Fact]
        public async Task J_Create_Profit_Loss()
        {
            var service = new SchemeProfitLossService();
            var schemeService = new EmployeeGroupService();
            var pl = GetTestSchemeProfitLoss1();
            var scheme = (await schemeService.GetAllEmployeeGroupAsync<ResponseDto<List<EmployeeGroupAddDto>>>()).Result;
            if (scheme.Any())
            {
                pl.GroupId = scheme.FirstOrDefault().Id.Value;
                var result = await service.CreateAsync<ResponseDto<string>>(pl);
                Assert.Equal(HttpStatusCode.OK, result.Code);
                Assert.Equal("Scheme ProfitLoss created", result.Message);
                Assert.NotNull(result.Message);
                Assert.Null(result.Result);

                pl = GetTestSchemeProfitLoss2();
                pl.GroupId = scheme.FirstOrDefault().Id.Value;
                result = await service.CreateAsync<ResponseDto<string>>(pl);

                pl = GetTestSchemeProfitLoss3();
                pl.GroupId = scheme.FirstOrDefault().Id.Value;
                result = await service.CreateAsync<ResponseDto<string>>(pl);

                pl = GetTestSchemeProfitLoss4();
                pl.GroupId = scheme.FirstOrDefault().Id.Value;
                result = await service.CreateAsync<ResponseDto<string>>(pl);

                pl = GetTestSchemeProfitLoss5();
                pl.GroupId = scheme.FirstOrDefault().Id.Value;
                result = await service.CreateAsync<ResponseDto<string>>(pl);
            }
            else
            {
                Assert.True(false);
            }

        }

        [Fact]
        public async Task K_Update_Scheme()
        {
            var service = new SchemeProfitLossService();
            var schemeService = new EmployeeGroupService();
            var scheme = (await schemeService.GetAllEmployeeGroupAsync<ResponseDto<List<EmployeeGroupAddDto>>>()).Result;
            if (scheme != null && scheme.Any())
            {
                var pls = (await service.GetAllAsync<ResponseDto<List<SchemeProfitLossDto>>>(scheme.FirstOrDefault().Id.Value)).Result;
                if (pls.Any())
                {
                    var pl = (await service.GetByIdAsync<ResponseDto<SchemeProfitLossDto>>(pls.FirstOrDefault().Id.Value)).Result;
                    pl.Comments = $"This is testing comments edited at {DateTime.Now}";
                    var result = await service.UpdateAsync<ResponseDto<string>>(pl);
                    Assert.Equal(HttpStatusCode.OK, result.Code);
                    Assert.Equal("Scheme ProfitLoss updated", result.Message);
                    Assert.NotNull(result.Message);
                    Assert.Null(result.Result);
                }
                else
                {
                    Assert.True(false);
                }

            }
            else
            {
                Assert.True(false);
            }

        }

        [Fact]
        public async Task L_GetAll_Scheme()
        {
            var service = new SchemeProfitLossService();
            var schemeService = new EmployeeGroupService();
            var scheme = (await schemeService.GetAllEmployeeGroupAsync<ResponseDto<List<EmployeeGroupAddDto>>>()).Result;
            if (scheme.Any())
            {
                var result = await service.GetAllAsync<ResponseDto<List<SchemeProfitLossDto>>>(scheme.FirstOrDefault().Id.Value);
                Assert.Equal(HttpStatusCode.OK, result.Code);
                Assert.NotNull(result.Result);
                Assert.Null(result.Message);
                Assert.True(result.Result.Any());
            }
            else
            {
                Assert.True(false);
            }
        }


        [Fact]
        public async Task M_Create_Shipment()
        {
            var empService = new EmployeeService();
            var emp = GetTestEmp();
            var user = (await empService.GetEmployeeByEmailAsync<ResponseDto<EmployeeDto>>(emp.Email)).Result;

            var service = new ShipmentService();
            var shipment = GetTestShipment();
            shipment.EmpId = user.Id;
            var result = await service.CreateAsync<ResponseDto<string>>(shipment);
            Assert.Equal(HttpStatusCode.OK, result.Code);
            Assert.Equal("Shipment created", result.Message);
            Assert.NotNull(result.Message);
            Assert.Null(result.Result);
        }

        [Fact]
        public async Task N_Update_Shipment()
        {
            var service = new ShipmentService();
            var shipments = (await service.GetAllAsync<ResponseDto<List<ShipmentDto>>>()).Result;
            if (shipments.Any())
            {
                var shipment = (await service.GetByIdAsync<ResponseDto<ShipmentAddDto>>(shipments.FirstOrDefault().Id)).Result;
                shipment.Platform = $"Test platform edited at {DateTime.Now}";
                var result = await service.UpdateAsync<ResponseDto<string>>(shipment);
                Assert.Equal(HttpStatusCode.OK, result.Code);
                Assert.Equal("Shipment updated", result.Message);
                Assert.NotNull(result.Message);
                Assert.Null(result.Result);
            }
            else
            {
                Assert.True(false);
            }
        }

        [Fact]
        public async Task O_GetAll_Shipment()
        {
            var service = new ShipmentService();
            var result = await service.GetAllAsync<ResponseDto<List<ShipmentDto>>>();
            Assert.Equal(HttpStatusCode.OK, result.Code);
            Assert.NotNull(result.Result);
            Assert.Null(result.Message);
            Assert.True(result.Result.Any());
        }

        private EmployeeAddDto GetTestEmp()
        {
            return new EmployeeAddDto()
            {
                DateOfBrith = new DateTime(193, 02, 05),
                Name = "Surendra Kandira",
                Email = "surendrakandira@gmail.com",
                Password = "123456",
                City = "Jaipur",
                Gender = "Male",
                Technologies = new List<string>() {
                "C#","ASP.Net",".Net Core","SQL"
                }
            };
        }

        private EmployeeGroupAddDto GetTestScheme()
        {
            return new EmployeeGroupAddDto()
            {
                Name = ".Net Core Group",
                Description = "This is .Net core group for testing purpose",
                IsActive = true
            };
        }
        private SchemeProfitLossDto GetTestSchemeProfitLoss1()
        {
            return new SchemeProfitLossDto()
            {
                Comments = "This is testing comments",
                Date = new DateTime(2022, 02, 01),
                Expense = 0,
                IsHoliday = false,
                IsNoTradeDay = false,
                IsRefresh = false,
                KeyWord = "C#,ASP.Net,.Net Core",
                ProfitLoss = 5623.02
            };
        }

        private SchemeProfitLossDto GetTestSchemeProfitLoss2()
        {
            return new SchemeProfitLossDto()
            {
                Comments = "This is testing comments",
                Date = new DateTime(2022, 02, 02),
                Expense = 0,
                IsHoliday = false,
                IsNoTradeDay = false,
                IsRefresh = false,
                KeyWord = "C#,ASP.Net,.Net Core",
                ProfitLoss = 5699.50
            };
        }

        private SchemeProfitLossDto GetTestSchemeProfitLoss3()
        {
            return new SchemeProfitLossDto()
            {
                Comments = "This is testing comments",
                Date = new DateTime(2022, 02, 03),
                Expense = 0,
                IsHoliday = false,
                IsNoTradeDay = false,
                IsRefresh = false,
                KeyWord = "C#,ASP.Net,.Net Core",
                ProfitLoss = 6256
            };
        }

        private SchemeProfitLossDto GetTestSchemeProfitLoss4()
        {
            return new SchemeProfitLossDto()
            {
                Comments = "This is testing comments",
                Date = new DateTime(2022, 02, 04),
                Expense = 0,
                IsHoliday = false,
                IsNoTradeDay = false,
                IsRefresh = false,
                KeyWord = "C#,ASP.Net,.Net Core",
                ProfitLoss = 6526.75
            };
        }

        private SchemeProfitLossDto GetTestSchemeProfitLoss5()
        {
            return new SchemeProfitLossDto()
            {
                Comments = "This is testing comments",
                Date = new DateTime(2022, 02, 05),
                Expense = 0,
                IsHoliday = false,
                IsNoTradeDay = false,
                IsRefresh = false,
                KeyWord = "C#,ASP.Net,.Net Core",
                ProfitLoss = 6825
            };
        }



        private ShipmentAddDto GetTestShipment()
        {
            return new ShipmentAddDto()
            {
                APIKey = "test API key",
                Broker = 1,
                LoginId = "Test loginId",
                Password = "123456",
                Password2 = "123456789",
                Platform = "Test platform"

            };
        }
    }
}
