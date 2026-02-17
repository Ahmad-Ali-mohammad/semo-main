const { execSync } = require('child_process');
const https = require('https');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║                                                            ║');
  console.log('║     🚀 SEMO Deployment Automation Tool 🚀                 ║');
  console.log('║                                                            ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  console.log('This tool will help you deploy your project to:');
  console.log('1. ✅ GitHub');
  console.log('2. 🔧 Render (Backend API)');
  console.log('3. 🌐 Vercel (Frontend)\n');

  // Step 1: Push to GitHub
  console.log('═══════════════════════════════════════════════════════════');
  console.log('Step 1: Pushing to GitHub');
  console.log('═══════════════════════════════════════════════════════════\n');

  try {
    console.log('📦 Adding files...');
    execSync('git add .', { stdio: 'inherit' });
    
    console.log('📝 Creating commit...');
    try {
      execSync('git commit -m "Deploy: Automated deployment setup"', { stdio: 'inherit' });
    } catch (e) {
      console.log('ℹ️  Nothing new to commit');
    }
    
    console.log('⬆️  Pushing to GitHub...');
    execSync('git push -u origin main', { stdio: 'inherit' });
    console.log('✅ Successfully pushed to GitHub!\n');
  } catch (error) {
    console.error('❌ Failed to push to GitHub');
    console.log('Please run manually: git push -u origin main\n');
  }

  // Step 2: Render Instructions
  console.log('═══════════════════════════════════════════════════════════');
  console.log('Step 2: Deploy Backend to Render');
  console.log('═══════════════════════════════════════════════════════════\n');

  console.log('📋 Instructions for Render:');
  console.log('1. Go to: https://render.com');
  console.log('2. Click: New + → Blueprint');
  console.log('3. Select repository: Ahmad-Ali-mohammad/semo-main');
  console.log('4. Render will detect render.yaml automatically');
  console.log('5. Add these environment variables:');
  console.log('   - DB_HOST=<your-database-host>');
  console.log('   - DB_USER=<your-database-user>');
  console.log('   - DB_PASSWORD=<your-database-password>');
  console.log('   - DB_NAME=<your-database-name>');
  console.log('   - ALLOWED_ORIGINS=<leave empty for now>');
  console.log('6. Click Apply\n');

  const renderUrl = await question('Enter your Render API URL (or press Enter to skip): ');
  
  if (renderUrl) {
    console.log(`\n✅ Render URL saved: ${renderUrl}\n`);
  }

  // Step 3: Vercel Instructions
  console.log('═══════════════════════════════════════════════════════════');
  console.log('Step 3: Deploy Frontend to Vercel');
  console.log('═══════════════════════════════════════════════════════════\n');

  console.log('📋 Instructions for Vercel:');
  console.log('1. Go to: https://vercel.com');
  console.log('2. Click: Add New → Project');
  console.log('3. Select repository: Ahmad-Ali-mohammad/semo-main');
  console.log('4. Settings:');
  console.log('   - Framework: Vite');
  console.log('   - Build Command: npm run build');
  console.log('   - Output Directory: dist');
  console.log('5. Environment Variable:');
  console.log(`   - VITE_API_URL=${renderUrl || '<your-render-url>'}`);
  console.log('6. Click Deploy\n');

  const vercelUrl = await question('Enter your Vercel URL (or press Enter to skip): ');
  
  if (vercelUrl) {
    console.log(`\n✅ Vercel URL saved: ${vercelUrl}\n`);
  }

  // Step 4: Update CORS
  if (renderUrl && vercelUrl) {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('Step 4: Update CORS in Render');
    console.log('═══════════════════════════════════════════════════════════\n');
    
    console.log('📋 Final step:');
    console.log('1. Go back to Render');
    console.log('2. Open semo-api service');
    console.log('3. Go to Environment tab');
    console.log(`4. Update ALLOWED_ORIGINS to: ${vercelUrl}`);
    console.log('5. Click Manual Deploy → Deploy latest commit\n');
  }

  // Summary
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🎉 Deployment Setup Complete!');
  console.log('═══════════════════════════════════════════════════════════\n');

  console.log('📍 Your URLs:');
  console.log(`   GitHub: https://github.com/Ahmad-Ali-mohammad/semo-main`);
  if (renderUrl) console.log(`   Backend: ${renderUrl}`);
  if (vercelUrl) console.log(`   Frontend: ${vercelUrl}`);
  
  console.log('\n📚 For detailed instructions, see:');
  console.log('   - QUICK_DEPLOY.md');
  console.log('   - DEPLOY_INSTRUCTIONS.md\n');

  rl.close();
}

main().catch(console.error);
