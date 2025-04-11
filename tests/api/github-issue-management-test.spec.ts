import { test, expect } from '@playwright/test';

test.describe('GitHub Issues API Tests', () => {
  // API endpoints and configuration
  const GITHUB_API_URL = 'https://api.github.com';
  const REPO_OWNER = 'sbahrim';
  const REPO_NAME = 'appgreat-task';
  const ISSUES_ENDPOINT = `${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/issues`;
  
  let createdIssueNumber: number;
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

  const getHeaders = (requiresAuth = false) => {
    const headers = {
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    };
    
    if (requiresAuth && GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
    }
    
    return headers;
  };

  test('Retrieve the list of issues from the repository', async ({ request }) => {

    // Send request to get issues
    const response = await request.get(ISSUES_ENDPOINT, {
      headers: getHeaders()
    });
    
    // Verify response status
    expect(response.status()).toBe(200);
    
    // Parse and validate response body
    const issues = await response.json();
    
    // Verify we got an array of issues
    expect(Array.isArray(issues)).toBeTruthy();
    expect(issues.length).toBeGreaterThanOrEqual(0);
    
    // Verify structure of the first issue

    if (issues.length > 0) {
      console.log('Issues found in the repository:', issues)
      const firstIssue = issues[0];
      expect(firstIssue).toHaveProperty('id');
      expect(firstIssue).toHaveProperty('number');
      expect(firstIssue).toHaveProperty('title');
      expect(firstIssue).toHaveProperty('state');
      expect(firstIssue).toHaveProperty('body');
      console.log('Issues from GET response have the expected structure');
      
    } else {
      console.log('No issues found in the repository.');
      return;
    }
    
  });

  test('Create a new issue, retrieve it, and close it', async ({ request }) => {
    // test.skip(!GITHUB_TOKEN, 'This test requires a GitHub token');
    
    // Create a unique issue title
    const issueTitle = `Test Issue - ${Date.now()}`;
    const issueBody = 'This is a test issue from Sergiu Bahrim';
    
    //Create a new issue
    const createResponse = await request.post(ISSUES_ENDPOINT, {
      headers: getHeaders(true),
      data: {
        title: issueTitle,
        body: issueBody
      }
    });
    
    // Verify successful creation
    expect(createResponse.status()).toBe(201);
    const createdIssue = await createResponse.json();
    createdIssueNumber = createdIssue.number;
    console.log('Newly created issue is:', createdIssueNumber);
    
    // Verify the created issue has correct data
    expect(createdIssue.title).toBe(issueTitle);
    expect(createdIssue.body).toBe(issueBody);
    expect(createdIssue.state).toBe('open');
    
    //Retrieve the created issue by number
    const getResponse = await request.get(`${ISSUES_ENDPOINT}/${createdIssueNumber}`, {
      headers: getHeaders(true)
    });
    
    expect(getResponse.status()).toBe(200);
    const retrievedIssue = await getResponse.json();
   
    
    // Verify the issue was created as expected
    expect(retrievedIssue.number).toBe(createdIssueNumber);
    expect(retrievedIssue.title).toBe(issueTitle);
    expect(retrievedIssue.body).toBe(issueBody);
    console.log('New issue was created as expected');
    
    // Step 3: Close the issue
    const closeResponse = await request.patch(`${ISSUES_ENDPOINT}/${createdIssueNumber}`, {
      headers: getHeaders(true),
      data: {
        state: 'closed'
      }
    });
    
    expect(closeResponse.status()).toBe(200);
    
    const closedIssue = await closeResponse.json();
    expect(closedIssue.state).toBe('closed');
    
    // Step 4: Verify the issue is closed by retrieving it again
    const verifyClosedResponse = await request.get(`${ISSUES_ENDPOINT}/${createdIssueNumber}`, {
      headers: getHeaders()
    });
    
    const verifiedIssue = await verifyClosedResponse.json();
    expect(verifiedIssue.state).toBe('closed');
    console.log('Issue was succesfully closed');
  });
  
  test('Vaildate error when creating an issue with missing required fields', async ({ request }) => {
    test.skip(!GITHUB_TOKEN, 'This test requires a GitHub token');
    
    // Attempt to create an issue without a title (required field)
    const response = await request.post(ISSUES_ENDPOINT, {
      headers: getHeaders(true),
      data: {
        body: 'This issue has no title, which should cause an error'
      }
    });
    
    // Verify the 422 Unprocessable Entity error response
    expect(response.status()).toBe(422);
    
    // Verify the expected error response body is returned
    const errorBody = await response.json();
    expect(errorBody).toHaveProperty('message');
    expect(errorBody.message).toContain('Invalid request.');
    expect(errorBody).toHaveProperty('status');
    expect(errorBody.status).toBe('422');
    console.log(`Request failed as expected due to error: ${errorBody.status} : ${errorBody.message}`);
  });

  test('Vaildate error when creating an issue with invalid fields', async ({ request }) => {
    test.skip(!GITHUB_TOKEN, 'This test requires a GitHub token');
    
    // Attempt to create an issue without a title (required field)
    const response = await request.post(ISSUES_ENDPOINT, {
      headers: getHeaders(true),
      data: 'invalid issue field'
    });
    
    // Verify the 400 Bad Request error response
    expect(response.status()).toBe(400);
    
    // Verify the expected error response body is returned
    const errorBody = await response.json();
    expect(errorBody).toHaveProperty('message');
    expect(errorBody.message).toContain('Problems parsing JSON');
    expect(errorBody).toHaveProperty('status');
    expect(errorBody.status).toBe('400');
    console.log(`Request failed as expected due to error: ${errorBody.status} : ${errorBody.message}`);
  });
  
  test('Validate error when accessing a non-existent issue', async ({ request }) => {

    // Try to access an issue with a very large number (unlikely to exist)
    const nonExistentIssueId = 999999999;
    
    const response = await request.get(`${ISSUES_ENDPOINT}/${nonExistentIssueId}`, {
        headers: getHeaders()
    });
    
    // Verify the 404 Not Found status
    expect(response.status()).toBe(404);
    
     // Verify the expected error response body is returned
    const errorBody = await response.json();
    expect(errorBody).toHaveProperty('message');
    expect(errorBody.message).toContain('Not Found');
    expect(errorBody.status).toBe('404');
    console.log(`Request failed as expected due to error: ${errorBody.status} : ${errorBody.message}`);
});
});