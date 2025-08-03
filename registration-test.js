#!/usr/bin/env node

// Security and Functionality Test Script for Registration API
// This script tests the registration endpoint security measures and functionality

async function testRegistrationEndpoint() {
  const baseUrl = 'http://localhost:3001'
  
  console.log('🔐 Testing Registration API Security and Functionality\n')
  
  // Test 1: CSRF Token Protection
  console.log('Test 1: CSRF Token Protection')
  try {
    const response = await fetch(`${baseUrl}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'testpassword123',
        agb: true
      })
    })
    
    if (response.status === 403) {
      console.log('✅ CSRF protection working - registration blocked without token')
    } else {
      console.log('❌ CSRF protection failed - registration allowed without token')
    }
  } catch (error) {
    console.log('❌ Error testing CSRF:', error.message)
  }
  
  // Test 2: Rate Limiting
  console.log('\nTest 2: Rate Limiting (3 attempts per hour)')
  try {
    const promises = []
    for (let i = 0; i < 5; i++) {
      promises.push(
        fetch(`${baseUrl}/api/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName: 'Test',
            lastName: 'User',
            email: `test${i}@example.com`,
            password: 'testpassword123',
            agb: true
          })
        })
      )
    }
    
    const responses = await Promise.all(promises)
    const rateLimited = responses.some(r => r.status === 429)
    
    if (rateLimited) {
      console.log('✅ Rate limiting working - some registration attempts blocked')
    } else {
      console.log('❌ Rate limiting not triggered - all attempts allowed')
    }
  } catch (error) {
    console.log('❌ Error testing rate limiting:', error.message)
  }
  
  // Test 3: Method Protection
  console.log('\nTest 3: Method Protection')
  try {
    const response = await fetch(`${baseUrl}/api/register`, {
      method: 'GET'
    })
    
    if (response.status === 405) {
      console.log('✅ Method protection working - GET request blocked')
    } else {
      console.log('❌ Method protection failed - GET request allowed')
    }
  } catch (error) {
    console.log('❌ Error testing method protection:', error.message)
  }
  
  // Test 4: Input Validation
  console.log('\nTest 4: Input Validation')
  try {
    // Get CSRF token first
    const tokenResponse = await fetch(`${baseUrl}/api/csrf-token`)
    const tokenData = await tokenResponse.json()
    
    if (tokenData.csrfToken) {
      // Test with missing fields
      const response = await fetch(`${baseUrl}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': baseUrl,
        },
        body: JSON.stringify({
          firstName: 'Test',
          // Missing lastName, email, password
          agb: true,
          csrfToken: tokenData.csrfToken
        })
      })
      
      if (response.status === 400) {
        console.log('✅ Input validation working - incomplete data rejected')
      } else {
        console.log('❌ Input validation failed - incomplete data accepted')
      }
    } else {
      console.log('❌ Could not get CSRF token for validation test')
    }
  } catch (error) {
    console.log('❌ Error testing input validation:', error.message)
  }
  
  // Test 5: Email Format Validation
  console.log('\nTest 5: Email Format Validation')
  try {
    // Get CSRF token first
    const tokenResponse = await fetch(`${baseUrl}/api/csrf-token`)
    const tokenData = await tokenResponse.json()
    
    if (tokenData.csrfToken) {
      // Test with invalid email
      const response = await fetch(`${baseUrl}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': baseUrl,
        },
        body: JSON.stringify({
          firstName: 'Test',
          lastName: 'User',
          email: 'invalid-email-format',
          password: 'testpassword123',
          agb: true,
          csrfToken: tokenData.csrfToken
        })
      })
      
      if (response.status === 400) {
        console.log('✅ Email validation working - invalid email rejected')
      } else {
        console.log('❌ Email validation failed - invalid email accepted')
      }
    }
  } catch (error) {
    console.log('❌ Error testing email validation:', error.message)
  }
  
  // Test 6: Password Length Validation
  console.log('\nTest 6: Password Length Validation')
  try {
    // Get CSRF token first
    const tokenResponse = await fetch(`${baseUrl}/api/csrf-token`)
    const tokenData = await tokenResponse.json()
    
    if (tokenData.csrfToken) {
      // Test with short password
      const response = await fetch(`${baseUrl}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': baseUrl,
        },
        body: JSON.stringify({
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          password: '123', // Too short
          agb: true,
          csrfToken: tokenData.csrfToken
        })
      })
      
      if (response.status === 400) {
        console.log('✅ Password validation working - short password rejected')
      } else {
        console.log('❌ Password validation failed - short password accepted')
      }
    }
  } catch (error) {
    console.log('❌ Error testing password validation:', error.message)
  }
  
  console.log('\n🔐 Registration API test completed!')
  console.log('\n📝 Note: These tests check security measures but do not create actual accounts.')
  console.log('For full functionality testing, ensure your backend API is properly configured.')
}

// Run the tests
testRegistrationEndpoint().catch(console.error)
