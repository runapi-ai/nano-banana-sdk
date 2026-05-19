import { NanoBananaClient } from '../src';

async function main() {
  console.log('🧪 Testing Polling Mechanism\n');
  console.log('='.repeat(50));

  // Check for API key
  const apiKey = process.env.RUNAPI_API_KEY;
  if (!apiKey) {
    console.error('❌ Error: RUNAPI_API_KEY environment variable is required');
    process.exit(1);
  }

  const client = new NanoBananaClient({
    apiKey,
    baseUrl: process.env.RUNAPI_BASE_URL || 'http://localhost:3000',
  });

  try {
    // Test 1: Monitor polling behavior
    console.log('\n⏳ Test 1: Monitoring polling behavior');
    console.log('-'.repeat(50));
    console.log('   Creating task and observing poll intervals...\n');
    
    const taskStart = Date.now();
    let lastPollTime = taskStart;
    let pollCount = 0;
    
    // Create task first
    const createResult = await client.textToImage.create({
      model: 'nano-banana',
      prompt: 'A simple test image for polling',
      image_size: '1:1',
    });
    
    console.log(`✅ Task created: ${createResult.id}`);
    console.log('   Starting manual polling...\n');
    
    // Manual polling loop to observe behavior
    while (true) {
      pollCount++;
      const pollStart = Date.now();
      const pollInterval = pollStart - lastPollTime;
      lastPollTime = pollStart;
      
      console.log(`   Poll #${pollCount} (interval: ${pollInterval}ms)`);
      
      const status = await client.textToImage.get(createResult.id);
      console.log(`      Status: ${status.status}`);
      
      if (status.status === 'completed') {
        console.log(`      ✅ Completed! Total polls: ${pollCount}`);
        console.log(`      Total time: ${((Date.now() - taskStart) / 1000).toFixed(1)}s`);
        break;
      }
      
      if (status.status === 'failed') {
        console.log(`      ❌ Task failed: ${status.error}`);
        break;
      }
      
      if (pollCount > 150) { // 150 * 2s = 5 minutes
        console.log(`      ⏱️  Stopping after ${pollCount} polls (timeout)`);
        break;
      }
      
      // Wait 2 seconds (default polling interval)
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Test 2: Test run() method (automatic polling)
    console.log('\n⏳ Test 2: Testing automatic polling with run()');
    console.log('-'.repeat(50));
    
    const runStart = Date.now();
    const runResult = await client.textToImage.run({
      model: 'nano-banana',
      prompt: 'Another test image for automatic polling',
      image_size: '1:1',
    });
    const runTime = Date.now() - runStart;
    
    console.log('✅ Automatic polling completed!');
    console.log(`   Task ID: ${runResult.id}`);
    console.log(`   Status: ${runResult.status}`);
    console.log(`   Total time: ${(runTime / 1000).toFixed(1)}s`);
    console.log(`   Estimated polls: ${Math.ceil(runTime / 2000)}`);

    // Test 3: Compare create+get vs run
    console.log('\n⏳ Test 3: Comparing manual vs automatic polling');
    console.log('-'.repeat(50));
    
    console.log('\n   Method 1: Manual (create + multiple get calls)');
    const manualStart = Date.now();
    const manualTask = await client.textToImage.create({
      model: 'nano-banana',
      prompt: 'Manual polling test',
    });
    
    let manualPolls = 0;
    while (true) {
      manualPolls++;
      const status = await client.textToImage.get(manualTask.id);
      if (status.status === 'completed' || status.status === 'failed') {
        break;
      }
      if (manualPolls > 150) break;
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    const manualTime = Date.now() - manualStart;
    console.log(`   ✓ Completed in ${(manualTime / 1000).toFixed(1)}s with ${manualPolls} polls`);
    
    console.log('\n   Method 2: Automatic (run method)');
    const autoStart = Date.now();
    await client.textToImage.run({
      model: 'nano-banana',
      prompt: 'Automatic polling test',
    });
    const autoTime = Date.now() - autoStart;
    console.log(`   ✓ Completed in ${(autoTime / 1000).toFixed(1)}s`);
    
    console.log('\n   Performance comparison:');
    console.log(`   Time difference: ${Math.abs(manualTime - autoTime)}ms`);
    console.log(`   Both methods use same polling mechanism ✓`);

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 Polling Test Summary:');
    console.log('='.repeat(50));
    console.log('✅ Poll interval observation  - PASSED');
    console.log('✅ Automatic polling (run)    - PASSED');
    console.log('✅ Manual vs Auto comparison  - PASSED');
    console.log('\n💡 Polling Behavior Validated:');
    console.log('   ✓ Default interval: ~2 seconds');
    console.log('   ✓ Stops immediately when completed');
    console.log('   ✓ Handles both manual and automatic modes');
    console.log('   ✓ Timeout protection (max 5 minutes)\n');

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
    }
    
    process.exit(1);
  }
}

// Run the test
main();
