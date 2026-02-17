const { execSync } = require('child_process');
const path = require('path');

const projectDir = __dirname;

console.log('🚀 Starting automatic deployment to GitHub...\n');

try {
  console.log('📦 Step 1/3: Adding files to Git...');
  execSync('git add .', { cwd: projectDir, stdio: 'inherit' });
  console.log('✅ Files added\n');

  console.log('📝 Step 2/3: Creating commit...');
  try {
    execSync('git commit -m "Deploy: Ready for Vercel and Render deployment"', { 
      cwd: projectDir, 
      stdio: 'inherit' 
    });
    console.log('✅ Commit created\n');
  } catch (e) {
    if (e.status === 1) {
      console.log('ℹ️  Nothing to commit (already up to date)\n');
    } else {
      throw e;
    }
  }

  console.log('⬆️  Step 3/3: Pushing to GitHub...');
  execSync('git push -u origin main', { cwd: projectDir, stdio: 'inherit' });
  console.log('✅ Successfully pushed to GitHub!\n');

  console.log('═══════════════════════════════════════════════════════');
  console.log('🎉 SUCCESS! Project is now on GitHub');
  console.log('═══════════════════════════════════════════════════════');
  console.log('\n📍 Repository: https://github.com/Ahmad-Ali-mohammad/semo-main');
  console.log('\n📋 Next Steps:');
  console.log('1. Deploy Backend on Render: https://render.com');
  console.log('2. Deploy Frontend on Vercel: https://vercel.com');
  console.log('3. See QUICK_DEPLOY.md for detailed instructions\n');

} catch (error) {
  console.error('\n❌ Error during deployment:', error.message);
  console.log('\n💡 Possible solutions:');
  console.log('1. Make sure you are logged in to GitHub');
  console.log('2. Use Personal Access Token: https://github.com/settings/tokens');
  console.log('3. Run manually: ');
  console.log('   git add .');
  console.log('   git commit -m "Deploy"');
  console.log('   git push -u origin main\n');
  process.exit(1);
}
