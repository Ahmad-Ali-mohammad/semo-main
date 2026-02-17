#!/usr/bin/env node

console.log('\n🚀 Starting deployment...\n');

const { execSync } = require('child_process');

const commands = [
  { cmd: 'git add .', desc: 'Adding files' },
  { cmd: 'git commit -m "Deploy: Automated deployment"', desc: 'Creating commit', allowFail: true },
  { cmd: 'git push -u origin main', desc: 'Pushing to GitHub' }
];

for (const { cmd, desc, allowFail } of commands) {
  try {
    console.log(`📦 ${desc}...`);
    execSync(cmd, { stdio: 'inherit' });
    console.log(`✅ ${desc} complete\n`);
  } catch (error) {
    if (!allowFail) {
      console.error(`\n❌ Error: ${desc} failed`);
      console.log('\nTry running manually:');
      console.log('  git add .');
      console.log('  git commit -m "Deploy"');
      console.log('  git push -u origin main\n');
      process.exit(1);
    }
    console.log(`ℹ️  ${desc} - nothing to do\n`);
  }
}

console.log('═══════════════════════════════════════════════════════');
console.log('✅ Successfully pushed to GitHub!');
console.log('═══════════════════════════════════════════════════════\n');
console.log('📍 Repository: https://github.com/Ahmad-Ali-mohammad/semo-main\n');
console.log('📋 Next steps:');
console.log('1. Deploy Backend: https://render.com');
console.log('2. Deploy Frontend: https://vercel.com');
console.log('3. See QUICK_DEPLOY.md for details\n');
