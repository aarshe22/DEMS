FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
RUN apt-get update && apt-get install -y libimage-exiftool-perl
WORKDIR /app
COPY --from=documents:localbuild /app/src/Documents.Queues.Tasks.ExifTool/bin/Release/net8.0/publish/ /app
ENTRYPOINT ["dotnet", "Documents.Queues.Tasks.ExifTool.dll"]