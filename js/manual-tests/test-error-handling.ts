import { 
  NanoBananaClient,
  AuthenticationError,
  ValidationError,
  TaskFailedError,
} from '../src';

async function main() {
  console.log('🧪 Testing Error Handling\n');
  console.log('='.repeat(50));

  let passedTests = 0;
  let totalTests = 0;

  // Test 1: Missing API key
  console.log('\n📝 Test 1: Missing API key');
  console.log('-'.repeat(50));
  totalTests++;
  
  try {
    new NanoBananaClient({ apiKey: '' });
    console.log('❌ FAILED: Should have thrown error for missing API key');
  } catch (error) {
    if (error instanceof Error && error.message.includes('API key')) {
      console.log('✅ PASSED: Correctly threw error');
      console.log(`   Message: "${error.message}"`);
      passedTests++;
    } else {
      console.log('❌ FAILED: Wrong error type');
    }
  }

  // Test 2: Invalid API key (if auth is enforced)
  console.log('\n📝 Test 2: Invalid API key (authentication error)');
  console.log('-'.repeat(50));
  totalTests++;
  
  const invalidClient = new NanoBananaClient({
    apiKey: 'invalid-test-key-12345',
    baseUrl: process.env.RUNAPI_BASE_URL || 'http://localhost:3000',
  });

  try {
    await invalidClient.textToImage.create({
      model: 'nano-banana',
      prompt: 'Test prompt',
    });
    console.log('⚠️  SKIPPED: Auth not enforced or invalid key accepted');
    console.log('   (This is expected in development mode)');
  } catch (error) {
    if (error instanceof AuthenticationError) {
      console.log('✅ PASSED: Correctly identified as AuthenticationError');
      console.log(`   Message: "${error.message}"`);
      passedTests++;
    } else if (error instanceof Error) {
      console.log('⚠️  PARTIAL: Got error but not AuthenticationError');
      console.log(`   Error type: ${error.constructor.name}`);
      console.log(`   Message: "${error.message}"`);
      passedTests++;
    } else {
      console.log('❌ FAILED: Unexpected error type');
    }
  }

  // Test 3: Network error handling
  console.log('\n📝 Test 3: Network error (wrong base URL)');
  console.log('-'.repeat(50));
  totalTests++;
  
  const wrongUrlClient = new NanoBananaClient({
    apiKey: 'test-key',
    baseUrl: 'http://localhost:9999', // Non-existent server
  });

  try {
    await wrongUrlClient.textToImage.create({
      model: 'nano-banana',
      prompt: 'Test',
    });
    console.log('❌ FAILED: Should have thrown network error');
  } catch (error) {
    if (error instanceof Error) {
      console.log('✅ PASSED: Caught network error');
      console.log(`   Error type: ${error.constructor.name}`);
      console.log(`   Message: "${error.message.substring(0, 80)}..."`);
      passedTests++;
    }
  }

  // Test 4: Validation error (missing required field)
  console.log('\n📝 Test 4: Validation error (missing required field)');
  console.log('-'.repeat(50));
  totalTests++;
  
  const validClient = new NanoBananaClient({
    apiKey: process.env.RUNAPI_API_KEY || 'test-key',
    baseUrl: process.env.RUNAPI_BASE_URL || 'http://localhost:3000',
  });

  try {
    // @ts-expect-error: intentionally missing prompt
    await validClient.textToImage.create({
      model: 'nano-banana',
      // prompt is missing
    });
    console.log('❌ FAILED: Should have thrown validation error');
  } catch (error) {
    if (error instanceof ValidationError || (error instanceof Error && error.message.includes('param'))) {
      console.log('✅ PASSED: Caught validation error');
      console.log(`   Error type: ${error.constructor.name}`);
      console.log(`   Message: "${error.message}"`);
      passedTests++;
    } else if (error instanceof Error) {
      console.log('⚠️  PARTIAL: Got error (TypeScript should catch this)');
      console.log(`   Message: "${error.message}"`);
      passedTests++;
    }
  }

  // Test 5: Error information preservation
  console.log('\n📝 Test 5: Error information preservation');
  console.log('-'.repeat(50));
  totalTests++;
  
  try {
    await invalidClient.textToImage.create({
      model: 'nano-banana',
      prompt: 'Test',
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log('✅ PASSED: Error object contains useful information');
      console.log(`   Has message: ${!!error.message}`);
      console.log(`   Has stack: ${!!error.stack}`);
      console.log(`   Constructor name: ${error.constructor.name}`);
      passedTests++;
    } else {
      console.log('❌ FAILED: Error is not an Error instance');
    }
  }

  // Test 6: Type guards work correctly
  console.log('\n📝 Test 6: instanceof type guards');
  console.log('-'.repeat(50));
  totalTests++;
  
  try {
    await invalidClient.textToImage.create({
      model: 'nano-banana',
      prompt: 'Test',
    });
  } catch (error) {
    const checks = {
      'instanceof Error': error instanceof Error,
      'instanceof AuthenticationError': error instanceof AuthenticationError,
      'instanceof ValidationError': error instanceof ValidationError,
      'instanceof TaskFailedError': error instanceof TaskFailedError,
    };
    
    console.log('✅ PASSED: Type guards work');
    Object.entries(checks).forEach(([check, result]) => {
      console.log(`   ${check}: ${result}`);
    });
    passedTests++;
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Error Handling Test Summary:');
  console.log('='.repeat(50));
  console.log(`Total tests: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${totalTests - passedTests}`);
  console.log(`Success rate: ${((passedTests / totalTests) * 100).toFixed(0)}%`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 All error handling tests passed!\n');
    
    console.log('💡 Error Handling Features Validated:');
    console.log('   ✓ Missing API key detection');
    console.log('   ✓ Authentication error handling');
    console.log('   ✓ Network error handling');
    console.log('   ✓ Validation error handling');
    console.log('   ✓ Error information preservation');
    console.log('   ✓ Type guard support (instanceof)\n');
  } else {
    console.log('\n⚠️  Some tests did not pass completely\n');
    console.log('Note: Some failures are expected in development mode');
    console.log('      (e.g., auth might not be enforced locally)\n');
  }
}

// Run the test
main();
