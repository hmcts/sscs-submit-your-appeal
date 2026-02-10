# SSCS - Submit Your Appeal

A web application that allows appellants to submit appeals online to the Social Security and Child Support (SSCS) tribunal. The application follows GDS guidelines, presenting a single question per page and guiding users through their appeal journey.

## Table of Contents
- [Background](#background)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Development](#development)
- [Testing](#testing)
- [Docker](#docker)
- [Useful Commands](#useful-commands)

## Background

Anyone who disagrees with a decision about their entitlement to benefits has the right to appeal against that decision. The first step is asking the Department for Work and Pensions to look at the decision again (known as requesting 'Mandatory Reconsideration'). If they still disagree, they can appeal to the Social Security and Child Support tribunal.

This application takes appellants on a journey, presenting a single question per page, and concludes with an appeal summary page where users can review, edit, sign, and submit their appeal.

## Prerequisites

- **Node.js** (>=18.0.0) - [Download here](https://nodejs.org/en)
- **Yarn** (>=1.22.0) - [Installation guide](https://yarnpkg.com/)
- **Docker** - For [sscs-tribunals-case-api](https://github.com/hmcts/sscs-tribunals-case-api/)
- **Redis** - For session storage
  - Install via package manager: `brew install redis` (macOS) or `apt-get install redis-server` (Ubuntu)
  - **NOTE**: If you cannot install redis with a package manager see **Install Redis without package manager** at the end of this README.
  - Or use Docker (see Docker section below)

## Quick Start

1. **Install dependencies:**
   ```bash
   yarn install
   ```

2. **Start Redis:**
   ```bash
   redis-server
   ```
   Or use Docker: `docker-compose up redis`

3. **Start the application:**
   - For SYA: `yarn dev`
   - For IBA appeals: `yarn iba:dev`

4. **View the application:**
   - URL: `https://localhost:3000`

## Development

### Configuration

The application requires Redis for session storage and the [sscs-tribunals-case-api](https://github.com/hmcts/sscs-tribunals-case-api/) to be running.

### Setup Steps

1. **Install dependencies:**
   ```bash
   yarn install
   ```

2. **Start Redis:**
   ```bash
   redis-server
   ```

3. **Run the API:**
   Start [sscs-tribunals-case-api](https://github.com/hmcts/sscs-tribunals-case-api/) - refer to its README for setup instructions.

4. **Generate cookie banner content:**
   ```bash
   ./node_modules/gulp/bin/gulp.js default
   ```

5. **Start the application:**
   - **SYA:**
     ```bash
     yarn dev
     ```
   - **IBA appeals:**
     ```bash
     yarn iba:dev
     ```
   - **IBA Appeals with AAT Backend:**
     ```bash
     yarn iba:dev:aat
     ```
     This connects to the Azure Acceptance Testing environment for validation.

6. **Access the application:**
   - URL: `https://localhost:3000`

## Testing

### Unit Tests
```bash
yarn test
```

### Code Coverage
```bash
yarn test:coverage
```

### End-to-End Testing

Ensure both SYA and the tribunals case API are running.

**Functional tests (entire journeys):**
```bash
yarn test:functional
```

**Page-specific tests:**
```bash
yarn test:e2e-pages
```

**Functional test batches (improved reliability):**
```bash
yarn test:functional:batches
```

**Faster test execution:**
```bash
E2E_WAIT_FOR_ACTION_VALUE=50 yarn test:functional:batches
```

### Smoke Tests
```bash
yarn test:smoke
```

### Security Audit
```bash
yarn audit
```
To update suppressions
```bash
yarn npm audit --recursive --environment production --json > yarn-audit-known-issues
```

## Docker

### Full Application with Docker

1. **Build the image:**
   ```bash
   docker build -t hmcts/submit-your-appeal:latest .
   ```

2. **Start the application:**
   ```bash
   docker-compose up sya
   ```

3. **Access the application:**
   - URL: `https://localhost:3000`

### Redis Only with Docker

If you prefer to run the application natively but use Docker for Redis:

```bash
docker-compose up redis
```

Then start the application with `yarn dev` or `yarn iba:dev`.

## Useful Commands

### Docker Commands
```bash
# List images
docker images

# List containers
docker ps

# Execute shell on container
docker exec -it <container_id> sh
```

### Development Commands
```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Run tests
yarn test

# Security audit
yarn audit
```

## Notes

- For IBA appeals, use `yarn iba:dev` instead of `yarn dev`
- Functional tests may require wait time adjustments for better reliability
- The application follows GDS design principles and accessibility guidelines

## Support

For issues or questions, please refer to the project's issue tracker or contact the development team.

### Install Redis without package manager: 
1) Download, extract and build redis:
    ```bash
        curl -O http://download.redis.io/redis-stable.tar.gz
        tar xvzf redis-stable.tar.gz
        cd redis-stable
        make
    ```
2) Run a Sanity check:
    ``` bash
        make test
    ```
3) Add Redis to and its cli your path:
    ```bash
        sudo cp src/redis-server /usr/local/bin/
        sudo cp src/redis-cli /usr/local/bin/
    ```



