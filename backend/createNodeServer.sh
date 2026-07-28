npm init -y
npm install -D typescript @types/node tsx
npx tsc --init 
mkdir src
echo "import Fastify from 'fastify';

const fastify = Fastify({ logger: true });

// O Fastify lida com rotas assíncronas por padrão
fastify.post('/cards', async (request, reply) => {
  // A sintaxe é muito limpa e objetiva
  return { status: 'ok' };
});

await fastify.listen({ port: 3001 });" > src/index.ts

npm install fastify

npm run dev