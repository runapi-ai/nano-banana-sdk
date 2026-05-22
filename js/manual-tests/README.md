# Nano-Banana SDK Manual Testing Guide

This directory contains manual test scripts for validating the `@runapi.ai/nano-banana` SDK with real API calls.

## 📋 Prerequisites

### 1. Start Rails Server

Make sure your Rails server is running:

```bash
# From project root
bin/dev

# Or using overmind
overmind start
```

The server should be available at `http://localhost:3000`.

### 2. Get API Key

You need a valid API Key with sufficient creditImage:

**Option A: Using Rails Console**
```bash
bin/rails console
```

Then in the console:
```ruby
# Get the first API Key
ApiToken.first.token

# Or create a new one for testing
user = User.first
token = user.api_tokens.create(name: "SDK Test Key")
token.token  # Copy this
```

**Option B: Using Database**
```bash
bin/rails dbconsole
```

```sql
SELECT token FROM api_tokens LIMIT 1;
```

### 3. Configure Environment Variables

**Recommended: Use .env file (auto-loaded)**
```bash
# Copy the example file
cp manual-tests/.env.example manual-tests/.env

# Edit manual-tests/.env with your API Key
# The .env file will be automatically loaded when you run tests
```

**Alternative: Manual export (not recommended)**
```bash
# Only needed if you don't use the .env file
export RUNAPI_API_KEY="your-api-key-here"
export RUNAPI_BASE_URL="http://localhost:3000"
export TEST_IMAGE_URL="https://example.com/your-test-image.jpg"
export DEBUG=true
```

**Note:** All test scripts now use `dotenv-cli` to automatically load `manual-tests/.env`, so you don't need to manually export variables.

---

## 🧪 Available Tests

### Test 1: Base Model Generation
**File:** `test-generation-base.ts`

**What it tests:**
- ✅ `create()` method - Create task without waiting
- ✅ `get()` method - Query task status
- ✅ `run()` method - Complete workflow (create + poll until completion)

**Run:**
```bash
cd sdk/js
pnpm --filter @runapi.ai/nano-banana test:base
```

**Expected output:**
```
🧪 Testing Nano Banana Base Model Generation
==================================================

📤 Test 1: Creating generation task (create method)
✅ Task created successfully!
   Task ID: abc-123
   Time: 156ms

🔍 Test 2: Checking task status (get method)
✅ Status retrieved successfully!
   Status: processing
   ...

🎉 All base model tests passed!
```

---

### Test 2: Pro Model Generation
**File:** `test-generation-pro.ts`

**What it tests:**
- ✅ Pro model with 1K resolution
- ✅ Pro model with 4K resolution  
- ✅ Different aspect ratios (1:1, 9:16, 4:3)
- ✅ `aspect_ratio` parameter (Pro-specific)
- ✅ `resolution` parameter (Pro-specific)

**Run:**
```bash
pnpm --filter @runapi.ai/nano-banana test:pro
```

**Note:** Pro model tests may take longer and consume more creditImage.

---

### Test 3: Image Edit
**File:** `test-edit.ts`

**What it tests:**
- ✅ Single image editing
- ✅ Different output formats (PNG, JPEG)
- ✅ `image_urls` parameter
- ✅ Style transformation prompts

**Run:**
```bash
pnpm --filter @runapi.ai/nano-banana test:edit
```

**Image Requirements:**
- Format: JPG, PNG, or WebP
- Size: < 10MB per image
- Must be publicly accessible URL

---

### Test 4: Polling Mechanism
**File:** `test-polling.ts`

**What it tests:**
- ✅ Poll interval observation (~2 seconds)
- ✅ Automatic polling with `run()` method
- ✅ Manual polling with `create()` + `get()`
- ✅ Timeout protection (max 5 minutes)

**Run:**
```bash
pnpm --filter @runapi.ai/nano-banana test:polling
```

**Note:** This test may take several minutes as it waits for tasks to complete.

---

### Test 5: Error Handling
**File:** `test-error-handling.ts`

**What it tests:**
- ✅ Missing API key detection
- ✅ Invalid API key (AuthenticationError)
- ✅ Network errors (wrong base URL)
- ✅ Validation errors (missing required fields)
- ✅ Error information preservation
- ✅ Type guards (`instanceof`)

**Run:**
```bash
pnpm --filter @runapi.ai/nano-banana test:errors
```

**Note:** Some tests intentionally cause errors to verify error handling.

---

### Test 6: Run All Tests
**File:** `test-all.ts`

Runs all tests sequentially and provides a summary report.

**Run:**
```bash
pnpm --filter @runapi.ai/nano-banana test:all

# Or using the shortcut
pnpm --filter @runapi.ai/nano-banana test:manual
```

