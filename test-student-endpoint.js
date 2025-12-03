const axios = require('axios');

// Test data for the student endpoint
const testData = {
    students: [
        { id: 1, name: 'John Doe', grade: 'A' },
        { id: 2, name: 'Jane Smith', grade: 'B' },
        { id: 3, name: 'Bob Johnson', grade: 'C' }
    ],
    email: 'school@example.com',
    userEmail: 'teacher@school.com'
};

async function testStudentEndpoint() {
    try {
        console.log('Testing POST /api/students endpoint...');
        console.log('Sending data:', JSON.stringify(testData, null, 2));
        
        // Make POST request to the endpoint
        const response = await axios.post('http://localhost:8000/api/students', testData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('\n✅ Request successful!');
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(response.data, null, 2));
        
    } catch (error) {
        console.error('\n❌ Request failed:');
        if (error.response) {
            // The request was made and the server responded with a status code
            console.error('Status:', error.response.status);
            console.error('Response:', error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received:', error.message);
        } else {
            // Something happened in setting up the request
            console.error('Error:', error.message);
        }
    }
}

// Test with different data
async function testMultipleCases() {
    console.log('='.repeat(50));
    console.log('TESTING MULTIPLE SCENARIOS');
    console.log('='.repeat(50));
    
    // Test 1: Normal case
    await testStudentEndpoint();
    
    console.log('\n' + '-'.repeat(30));
    
    // Test 2: Empty students array
    try {
        console.log('Testing with empty students array...');
        const emptyData = {
            students: [],
            email: 'test@example.com',
            userEmail: 'user@test.com'
        };
        
        const response = await axios.post('http://localhost:8000/api/students', emptyData);
        console.log('Empty test response:', response.data);
    } catch (error) {
        console.error('Empty test failed:', error.message);
    }
    
    console.log('\n' + '-'.repeat(30));
    
    // Test 3: Missing fields
    try {
        console.log('Testing with missing fields...');
        const incompleteData = {
            students: [{ id: 1, name: 'Test' }]
            // Missing email and userEmail
        };
        
        const response = await axios.post('http://localhost:8000/api/students', incompleteData);
        console.log('Incomplete data response:', response.data);
    } catch (error) {
        console.error('Incomplete data test failed:', error.message);
    }
}

// Instructions for running the test
console.log('📋 To run this test:');
console.log('1. Make sure your server is running: node index.js');
console.log('2. Install axios if not installed: npm install axios');
console.log('3. Run this test file: node test-student-endpoint.js\n');

// Check if server is running by making a simple request first
async function checkServerAndRun() {
    try {
        await axios.get('http://localhost:8000');
        console.log('✅ Server is running, starting tests...\n');
        await testMultipleCases();
    } catch (error) {
        console.error('❌ Server is not running on http://localhost:8000');
        console.error('Please start the server first with: node index.js');
    }
}

// Run the tests
checkServerAndRun();
