const { spawn } = require('child_process');

const sharedEnv = {
  ...process.env,
  DATABASE_URL:
    process.env.DATABASE_URL ||
    'postgresql://insureflow_admin:insureflow_secure_password@localhost:5432/insureflow_db?schema=public',
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: process.env.REDIS_PORT || '6379',
  MINIO_ENDPOINT: process.env.MINIO_ENDPOINT || 'localhost',
  MINIO_PORT: process.env.MINIO_PORT || '9000',
  MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY || 'minio_admin',
  MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY || 'minio_secure_password',
};

const services = [
  { name: 'frontend', command: 'npm', args: ['run', 'dev', '--workspace=@insureflow/frontend'] },
  { name: 'auth', command: 'npm', args: ['run', 'start', '--workspace=@insureflow/api-auth'] },
  { name: 'crm', command: 'npm', args: ['run', 'start', '--workspace=@insureflow/api-crm'] },
  { name: 'contracts', command: 'npm', args: ['run', 'start', '--workspace=@insureflow/api-contracts'] },
  { name: 'claims', command: 'npm', args: ['run', 'start', '--workspace=@insureflow/api-claims'] },
  { name: 'billing', command: 'npm', args: ['run', 'start', '--workspace=@insureflow/api-billing'] },
  { name: 'documents', command: 'npm', args: ['run', 'start', '--workspace=@insureflow/api-documents'] },
  { name: 'payments', command: 'npm', args: ['run', 'start', '--workspace=@insureflow/api-payments'] },
  { name: 'reporting', command: 'npm', args: ['run', 'start', '--workspace=@insureflow/api-reporting'] },
  { name: 'ai', command: 'npm', args: ['run', 'start', '--workspace=@insureflow/api-ai'] },
];

const children = [];

function pipeOutput(serviceName, stream, writer) {
  stream.on('data', (data) => {
    const lines = data.toString().trim().split(/\r?\n/);
    for (const line of lines) {
      if (line.trim()) writer(`[${serviceName}] ${line}`);
    }
  });
}

console.log('[StartAll] Starting OKAYO / INSUREFLOW services...');
console.log('[StartAll] Frontend remains usable with local enterprise fallback data if APIs are unavailable.');

for (const service of services) {
  console.log(`[StartAll] Spawning ${service.name}...`);
  const child = spawn(service.command, service.args, {
    shell: true,
    stdio: 'pipe',
    env: sharedEnv,
  });

  pipeOutput(service.name, child.stdout, console.log);
  pipeOutput(`${service.name}][ERROR`, child.stderr, console.error);

  child.on('close', (code) => {
    console.log(`[StartAll] Service ${service.name} exited with code ${code}`);
  });

  children.push(child);
}

function shutdown() {
  console.log('[StartAll] Shutting down all services...');
  for (const child of children) {
    if (!child.killed) child.kill();
  }
}

process.on('SIGINT', () => {
  shutdown();
  process.exit(0);
});

process.on('SIGTERM', () => {
  shutdown();
  process.exit(0);
});
