# Reptile House - GitHub Copilot Instructions

## Project Overview

**Reptile House** is a full-stack e-commerce platform specializing in reptiles and reptile supplies, with an Arabic-language user interface. The platform provides:

- Product catalog for reptiles (snakes, lizards, turtles) and supplies
- Comprehensive admin dashboard with 27+ management pages
- User features: shopping cart, wishlist, order tracking, payment verification
- Educational blog/articles about reptile care
- Role-based access control (admin, manager, editor, user)

**Target Users**: Arabic-speaking reptile enthusiasts and pet owners

## Tech Stack

### Frontend
- **React 19.2** with **TypeScript 5.8**
- **Vite 6.2** (build tool and dev server)
- **Tailwind CSS 4.x** for styling
- **Context API** for state management (no Redux/Zustand)
- Custom client-side routing (no React Router)

### Backend
- **Node.js** with **Express 4.21**
- **MySQL 3.11** (mysql2 driver)
- **ES Modules** only (type: "module" in package.json)

### Security & Middleware
- **Helmet.js** for HTTP security headers
- **express-rate-limit** for API protection
- **CORS** with strict origin validation
- **compression** for response optimization

### Deployment Support
- Vercel (frontend) + Render (backend)
- Hostinger VPS
- Monolithic deployment (Express serves static frontend)

## Architecture & Directory Structure

```
/
├── Frontend (React SPA)
│   ├── App.tsx                 # Main application router and layout
│   ├── components/             # 21 reusable UI components
│   ├── pages/                  # 26 feature pages (lazy-loaded)
│   │   └── admin/              # 27 admin dashboard pages
│   ├── contexts/               # 5 global state providers
│   │   ├── AuthContext.tsx     # Authentication & user state
│   │   ├── CartContext.tsx     # Shopping cart management
│   │   ├── WishlistContext.tsx # User wishlist
│   │   ├── PreferencesContext.tsx # User preferences
│   │   └── DatabaseContext.tsx # API data management
│   ├── hooks/                  # 6 custom React hooks
│   ├── services/               # API client and media utilities
│   │   ├── api.ts              # Centralized API service
│   │   └── media.ts            # Media handling utilities
│   ├── types.ts                # Shared TypeScript interfaces
│   └── constants.ts            # Application constants
│
├── Backend (Express API)
│   └── server/
│       ├── index.js            # Express server setup
│       ├── routes/             # API endpoint definitions
│       ├── controllers/        # 19 business logic controllers
│       ├── models/             # 18 database models/operations
│       ├── database/
│       │   ├── schema.sql      # MySQL schema definition
│       │   ├── seed.js         # Initial data seeder
│       │   └── runSchema.js    # Schema setup script
│       ├── auth.js             # Authentication logic
│       └── config/             # Server configuration
│
└── Configuration
    ├── vite.config.ts          # Vite build configuration
    ├── tsconfig.json           # TypeScript configuration
    ├── tailwind.config.cjs     # Tailwind CSS configuration
    └── package.json            # Monorepo scripts
```

## Coding Standards & Conventions

### TypeScript
- **Strict typing**: Always define interfaces for data structures
- **No any types**: Use proper type definitions or unknown
- **Path aliases**: Use `@/*` for absolute imports from root
- **File naming**: PascalCase for components (e.g., `ReptileCard.tsx`)

### React
- **Functional components** only (no class components)
- **Hooks pattern**: Use custom hooks for shared logic
- **Context API**: Use existing contexts; don't add new state libraries
- **Lazy loading**: Use `React.lazy()` and `Suspense` for route-level code splitting
- **Props interfaces**: Define TypeScript interfaces for all component props

### Backend
- **ES Modules**: Always use `import/export`, never `require()`
- **MVC Pattern**: Models → Controllers → Routes
- **Parameterized queries**: Always use prepared statements with mysql2
- **Error handling**: Return structured JSON responses with status codes
- **No CommonJS**: Project uses pure ESM (type: "module")

