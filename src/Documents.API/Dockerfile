FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=documents:localbuild /app/src/Documents.API/bin/Release/net8.0/publish/ /app
ENTRYPOINT ["dotnet", "Documents.API.dll"]
EXPOSE 5001