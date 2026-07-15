#!/usr/bin/env node

const { execSync } = require('child_process');
const readline = require('readline');

// Configurações
const BLOCKED_BRANCHES = ['main', 'master'];
const SECRET_PATTERNS = [
  /AIzaSy[A-Za-z0-9_\\-]{33}/i, // Google API Key
  /AWS_SECRET_ACCESS_KEY/i,
  /amzn\.mws\.[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i,
  /HEROKU_API_KEY/i,
  /secret_key/i,
  /private_key/i,
  /password\s*=\s*['"][^'"]+['"]/i,
];

// Utilitários de Formatação
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function logSuccess(msg) {
  console.log(`${colors.green}✔ ${msg}${colors.reset}`);
}

function logWarning(msg) {
  console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`);
}

function logError(msg) {
  console.error(`${colors.red}✘ ${msg}${colors.reset}`);
}

function logStep(msg) {
  console.log(`\n${colors.cyan}${colors.bold}👉 ${msg}${colors.reset}`);
}

// 1. Obter a branch atual
function getCurrentBranch() {
  try {
    return execSync('git symbolic-ref --short HEAD').toString().trim();
  } catch {
    return '';
  }
}

// 2. Proteção de Branches
function checkBranchProtection(branch) {
  logStep('Verificando proteção de branch...');
  if (BLOCKED_BRANCHES.includes(branch)) {
    if (process.env.ALLOW_MAIN_PUSH === '1') {
      logWarning(`Push para branch protegida '${branch}' permitido devido a ALLOW_MAIN_PUSH=1.`);
      return true;
    }
    logError(`Push direto para a branch '${branch}' é proibido!`);
    logError('Use Pull Requests (PR) para mesclar alterações nesta branch.');
    logError('Se você realmente precisa fazer push, defina ALLOW_MAIN_PUSH=1.');
    return false;
  }
  logSuccess(`Branch '${branch}' não é protegida. Prosseguindo.`);
  return true;
}

// 3. Checagem de Vazamento de Segredos e Chaves
function checkSecrets(remoteSha, localSha) {
  logStep('Verificando vazamento de credenciais/segredos...');
  
  // Se for uma branch nova, compara com a master/main ou o último commit local
  let diffRange = '';
  if (!remoteSha || remoteSha.match(/^0+$/)) {
    diffRange = 'HEAD~1..HEAD'; // Analisa o último commit se for nova branch
  } else {
    diffRange = `${remoteSha}..${localSha}`;
  }

  try {
    // Verificar se algum arquivo .env está sendo enviado no diff
    const filesChanged = execSync(`git diff --name-only ${diffRange}`, { stdio: ['pipe', 'pipe', 'ignore'] })
      .toString()
      .split('\n');

    const envFiles = filesChanged.filter(file => file.includes('.env'));
    if (envFiles.length > 0) {
      logError(`Arquivo sensitivo detectado no diff de push: ${envFiles.join(', ')}`);
      logError('Nunca envie arquivos .env para o repositório remoto!');
      return false;
    }

    // Verificar padrões de segredos no conteúdo do diff
    const diffContent = execSync(`git diff ${diffRange}`, { stdio: ['pipe', 'pipe', 'ignore'] }).toString();
    for (const pattern of SECRET_PATTERNS) {
      if (pattern.test(diffContent)) {
        logError(`Potencial segredo/chave exposta detectada! Padrão: ${pattern}`);
        logError('Por favor, revise suas alterações e remova credenciais hardcoded.');
        return false;
      }
    }
  } catch (error) {
    // Se falhar (por exemplo, HEAD~1 não existir), loga aviso mas deixa continuar
    logWarning('Não foi possível analisar o diff de commits para segredos.');
  }

  logSuccess('Nenhum segredo ou arquivo .env detectado no diff.');
  return true;
}

// 4. Rodar Comando npm/validador
function runCommand(command, name) {
  logStep(`Executando ${name}...`);
  console.log(`> ${command}`);
  try {
    execSync(command, { stdio: 'inherit' });
    logSuccess(`${name} concluído com sucesso.`);
    return true;
  } catch {
    logError(`${name} falhou. Por favor, corrija os problemas antes de fazer push.`);
    return false;
  }
}

// Fluxo Principal
async function main() {
  const branch = getCurrentBranch();
  
  if (!checkBranchProtection(branch)) {
    process.exit(1);
  }

  // Obter informações do stdin (referências empurradas pelo git)
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  let hasErrors = false;

  for await (const line of rl) {
    const parts = line.split(' ');
    if (parts.length === 4) {
      const [_, localSha, __, remoteSha] = parts;
      if (!checkSecrets(remoteSha, localSha)) {
        hasErrors = true;
        break;
      }
    }
  }

  if (hasErrors) {
    process.exit(1);
  }

  // Rodar validações adicionais (Lint, Prettier, TypeScript e Testes)
  if (!runCommand('npm run format:check', 'Prettier (Formatação)')) process.exit(1);
  if (!runCommand('npm run lint', 'ESLint (Linter)')) process.exit(1);
  if (!runCommand('npm run type-check', 'TypeScript (Tipagem)')) process.exit(1);
  if (!runCommand('npm run test', 'Jest (Testes)')) process.exit(1);

  console.log(`\n${colors.green}${colors.bold}🎉 Tudo pronto! Push autorizado. 🚀${colors.reset}\n`);
  process.exit(0);
}

main().catch((err) => {
  logError(`Erro inesperado no pre-push hook: ${err.message}`);
  process.exit(1);
});
