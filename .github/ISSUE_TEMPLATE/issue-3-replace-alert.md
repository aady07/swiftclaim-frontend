# Issue 3: Replace alert() with Proper UI Error Messages

**Difficulty:** ⭐⭐⭐ Medium | **Time:** 2-3 hours | **Labels:** `good-first-issue`, `enhancement`, `ui/ux`, `beginner-friendly`

## Description
The chatbot and other components use browser `alert()` for error messages, which provides a poor user experience. Replace these with proper UI error messages that match the application's design.

## Files to Update
- `src/services/speechService.js` (multiple alert() calls)
- `src/components/chatbot/ChatInterface.jsx` (line 553)
- `src/hooks/useSpeechRecognition.js` (line 28)
- `src/pages/ClaimUpload.jsx` (line 159)

## Current Behavior
- Uses browser `alert()` for microphone access errors, speech recognition errors, and other issues
- Alert boxes are blocking (user must click OK to continue)
- Alert boxes don't match the app's modern design
- Poor user experience on mobile devices

## Expected Behavior
- Replace `alert()` with in-app error messages
- Error messages should match the chatbot UI design
- Messages should be non-blocking (toast notification or inline message)
- Messages should support multiple languages (English, Hindi, Telugu)
- Messages should auto-dismiss after a few seconds (optional)

## Acceptance Criteria
- [ ] Find all `alert()` calls in the specified files
- [ ] Replace `alert()` with proper UI error messages
- [ ] Error messages should be styled to match the app design
- [ ] Messages should be non-blocking (user can interact while message is shown)
- [ ] Messages should support multiple languages (English, Hindi, Telugu)
- [ ] Test all error scenarios:
  - Microphone permission denied
  - Speech recognition not supported
  - Recording errors
  - PDF generation errors

## Files with alert() calls

### 1. src/services/speechService.js
- Line 248: Microphone access error (Telugu)
- Line 271: MediaRecorder error
- Line 288: Failed to start MediaRecorder
- Line 308: Speech recognition not supported
- Line 353: Error starting SpeechRecognition
- Line 363: Microphone access error (Browser SpeechRecognition)
- Line 421: Couldn't understand audio (Telugu)
- Line 429: Error processing recorded audio

### 2. src/components/chatbot/ChatInterface.jsx
- Line 553: TTS error message

### 3. src/hooks/useSpeechRecognition.js
- Line 28: Speech recognition error

### 4. src/pages/ClaimUpload.jsx
- Line 159: PDF generation error

## Implementation Approach

### Option 1: Create a Toast/Notification Component
Create a reusable toast notification component that can be used throughout the app.

### Option 2: Use Existing UI State
Leverage the existing `useUIStateService` hook to display error messages inline with the chatbot.

### Option 3: Inline Error Messages
Display error messages directly in the component UI where the error occurs.

## Example Implementation (Option 2 - Using existing state)
```javascript
// Instead of:
alert(t("Microphone access is required for voice input.", ...));

// Use:
const errorMessage = t("Microphone access is required for voice input.", ...);
addMessage(errorMessage, true); // Display in chat
// Or set a specific error state if available
```

## Design Requirements
- Error messages should be visible but not intrusive
- Use red/error color scheme
- Consider adding an icon (e.g., error icon)
- Should work on both desktop and mobile
- Should support dark/light themes if applicable

## Testing Checklist
- [ ] Test microphone permission denied scenario
- [ ] Test speech recognition not supported scenario
- [ ] Test MediaRecorder errors
- [ ] Test PDF generation errors
- [ ] Test TTS errors
- [ ] Verify error messages appear correctly in all languages (EN, HI, TE)
- [ ] Verify error messages don't block user interaction
- [ ] Test on mobile devices
- [ ] Test with slow network connection

## Tips
- Look at how success messages are displayed in the chat interface
- Check the `useUIStateService` hook for existing error state management
- Use the existing translation function `t()` for multi-language support
- Consider creating a reusable error message component

---

**Perfect for:** Learning React component design and UX best practices
