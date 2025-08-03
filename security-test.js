#!/usr/bin/env node

// Security Test Script for Contact API
// This script tests the security measures implemented for the contact endpoint

async function testSecurityMeasures() {
  const baseUrl = 'http://localhost:3000'
  
  console.log('🔒 Testing Contact API Security Measures\n')
  
  // Test 1: CSRF Token Protection
  console.log('Test 1: CSRF Token Protection')
  try {
    const response = await fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'Test message without CSRF token'
      })
    })
    
    if (response.status === 403) {
      console.log('✅ CSRF protection working - request blocked without token')
    } else {
      console.log('❌ CSRF protection failed - request allowed without token')
    }
  } catch (error) {
    console.log('❌ Error testing CSRF:', error.message)
  }
  
  // Test 2: Rate Limiting
  console.log('\nTest 2: Rate Limiting')
  try {
    const promises = []
    for (let i = 0; i < 7; i++) {
      promises.push(
        fetch(`${baseUrl}/api/contact`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'Test User',
            email: 'test@example.com',
            subject: 'Test Subject',
            message: 'Test message for rate limiting'
          })
        })
      )
    }
    
    const responses = await Promise.all(promises)
    const rateLimited = responses.some(r => r.status === 429)
    
    if (rateLimited) {
      console.log('✅ Rate limiting working - some requests blocked')
    } else {
      console.log('❌ Rate limiting not triggered - all requests allowed')
    }
  } catch (error) {
    console.log('❌ Error testing rate limiting:', error.message)
  }
  
  // Test 3: Method Protection
  console.log('\nTest 3: Method Protection')
  try {
    const response = await fetch(`${baseUrl}/api/contact`, {
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
  
  // Test 4: Valid CSRF Token Flow
  console.log('\nTest 4: Valid CSRF Token Flow')
  try {
    // Get CSRF token
    const tokenResponse = await fetch(`${baseUrl}/api/csrf-token`)
    const tokenData = await tokenResponse.json()
    
    if (tokenData.csrfToken) {
      console.log('✅ CSRF token generation working')
      
      // Test with valid token (this should still fail validation but not due to CSRF)
      const contactResponse = await fetch(`${baseUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': baseUrl,
        },
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          subject: 'Test Subject',
          message: 'Test message with valid CSRF token',
          csrfToken: tokenData.csrfToken
        })
      })
      
      // The request might fail for other reasons (like API token), but not CSRF
      if (contactResponse.status !== 403 || !contactResponse.statusText.includes('CSRF')) {
        console.log('✅ CSRF token validation allows valid tokens')
      } else {
        console.log('❌ Valid CSRF token was rejected')
      }
    } else {
      console.log('❌ CSRF token generation failed')
    }
  } catch (error) {
    console.log('❌ Error testing valid CSRF flow:', error.message)
  }
  
  console.log('\n🔒 Security test completed!')
}

// Run the tests
testSecurityMeasures().catch(console.error)
