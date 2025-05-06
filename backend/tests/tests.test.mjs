// Simple API test file
import { describe, it, before, after } from 'node:test'
import assert from 'node:assert'
import fetch from 'node-fetch'
import { PrismaClient } from '@prisma/client'

const API_BASE_URL = 'http://localhost:8080'

const client = new PrismaClient()

let testFormDataId;
let createdQueryId;
const fakeQueryId = '0'*32;

// Runs before all the test cases and creates
// test data in the formData table we will
// use for simple tests
before(async () => {
  console.log('Setting up test data before all tests')
  const testFormData = await client.formData.create({
    data: {
      question: 'Question for API Test',
      answer: 'Answer for API Test',
    },
  })
  testFormDataId = testFormData.id
  console.log(`Created test form data with ID: ${testFormDataId}`)
})

// Runs after all test cases and deletes the
// test data that we created in the formData table
// and any queries it might have
after(async () => {
  console.log('Cleaning up test data after all tests')
  if (createdQueryId) {
    try {
      await client.query.delete({
        where: { id: createdQueryId },
      })
      console.log(`Deleted test query with ID: ${createdQueryId}`)
    } catch (err) {
      console.log(`Error deleting test query: ${err.message}`)
    }
  }
  if (testFormDataId) {
    try {
      await client.query.deleteMany({
        where: { formDataId: testFormDataId },
      })
      await client.formData.delete({
        where: { id: testFormDataId },
      })
      console.log(`Deleted test form data with ID: ${testFormDataId}`)
    } catch (err) {
      console.log(`Error deleting test form data: ${err.message}`)
    }
  }
  await client.$disconnect()
  console.log('Test cleanup complete')
})

describe('API Tests', () => {

  // Test 1:
  // Test that we can successfully create a query
  it('1. POST /query creates a new query successfully', async () => {
    const queryData = {
      title: 'Test Query',
      description: 'This is a test query for integration testing',
      formDataId: testFormDataId,
    }
    const response = await fetch(`${API_BASE_URL}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(queryData),
    })
    assert.strictEqual(
      response.status,
      201,
      'Expected status code 201 for query creation'
    )
    const data = await response.json()
    createdQueryId = data.data.id
    console.log('Test data:', data)
    assert.strictEqual(
      data.data.title,
      queryData.title,
      'Query title did not match expected title.'
    )
    assert.strictEqual(
      data.data.description,
      queryData.description,
      'Query description did not match expected description.'
    )
    assert.strictEqual(data.data.status, 'OPEN', 'Query status was not OPEN')
    assert.ok(createdQueryId, 'Failed to get ID of created query')
  })

  // Test 2:
  // Test that if a query exists on a form data we cannot create another
  it('2. This test is for POST /query, fails to create new query since form data already has query', async () => {
    const queryData = {
      title: 'Test Query',
      description: 'This is a test query for integration testing',
      formDataId: testFormDataId,
    }
    const response = await fetch(`${API_BASE_URL}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(queryData),
    })
    assert.strictEqual(
      response.status,
      400,
      'Expected status code 400 for failed query creation'
    )
  })

  // Test 3:
  // Test we can edit a query
  it('3. PUT /query/:id updates a query status successfully', async () => {
    assert.ok(createdQueryId, 'No query ID available for update test')
    const updateData = {
      title: 'Updated Query Title',
      description: 'This is to test updating the query title',
      status: 'RESOLVED',
    }
    const response = await fetch(`${API_BASE_URL}/query/${createdQueryId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    })
    assert.strictEqual(
      response.status,
      200,
      'Expected status code 200 for query update'
    )
    const data = await response.json()
    assert.strictEqual(
      data.data.title,
      updateData.title,
      'Query title did not match expected title.'
    )
    assert.strictEqual(
      data.data.description,
      updateData.description,
      'Query description did not match expected description.'
    )
    assert.strictEqual(
      data.data.status,
      'RESOLVED',
      'Query status was not updated to RESOLVED'
    )
  })

  // Test 4:
  // Test we cannot edit a query that does not exist
  it('4. Test is for PUT /query/:id fails to updates a query that doesnt exist', async () => {
    assert.ok(createdQueryId, 'No query ID available for update test')
    const updateData = {
      title: 'Updated Query Title',
      description: 'This is to test updating the query title',
      status: 'RESOLVED',
    }
    const response = await fetch(`${API_BASE_URL}/query/${fakeQueryId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    })
    assert.strictEqual(
      response.status,
      400,
      'Expected status code 400 for failed query update'
    )
  })

  // Test 5:
  // Test we can delete a query
  it('5. DELETE /query/:id deletes a query successfully', async () => {
    assert.ok(createdQueryId, 'No query ID available for delete test')
    const response = await fetch(`${API_BASE_URL}/query/${createdQueryId}`, {
      method: 'DELETE',
    })
    assert.strictEqual(
      response.status,
      204,
      'Expected status code 204 for query deletion'
    )
    createdQueryId = null;
  })

  // Test 6:
  // Test we can successfully use the form data get request
  it('6. GET /form-data returns form data with status 200', async () => {
    const response = await fetch(`${API_BASE_URL}/form-data`);
    assert.strictEqual(response.status, 200);
  });
})
