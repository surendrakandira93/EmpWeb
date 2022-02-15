#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

#Depending on the operating system of the host machines(s) that will build or run the containers, the image specified in the FROM statement may need to be changed.
#For more information, please see https://aka.ms/containercompat

FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /src
COPY ["EMP.Web/EMP.Web.csproj", "EMP.Web/"]
COPY ["EMP.Common/EMP.Common.csproj", "EMP.Common/"]
COPY ["EMP.Dto/EMP.Dto.csproj", "EMP.Dto/"]
COPY ["EMP.Service/EMP.Service.csproj", "EMP.Service/"]
RUN dotnet restore "EMP.Web/EMP.Web.csproj"
COPY . .
WORKDIR "/src/EMP.Web"
RUN dotnet build "EMP.Web.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "EMP.Web.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "EMP.Web.dll"]