const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Create a sample file for testing
function createSampleFile() {
    const sampleContent = 'This is a sample file for testing form-data upload.';
    const filePath = path.join(__dirname, 'sample-test-file.txt');
    
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, sampleContent);
        console.log('📄 Created sample test file:', filePath);
    }
    
    return filePath;
}

async function testFormDataEndpoint() {
    try {
        console.log('Testing POST /api/formdata endpoint with multipart form-data...');
        
        // Create sample file
        const sampleFilePath = createSampleFile();
        
        // Create form data
        const formData = new FormData();
        formData.append('email', 'test@example.com');
        formData.append('file', fs.createReadStream(sampleFilePath));
        
        console.log('📤 Sending form-data with:');
        console.log('   Email: test@example.com');
        console.log('   File: sample-test-file.txt');
        
        // Make POST request with form-data
        const response = await axios.post('http://localhost:8000/api/formdata', formData, {
            headers: {
                ...formData.getHeaders()
            }
        });
        
        console.log('\n✅ Form-data request successful!');
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(response.data, null, 2));
        
    } catch (error) {
        console.error('\n❌ Form-data request failed:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Response:', error.response.data);
        } else if (error.request) {
            console.error('No response received:', error.message);
        } else {
            console.error('Error:', error.message);
        }
    }
}

async function testFormDataWithoutFile() {
    try {
        console.log('\n' + '-'.repeat(50));
        console.log('Testing form-data without file...');
        
        // Create form data with only email
        const formData = new FormData();
        formData.append('email', 'no-file@example.com');
        
        const response = await axios.post('http://localhost:8000/api/formdata', formData, {
            headers: {
                ...formData.getHeaders()
            }
        });
        
        console.log('✅ Request without file successful!');
        console.log('Response:', response.data);
        
    } catch (error) {
        console.error('❌ Request without file failed:', error.message);
    }
}

async function testFormDataWithoutEmail() {
    try {
        console.log('\n' + '-'.repeat(50));
        console.log('Testing form-data without email...');
        
        const sampleFilePath = createSampleFile();
        
        // Create form data with only file
        const formData = new FormData();
        formData.append('file', fs.createReadStream(sampleFilePath));
        
        const response = await axios.post('http://localhost:8000/api/formdata', formData, {
            headers: {
                ...formData.getHeaders()
            }
        });
        
        console.log('✅ Request without email successful!');
        console.log('Response:', response.data);
        
    } catch (error) {
        console.error('❌ Request without email failed:', error.message);
    }
}

async function testWithDifferentFileTypes() {
    try {
        console.log('\n' + '-'.repeat(50));
        console.log('Testing with different file types...');
        
        // Test with JSON file
        const jsonData = { test: 'data', number: 123 };
        const jsonFilePath = path.join(__dirname, 'test-data.json');
        fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2));
        
        const formData = new FormData();
        formData.append('email', 'json-test@example.com');
        formData.append('file', fs.createReadStream(jsonFilePath), 'test-data.json');
        
        const response = await axios.post('http://localhost:8000/api/formdata', formData, {
            headers: {
                ...formData.getHeaders()
            }
        });
        
        console.log('✅ JSON file upload successful!');
        console.log('Response:', JSON.stringify(response.data, null, 2));
        
        // Clean up
        fs.unlinkSync(jsonFilePath);
        
    } catch (error) {
        console.error('❌ JSON file test failed:', error.message);
    }
}

// Instructions for running the test
console.log('📋 To run this form-data test:');
console.log('1. Make sure your server is running: node index.js');
console.log('2. Install dependencies: npm install');
console.log('3. Run this test file: node test-formdata-endpoint.js\n');

// Check if server is running
async function checkServerAndRun() {
    try {
        await axios.get('http://localhost:8000');
        console.log('✅ Server is running, starting form-data tests...\n');
        
        await testFormDataEndpoint();
        await testFormDataWithoutFile();
        await testFormDataWithoutEmail();
        await testWithDifferentFileTypes();
        
        console.log('\n' + '='.repeat(50));
        console.log('🎉 All form-data tests completed!');
        console.log('📁 Check the "uploads/" folder for uploaded files');
        
    } catch (error) {
        console.error('❌ Server is not running on http://localhost:8000');
        console.error('Please start the server first with: node index.js');
    }
}

// Run the tests
checkServerAndRun();
