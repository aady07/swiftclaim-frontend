# GitHub Issues Guide for Interns

## How to Create Issues on GitHub

### Method 1: Via GitHub Website (Easiest)

1. **Navigate to your repository on GitHub**
   - Go to: `https://github.com/YOUR_USERNAME/Frontend_Swiftclaim`

2. **Click on the "Issues" tab**
   - Located at the top of the repository page

3. **Click "New Issue" button**
   - Green button on the right side

4. **Fill out the issue:**
   - **Title**: Clear, descriptive title (e.g., "Clean up console.log statements")
   - **Description**: Use the template below or create your own
   - **Labels**: Add appropriate labels (good-first-issue, bug, enhancement, etc.)
   - **Assignees**: Assign to the intern (optional)
   - **Projects**: Add to a project board (optional)

5. **Click "Submit new issue"**

### Method 2: Via GitHub CLI (if installed)

```bash
gh issue create --title "Clean up console.log statements" --body "Issue description here" --label "good-first-issue"
```

## Suggested Beginner-Friendly Issues

### Issue 1: Clean Up Console Logs ⭐ (Easiest)
**Priority**: Low | **Difficulty**: Easy | **Time**: 1-2 hours

```
Title: Clean up console.log statements for production

Remove or replace console.log() statements throughout the codebase.
See .github/ISSUE_TEMPLATE/good-first-issue.md for full details.
```

---

### Issue 2: Improve Error Messages ⭐
**Priority**: Medium | **Difficulty**: Easy | **Time**: 2-3 hours

```
Title: Improve user-facing error messages

Current error messages are too technical. Make them more user-friendly.

Files to update:
- src/services/api/claimService.js
- src/services/messageService.js
- src/hooks/useFileUpload.js

Acceptance Criteria:
- Error messages should be clear and actionable
- Support multiple languages (English, Hindi, Telugu)
- No technical jargon visible to end users
```

---

### Issue 3: Add Loading States
**Priority**: Medium | **Difficulty**: Medium | **Time**: 3-4 hours

```
Title: Add proper loading indicators during API calls

Some API calls don't show loading states, causing confusion.

Areas to improve:
- Claim upload processing
- Speech-to-text conversion
- Chat message sending

Acceptance Criteria:
- Loading spinner/banner appears during async operations
- User can see that action is in progress
- Consistent loading UI across all features
```

---

### Issue 4: Fix Typo in Comments
**Priority**: Low | **Difficulty**: Very Easy | **Time**: 30 minutes

```
Title: Fix typo in claimService.js comment

Line 28 in src/services/api/claimService.js has a typo:
"// Silently handle the error without loggingimage.png"

Should be:
"// Silently handle the error without logging"
```

---

### Issue 5: Improve Form Validation
**Priority**: Medium | **Difficulty**: Medium | **Time**: 3-4 hours

```
Title: Add real-time validation to Careers form

The Careers page form should validate inputs as user types.

Files:
- src/pages/Careers.jsx

Acceptance Criteria:
- Email validation shows error immediately
- Phone number format validation
- File size/type validation before submit
- Better visual feedback for invalid fields
```

---

## Issue Template Example

```markdown
## Description
[Clear description of what needs to be done]

## Files to Modify
- `src/file/path.js`
- `src/another/file.jsx`

## Acceptance Criteria
- [ ] Task 1 completed
- [ ] Task 2 completed
- [ ] Code tested and working

## Additional Notes
[Any additional context or instructions]

## Screenshots (if applicable)
[If UI-related, attach screenshots]

## Labels
- `good-first-issue`
- `enhancement` (or `bug`, `documentation`, etc.)
```

## Labels to Use

- `good-first-issue` - Perfect for beginners
- `bug` - Something broken
- `enhancement` - New feature or improvement
- `documentation` - Docs need updating
- `code-cleanup` - Refactoring/cleaning code
- `ui/ux` - User interface improvements
- `beginner-friendly` - Good for new developers

## Creating Your First Issue

1. Start with Issue #1 (Console Logs) - it's the easiest
2. Read the code carefully
3. Make changes on a new branch
4. Test thoroughly
5. Submit a Pull Request

## Tips

- **One issue = One feature/bug fix** - Don't combine multiple unrelated changes
- **Be specific** - Clear titles and descriptions help everyone
- **Include examples** - Show before/after code when possible
- **Set realistic timelines** - Better to underestimate than overpromise
- **Ask questions** - Use issue comments to clarify requirements
