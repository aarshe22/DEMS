FROM mcr.microsoft.com/dotnet/aspnet:8.0.3-bionic AS runtime

RUN    apt-get -yqq update && \
       apt-get install -yq --no-install-recommends \
                default-jre ca-certificates && \
       cd && \
       apt-get autoremove -y && \
       apt-get clean -y && \
       rm -rf /var/lib/apt/lists

WORKDIR /app
COPY --from=documents:localbuild /app/src/Documents.Queues.Tasks.TextExtract/bin/Release/net8.0/publish/ /app
ENTRYPOINT ["dotnet", "Documents.Queues.Tasks.TextExtract.dll"]
