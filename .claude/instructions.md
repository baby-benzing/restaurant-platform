# Restaurant Platform Implementation Guide

## Project Overview
Build a multi-restaurant website platform with shared components and individual restaurant configurations. 
The complete scope of websites are: 
https://www.pave46.com/
https://www.noreetuh.com/
https://www.hulihulinyc.com/
First focus on getting Pavé46 working locally with test-driven development. 

## Working Instructions for Claude Code

### Core Principles
1. **Test-Driven Development (TDD)**
   - Write tests BEFORE implementing any feature
   - Follow Red-Green-Refactor cycle
   - Maintain minimum 80% code coverage
   - Create test files alongside implementation files

2. **Task Decomposition**
   - Break each high-level task into 15-30 minute subtasks
   - Document your plan in `planning/[task-name].md` before starting
   - Think through edge cases and error handling before coding

3. **Progress Tracking**
   - Update `progress.log` after each subtask
   - Maintain `CHANGELOG.md` with semantic versioning
   - Document architectural decisions in `docs/decisions/`

### Testing Requirements
```
For each component/function:
1. Create [component].test.ts file
2. Write unit tests covering:
   - Happy path
   - Edge cases
   - Error conditions
   - Integration points
3. Run tests before committing
4. Document test scenarios in test files
```

### Logging Format
```bash
# Progress log entries
echo "$(date '+%Y-%m-%d %H:%M'): [STATUS] Task - Details" >> progress.log
# STATUS: START, COMPLETE, BLOCKED, TEST_PASS, TEST_FAIL

# CHANGELOG.md updates after each major task
```

## High-Level Implementation Tasks

### 1. Project Foundation Setup
**Objective**: Create monorepo structure with proper tooling

**Requirements**:
- Initialize pnpm workspace monorepo
- Setup TypeScript configuration
- Configure ESLint and Prettier
- Setup Jest for testing
- Create Docker compose for PostgreSQL
- Initialize git with proper .gitignore

**Test Requirements**:
- Verify all tools are installed and versions are correct
- Test that workspace packages can reference each other
- Ensure database connection works

**Deliverables**:
- Working monorepo structure
- All development tools configured
- Local database running

---

### 2. Database Schema and ORM Setup
**Objective**: Design and implement database layer with Prisma

**Requirements**:
- Design schema for restaurants, menus, users, content
- Setup Prisma with PostgreSQL
- Create migration system
- Implement seed data for development
- Create database access utilities

**Test Requirements**:
- Test all CRUD operations for each model
- Verify relationships and constraints
- Test migration rollback and forward
- Validate seed data integrity

**Deliverables**:
- Complete database schema
- Working Prisma client
- Seed data for Pavé46

---

### 3. Shared Component Library
**Objective**: Build reusable UI components in web-common package

**Requirements**:
- Create base layout system
- Build menu display component
- Implement hours/contact components
- Design responsive navigation
- Setup Tailwind CSS with design tokens
- Create loading and error states

**Test Requirements**:
- Unit test each component with React Testing Library
- Test responsive behavior
- Test accessibility (ARIA labels, keyboard navigation)
- Use playwrite to test and document component behaviors

**Deliverables**:
- Fully tested component library
- Storybook documentation (optional)
- Accessibility compliant components

---

### 4. Pavé46 Restaurant Application
**Objective**: Implement first restaurant website using Next.js

**Requirements**:
- Setup Next.js 14 with App Router
- Implement homepage with all sections
- Create dynamic routing for pages
- Add SEO optimization
- Implement image optimization
- Setup error boundaries

**Test Requirements**:
- E2E tests for critical user paths
- Test data fetching and error states
- Performance testing (Core Web Vitals)
- SEO validation tests

**Deliverables**:
- Fully functional Pavé46 website
- All content displayed correctly
- Mobile responsive design

---

### 5. Admin Authentication System
**Objective**: Secure admin access with role-based permissions

**Requirements**:
- Implement NextAuth.js authentication
- Create login/logout flow
- Setup JWT tokens
- Implement role-based access control
- Add password reset functionality
- Create session management

**Test Requirements**:
- Test authentication flow
- Test authorization for different roles
- Test token expiration and refresh
- Test security against common attacks

**Deliverables**:
- Secure authentication system
- Protected admin routes
- User management utilities

---

### 6. Content Management System
**Objective**: Build admin interface for content updates

**Requirements**:
- Create admin dashboard layout
- Build CRUD interfaces for:
  - Menu items and sections
  - Operating hours
  - Contact information
  - Image gallery
- Implement preview functionality
- Add bulk operations
- Create audit logging

**Test Requirements**:
- Test all CRUD operations
- Test validation rules
- Test concurrent editing scenarios
- Test audit trail accuracy

**Deliverables**:
- Functional admin panel
- All content editable
- Change tracking system

---

### 7. API Layer Development
**Objective**: Create RESTful API for data operations

**Requirements**:
- Design API routes structure
- Implement CRUD endpoints
- Add input validation
- Setup rate limiting
- Implement caching strategy
- Create API documentation

**Test Requirements**:
- Integration tests for all endpoints
- Test validation and error responses
- Load testing for performance
- Security testing (SQL injection, XSS)

**Deliverables**:
- Complete API with documentation
- Postman/Insomnia collection
- Rate limiting configured

---

