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
```
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
```
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

# API DOCUMENTATION 

## API POST /api/user  
Create a new user (ADMIN or CONVENOR). Used internally by admin workflows.
> ⚠️ This route **only creates users**. Convenor assignment to a society is handled by `/api/user/add`.

---

### 📥 Expected Request Format
<details>
<summary>Click to expand</summary>

#### Create ADMIN
```json
{
  "name": "Admin User",
  "rollno": "ADMIN01",
  "password": "admin@123",
  "role": "ADMIN",
  "imgurl": "https://example.com/admin.png"

}
```
or 
#### Create Convenor (optional Not needed can be done by admin)

````json
{
  "name": "Harshit",
  "rollno": "123103100",
  "password": "secret123",
  "role": "CONVENOR",
  "societyName": "society1",
  "imgurl": "https://example.com/harshit.png"

}
````
</details>


### 📥 Expected Response  Format
<details>
<summary>Click to expand</summary>

```json
{
    "message": "User created successfully",
    "user": {
        "id": "695b70f18d6e36dd4801401e",
        "name": "AdminUser",
        "rollno": "123103105",
        "imgurl": "adminImageURL",
        "role": "ADMIN"
    }
}
```
</details>

## API POST /api/auth/login  
Authenticate a user and issue a **JWT token** for protected routes.

---

### 📥 Expected Request Format
<details>
<summary>Click to expand</summary>

```json
{
  "rollno": "123103100",
  "password": "secret123"
}
```
</details>

### 📥 Expected Response  Format
<details>
<summary>Click to expand</summary>

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65fa123abc",
    "name": "Harshit",
    "rollno": "123103100",
    "imgurl": "https://example.com/harshit.png",
    "role": "CONVENOR",
    "societyName": "society1"
  }
}
```
</details>

## API POST /api/user/add  
Create or rotate a **Convenor** for a society.  
> 🔒 **Admin-only route**  
> - Creates user if not exists  
> - Assigns as current convenor  
> - Rotates previous convenor & co-convenors into history  

---

### 📥 Expected Request Format
<details>
<summary>Click to expand</summary>

```json
{
  "name": "Harshit",
  "rollno": "123103100",
  "password": "secret123",
  "imgurl": "https://example.com/harshit.png",
  "societyName": "society1",
  "tech": 2025,
  "coConvenors": [
    {
      "name": "Aman",
      "imgurl": "https://example.com/aman.png"
    }
  ]
}
```

Note: password is required only if user does not already exist
coConvenors is optional
</details>

### 📤 Expected Response Format
<details> 
<summary>Click to expand</summary>
Society Created + Convenor Assigned (201)

```json
{
  "message": "Society created and convenor assigned",
  "society": "society1",
  "convenor": {
    "name": "Harshit",
    "imgurl": "https://example.com/harshit.png"
  },
  "tech": 2025
}
```
</details>

## API POST /api/convenors/co-convenors/all  
Replace **all current co-convenors** of a society in one operation.  
> 🔒 **Accessible by ADMIN or current CONVENOR of the society**  
> - Clears existing co-convenors  
> - Moves them to history  
> - Sets a fresh list for the given tech year  

---

### 📥 Expected Request Format
<details>
<summary>Click to expand</summary>

```json
{
  "societyName": "society1",
  "tech": 2025,
  "coConvenors": [
    {
      "name": "Aman",
      "imgurl": "https://example.com/aman.png"
    },
    {
      "name": "Riya",
      "imgurl": "https://example.com/riya.png"
    }
  ]
}
```

- **Notes**
  - Co-Convenors Must be provided as a complete replacement list
  - Existing co-convenors are automatically moved to history
</details>

### 📤 Expected Response Format
<details> <summary>Click to expand</summary>

```json
{
    "message": "Co-convenors updated successfully",
    "society": "society1",
    "tech": 2026,
    "coConvenors": [
        {
            "name": "Shobita",
            "imgurl": "https://example.com/aman.png",
            "tech": 2026,
            "_id": "695b7bdb03cc75ae179842c9"
        },
        {
            "name": "Yash",
            "imgurl": "https://example.com/riya.png",
            "tech": 2026,
            "_id": "695b7bdb03cc75ae179842ca"
        }
    ]
}
```
</details>

## API POST /api/convenors/co-convenors  
Add **one co-convenor** to a society.  

> 🔒 Accessible by **ADMIN** or **current CONVENOR** of the society  
> - Appends a single co-convenor  
> - Does NOT affect existing co-convenors  
> - Does NOT modify history  

---

### 📥 Expected Request Format
<details>
<summary>Click to expand</summary>

```json
{
  "societyName": "society1",
  "coConvenor": {
    "name": "Harsh",
    "imgurl": "https://example.com/harsh.png"
  }
}
```
</details>

### 📥 Expected Response  Format
<details>
<summary>Click to expand</summary>

```json
{
  "societyName": "society1",
  "coConvenor": {
    "name": "Harsh",
    "imgurl": "https://example.com/harsh.png"
  }
}
```
</details>