**Expected output:**
```
🧪 Running Nano-Banana SDK Test Suite
============================================================

[1/5] Base Model Generation...
✅ PASSED (15.3s)

[2/5] Pro Model Generation...
✅ PASSED (42.1s)

[3/5] Image Edit...
✅ PASSED (12.7s)

[4/5] Polling Mechanism...
✅ PASSED (25.4s)

[5/5] Error Handling...
✅ PASSED (3.2s)

============================================================
📊 Test Summary
============================================================
✅ [1/5] Base Model Generation (15.3s)
✅ [2/5] Pro Model Generation (42.1s)
✅ [3/5] Image Edit (12.7s)
✅ [4/5] Polling Mechanism (25.4s)
✅ [5/5] Error Handling (3.2s)

============================================================
Total Tests: 5
Passed: 5
Failed: 0
Success Rate: 100%
Total Duration: 98.7s
============================================================

🎉 All tests passed!
```

---

## 📊 Test Results Checklist

After running tests, verify:

### Base Model Tests
- [ ] Task created with valid ID
- [ ] Status transitions: processing → completed
- [ ] `result_urls` contains valid image URLs
- [ ] Generated images are accessible

### Pro Model Tests
- [ ] Accepts `aspect_ratio` parameter
- [ ] Accepts `resolution` parameter (1K, 2K, 4K)
- [ ] Higher resolution images are larger in file size
- [ ] Pro model produces higher quality images

### Edit Tests
- [ ] Accepts `image_urls` array
- [ ] Edit transformations match the prompt
- [ ] Output format can be changed (png, jpeg)
- [ ] Multiple image editImage work

### Polling Tests
- [ ] Poll interval is approximately 2 seconds
- [ ] Polling stops immediately when task completes
- [ ] Timeout protection works (max 5 minutes)
- [ ] No unnecessary polls after completion

### Error Tests
- [ ] Missing API key throws error
- [ ] Invalid token returns authentication error
- [ ] Network errors are caught properly
- [ ] Validation errors show helpful messages
- [ ] Type guards work (`instanceof AuthenticationError`)

---

## 🐛 Troubleshooting

### "API key is required" Error
```bash
# Make sure you've exported the API key
echo $RUNAPI_API_KEY

# If empty, export it:
export RUNAPI_API_KEY="your-token"
```

### "Connection refused" Error
```bash
# Check if Rails server is running
curl http://localhost:3000/api/v1/me

# If not running, start it:
bin/dev
```

### "Insufficient creditImage" Error
```bash
# Check your creditImage in Rails console
bin/rails console
> User.first.account.creditImage
```

### "Task timeout" Error
```bash
# Check backend logs for errors
tail -f log/development.log

# Check if Google Nano Banana channel is active
bin/rails console
> Channel.where(provider: Provider.find_by(name: 'Google')).active
```

### Tests taking too long
- Pro model and 4K generation take longer (30-60 seconds)
- Polling tests intentionally wait for completion
- Use `example:base` for quick verification

---

## 💡 Tips for Effective Testing

1. **Start with base model tests** - Quickest way to verify basic functionality
2. **Check creditImage before Pro tests** - Pro model consumes more creditImage
3. **Use DEBUG=true for troubleshooting** - Shows detailed error information
4. **Test with real images** - Use TEST_IMAGE_URL for edit tests
5. **Monitor backend logs** - `tail -f log/development.log` while testing
6. **Verify generated images** - Click the result URLs to check quality

---

## 🎯 Quick Start

**Minimal setup to run tests:**

```bash
# 1. Start Rails server (in one terminal)
bin/dev

# 2. Configure .env file (in another terminal)
cd sdk/js/packages/nano-banana/manual-tests
cp .env.example .env

# 3. Get API Key and add to .env
echo "RUNAPI_API_KEY=$(bin/rails runner 'puts ApiToken.first.token')" >> .env

# 4. Run base model test (quick verification)
cd ../../  # Back to sdk/js
pnpm --filter @runapi.ai/nano-banana test:base

# 5. Run all tests (full verification)
pnpm --filter @runapi.ai/nano-banana test:all
```

---

## 📝 Test Reports

After running tests, you can create a test report:

```markdown
# Nano-Banana SDK Test Report

**Date:** 2026-01-05
**Tester:** Your Name
**SDK Version:** 0.1.0
**Environment:** Development (localhost:3000)

## Test Results

✅ Base Model Generation - PASSED (15.3s)
✅ Pro Model Generation - PASSED (42.1s)
✅ Image Edit - PASSED (12.7s)
✅ Polling Mechanism - PASSED (25.4s)
✅ Error Handling - PASSED (3.2s)

## Sample Generated Images

- Base model (16:9): https://...
- Pro model (4K): https://...
- Edit result: https://...

## Issues Found

None

## Conclusion

SDK is ready for production use.
```

---

## 🚀 Next Steps

Once all tests pass:

1. ✅ SDK implementation is validated
2. ✅ Ready for integration into `@runapi.ai/nano-banana` package
3. ✅ Can be published to npm
4. ✅ Ready for production use

For any issues or questions, please check:
- Backend logs: `log/development.log`
- Bruno API tests: `bruno/nano-banana/`
- API documentation: `docs/`
