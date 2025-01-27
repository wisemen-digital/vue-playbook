# Teamwork makes the dream work

## Pull request (code reviews)

Knowledge sharing is the main priority during a code review. The goal is to ensure the code is high quality, maintainable, and adheres to best practices. Code reviews also provide an opportunity to learn from one another and improve the overall codebase.

When reviewing a pull request, approach it carefully, respectfully, and with the intention of helping the author improve. This is a chance to teach or learn from each other.

If your pull request is rejected, don’t take it personally—it’s simply a way to enhance the codebase and the team’s knowledge.

In cases where you disagree with the reviewer, have a discussion to find common ground. If an agreement can’t be reached, involve a third party to offer another perspective.
### Important things to look at in a pull request:

#### Readability
- [ ] Is the code easy to read?
- [ ] Are the variable names descriptive?
- [ ] Are the functions short and to the point?
- [ ] Check if the code is formatted correctly.
- [ ] Check if the code is consistent with the rest of the codebase.

#### Best practices
- [ ] Does the code follow coding standards and conventions?
- [ ] Are there any anti-patterns or redundant code present?

#### Comments and Documentation
- [ ] Are there any comments that are unclear or unnecessary?
- [ ] Are there any parts of the code that are not documented?
- [ ] Is the pull request description up to date?

#### Tests
- Are there any tests present?
  - [ ] Check for unit, integration and end-to-end tests, depending on the scope. 
- Are the test relevant and meaningful?
  - [ ] Ensure test cover edge cases, happy paths, and failure scenarios. 
- Do all tests pass?
  - [ ] Check the test results in the CI/CD pipeline.

#### Performance
- Doest the code perform effieciently?
  - [ ] Check for any potential bottlenecks for data-intensive operations.
- Is the algorithm optimal?
  - [ ] Look for unnecessary loops, repeated operations, or redundant code.

#### Security
- Are there any security vulnerabilities?
  - [ ] Check for any sensitive data being exposed, SQL injection, or XSS attacks.
- Is sensitive information handled correctly?
  - [ ] Ensure that passwords, API keys, and other sensitive data are not hardcoded. They should be stored in the correct environment variables.

#### Dependencies
- Are there any new dependencies?
  - [ ] Check if the dependencies are necessary and if they are up to date.
- Are the versions of dependencies compatible?
  - [ ] Ensure that the dependencies are compatible with the rest of the codebase.

#### Backward compatibility
- Does the code break any existing functionality?
  - [ ] Check if the new code breaks any existing features or functionality.

#### Overall Review
- Is the PR scope appropriate?
  - [ ] Ensure the PR isn’t doing too much. A focused, smaller PR is easier to review and merge.
- Is feedback addressed?
  - [ ] Check if the feedback from previous reviews has been addressed.

### Pair programming

Pair programming is a great way to collaborate and share knowledge. It involves two developers working together on the same codebase, with one developer writing the code and the other reviewing it in real-time.

Pair programming can help catch bugs early, improve code quality, and foster a sense of teamwork. It also provides an opportunity for developers to learn from each other and share best practices.

When pair programming, make sure to communicate effectively, take turns writing and reviewing code, and be open to feedback. Remember, the goal is to work together to produce high-quality code.
