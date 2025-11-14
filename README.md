# Welfare Data Backend

A Node.js/TypeScript backend application for managing processograms (workflow diagrams) with AI-powered features, image processing, and comprehensive CRUD operations.

## 🏗️ Architecture & Design Patterns

This project follows a **Clean Architecture** approach with clear separation of concerns:

### **Layered Architecture**

```
┌─────────────────────────────────────┐
│         Routes & Controllers        │  ← HTTP Layer
├─────────────────────────────────────┤
│           Use Cases                 │  ← Business Logic Layer
├─────────────────────────────────────┤
│      Services & Repositories        │  ← Data Access Layer
├─────────────────────────────────────┤
│         Models (Mongoose)           │  ← Database Layer
└─────────────────────────────────────┘
```

### **Key Design Patterns**

#### 1. **Use Case Pattern (Clean Architecture)**

Each business operation is encapsulated in a dedicated use case class:

- `AiChatUseCase` - AI chat interactions
- `CreateProcessogramUseCase` - Processogram creation
- `UpdateProcessogramDataUseCase` - Data updates
- Located in: `src/useCases/*/`

#### 2. **Repository Pattern** ⚠️ _Deprecated_

> **Note:** This pattern is deprecated and will be removed in future versions based on architectural decisions.

Generic CRUD operations abstracted through reusable functions:

- `CREATE`, `READ`, `UPDATE`, `DELETE` in `src/useCases/CRUD/`
- Mongoose implementations in `src/implementations/mongoose/`

#### 3. **Service Layer Pattern**

External integrations and complex business logic:

- `OpenAiChatStream` - OpenAI integration
- `GoogleImageSearch` - Google Cloud Vision
- `ProcessogramService` - SVG processing and image manipulation
- Located in: `src/services/`

#### 4. **Middleware Pattern**

Cross-cutting concerns:

- `AuthProtected` - JWT authentication
- `OnlyGuest` - Guest-only routes
- `superUser` - Authorization checks
- Located in: `src/middlewares/`

#### 5. **MVC Pattern** ⚠️ _Deprecated_

> **Note:** This pattern is deprecated and will be removed in future versions based on architectural decisions.

Traditional MVC for HTTP handling:

- **Models**: Mongoose schemas (`src/models/`)
- **Views**: JSON responses
- **Controllers**: Route handlers (`src/controllers/`)

#### 6. **Strategy Pattern**

Storage abstraction layer:

- Google Cloud Storage implementation
- Disk storage fallback
- Located in: `src/storage/`

## 📁 Project Structure

```
bin/
├── server.ts                    # Application entry point
└── config/                      # Server configuration
    ├── database.ts              # MongoDB connection
    ├── express-customizer.ts    # Express app setup
    └── middlewares.ts           # Global middleware setup

src/
├── routes/                      # Route definitions
│   ├── admin/                   # Admin-only routes
│   └── public/                  # Public API routes
│
├── controllers/                 # HTTP request handlers ⚠️ _Deprecated_
│   ├── AuthController.ts
│   └── UserController.ts
│
├── useCases/                    # Business logic (Use Cases)
│   ├── CRUD/                    # Generic CRUD operations ⚠️ _Deprecated_
│   ├── AiChatUseCase/
│   ├── ProcessogramUseCase/
│   ├── ProductionModuleUseCase/
│   └── ...
│
├── services/                    # External services & complex logic
│   ├── OpenAiChatSteam.ts
│   ├── GoogleImageSearch.ts
│   └── ProcessogramService.ts
│
├── models/                      # Mongoose models
│   ├── User.ts
│   ├── Processogram.ts
│   └── ...
│
├── middlewares/                 # Express middlewares
│   ├── logged.ts                # Authentication
│   └── super-user.ts            # Authorization
│
├── implementations/             # Data access implementations
│   └── mongoose/
│
├── storage/                     # File storage abstraction
│   ├── google-storage.ts
│   └── storage.ts
│
├── api/                         # External API clients
│   └── gitlab.ts
│
└── utils/                       # Utility functions
    ├── mongoose-utils.ts
    └── validate.ts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 14+
- MongoDB
- Google Cloud Storage account (optional)
- OpenAI API key (for AI features)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd wm-platform-new
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables**

   Create a `.env` file from `.env.example`:

   ```bash
   cp .env.example .env
   ```

   Required variables:

   ```env
   MONGO_CONNECTION_URL=mongodb://localhost:27017/WMplatform
   SECRET=your-jwt-secret
   PORT=8080
   NODE_ENV=dev
   CLIENT_DOMAIN=http://localhost:3000

   # Optional: Google Cloud Storage
   GOOGLE_CLOUD_PROJECT_ID=your-project-id
   GOOGLE_CLOUD_BUCKET_NAME=your-bucket-name

   # Optional: GitLab integration
   GITLAB_PERSONAL_TOKEN=your-token
   GITLAB_PROJECT_ID=your-project-id
   ```

4. **Start the server**
   ```bash
   npm start
   # or
   yarn start
   ```

The server will run on the port specified in `.env` or default to **8080**.

## 🔑 Core Features

- **User Authentication & Authorization** - JWT-based auth with role-based access
- **Processogram Management** - Create, update, and manage workflow diagrams
- **SVG Processing** - Advanced SVG manipulation and optimization
- **AI Integration** - OpenAI-powered chat and content generation
- **Image Search** - Google Cloud Vision integration
- **File Storage** - Google Cloud Storage
- **GitLab Integration** - Issue tracking integration ⚠️ _Deprecated_

## 🛣️ API Routes

### Public Routes (`/public`)

- Processogram retrieval
- Species information
- Production modules
- Image search

### Admin Routes (`/admin`)

- User management
- Processogram CRUD
- Production module management
- Registration codes

### Root Routes (`/`)

- Authentication (login/logout)
- User profile

## 🧪 Development

```bash
# Development mode with auto-reload
npm run dev

# Build TypeScript
npm run build
```
