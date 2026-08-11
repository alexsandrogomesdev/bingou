#!/bin/sh
set -e

echo "Waiting for DB..."

# Se estiver usando Prisma, Knex, TypeORM, Drizzle, etc:
echo "Executing migrations..."
npx prisma migrate deploy # ou npm run db:migrate / node dist/scripts/migrate.js

echo "Executando seeds (criação de usuários/dados padrão)..."
npx prisma db seed # ou npm run db:seed / node dist/scripts/seed.js

echo "Iniciando a aplicação..."
exec "$@"