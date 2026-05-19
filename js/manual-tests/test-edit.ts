import { NanoBananaClient } from '../src';

async function main() {
  console.log('🧪 Testing Nano Banana Image Edit\n');
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

  // Use a public test image or environment variable
  const testImageUrl = process.env.TEST_IMAGE_URL || 
    'https://raw.githubusercontent.com/ckenst/images-catalog/refs/heads/master/size/small_size/Starbucks%20Dog.jpg';

  try {
    // Test 1: Single image edit
    console.log('\n⏳ Test 1: Editing single image');
    console.log('-'.repeat(50));
    console.log(`   Input image: ${testImageUrl.substring(0, 60)}...`);
    console.log('   Prompt: Transform into watercolor painting style');
    
    const test1Start = Date.now();
    const result1 = await client.editImage.run({
      model: 'nano-banana-edit',
      prompt: 'Transform this into a watercolor painting style with soft colors',
      image_urls: [testImageUrl],
      image_size: '1:1',
      output_format: 'png',
    });
    const test1Time = Date.now() - test1Start;
    
    console.log('✅ Edit completed!');
    console.log(`   Task ID: ${result1.id}`);
    console.log(`   Status: ${result1.status}`);
    console.log(`   Model: ${result1.model}`);
    console.log(`   Time: ${(test1Time / 1000).toFixed(1)}s`);
    
    if (result1.result_urls && result1.result_urls.length > 0) {
      console.log(`   Result URL: ${result1.result_urls[0]}`);
    }

    // Test 2: Different output format (JPEG)
    console.log('\n⏳ Test 2: Testing JPEG output format');
    console.log('-'.repeat(50));
    
    const test2Start = Date.now();
    const result2 = await client.editImage.run({
      model: 'nano-banana-edit',
      prompt: 'Convert to anime art style with vibrant colors',
      image_urls: [testImageUrl],
      image_size: '16:9',
      output_format: 'jpeg',
    });
    const test2Time = Date.now() - test2Start;
    
    console.log('✅ JPEG edit completed!');
    console.log(`   Task ID: ${result2.id}`);
    console.log(`   Output format: jpeg`);
    console.log(`   Time: ${(test2Time / 1000).toFixed(1)}s`);

    // Test 3: create() and get() separately
    console.log('\n⏳ Test 3: Testing create() and get() methods');
    console.log('-'.repeat(50));
    
    const createResult = await client.editImage.create({
      model: 'nano-banana-edit',
      prompt: 'Add a magical fantasy background',
      image_urls: [testImageUrl],
      image_size: 'auto',
    });
    
    console.log('✅ Task created!');
    console.log(`   Task ID: ${createResult.id}`);
    
    // Wait a bit and check status
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const getResult = await client.editImage.get(createResult.id);
    console.log('✅ Status retrieved!');
    console.log(`   Current status: ${getResult.status}`);

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 Test Summary:');
    console.log('='.repeat(50));
    console.log('✅ Single image edit    - PASSED');
    console.log('✅ JPEG output format   - PASSED');
    console.log('✅ create() and get()   - PASSED');
    console.log('\n🎉 All edit tests passed!\n');
    
    console.log('💡 Edit Features Validated:');
    console.log('   ✓ image_urls parameter');
    console.log('   ✓ Different image_size options');
    console.log('   ✓ Multiple output formats (png, jpeg)');
    console.log('   ✓ Style transformation prompts\n');

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
    console.error('   1. Check if the test image URL is accessible');
    console.error('   2. Verify nano-banana-edit model is available');
    console.error('   3. Use TEST_IMAGE_URL env var for custom images');
    console.error('   4. Image must be < 10MB and valid format (jpg/png/webp)\n');
    
    process.exit(1);
  }
}

// Run the test
main();
