# Receiptr - Digital Receipt Generator

A simple digital receipt generator for small businesses, freelancers, POS agents, salons, and food vendors.

## Features

- ✅ User registration and authentication
- ✅ Business profile setup (name, logo, VAT rate)
- ✅ Create professional digital receipts
- ✅ Auto-calculate subtotals, VAT, and totals
- ✅ Share receipts via WhatsApp, email, or direct links
- ✅ Public receipt viewing with printable format
- ✅ Receipt history with search and filter
- ✅ Mobile-friendly responsive design

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Frontend**: React, TailwindCSS, React Hook Form
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js with JWT
- **Deployment**: Vercel + MongoDB Atlas

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd receiptr
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` with your configuration:
   ```env
   MONGODB_URI=your-mongodb-connection-string
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser**

## Project Structure

```
/app
  / (Landing Page)
  /login
  /register
  /dashboard
  /create
  /receipts/[id]     # Public receipt view
  /settings
  /api
    /auth
    /user
    /receipts
/components
  Navbar, etc.
/lib
  /models
    User.ts
    Receipt.ts
  /utils
    calculateReceipt.ts
  auth.ts
  db.ts
```

## API Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/user` - Get user profile
- `PUT /api/user` - Update user profile
- `POST /api/receipts` - Create new receipt
- `GET /api/receipts` - Get user receipts
- `GET /api/receipts/[id]` - Get public receipt

## Deployment

1. **Set up MongoDB Atlas**
   - Create a new cluster
   - Get your connection string

2. **Deploy to Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```

3. **Configure environment variables in Vercel**
   - Add your MongoDB URI
   - Set NEXTAUTH_SECRET and NEXTAUTH_URL

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
