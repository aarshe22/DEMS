# DEMS Quick Start Guide

This guide provides step-by-step instructions to get the Digital Evidence Management System (DEMS) up and running on your development machine.

## Table of Contents

- [Prerequisites Check](#prerequisites-check)
- [Windows Setup (Visual Studio)](#windows-setup-visual-studio)
- [macOS/Linux Setup](#macoslinux-setup)
- [Initial Configuration](#initial-configuration)
- [Starting Services](#starting-services)
- [Running the Application](#running-the-application)
- [Verifying Installation](#verifying-installation)
- [Next Steps](#next-steps)

---

## Prerequisites Check

Before starting, ensure you have the following installed:

### Required Software

- ✅ **.NET 8.0 SDK** - [Download](https://dotnet.microsoft.com/download/dotnet/8.0)
  - Verify: `dotnet --version` (should show 8.0.x)
  
- ✅ **Docker Desktop** (Windows/macOS) or **Docker Engine** (Linux)
  - Verify: `docker --version`
  - Verify Docker is running: `docker ps`

- ✅ **Node.js 18.x or later** - [Download](https://nodejs.org/)
  - Verify: `node --version` (should show v18.x or higher)
  - Verify: `npm --version` (should show 9.x or higher)

### Windows Only

- ✅ **Visual Studio 2022** (Community, Professional, or Enterprise)
  - With ".NET desktop development" workload
  - With "ASP.NET and web development" workload
  - Verify: Open Visual Studio → Help → About Microsoft Visual Studio

### Optional but Recommended

- ✅ **Git** - [Download](https://git-scm.com/downloads)
- ✅ **Postman** or similar API testing tool
- ✅ **Visual Studio Code** (for Angular development)

---

## Windows Setup (Visual Studio)

### Step 1: Clone the Repository

```cmd
git clone <repository-url>
cd DEMS
```

Or download and extract the ZIP file to your desired location.

### Step 2: Start Docker Services

1. **Open PowerShell or Command Prompt as Administrator**

2. **Navigate to services directory**
   ```cmd
   cd support\services
   ```

3. **Start all services**
   ```cmd
   up.cmd
   ```
   
   Or manually:
   ```cmd
   docker-compose -f rabbit\docker-compose.yml up -d
   docker-compose -f mssql\docker-compose.yml up -d
   docker-compose -f elk\docker-compose.yml up -d
   docker-compose -f redis\docker-compose.yml up -d
   ```

4. **Verify services are running**
   ```cmd
   docker ps
   ```
   
   You should see containers for:
   - rabbitmq
   - mssql-server-linux (or mssql)
   - elasticsearch
   - redis

5. **Wait for services to be ready** (30-60 seconds)
   - SQL Server: Check logs with `docker logs <mssql-container-name>`
   - Elasticsearch: Visit `http://localhost:9200` in browser
   - RabbitMQ: Visit `http://localhost:15672` (guest/guest)

### Step 3: Create Configuration File

1. **Create a configuration directory** (if it doesn't exist)
   ```cmd
   mkdir C:\dms\config
   ```

2. **Create `config.json`** in that directory with the following content:

   ```json
   {
     "DocumentsAPI": {
       "ElasticSearchUri": "http://localhost:9200",
       "ElasticSearchIndex": "documents",
       "QueueURI": "amqp://guest:guest@localhost:5672",
       "ConnectionString": "Server=localhost,1433;Database=Documents;User Id=sa;Password=wwFRtn9aCa3kAv9J;TrustServerCertificate=True",
       "BackendGatewayURL": "http://localhost:5020/",
       "TokenValidationSecret": "SooperSecre1231234t!",
       "TokenIssuer": "API",
       "TokenAudience": "API",
       "TokenExpirationSeconds": 90000
     },
     "DocumentsQueuesTasksIndex": {
       "API": {
         "Uri": "http://localhost:5001/",
         "OrganizationKey": "System",
         "UserKey": "system",
         "Password": "DocumentsDefault"
       },
       "ElasticSearchUri": "http://localhost:9200",
       "StartupDelay": 4000
     },
     "DocumentsQueuesTasksEventRouter": {
       "API": {
         "Uri": "http://localhost:5001/",
         "OrganizationKey": "System",
         "UserKey": "system",
         "Password": "DocumentsDefault"
       }
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

   **⚠️ Security Note:** Change the passwords and secrets in production!

3. **Set environment variable**
   
   **Option A: System-wide (Permanent)**
   ```cmd
   setx DOCUMENTS_CONFIG_PATH "C:\dms\config\config.json"
   ```
   Close and reopen your terminal/Visual Studio for the change to take effect.

   **Option B: Current Session (Temporary)**
   ```cmd
   set DOCUMENTS_CONFIG_PATH=C:\dms\config\config.json
   ```

### Step 4: Open Solution in Visual Studio

1. **Launch Visual Studio 2022**

2. **Open Solution**
   - File → Open → Project/Solution
   - Navigate to the DEMS folder
   - Select `Documents.sln`
   - Click Open

3. **Wait for Package Restoration**
   - Visual Studio will automatically restore NuGet packages
   - This may take 2-5 minutes on first load
   - Check the status bar for "Restoring packages..." progress

4. **Verify Projects Load**
   - Solution Explorer should show all projects
   - No red error indicators on projects

### Step 5: Configure Startup Projects

1. **Right-click on the Solution** in Solution Explorer
   - Select "Properties" (or "Set Startup Projects...")

2. **Select "Multiple startup projects"**

3. **Set the following projects to "Start":**
   - ✅ Documents.API
   - ✅ Documents.Backends.Gateway
   - ✅ Documents.Clients.Manager
   - ✅ Documents.Queues.Tasks.EventRouter
   - ✅ Documents.Queues.Tasks.Index

4. **Set all others to "None"**

5. **Click OK**

### Step 6: Configure Project URLs (Optional)

1. **Right-click Documents.API** → Properties
   - Go to "Debug" → "General"
   - Set "Launch URL" to: `http://localhost:5001`
   - Or edit `launchSettings.json` in the project

2. **Repeat for other projects:**
   - Documents.Backends.Gateway: `http://localhost:5020`
   - Documents.Clients.Manager: `http://localhost:5000`

### Step 7: Build the Solution

1. **Select Build Configuration**
   - Use "Debug" or "Debug Local" from the dropdown

2. **Build Solution**
   - Build → Build Solution (or press `Ctrl+Shift+B`)
   - Wait for build to complete
   - Check Output window for errors

3. **Fix any build errors:**
   - Missing packages: Right-click solution → Restore NuGet Packages
   - Compilation errors: Review error messages and fix code issues

### Step 8: Install Angular Dependencies

1. **Open a new terminal** (PowerShell or Command Prompt)

2. **Navigate to UI directory**
   ```cmd
   cd src\Documents.Clients.Manager\UI
   ```

3. **Install npm packages**
   ```cmd
   npm install
   ```
   This may take 5-10 minutes on first run.

4. **Verify installation**
   ```cmd
   npm list --depth=0
   ```

### Step 9: Run the Application

1. **In Visual Studio, press F5** (or click the green "Start" button)

2. **Visual Studio will start multiple projects:**
   - Documents.API
   - Documents.Backends.Gateway
   - Documents.Clients.Manager
   - Documents.Queues.Tasks.EventRouter
   - Documents.Queues.Tasks.Index

3. **Wait for services to start** (30-60 seconds)

4. **Check Output windows** for each project to verify they started successfully

5. **Open browser and navigate to:**
   - API Swagger: `http://localhost:5001/swagger`
   - Manager UI: `http://localhost:5000` or `http://localhost:4200`
   - Gateway Health: `http://localhost:5020/healthcheck`

### Step 10: Start Angular Development Server (If Needed)

If the Manager UI doesn't load, you may need to start Angular separately:

1. **Open a new terminal**

2. **Navigate to UI directory**
   ```cmd
   cd src\Documents.Clients.Manager\UI
   ```

3. **Start Angular dev server**
   ```cmd
   npm start
   ```

4. **Wait for compilation** and navigate to `http://localhost:4200`

---

## macOS/Linux Setup

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd DEMS
```

### Step 2: Start Docker Services

1. **Navigate to services directory**
   ```bash
   cd support/services
   ```

2. **Start all services**
   ```bash
   ./up.sh
   ```
   
   Or manually:
   ```bash
   docker-compose -f rabbit/docker-compose.yml up -d
   docker-compose -f mssql/docker-compose.yml up -d
   docker-compose -f elk/docker-compose.yml up -d
   docker-compose -f redis/docker-compose.yml up -d
   ```

3. **Verify services**
   ```bash
   docker ps
   ```

### Step 3: Create Configuration File

1. **Create config directory**
   ```bash
   mkdir -p ~/.dms
   ```

2. **Create `config.json`**
   ```bash
   nano ~/.dms/config.json
   ```
   
   Paste the same configuration as in the Windows section above.

3. **Set environment variable**
   ```bash
   export DOCUMENTS_CONFIG_PATH="$HOME/.dms/config.json"
   ```
   
   To make it permanent, add to `~/.bashrc` or `~/.zshrc`:
   ```bash
   echo 'export DOCUMENTS_CONFIG_PATH="$HOME/.dms/config.json"' >> ~/.bashrc
   source ~/.bashrc
   ```

### Step 4: Restore and Build

1. **Restore NuGet packages**
   ```bash
   dotnet restore Documents.sln
   ```

2. **Build solution**
   ```bash
   dotnet build Documents.sln --configuration Debug
   ```

### Step 5: Install Angular Dependencies

```bash
cd src/Documents.Clients.Manager/UI
npm install
```

### Step 6: Run Services

**Terminal 1 - API:**
```bash
cd src/Documents.API
dotnet run
```

**Terminal 2 - Gateway:**
```bash
cd src/Documents.Backends.Gateway
dotnet run
```

**Terminal 3 - Manager:**
```bash
cd src/Documents.Clients.Manager
dotnet run
```

**Terminal 4 - Index Worker:**
```bash
cd src/Documents.Queues.Tasks.Index
dotnet run
```

**Terminal 5 - Event Router:**
```bash
cd src/Documents.Queues.Tasks.EventRouter
dotnet run
```

**Terminal 6 - Angular (if needed):**
```bash
cd src/Documents.Clients.Manager/UI
npm start
```

---

## Initial Configuration

### First-Time Database Setup

The database is automatically created on first API startup. Default credentials:

- **Organization Key**: `System`
- **User Key**: `system`
- **Password**: `DocumentsDefault`

### Create Your First Organization

Using the CLI tools:

```bash
# Build the tools project first
cd src/Documents.Clients.Tools
dotnet build

# Create organization
dotnet run -- organization provision basic --name "MyOrg" --organizationKey "MyOrg" --basepath "/path/to/store"
```

Or using the API directly (see API documentation).

---

## Verifying Installation

### 1. Check API Health

```bash
curl http://localhost:5001/api/v1/health
```

Should return a JSON response with status information.

### 2. Check Gateway Health

```bash
curl http://localhost:5020/healthcheck
```

### 3. Check Elasticsearch

```bash
curl http://localhost:9200
```

Should return Elasticsearch cluster information.

### 4. Check RabbitMQ

Open browser: `http://localhost:15672`
- Username: `guest`
- Password: `guest`

### 5. Access Swagger UI

Open browser: `http://localhost:5001/swagger`

You should see the API documentation.

### 6. Access Manager UI

Open browser: `http://localhost:5000` or `http://localhost:4200`

You should see the login page or be automatically logged in (if backdoor is enabled).

---

## Next Steps

### 1. Explore the API

- Visit Swagger UI: `http://localhost:5001/swagger`
- Try the health endpoint
- Explore available endpoints

### 2. Create Test Data

- Create an organization
- Create users
- Upload test files
- Search for documents

### 3. Review Documentation

- Read [README.md](README.md) for detailed information
- Check [MODERNIZATION_SUMMARY.md](MODERNIZATION_SUMMARY.md) for upgrade notes
- Review API documentation in Swagger

### 4. Configure for Production

- Change default passwords
- Update security settings
- Configure proper logging
- Set up SSL/TLS certificates
- Review security best practices

### 5. Set Up CLI Tools

**Windows:**
Create `dms.cmd` in a directory in your PATH:
```cmd
@dotnet C:\path\to\DEMS\src\Documents.Clients.Tools\bin\Debug\net8.0\Documents.Clients.Tools.dll %*
```

**macOS/Linux:**
Create `dms` script:
```bash
#!/bin/bash
dotnet /path/to/DEMS/src/Documents.Clients.Tools/bin/Debug/net8.0/Documents.Clients.Tools.dll "$@"
```

Make it executable:
```bash
chmod +x dms
```

Then use:
```bash
dms --help
dms organization list
```

---

## Troubleshooting

### Services Won't Start

1. **Check Docker is running**
   ```bash
   docker ps
   ```

2. **Check ports are available**
   - Windows: `netstat -an | findstr "5001 5020 1433"`
   - macOS/Linux: `lsof -i :5001`

3. **Check configuration file path**
   - Verify `DOCUMENTS_CONFIG_PATH` is set correctly
   - Verify the file exists and is valid JSON

### Build Errors

1. **Restore packages**
   ```bash
   dotnet restore
   ```

2. **Clean and rebuild**
   ```bash
   dotnet clean
   dotnet build
   ```

3. **Check .NET version**
   ```bash
   dotnet --version
   ```
   Should be 8.0.x

### Angular Errors

1. **Clear and reinstall**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Check Node version**
   ```bash
   node --version
   ```
   Should be 18.x or higher

### Database Connection Issues

1. **Verify SQL Server is running**
   ```bash
   docker ps | grep mssql
   ```

2. **Check connection string** in config.json

3. **Test connection**
   ```bash
   docker exec -it <mssql-container> /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P YourPassword
   ```

---

## Getting Help

- Review error messages in Visual Studio Output window
- Check Docker logs: `docker logs <container-name>`
- Review application logs in console output
- Check [README.md](README.md) for more information
- Review [MODERNIZATION_SUMMARY.md](MODERNIZATION_SUMMARY.md) for known issues

---

**Congratulations!** You should now have DEMS running on your development machine. 🎉

