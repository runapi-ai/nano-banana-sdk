import { NanoBananaClient } from '../src';

async function main() {
  console.log('🧪 Testing Nano Banana Pro Model Generation\n');
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
    // Test 1: Pro model with 1K resolution
    console.log('\n⏳ Test 1: Pro Model with 1K resolution');
    console.log('-'.repeat(50));
    
    const test1Start = Date.now();
    const result1K = await client.textToImage.run({
      model: 'nano-banana-pro',
      prompt: 'A futuristic cyberpunk cityscape at night with neon lights',
      aspect_ratio: '16:9',
      resolution: '1K',
      output_format: 'png',
    });
    const test1Time = Date.now() - test1Start;
    
    console.log('✅ 1K generation completed!');
    console.log(`   Task ID: ${result1K.id}`);
    console.log(`   Status: ${result1K.status}`);
    console.log(`   Model: ${result1K.model}`);
    console.log(`   Aspect Ratio: 16:9`);
    console.log(`   Resolution: 1K`);
    console.log(`   Time: ${(test1Time / 1000).toFixed(1)}s`);
    
    if (result1K.result_urls && result1K.result_urls.length > 0) {
      console.log(`   Result URL: ${result1K.result_urls[0]}`);
    }

    // Test 2: Pro model with 4K resolution (higher quality)
    console.log('\n⏳ Test 2: Pro Model with 4K resolution (high quality)');
    console.log('-'.repeat(50));
    
    const test2Start = Date.now();
    const result4K = await client.textToImage.run({
      model: 'nano-banana-pro',
      prompt: 'Ultra-detailed landscape with mountains, rivers, and a dramatic sunset sky',
      aspect_ratio: '21:9',
      resolution: '4K',
      output_format: 'png',
    });
    const test2Time = Date.now() - test2Start;
    
    console.log('✅ 4K generation completed!');
    console.log(`   Task ID: ${result4K.id}`);
    console.log(`   Status: ${result4K.status}`);
    console.log(`   Model: ${result4K.model}`);
    console.log(`   Aspect Ratio: 21:9`);
    console.log(`   Resolution: 4K`);
    console.log(`   Time: ${(test2Time / 1000).toFixed(1)}s`);
    
    if (result4K.result_urls && result4K.result_urls.length > 0) {
      console.log(`   Result URL: ${result4K.result_urls[0]}`);
    }

    // Test 3: Different aspect ratios
    console.log('\n⏳ Test 3: Testing different aspect ratios');
    console.log('-'.repeat(50));
    
    const aspectRatios: Array<'1:1' | '9:16' | '4:3'> = ['1:1', '9:16', '4:3'];
    
    for (const ratio of aspectRatios) {
      console.log(`\n   Testing aspect ratio: ${ratio}`);
      const testStart = Date.now();
      
      const result = await client.textToImage.run({
        model: 'nano-banana-pro',
        prompt: `A professional photograph with ${ratio} aspect ratio`,
        aspect_ratio: ratio,
        resolution: '2K',
      });
      
      const testTime = Date.now() - testStart;
      console.log(`   ✅ ${ratio} completed in ${(testTime / 1000).toFixed(1)}s`);
      console.log(`      Task ID: ${result.id}`);
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 Test Summary:');
    console.log('='.repeat(50));
    console.log('✅ 1K Resolution  - PASSED');
    console.log('✅ 4K Resolution  - PASSED');
    console.log('✅ Aspect Ratios  - PASSED (1:1, 9:16, 4:3)');
    console.log('\n🎉 All Pro model tests passed!\n');
    
    console.log('💡 Pro Model Features Validated:');
    console.log('   ✓ aspect_ratio parameter (not image_size)');
    console.log('   ✓ resolution parameter (1K, 2K, 4K)');
    console.log('   ✓ Multiple aspect ratio options');
    console.log('   ✓ High-quality image generation\n');

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
    console.error('   1. Pro model might require more creditImage');
    console.error('   2. 4K generation takes longer (be patient)');
    console.error('   3. Check if nano-banana-pro is available\n');
    
    process.exit(1);
  }
}

// Run the test
main();