### 8. Local Development Optimization
**Objective**: Ensure smooth local development experience

**Requirements**:
- Setup hot reload for all packages
- Create development scripts
- Implement mock data generators
- Setup development proxy
- Create reset/refresh utilities
- Add development debugging tools

**Test Requirements**:
- Test build processes
- Verify hot reload works across packages
- Test development vs production builds
- Validate environment variable handling

**Deliverables**:
- Smooth development workflow
- Helpful development scripts
- Clear troubleshooting guide

---

## Test-Driven Development Playbook

### For Each Feature Implementation:

#### 1. Planning Phase
```markdown
# In planning/[feature-name].md
- Define acceptance criteria
- List test scenarios
- Identify edge cases
- Plan test data
```

#### 2. Test Writing Phase
```typescript
// Write tests first
describe('Feature: [Name]', () => {
  describe('Scenario: [Happy Path]', () => {
    it('should [expected behavior]', () => {
      // Arrange
      // Act
      // Assert
    });
  });
  
  describe('Scenario: [Edge Case]', () => {
    it('should handle [edge case]', () => {
      // Test implementation
    });
  });
  
  describe('Scenario: [Error Handling]', () => {
    it('should throw error when [condition]', () => {
      // Test implementation
    });
  });
});
```

#### 3. Implementation Phase
- Run tests (see them fail - RED)
- Write minimal code to pass tests (GREEN)
- Refactor for clarity and performance (REFACTOR)
- Ensure tests still pass

#### 4. Integration Phase
- Write integration tests
- Test with other components
- Update documentation
- Update CHANGELOG.md

### Testing Standards

#### Unit Tests
- Test individual functions/components in isolation
- Mock external dependencies
- Cover all code branches
- Test return values and side effects

#### Integration Tests
- Test component interactions
- Test API endpoints with database
- Test authentication flows
- Test data flow through system

#### E2E Tests
- Test complete user journeys
- Test on different browsers
- Test responsive layouts
- Test performance metrics

### Code Coverage Requirements
```json
{
  "branches": 80,
  "functions": 80,
  "lines": 80,
  "statements": 80
}
```

## Project Structure
```
restaurant-platform/
├── apps/
│   └── pave46/              # Restaurant application
├── packages/
│   ├── web-common/          # Shared components
│   ├── database/            # Prisma ORM
│   └── admin/               # Admin components
├── planning/                # Task breakdowns
├── docs/
│   ├── decisions/          # Architecture Decision Records
│   └── testing/            # Test documentation
├── tests/
│   ├── unit/              # Unit tests
│   ├── integration/       # Integration tests
│   └── e2e/               # End-to-end tests
├── progress.log
├── CHANGELOG.md
└── README.md
```

## Technology Stack Decisions

### Core Technologies
- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL with Prisma
- **Styling**: Tailwind CSS
- **Testing**: Jest, React Testing Library, Playwright
- **Authentication**: NextAuth.js
- **Package Manager**: pnpm (workspace)
- **Language**: TypeScript (strict mode)

### Development Tools
- **Linting**: ESLint with strict ruleset
- **Formatting**: Prettier
- **Git Hooks**: Husky for pre-commit tests
- **CI**: GitHub Actions (when ready)

## Implementation Order

1. **Week 1**: Tasks 1-3 (Foundation, Database, Components)
2. **Week 2**: Tasks 4-5 (Pavé46 App, Authentication)
3. **Week 3**: Tasks 6-7 (CMS, API)
4. **Week 4**: Task 8 + Testing + Polish

## Success Criteria

### Functional Requirements
- [ ] Pavé46 website loads and displays all content
- [ ] Admin can log in and edit content
- [ ] Changes reflect immediately on frontend
- [ ] Mobile responsive design works
- [ ] All tests pass with >80% coverage

### Non-Functional Requirements
- [ ] Page loads under 2 seconds
- [ ] Accessibility score >90
- [ ] SEO score >90
- [ ] No security vulnerabilities
- [ ] Clean, maintainable code

## Instructions for Getting Started

```bash
# 1. Create project structure
mkdir -p ~/projects/custom_web
cd ~/projects/custom_web

# 2. Initialize progress tracking
echo "$(date '+%Y-%m-%d %H:%M'): [START] Project initialization" > progress.log
echo "# Restaurant Platform Progress" > README.md

# 3. Create planning directory
mkdir -p planning docs/decisions tests

# 4. Start with Task 1
# Create planning/task1-foundation.md with your breakdown
# Then begin implementation with TDD approach
```

## Notes for Claude Code

### Before Starting Each Task:
1. Read this entire guide
2. Create detailed breakdown in `planning/`
3. Write test specifications
4. Set up test files
5. Begin TDD cycle

### During Implementation:
1. Commit after each passing test
2. Update progress.log frequently
3. Document decisions in `docs/decisions/`
4. Keep tests running in watch mode
5. Refactor only with green tests

### After Each Task:
1. Run full test suite
2. Update CHANGELOG.md
3. Verify code coverage
4. Update documentation
5. Plan next task

## Final Notes

This guide provides high-level direction. Claude Code should:
- Decompose each task into specific implementation steps
- Research best practices for each technology
- Make architectural decisions and document them
- Focus on test coverage and code quality
- Build incrementally and verify each step

The goal is a production-ready, maintainable platform that can be extended to other restaurants after Pavé46 is complete.
