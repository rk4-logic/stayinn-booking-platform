# Changelog

## feat(setup)
- Next.js 16 with App Router and TypeScript
- Clerk authentication with Google OAuth
- MongoDB Atlas connection with Mongoose

## feat(auth)
- Clerk webhook to sync users to MongoDB
- Protected layout with user sync
- User model with role-based schema

## feat(models)
- Property, Room, Booking, Review Mongoose models
- Reusable sub-schemas: image, location, contact, guests
- Shared schema-options with virtuals and getters
- Compound indexes for search, dashboard, availability
- TypeScript domain interfaces for all entities