### Naming Conventions
- **Components**: PascalCase (e.g., `ProductCard`, `AdminDashboard`)
- **Files**: Match component name (e.g., `ProductCard.tsx`)
- **Functions**: camelCase (e.g., `fetchProducts`, `handleSubmit`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- **Database tables**: snake_case (e.g., `users`, `order_items`)
- **API endpoints**: kebab-case with REST conventions (e.g., `/api/reptiles/:id`)

### Security Best Practices
- **Never commit secrets**: Use `.env` files (already in `.gitignore`)
- **Rate limiting**: Apply to sensitive endpoints (auth, payments)
- **Input validation**: Validate and sanitize all user inputs
- **Password security**: Use existing auth.js patterns (SHA256 + salt)
- **CORS**: Always check `ALLOWED_ORIGINS` configuration
- **SQL injection**: Use parameterized queries exclusively
- **XSS prevention**: Sanitize user-generated content before rendering

## Key Development Patterns

### State Management
```typescript
// Use existing Context providers
const { user, login, logout } = useAuth();
const { cart, addToCart, removeFromCart } = useCart();
const { wishlist, addToWishlist } = useWishlist();
```

### API Calls
```typescript
// Always use the centralized api.ts service
import api from '@/services/api';

const data = await api.get('/reptiles');
await api.post('/orders', orderData);
```

### Custom Routing
```typescript
// Use pathname manipulation for navigation
window.location.pathname = '/products';

// In components, detect route with:
const isActive = window.location.pathname === '/products';
```

### Database Operations
```javascript
// Model pattern (backend)
export async function getAll() {
  const [rows] = await db.query('SELECT * FROM table');
  return rows;
}

// Controller pattern
export async function getAllController(req, res) {
  try {
    const data = await getAll();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
}
```

## Common Pitfalls to Avoid

### Frontend
- ❌ Don't install React Router (project uses custom routing)
- ❌ Don't add Redux/Zustand (use existing Context API)
- ❌ Don't use inline styles (use Tailwind classes)
- ❌ Don't import images directly (use /public directory)
- ❌ Don't hardcode API URLs (use `services/api.ts`)

### Backend
- ❌ Don't use `require()` syntax (project is ES Modules)
- ❌ Don't use raw SQL strings with user input (SQL injection risk)
- ❌ Don't return detailed errors to clients in production
- ❌ Don't store passwords in plain text
- ❌ Don't disable rate limiting or CORS

### General
- ❌ Don't commit `.env` files
- ❌ Don't remove security headers or middleware
- ❌ Don't modify authentication logic without thorough testing
- ❌ Don't change database schema without migration strategy

## Development Workflow

### Setup
```bash
npm install                    # Install root dependencies
cd server && npm install       # Install server dependencies
npm run setup:db              # Create schema and seed data
```

### Development
```bash
npm run start:all             # Run both frontend (5173) and backend (3001)
npm run dev                   # Frontend only
npm run server                # Backend only
```

### Production Build
```bash
npm run build                 # Build frontend to dist/
cd server && npm run start    # Serve static files + API
```

### Environment Variables
```bash
# server/.env (required for production)
NODE_ENV=production
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=reptile_house
PORT=3001
ALLOWED_ORIGINS=https://yourdomain.com
RATE_LIMIT_MAX=600
AUTH_RATE_LIMIT_MAX=30
```

## Testing Guidelines

- Run builds before committing: `npm run build`
- Test API endpoints with curl or Postman
- Verify rate limiting works on auth endpoints
- Check CORS headers in browser console
- Test admin features with different user roles
- Validate Arabic text displays correctly

## Resources & References

- **Deployment Guides**:
  - `DEPLOY_HOSTINGER_VPS.md` - VPS deployment
  - `DEPLOY_VERCEL_RENDER.md` - Split deployment
  - `DEPLOYMENT_SUMMARY.md` - Overview of options
  
- **Help System**: `HELP_SYSTEM_GUIDE.md`

- **Quick Deploy**: `QUICK_DEPLOY.md`

## Language & Localization

- **Primary Language**: Arabic (العربية)
- **UI Text**: Most user-facing text is in Arabic
- **Code Comments**: Mixed Arabic/English
- **Documentation**: Mixed Arabic/English
- **Database**: Uses `utf8mb4` for full Unicode support

When adding new features:
- Consider RTL (right-to-left) layout requirements
- Use Arabic text for user-facing strings
- Test with Arabic input in forms
- Ensure proper character encoding in API responses

## Code Review Checklist

Before submitting code:
- [ ] TypeScript compiles without errors
- [ ] No hardcoded credentials or API keys
- [ ] Rate limiting applied to sensitive endpoints
- [ ] Input validation on all user inputs
- [ ] Parameterized SQL queries only
- [ ] Error handling with structured responses
- [ ] CORS configuration reviewed
- [ ] Arabic text displays correctly (if applicable)
- [ ] Build succeeds: `npm run build`
- [ ] No new security vulnerabilities introduced
