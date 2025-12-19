FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=documents:localbuild /app/src/Documents.Clients.PCMSBridge/bin/Release/net8.0/publish/ /app
EXPOSE 5050
ENTRYPOINT ["dotnet", "Documents.Clients.PCMSBridge.dll"]
