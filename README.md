[![NYPTI Logo](https://www.nypti.org/wp-content/uploads/2014/01/NYPTISeal-170.png)](https://www.nypti.org/)

# NYPTI's Digital Evidence Management System (DEMS)

DEMS is a comprehensive digital evidence file management system from the [New York Prosecutors Training Institute](https://www.nypti.org) designed for prosecutors to help them meet Discovery obligations and manage digital evidence effectively.

Read about DEMS and its features [here](https://books.nypti.org/bedu/dcty/index.html).

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Development](#development)
- [Building and Running](#building-and-running)
- [Docker Deployment](#docker-deployment)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Overview

DEMS is a robust, enterprise-grade digital evidence management system that provides:

- **Secure File Storage**: Multi-tenant file storage with encryption support
- **Advanced Search**: Full-text search powered by Elasticsearch
- **Document Processing**: Automated document conversion, OCR, and metadata extraction
- **Media Management**: Video/audio transcoding and playback capabilities
- **Audit Logging**: Comprehensive audit trails for compliance
- **Role-Based Access Control**: Fine-grained security and permissions
- **Queue-Based Processing**: Asynchronous task processing with RabbitMQ
- **RESTful API**: Complete API for integration and automation

## Architecture

DEMS follows a microservices architecture with the following components:

### Core Services

1. **Documents.API** - Main REST API service (Port 5001)
2. **Documents.Backends.Gateway** - File storage gateway (Port 5020)
3. **Documents.Clients.Manager** - Web management interface (Port 5000/4200)
4. **Documents.Clients.Admin** - Administrative interface
5. **Documents.Clients.Tools** - Command-line tools

### Queue Workers

- **Documents.Queues.Tasks.Index** - Indexes documents in Elasticsearch
- **Documents.Queues.Tasks.EventRouter** - Routes events to subscribers
- **Documents.Queues.Tasks.ImageGen** - Generates thumbnails and previews
- **Documents.Queues.Tasks.ToPDF** - Converts documents to PDF
- **Documents.Queues.Tasks.PDFOCR** - Performs OCR on PDF documents
- **Documents.Queues.Tasks.TextExtract** - Extracts text from documents
- **Documents.Queues.Tasks.Transcode.FFMPEG** - Transcodes video/audio files
- **Documents.Queues.Tasks.ExifTool** - Extracts EXIF metadata
- **Documents.Queues.Tasks.Archive** - Handles archiving operations
- **Documents.Queues.Tasks.Synchronize** - Synchronizes data between systems
- **Documents.Queues.Tasks.Notify** - Sends notifications
- **Documents.Queues.Tasks.LogReader** - Processes log files

### Infrastructure Services

- **SQL Server** - Primary database (Port 1433)
- **Elasticsearch** - Search engine (Port 9200)
- **RabbitMQ** - Message queue (Ports 5672, 15672)
- **Redis** - Caching (Port 6379)

## Technology Stack

### Backend
- **.NET 8.0** - Modern, cross-platform framework
- **ASP.NET Core 8.0** - Web framework
- **Entity Framework Core 8.0** - ORM
- **Serilog** - Structured logging
- **Elastic.Clients.Elasticsearch 8.11** - Search client
- **RabbitMQ.Client 6.8** - Message queue client

### Frontend
- **Angular 18** - Modern web framework
- **TypeScript 5.4** - Type-safe JavaScript
- **Bootstrap 5.3** - UI framework
- **RxJS 7.8** - Reactive programming

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **SQL Server 2022** - Database
- **Elasticsearch 8.11** - Search engine
- **RabbitMQ 3.13** - Message broker

## Prerequisites

### Required Software

#### Windows
- **Visual Studio 2022** (Community, Professional, or Enterprise) with:
  - .NET 8.0 SDK
  - ASP.NET and web development workload
  - SQL Server Data Tools (optional)
- **Docker Desktop for Windows** (version 4.0 or later)
- **Git** for Windows
- **Node.js 18.x or later** (for Angular development)
- **npm 9.x or later**

#### macOS/Linux
- **.NET 8.0 SDK** - [Download](https://dotnet.microsoft.com/download/dotnet/8.0)
- **Docker Desktop** (macOS) or **Docker Engine** (Linux)
- **Git**
- **Node.js 18.x or later**
- **npm 9.x or later**
- **Visual Studio Code** (recommended) or **JetBrains Rider**

### System Requirements

- **RAM**: Minimum 8GB, Recommended 16GB+
- **Disk Space**: 20GB+ free space
- **CPU**: Multi-core processor recommended
- **Network**: Internet connection for package downloads

### Docker Requirements

- Docker Desktop/Engine running
- At least 4GB RAM allocated to Docker
- Ports available: 1433, 5001, 5020, 5672, 15672, 6379, 9200, 5601

## Quick Start

For detailed step-by-step instructions, see [QUICK-START.md](QUICK-START.md).

### Quick Setup (Windows)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd DEMS
   ```

2. **Start Docker services**
   ```bash
   cd support\services
   up.cmd
   ```

3. **Set environment variable**
   ```cmd
   setx DOCUMENTS_CONFIG_PATH "C:\path\to\config.json"
   ```

4. **Open in Visual Studio**
   - Open `Documents.sln`
   - Restore NuGet packages
   - Set startup projects (see [QUICK-START.md](QUICK-START.md))

5. **Run the application**
   - Press F5 or click Start

### Quick Setup (macOS/Linux)

1. **Clone and navigate**
   ```bash
   git clone <repository-url>
   cd DEMS
   ```

2. **Start Docker services**
   ```bash
   cd support/services
   ./up.sh
   ```

3. **Set environment variable**
   ```bash
   export DOCUMENTS_CONFIG_PATH="$HOME/.dms/config.json"
   ```

4. **Restore and build**
   ```bash
   dotnet restore
   dotnet build
   ```

5. **Run services**
   ```bash
   cd src/Documents.API
   dotnet run
   ```

## Project Structure

```
DEMS/
├── src/                          # Source code
│   ├── Documents.API/            # Main REST API
│   ├── Documents.API.Common/     # Shared API models
│   ├── Documents.API.Client/      # API client library
│   ├── Documents.Backends.Gateway/  # File storage gateway
│   ├── Documents.Clients.Manager/   # Web management UI
│   │   └── UI/                   # Angular frontend
│   ├── Documents.Clients.Admin/     # Admin interface
│   ├── Documents.Clients.Tools/     # CLI tools
│   ├── Documents.Queues.*/       # Queue worker services
│   ├── Documents.Store/          # Data access layer
│   ├── Documents.Store.SqlServer/ # SQL Server implementation
│   ├── Documents.Search/          # Search abstraction
│   ├── Documents.Search.ElasticSearch/ # Elasticsearch implementation
│   └── Documents.Common/         # Shared utilities
├── support/                      # Support files
│   ├── services/                # Docker Compose services
│   ├── config/                  # Configuration templates
│   └── compose-full/            # Full stack compose file
├── Documents.sln               # Visual Studio solution
├── README.md                    # This file
├── QUICK-START.md              # Quick start guide
└── MODERNIZATION_SUMMARY.md    # Modernization details
```

## Configuration

### Configuration File

The application requires a `config.json` file. Set the `DOCUMENTS_CONFIG_PATH` environment variable to point to this file.

**Example configuration structure:**

```json
{
  "DocumentsAPI": {
    "ElasticSearchUri": "http://localhost:9200",
    "ElasticSearchIndex": "documents",
    "QueueURI": "amqp://guest:guest@localhost:5672",
    "ConnectionString": "Server=localhost;Database=Documents;User Id=sa;Password=YourPassword;TrustServerCertificate=True",
    "BackendGatewayURL": "http://localhost:5020/",
    "TokenValidationSecret": "YourSecretKeyHere",
    "TokenIssuer": "API",
    "TokenAudience": "API",
    "TokenExpirationSeconds": 90000
  },
  "DocumentsClientsManager": {
    "API": {
      "Uri": "http://localhost:5001/"
    },
    "IsBackdoorEnabled": true,
    "BackdoorOrganizationKey": "System",
    "BackdoorUserKey": "system",
    "BackdoorPassword": "DocumentsDefault"
  },
  "Serilog": {
    "MinimumLevel": {
      "Default": "Information",
      "Override": {
        "Documents": "Information"
      }
    },
    "WriteTo": [
      {
        "Name": "Console",
        "Args": {
          "outputTemplate": "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] {Message:lj}{NewLine}{Exception}"
        }
      }
    ]
  }
}
```

### Environment Variables

- `DOCUMENTS_CONFIG_PATH` - Path to the configuration JSON file (required)

### Database Setup

The database is automatically created on first run. Default credentials:
- **Organization**: `System`
- **User**: `system`
- **Password**: `DocumentsDefault`

**⚠️ Change default passwords in production!**

## Development

### Visual Studio Setup

1. **Open Solution**
   - Open `Documents.sln` in Visual Studio 2022
   - Wait for package restoration to complete

2. **Configure Startup Projects**
   - Right-click solution → Properties → Startup Project
   - Select "Multiple startup projects"
   - Set the following to "Start":
     - Documents.API
     - Documents.Backends.Gateway
     - Documents.Clients.Manager
     - Documents.Queues.Tasks.EventRouter
     - Documents.Queues.Tasks.Index

3. **Configure Project URLs**
   - Documents.API: `http://localhost:5001`
   - Documents.Backends.Gateway: `http://localhost:5020`
   - Documents.Clients.Manager: `http://localhost:5000`

4. **Build Configuration**
   - Use "Debug" or "Debug Local" configuration
   - Ensure all projects build successfully

### Angular Development

1. **Navigate to UI directory**
   ```bash
   cd src/Documents.Clients.Manager/UI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```
   The Angular app will be available at `http://localhost:4200`

4. **Build for production**
   ```bash
   npm run build-prod
   ```

### Command Line Tools

The `Documents.Clients.Tools` project provides a CLI tool for system administration.

**Windows Setup:**
Create `dms.cmd` in your PATH:
```cmd
@dotnet C:\path\to\DEMS\src\Documents.Clients.Tools\bin\Debug\net8.0\Documents.Clients.Tools.dll %*
```

**Usage:**
```bash
dms --help
dms organization list
dms user create --email user@example.com --password password System/user1
```

## Building and Running

### Build from Command Line

```bash
# Restore packages
dotnet restore

# Build solution
dotnet build Documents.sln --configuration Release

# Build specific project
dotnet build src/Documents.API/Documents.API.csproj
```

### Run Individual Services

```bash
# API
cd src/Documents.API
dotnet run

# Backend Gateway
cd src/Documents.Backends.Gateway
dotnet run

# Manager (requires Angular build)
cd src/Documents.Clients.Manager
dotnet run
```

### Run Queue Workers

```bash
# Index worker
cd src/Documents.Queues.Tasks.Index
dotnet run

# Event Router
cd src/Documents.Queues.Tasks.EventRouter
dotnet run
```

## Docker Deployment

### Using Docker Compose

1. **Full stack deployment**
   ```bash
   cd support/compose-full
   docker-compose up -d
   ```

2. **Individual services**
   ```bash
   cd support/services
   docker-compose -f rabbit/docker-compose.yml up -d
   docker-compose -f mssql/docker-compose.yml up -d
   docker-compose -f elk/docker-compose.yml up -d
   ```

### Building Docker Images

```bash
# Build all images
docker build -t documents.api:latest -f src/Documents.API/Dockerfile .
docker build -t documents.backends.gateway:latest -f src/Documents.Backends.Gateway/Dockerfile .
# ... etc
```

### Service Ports

| Service | Port | Description |
|---------|------|-------------|
| Documents.API | 5001 | Main API |
| Documents.Backends.Gateway | 5020 | File gateway |
| Documents.Clients.Manager | 5000 | Web UI |
| SQL Server | 1433 | Database |
| RabbitMQ | 5672 | AMQP |
| RabbitMQ Management | 15672 | Web UI (guest/guest) |
| Elasticsearch | 9200 | Search API |
| Kibana | 5601 | Log viewer |
| Redis | 6379 | Cache |

## API Documentation

### Swagger/OpenAPI

When running Documents.API, Swagger documentation is available at:
- `http://localhost:5001/swagger`

### Health Check Endpoints

- API: `http://localhost:5001/api/v1/health`
- Gateway: `http://localhost:5020/healthcheck`

### Authentication

The API uses JWT Bearer tokens. Obtain a token by:
1. Using the backdoor endpoint (development only)
2. Authenticating via `/api/v1/auth/login`
3. Using the CLI tools: `dms context set`

## Troubleshooting

### Common Issues

**1. Port Already in Use**
- Check if services are already running
- Change port numbers in `launchSettings.json` or `hosting.json`

**2. Database Connection Failed**
- Ensure SQL Server container is running: `docker ps`
- Check connection string in config.json
- Verify SQL Server is accessible: `telnet localhost 1433`

**3. Elasticsearch Connection Failed**
- Check Elasticsearch is running: `curl http://localhost:9200`
- Verify Elasticsearch version compatibility (8.11.0)
- Check security settings in docker-compose.yml

**4. RabbitMQ Connection Failed**
- Verify RabbitMQ is running: `docker ps | grep rabbitmq`
- Check credentials in config.json
- Access management UI: `http://localhost:15672` (guest/guest)

**5. Angular Build Errors**
- Clear node_modules: `rm -rf node_modules package-lock.json`
- Reinstall: `npm install`
- Check Node.js version: `node --version` (should be 18+)

**6. .NET Build Errors**
- Restore packages: `dotnet restore`
- Clean solution: `dotnet clean`
- Rebuild: `dotnet build --no-incremental`

**7. Configuration Not Found**
- Verify `DOCUMENTS_CONFIG_PATH` environment variable is set
- Check file path is correct
- Ensure config.json has valid JSON syntax

### Logs

- Application logs: Check console output or configured Serilog sinks
- Docker logs: `docker logs <container-name>`
- Elasticsearch logs: Available in Kibana at `http://localhost:5601`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Test thoroughly
5. Commit: `git commit -am 'Add feature'`
6. Push: `git push origin feature/your-feature`
7. Create a Pull Request

## License

This project is provided by the New York Prosecutors Training Institute (NYPTI).

## Support

For issues, questions, or contributions:
- Review [QUICK-START.md](QUICK-START.md) for setup help
- Check [MODERNIZATION_SUMMARY.md](MODERNIZATION_SUMMARY.md) for upgrade information
- Visit [NYPTI Website](https://www.nypti.org)

## Additional Resources

- [.NET 8 Documentation](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-8)
- [Angular Documentation](https://angular.io/docs)
- [Elasticsearch .NET Client](https://www.elastic.co/guide/en/elasticsearch/client/net-api/current/index.html)
- [RabbitMQ Documentation](https://www.rabbitmq.com/documentation.html)
