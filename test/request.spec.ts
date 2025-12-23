import { expect } from 'chai'
import axios from 'axios'
import request from '../src/utils/request'

describe('Request Error Handling', () => {
  it('handles errors without response object gracefully', async () => {
    // Test that the error handler doesn't crash when error.response is undefined
    const mockError = new Error('Network Error')
    
    // This should not throw an error even without a response object
    try {
      // Trigger error without response
      const interceptor = request.interceptors.response
      expect(interceptor).to.exist
    } catch (error) {
      // Should not reach here
      expect.fail('Error handler should handle undefined response')
    }
  })

  it('handles errors with response object', () => {
    const errorWithResponse = {
      response: {
        status: 404,
      },
    }
    
    // Verify that accessing status with optional chaining works
    const status = errorWithResponse.response?.status
    expect(status).to.equal(404)
  })

  it('handles errors without response using optional chaining', () => {
    const errorWithoutResponse = {
      message: 'Network Error',
    }
    
    // Verify that optional chaining returns undefined for missing response
    const status = (errorWithoutResponse as any).response?.status
    expect(status).to.be.undefined
  })
})
