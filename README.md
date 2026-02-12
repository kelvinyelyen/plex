# Plex

![Next JS](https://img.shields.io/badge/Next-black?style=flat-square&logo=next.js&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)

Cognitive exercises and logic puzzles. Features Sudoku, Schulte Tables, and Chimp Tests.

## Stack

- Next.js
- Tailwind CSS
- Prisma
- NextAuth.js

## Development

Choose one of the following options to set up your development environment.

### Option 1: Standard Setup (Recommended)

Requires Node.js and a PostgreSQL database.

1.  **Clone and Install**:
    ```bash
    git clone https://github.com/kelvinyelyen/plex.git
    cd plex
    npm install
    # Setup .env with DATABASE_URL
    npx prisma generate
    npm run dev
    ```

2.  **Environment**:
    Create a `.env` file with your database and auth credentials.

### Option 2: Docker Setup

Requires Docker and Docker Compose.

1.  **Build and Start**:
    ```bash
    docker-compose up --build
    ```
    The application will be available at `http://localhost:3000`.

2.  **Database Migrations**:
    The database is initialized empty. Run migrations to set up the schema:
    
    **Method A: From host (if Node.js installed)**
    ```bash
    # Ensure .env points to localhost:5432
    npx prisma migrate deploy
    ```

    **Method B: Via Docker (One-off container)**
    ```bash
    docker run --rm -it \
      --network plex_plex-network \
      -v $(pwd):/app \
      -w /app \
      -e DATABASE_URL="postgresql://postgres:password@db:5432/plex" \
      node:20-alpine sh -c "npm install -g prisma && npx prisma migrate deploy"
    ```
