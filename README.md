# TravelPack

TravelPack is a full-stack, cloud-hosted web application designed to assist users with travel planning and packing management.
The web app enables users to create, organize, and reuse structured packing lists tailored to specific trips, reducing the stress and errors associated with travel preparation.

## About TravelPack

TravelPack streamlines travel preparation by letting you:

- Create and manage trips with associated packing lists.
- Categorize items for better organization.
- Save reusable templates for recurring travel needs.
- Track packing progress in real time.
- Export packing lists as PDFs or share them via unique links.

## Running the Project

To run TravelPack locally, follow these steps:

1. Clone the repository:

```
git clone https://github.com/sam-carvalho/travelpack.git
```

2. Navigate to the project directory:

```
cd travelpack
```

3. Install dependencies:

```
pnpm install
```

4. Create a `.env` file in the project root and configure your environment variables. Example:

```
DATABASE_URL=YOUR_DATABASE_URL
NEXTAUTH_SECRET=YOUR_NEXTAUTH_SECRET
NEXTAUTH_URL=http://localhost:3000
```

### How to set these values

- `DATABASE_URL`: TravelPack uses PostgreSQL as its database. You can host it locally or use a cloud provider such as Neon.
- `NEXTAUTH_SECRET`: Used to encrypt session data. Generate a strong random value by running: `openssl rand -base64 32`
- `NEXTAUTH_URL`: The base URL of your app (e.g., http://localhost:3000 for local development).

5. Run database migrations (using Prisma):

```
npx prisma migrate dev
```

6. Start the development server:

```
pnpm dev
```

7. Access TravelPack in your browser at http://localhost:3000.
