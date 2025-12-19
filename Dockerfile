FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app
RUN mkdir /app/packages

COPY ./*.sln ./NuGet.Config ./
COPY src/*/*.csproj ./
RUN for file in $(ls *.csproj); do mkdir -p src/${file%.*}/ && mv $file src/${file%.*}/; done

RUN dotnet msbuild /t:Restore /p:Configuration=Release /p:TargetFramework=net8.0 /p:PackageOutputPath="/app/packages" /maxcpucount:1 /p:version=3.0.0-beta

COPY . /app
RUN dotnet msbuild /t:Pack /t:Publish /p:Configuration=Release /p:TargetFramework=net8.0 /p:PackageOutputPath="/app/packages" /maxcpucount:1 /p:version=3.0.0-beta
