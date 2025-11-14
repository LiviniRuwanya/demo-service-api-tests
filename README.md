

# API Test Suite for Demo Service

## Project Overview

This project is designed to test whether a website or application works correctly. It is similar to having a tool that automatically checks your work for mistakes. The purpose of this project is to make sure that APIs, which are ways for programs to communicate with each other, function properly.

The project was completed in one day and focuses on automated API testing.

---

## Project Goals

1. **Automated Tests**

   * Created tests using Postman.
   * Verified that APIs respond correctly, provide the correct data, and perform quickly.

2. **GitHub Actions Integration**

   * Set up GitHub Actions to automatically run tests when code is updated.
   * This ensures that any changes are checked immediately for errors.

3. **Test Reports and Logs**

   * When a test fails, a detailed report is generated to identify the problem.
   * Reports are saved for future reference and analysis.

**What We Built:**

* A collection of API tests
* Automatic testing whenever code is updated in GitHub
* Reports showing which tests passed or failed
* Logs that help locate issues

---

## Project Structure

```
.
├── postman-collection.json      # Collection of all tests
├── postman-environment.json     # Test settings
├── package.json                 # List of tools and dependencies
├── .github/
│   └── workflows/
│       └── api-tests.yml        # Instructions for GitHub Actions
└── README.md                    # Project documentation
```

---

## Getting Started

### Requirements

* **Node.js** – Allows your computer to run JavaScript programs.
* **npm** – A tool to install the required libraries and tools.
* **Git** – Used to manage code versions and share projects.

### Setup Instructions

1. Install the necessary tools by opening the terminal and running:

```bash
npm install
```

2. Set your website address by editing `postman-environment.json`:

```json
{
  "base_url": "https://your-website-address.com"
}
```

---

## Running the Tests

### Recommended Method

Run the following command to execute all tests and generate a report:

```bash
npm test
```

### Other Options

* Run tests in CI mode for GitHub:

```bash
npm run test:ci
```

* Display detailed test information:

```bash
npm run test:verbose
```

---

## Types of Tests

1. **Health Check Test**

   * Verifies that the website is accessible.

2. **User Tests**

   * Get all users
   * Create a user
   * Get one user
   * Check error handling for invalid requests

3. **Product Tests**

   * Get all products
   * Create a product

Each test checks:

* Status code of the response
* Response time
* Correct data format
* Presence of required fields

---

## GitHub Actions Integration

GitHub Actions is used to automatically run tests when:

* Code is pushed to GitHub
* A pull request is created
* Tests are manually triggered

**Process:**

1. GitHub retrieves the project code
2. Installs required tools
3. Runs all tests
4. Generates reports showing pass/fail results

**Setup Instructions:**

1. Go to your GitHub repository settings
2. Navigate to "Secrets and variables" → "Actions"
3. Add a secret called `BASE_URL` with your website address

If no secret is set, a default test website will be used.

---

## Test Reports

After running tests, the following reports are available:

* `newman-report.html` – Can be opened in a web browser
* `newman-report.json` – Machine-readable report
* `newman-report.xml` – Compatible with other testing tools

Reports include:

* Passed and failed tests
* Duration of each test
* Details of what was tested
* Error messages if any tests failed

---

## Adding New Tests

To add your own tests:

1. Open `postman-collection.json`
2. Add a new test inside the `item` section. Example:

```json
{
  "name": "My New Test",
  "event": [
    {
      "listen": "test",
      "script": {
        "exec": [
          "pm.test(\"Status code is 200\", function () {",
          "    pm.response.to.have.status(200);",
          "});"
        ]
      }
    }
  ],
  "request": {
    "method": "GET",
    "url": "{{base_url}}/your-endpoint"
  }
}
```

---

## Troubleshooting

**Tests not working locally:**

* Check if the website is running
* Verify the website address in `postman-environment.json`
* Use `npm run test:verbose` for detailed information

**Tests not working on GitHub:**

* Check the "Actions" tab for logs
* Download reports for details
* Ensure the `BASE_URL` secret is correctly set

---

## Glossary

* **API:** A system that allows programs to communicate
* **Postman:** A tool to test APIs
* **Newman:** Command-line version of Postman
* **GitHub Actions:** Tool to automate tasks in GitHub
* **CI/CD:** Automatic testing and deployment
* **Endpoint:** A specific URL for a service, such as `/users`

---

## License

This project uses the MIT License, so anyone can use, modify, or share it freely.

---

## Contributing

1. Fork the project
2. Create a new branch
3. Add new tests
4. Submit a pull request

---

This project demonstrates the importance of automated testing to detect errors early and ensure software works as intended.

---

