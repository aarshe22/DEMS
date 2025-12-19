FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=documents:localbuild /app/src/Documents.Clients.Tools/bin/Release/net8.0/publish/ /app

RUN chmod +x /app/dms.sh
RUN ln -s /app/dms.sh /bin/dms
CMD exec /bin/bash -c "trap : TERM INT; sleep infinity & wait"
