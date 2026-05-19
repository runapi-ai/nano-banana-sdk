import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface TestResult {
  name: string;
  passed: boolean;
  duration: number;
  error?: string;
}

const tests = [
  { name: 'Base Model Generation', file: 'test-generation-base.ts' },
  { name: 'Pro Model Generation', file: 'test-generation-pro.ts' },
  { name: 'Image Edit', file: 'test-edit.ts' },
  { name: 'Polling Mechanism', file: 'test-polling.ts' },
  { name: 'Error Handling', file: 'test-error-handling.ts' },
];

async function runTest(testFile: string): Promise<{ success: boolean; duration: number; output: string }> {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const testPath = join(__dirname, testFile);
    
    const proc = spawn('npx', ['tsx', testPath], {
      stdio: 'pipe',
      env: process.env,
    });

    let output = '';
    let errorOutput = '';

    proc.stdout.on('data', (data) => {
      output += data.toString();
    });

    proc.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    proc.on('close', (code) => {
      const duration = Date.now() - startTime;
      resolve({
        success: code === 0,
        duration,
        output: output + errorOutput,
      });
    });
  });
}

async function main() {
  console.log('🧪 Running Nano-Banana SDK Test Suite\n');
  console.log('='.repeat(60));
  
  // Check for API key
  if (!process.env.RUNAPI_API_KEY) {
    console.error('\n❌ Error: RUNAPI_API_KEY environment variable is required');
    console.error('   Please set it using: export RUNAPI_API_KEY="your-token"\n');
    process.exit(1);
  }

  const results: TestResult[] = [];
  const startTime = Date.now();

  for (let i = 0; i < tests.length; i++) {
    const test = tests[i];
    console.log(`\n[${i + 1}/${tests.length}] ${test.name}...`);
    console.log('-'.repeat(60));

    try {
      const result = await runTest(test.file);
      
      if (result.success) {
        console.log(`✅ PASSED (${(result.duration / 1000).toFixed(1)}s)`);
        results.push({
          name: test.name,
          passed: true,
          duration: result.duration,
        });
      } else {
        console.log(`❌ FAILED (${(result.duration / 1000).toFixed(1)}s)`);
        console.log('\nError output:');
        console.log(result.output.split('\n').slice(-10).join('\n'));
        results.push({
          name: test.name,
          passed: false,
          duration: result.duration,
          error: result.output,
        });
      }
    } catch (error) {
      console.log('❌ FAILED (error running test)');
      results.push({
        name: test.name,
        passed: false,
        duration: 0,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const totalDuration = Date.now() - startTime;
  const passedCount = results.filter((r) => r.passed).length;
  const failedCount = results.length - passedCount;

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Test Summary');
  console.log('='.repeat(60));
  
  results.forEach((result, index) => {
    const status = result.passed ? '✅' : '❌';
    const time = (result.duration / 1000).toFixed(1);
    console.log(`${status} [${index + 1}/${results.length}] ${result.name} (${time}s)`);
  });

  console.log('\n' + '='.repeat(60));
  console.log(`Total Tests: ${results.length}`);
  console.log(`Passed: ${passedCount}`);
  console.log(`Failed: ${failedCount}`);
  console.log(`Success Rate: ${((passedCount / results.length) * 100).toFixed(0)}%`);
  console.log(`Total Duration: ${(totalDuration / 1000).toFixed(1)}s`);
  console.log('='.repeat(60));

  if (failedCount > 0) {
    console.log('\n⚠️  Some tests failed. See details above.\n');
    process.exit(1);
  } else {
    console.log('\n🎉 All tests passed!\n');
    process.exit(0);
  }
}

main();
