const http = require("http");
const express = require('express')
const multer = require('multer')

const app = express()
app.use(express.json());

// Sample array of JSON objects
const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com' },
    { id: 4, name: 'Alice Williams', email: 'alice@example.com' },
    { id: 5, name: 'Charlie Brown', email: 'charlie@example.com' }
];

// Log the array directly
console.log("Users array:", users);

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' })
 
app.get('/',(req,res)=>{
    console.log("request received")
    res.send("response received from server");
})

app.get('/postMessage', (req, res) => {
    let message = req.query.message;
    message = JSON.parse(message);
    console.log(message[0].name);
    res.json({ status: 'Message received' });
});

app.post('/api/students', (req, res) => {
    const { students, email, userEmail } = req.body;
    
    console.log('Students:', students);
    console.log('Email:', email);
    console.log('User Email:', userEmail);
    
    res.json({ 
        status: 'Student data received',
        studentsCount: students ? students.length : 0,
        received: {
            students,
            email,
            userEmail
        }
    });
});

app.post('/api/formdata', upload.single('file'), (req, res) => {
    console.log('Received form-data request');
    
    const email = req.body.email;
    const file = req.file;
    
    console.log('Email from formData:', email);
    
    if (file) {
        console.log('File received:', {
            originalname: file.originalname,
            filename: file.filename,
            size: file.size,
            mimetype: file.mimetype
        });
    } else {
        console.log('No file received');
    }
    
    res.json({
        status: 'Form data received',
        email: email,
        fileReceived: !!file,
        fileInfo: file ? {
            originalname: file.originalname,
            filename: file.filename,
            size: file.size,
            mimetype: file.mimetype
        } : null
    });
});

const myServer = http.createServer(app)

myServer.listen(8000,()=>{
    console.log("server started");
})



// const function1 = async ()  => {

//     // Simulate an asynchronous operation
//     return new Promise((resolve,reject) => {
//         setTimeout(() => {      
//         console.log("Function 1 completed");
//         resolve("Function 1 completed");
//         }, 1000);
//     });
// }


// const function2 = async ()  => {

//     // Simulate an asynchronous operation
//     return new Promise((resolve,reject) => {
//         setTimeout(() => {
//         console.log("Function 2 completed");
//         resolve("Function 2 rejected");
//         }, 100);
//     });
// }

// const function3 = async ()  => {
//     // Simulate an asynchronous operation
//     return new Promise((resolve,reject) => {
//         setTimeout(() => {
//         console.log("Function 3 completed");
//         resolve("Function 3 completed");
//         }, 500);
//     });
// }

// const function4 = async ()  => {
//     // Simulate an asynchronous operation
//     return new Promise((resolve,reject) => {
//         setTimeout(() => {
//         console.log("Function 4 completed");
//         resolve("Function 4 completed");
//         }, 300);
//     });
// }


// const function5 = async ()  => {
//     // Simulate an asynchronous operation
//     return new Promise((resolve,reject) => {
//         setTimeout(() => {
//         console.log("Function 5 completed");
//         resolve("Function 5 completed");
//         }, 300);
//     });
// }


// const main = async () => {
//     try {
//         const startTime = Date.now();
//         // Start all functions without awaiting
//         const promises = [
//             function1(),
//             function2(),
//             function3(),
//             function4(),
//             function5()
//         ];
//         // Await all promises to ensure main waits for all to finish
//         await Promise.all(promises);
//        const duration = Date.now() - startTime;
//         console.log(`Message processed in ${duration}ms`);
//     } catch (error) {
//         console.error("Error in function3, function4, or function5:", error);
//     }
// }

// main().then(() => {
//     console.log("All functions completed successfully");
// }).catch((error) => {
//     console.error("Error in main function:", error);
// });