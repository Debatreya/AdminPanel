## Getting Started

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Project Structure
├── app/                    # Next.js App Router
│   ├── (auth)/            # Route groups for auth pages
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/       # Route groups for dashboard
│   │   ├── societies/
│   │   ├── events/
│   │   └── sponsors/
│   ├── api/               # API routes
│   │   ├── societies/
│   │   ├── events/
│   │   └── auth/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/            # Reusable UI components
│   ├── ui/               # Basic UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── modal.tsx
│   │   └── index.ts
│   ├── forms/            # Form components
│   │   ├── society-form.tsx
│   │   └── event-form.tsx
│   ├── tables/           # Table components
│   │   ├── societies-table.tsx
│   │   └── events-table.tsx
│   ├── layout/           # Layout components
│   │   ├── header.tsx
│   │   ├── sidebar.tsx
│   │   └── footer.tsx
│   └── charts/           # Chart/visualization components
│
├── lib/                  # Utilities and configurations
│   ├── models/          # Database models (your existing)
│   ├── db.ts            # Database connection
│   ├── auth.ts          # Authentication logic
│   ├── utils.ts         # Utility functions
│   └── validations.ts   # Form validations (Zod schemas)
│
├── constants/           # Constants and enums (your existing)
│   ├── enums.ts
│   └── index.ts
│
├── types/               # TypeScript type definitions
│   ├── auth.ts
│   ├── api.ts
│   └── index.ts
│
├── hooks/               # Custom React hooks
│   ├── use-auth.ts
│   ├── use-api.ts
│   └── use-local-storage.ts
│
├── context/             # React Context providers
│   ├── auth-context.tsx
│   └── theme-context.tsx
│
├── styles/              # Additional styles
│   ├── components.css
│   └── utilities.css
│
├── public/              # Static assets
│   ├── images/
│   ├── icons/
│   └── favicon.ico
│
├── config/              # Configuration files
│   ├── database.ts
│   ├── env.ts
│   └── constants.ts
│
└── middleware.ts        # Next.js middleware

### Key Organizational Principles:
1. App Directory (app)
- Route Groups: Use (auth), (dashboard) for organizing routes without affecting URL structure
- API Routes: Keep all API endpoints in api
- Page Components: Only page-specific components here
2. Components Directory (components/)
- UI Components: Basic, reusable UI elements
- Feature Components: Domain-specific components (forms, tables)
- Layout Components: Header, sidebar, navigation
3. Lib Directory (lib/)
- Models: Your database schemas
- Utilities: Helper functions, database connections
- Business Logic: Core application logic
4. Separation of Concerns
- Types: Centralized TypeScript definitions
- Hooks: Custom React hooks for state management
- Context: Global state management
- Config: Environment and configuration management

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


Got it 👍 — short, clean, **developer-first**, with **optional details hidden behind toggles**.

Below is the **Markdown code** you can paste directly into `README.md`.

---

## 📘 GET /api/convenor

Fetch society details along with their **convenor** and **co-convenors**.

---

### 🔗 Endpoint
```http
GET /api/convenor
````

---

### 🔁 Usage

#### 🔹 Get all societies

```http
GET /api/convenor
```

#### 🔹 Get a specific society

```http
GET /api/convenor?societyName=CSI
```

---

### 📥 Query Parameters

| Name          | Type | Required | Description               |
| ------------- | ---- | -------- | ------------------------- |
| `societyName` | ENUM | No       | Society name (fixed enum) |

---

### 📤 Success Response (200)

```json
{
  "id": "65f1...",
  "name": "society1",
  "logo": "...",
  "convenor": { "name": "user1", "year": "FINAL" },
  "coConvenors": []
}
```

