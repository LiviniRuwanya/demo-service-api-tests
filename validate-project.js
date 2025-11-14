// Project Validation Script
// This script checks if all project files are properly formatted and configured

const fs = require('fs');
const path = require('path');

let errors = [];
let warnings = [];

console.log('🔍 Validating API Test Suite Project...\n');

// Check if required files exist
const requiredFiles = [
    'postman-collection.json',
    'postman-environment.json',
    'package.json',
    '.github/workflows/api-tests.yml',
    'README.md',
    '.gitignore'
];

console.log('Checking required files...');
requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`   ${file}`);
    } else {
        console.log(`   ${file} - MISSING`);
        errors.push(`Missing required file: ${file}`);
    }
});

// Validate JSON files
console.log('\n Validating JSON files...');

function validateJSON(filePath, fileName) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const parsed = JSON.parse(content);
        console.log(`   ${fileName} - Valid JSON`);
        return parsed;
    } catch (error) {
        console.log(`   ${fileName} - Invalid JSON: ${error.message}`);
        errors.push(`${fileName}: ${error.message}`);
        return null;
    }
}

const collection = validateJSON('postman-collection.json', 'postman-collection.json');
const environment = validateJSON('postman-environment.json', 'postman-environment.json');
const packageJson = validateJSON('package.json', 'package.json');

// Validate Postman Collection structure
if (collection) {
    console.log('\n Validating Postman Collection structure...');
    
    if (!collection.info) {
        errors.push('Postman collection missing "info" section');
    } else {
        console.log(`  Collection name: ${collection.info.name}`);
    }
    
    if (!collection.item || !Array.isArray(collection.item)) {
        errors.push('Postman collection missing "item" array');
    } else {
        console.log(`  Found ${collection.item.length} test groups`);
        
        // Count total requests
        let requestCount = 0;
        function countRequests(items) {
            items.forEach(item => {
                if (item.request) {
                    requestCount++;
                }
                if (item.item && Array.isArray(item.item)) {
                    countRequests(item.item);
                }
            });
        }
        countRequests(collection.item);
        console.log(`  Found ${requestCount} API test requests`);
    }
}

// Validate Environment file
if (environment) {
    console.log('\n Validating Environment configuration...');
    
    if (!environment.values || !Array.isArray(environment.values)) {
        errors.push('Environment file missing "values" array');
    } else {
        const baseUrl = environment.values.find(v => v.key === 'base_url');
        if (baseUrl) {
            console.log(`  Base URL configured: ${baseUrl.value}`);
            if (baseUrl.value === 'https://jsonplaceholder.typicode.com') {
                warnings.push('Using default test API. Some endpoints may not match (e.g., /health, /api/products). Update base_url for your actual API.');
            }
        } else {
            errors.push('Environment file missing "base_url" variable');
        }
    }
}

// Validate package.json
if (packageJson) {
    console.log('\n Validating package.json...');
    
    if (!packageJson.scripts) {
        errors.push('package.json missing "scripts" section');
    } else {
        const requiredScripts = ['test', 'test:ci'];
        requiredScripts.forEach(script => {
            if (packageJson.scripts[script]) {
                console.log(`  Script "${script}" found`);
            } else {
                errors.push(`package.json missing script: ${script}`);
            }
        });
    }
    
    if (!packageJson.devDependencies) {
        errors.push('package.json missing "devDependencies" section');
    } else {
        if (packageJson.devDependencies.newman) {
            console.log(`  Newman dependency: ${packageJson.devDependencies.newman}`);
        } else {
            errors.push('package.json missing "newman" dependency');
        }
    }
}

// Validate GitHub Actions workflow
console.log('\n Validating GitHub Actions workflow...');
try {
    const workflowContent = fs.readFileSync('.github/workflows/api-tests.yml', 'utf8');
    
    if (workflowContent.includes('name: API Test Suite')) {
        console.log('  Workflow name found');
    }
    
    if (workflowContent.includes('npm run test:ci') || workflowContent.includes('newman run')) {
        console.log('  Test command found');
    } else {
        warnings.push('GitHub Actions workflow may not be calling the correct test command');
    }
    
    if (workflowContent.includes('--env-var') || workflowContent.includes('BASE_URL')) {
        console.log('  Environment variable handling configured');
    }
    
    if (workflowContent.includes('actions/upload-artifact')) {
        console.log(' Artifact upload configured');
    }
    
    console.log('  Workflow file is readable');
} catch (error) {
    errors.push(`GitHub Actions workflow: ${error.message}`);
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('VALIDATION SUMMARY');
console.log('='.repeat(50));

if (errors.length === 0 && warnings.length === 0) {
    console.log('\n All checks passed! Project is properly configured.\n');
    process.exit(0);
} else {
    if (warnings.length > 0) {
        console.log('\n  WARNINGS:');
        warnings.forEach(warning => console.log(`  • ${warning}`));
    }
    
    if (errors.length > 0) {
        console.log('\n ERRORS:');
        errors.forEach(error => console.log(`  • ${error}`));
        console.log('\n Validation failed. Please fix the errors above.\n');
        process.exit(1);
    } else {
        console.log('\n No critical errors. Project should work, but review warnings above.\n');
        process.exit(0);
    }
}

