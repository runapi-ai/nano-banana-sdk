import { NanoBananaClient } from '../src';

async function main() {
  console.log('🧪 Testing Nano Banana Base Model Generation\n');
  console.log('='.repeat(50));

  // Check for API key
  const apiKey = process.env.RUNAPI_API_KEY;
  if (!apiKey) {
    console.error('❌ Error: RUNAPI_API_KEY environment variable is required');
    console.error('   Please set it using: export RUNAPI_API_KEY="your-token"');
    process.exit(1);
  }

  // Initialize client
  const client = new NanoBananaClient({
    apiKey,
    baseUrl: process.env.RUNAPI_BASE_URL || 'http://localhost:3000',
  });

  try {
    // Test 1: create() - Create task without waiting
    console.log('\n📤 Test 1: Creating generation task (create method)');
    console.log('-'.repeat(50));
    const createStart = Date.now();
    const createResult = await client.textToImage.create({
      model: 'nano-banana',
      prompt: 'A beautiful sunset over mountains with vibrant orange and purple colors',
      image_size: '16:9',
      output_format: 'png',
    });
    const createTime = Date.now() - createStart;
    
    console.log('✅ Task created successfully!');
    console.log(`   Task ID: ${createResult.id}`);
    console.log(`   Time: ${createTime}ms`);

    // Test 2: get() - Query task status
    console.log('\n🔍 Test 2: Checking task status (get method)');
    console.log('-'.repeat(50));
    const getStart = Date.now();
    const getResult = await client.textToImage.get(createResult.id);
    const getTime = Date.now() - getStart;
    
    console.log('✅ Status retrieved successfully!');
    console.log(`   Task ID: ${getResult.id}`);
    console.log(`   Status: ${getResult.status}`);
    console.log(`   Model: ${getResult.model}`);
    console.log(`   Time: ${getTime}ms`);
    
    if (getResult.result_urls && getResult.result_urls.length > 0) {
      console.log(`   Result URLs: ${getResult.result_urls.join(', ')}`);
    }

    // Test 3: run() - Complete workflow (create + poll until completion)
    console.log('\n⏳ Test 3: Running complete workflow (run method)');
    console.log('-'.repeat(50));
    console.log('   This will create a new task and wait for completion...');
    
    const runStart = Date.now();
    const runResult = await client.textToImage.run({
      model: 'nano-banana',
      prompt: 'A serene lake with crystal clear water reflecting the surrounding forest',
      image_size: '1:1',
      output_format: 'png',
    });

    const runTime = Date.now() - runStart;
    
    console.log('✅ Generation completed successfully!');
    console.log(`   Task ID: ${runResult.id}`);
    console.log(`   Status: ${runResult.status}`);
    console.log(`   Model: ${runResult.model}`);
    console.log(`   Total time: ${(runTime / 1000).toFixed(1)}s`);
    
    if (runResult.result_urls && runResult.result_urls.length > 0) {
      console.log(`   Result URLs:`);
      runResult.result_urls.forEach((url, idx) => {
        console.log(`     [${idx + 1}] ${url}`);
      });
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 Test Summary:');
    console.log('='.repeat(50));
    console.log('✅ create() - PASSED');
    console.log('✅ get()    - PASSED');
    console.log('✅ run()    - PASSED');
    console.log('\n🎉 All base model tests passed!\n');

  } catch (error) {
    console.error('\n❌ Test failed!');
    console.error('='.repeat(50));
    
    if (error instanceof Error) {
      console.error(`Error type: ${error.constructor.name}`);
      console.error(`Message: ${error.message}`);
      
      if (process.env.DEBUG) {
        console.error('\nStack trace:');
        console.error(error.stack);
      }
    } else {
      console.error('Unknown error:', error);
    }
    
    console.error('\n💡 Troubleshooting tips:');
    console.error('   1. Check if Rails server is running (bin/dev)');
    console.error('   2. Verify your API Key is valid');
    console.error('   3. Check if you have sufficient creditImage');
    console.error('   4. Run with DEBUG=true for more details\n');
    
    process.exit(1);
  }
}

// Run the test
main();
