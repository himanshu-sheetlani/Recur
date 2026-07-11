# QA Audit & Test Report: Recur Application

**Date:** July 4, 2026  
**Audited By:** Senior QA Engineer (10+ Years Experience)  
**Target Environment:** Production Release Candidate  

---

## 1. Executive Summary

This report covers a comprehensive, deep-dive QA audit of the **Recur** application (a client-server system for tracking coding practice and DSA attempts). The audit covers functional validity, UI/UX aesthetics, responsiveness, performance metrics, security posture, accessibility compliance (WCAG 2.2 AA), and edge-case resilience.

### Major Findings:
- **Critical Security Bypass:** A bug in the token verification controller `/auth/me` returns HTTP Status `200 OK` on error catching, causing unauthenticated users to bypass client-side route protection and gain access to the dashboard and history pages with broken/empty interfaces.
- **Indirect Object Reference (IDOR):** The `/api/dashboard/question/:id` route lacks user-scoping, permitting any logged-in user to query the attempts and details of any question in the database simply by knowing its MongoDB `ObjectId`.
- **Node Server Instability:** Several backend controllers contain crash-prone exception handlers that try to send response payloads twice (triggering `ERR_HTTP_HEADERS_SENT` Node.js crashes).
- **Time-Tracking Calculations Flaw:** The stopwatch records only the *seconds portion* modulo 60 (discarding minutes/hours entirely), meaning a 10-minute DSA attempt is logged in the database as `0 seconds`.
- **Accessibility & UX Issues:** Input elements in the attempt modal lack programmatic ID associations to their HTML labels, interactive SVGs trigger flash-of-empty states on history views, and the favicon is an unoptimized `626 KB` asset.

Based on these findings, **the application is NOT ready for production deployment.** 

---

## 2. Feature Coverage Table

| ID | Feature Area | Scenario Description | Tested Viewports | Status | Comments |
|----|--------------|----------------------|------------------|--------|----------|
| FT-01 | Auth | User Signup with valid data | All | **PASS** | Client validation works. |
| FT-02 | Auth | User Signup with duplicate fields | All | **PASS** | Returns HTTP 409 conflict correctly. |
| FT-03 | Auth | User Login with valid credentials | All | **PASS** | Navigates to dashboard. |
| FT-04 | Auth | User Login with invalid credentials | All | **PASS** | Shows error toast. |
| FT-05 | Auth | Route protection for dashboard/history | All | **FAIL** | Blocked by token verification bypass (Bug #1). |
| FT-06 | Dashboard | Retrieve statistics & difficulty counts | All | **PASS** | Correctly maps DB aggregation to UI cards. |
| FT-07 | Dashboard | Pie chart distribution display | All | **FAIL** | Legend text color accessibility issue (Bug #19). |
| FT-08 | Dashboard | Recent solved questions display | All | **FAIL** | Potential page crash on null question references (Bug #11). |
| FT-09 | Create Attempt | Stepper wizard inputs & validations | Desktop/Mobile | **FAIL** | Indicators bypass validation; URLs unvalidated (Bugs #17, #18). |
| FT-10 | Create Attempt | Stopwatch timing controls | Desktop/Mobile | **FAIL** | Minutes discarded; running time not saved (Bugs #7, #8). |
| FT-11 | Create Attempt | Checklist external help checkbox | Desktop/Mobile | **FAIL** | Checkbox cannot be unchecked once checked (Bug #6). |
| FT-12 | History | All questions listing table | All | **FAIL** | Flash of empty state on loading (Bug #9). |
| FT-13 | History | See attempts modal lookup | All | **FAIL** | Stale data shown during loading; IDOR security leak (Bugs #2, #10). |

---

## 3. Detailed Test Cases

| ID | Feature | Scenario | Steps | Expected Result | Actual Result | Status |
|----|---------|----------|-------|-----------------|---------------|--------|
| TC-01 | Auth | Token expiration route navigation | 1. Set invalid cookie `token`. <br> 2. Open `/dashboard`. | Redirect user to `/login`. | Allows entrance to page; loads blank cards. | **FAIL** |
| TC-02 | Auth | Session logout | 1. Click "Log out". | Clear cookie & storage; redirect to `/login`. | Cookie cleared, redirects to login page. | **PASS** |
| TC-03 | Stats | Empty state display | 1. Register a new user. <br> 2. Log in. <br> 3. Go to Dashboard. | Chart displays 0 counts; lists show Empty state. | Renders 0s, displays placeholder image. | **PASS** |
| TC-04 | Attempt | Stopwatch timer integrity | 1. Start stopwatch.<br>2. Run for 75s.<br>3. Stop & save. | Save attempt as 75 seconds total. | Saved in DB as 15 seconds. | **FAIL** |
| TC-05 | Attempt | External link redirection | 1. Save attempt with link `google.com`. <br> 2. Click "Link" button. | Navigate to `https://google.com`. | Navigates to `http://localhost:5173/google.com` (404). | **FAIL** |
| TC-06 | Security | JavaScript URI execution | 1. Enter `javascript:alert(1)` as link. <br> 2. Save attempt and click link. | Link is sanitized or sanitized. | Executes alert script in browser (XSS). | **FAIL** |
| TC-07 | Stepper | Step skipping validation | 1. Open "+" attempt form. <br> 2. Click circle "3" at top. | Stepper remains on Step 1. | Stepper moves to Step 3. | **FAIL** |

---

## 4. Bug Report

### [Bug 01] `/auth/me` Endpoint Returns HTTP 200 on JWT Verification Failure (Auth Bypass)
- **Severity:** Critical
- **Page:** `/dashboard`, `/history`, `ProtectedRoute`
- **Preconditions:** Token is expired or tampered with.
- **Steps to reproduce:**
  1. Manually add an invalid cookie `token=badtokenvalue` in the browser console.
  2. Attempt to visit `http://localhost:5173/dashboard`.
  3. The `ProtectedRoute` makes a GET request to `/api/auth/me`.
  4. The server throws a verification error, catches it, and sends the error object as a JSON response without setting an error status code.
- **Expected Result:** The API returns HTTP 401 Unauthorized, and the user is redirected to `/login`.
- **Actual Result:** The API returns HTTP 200 OK with `{"msg": {...Error Object}}`. The frontend treats this as a success, sets `isAuth(true)`, and enters the dashboard. The dashboard remains blank or loading since stats requests correctly return 401.
- **Possible Root Cause:** In `server/controller/checkAuth.controller.ts` (Line 25), the catch block returns `res.json({msg: e})` which uses the default HTTP 200 status code.
- **Suggested Fix:**
  ```typescript
  catch(e){
      return res.status(401).json({msg: "Invalid or expired token"})
  }
  ```

---

### [Bug 02] Missing Authorization Checks in `getAttempt` Controller (IDOR Vulnerability)
- **Severity:** High
- **Page:** `/history` -> See Attempts modal
- **Preconditions:** Logged in. Knowing a MongoDB `questionId` belonging to another user.
- **Steps to reproduce:**
  1. Log in to User Account A.
  2. Send a GET request to `http://localhost:3000/api/dashboard/question/<User_B_Question_ID>`.
- **Expected Result:** The server returns HTTP 403 Forbidden or 404 Not Found since the question does not belong to User A.
- **Actual Result:** The server returns HTTP 200 OK along with all attempts logged for that question by User B.
- **Possible Root Cause:** In `server/controller/attempt.controller.ts` (Line 58), the lookup is `Attempt.find({questionId: questionId})` without specifying the `userId` associated with the request context.
- **Suggested Fix:** Change to:
  ```typescript
  const response: AttemptI[] = await Attempt.find({questionId: questionId, userId: userId})
  ```

---

### [Bug 03] Server Crashes in stats controller due to double response send (`ERR_HTTP_HEADERS_SENT`)
- **Severity:** High
- **Page:** `/dashboard` API route
- **Preconditions:** An exception occurs inside database aggregates in `stats.controller.ts`.
- **Steps to reproduce:**
  1. Temporarily disrupt MongoDB connection during a `/api/dashboard/stats` request.
  2. The aggregate query inside helper functions `avgTimeTaken` or `recent` fails.
  3. The error triggers the helper function's `catch` block which fires `res.json({msg: e})`.
  4. The main thread continues, reaches the final `res.status(200).json(...)` statement, and triggers a header error crash.
- **Expected Result:** The server responds with HTTP 500 once and logs the stack trace.
- **Actual Result:** Server crashes due to multiple response sends, shutting down node process.
- **Possible Root Cause:** `stats.controller.ts` helper functions write directly to `res` on errors instead of propagating/throwing them to the parent try-catch.
- **Suggested Fix:** Refactor helper functions to remove nested try-catches and allow errors to bubble up to the main controller's catch block.

---

### [Bug 04] Typo in Mongoose Schema for User Model (`reqired` is ignored)
- **Severity:** High
- **Page:** `/api/auth/signup` database storage
- **Preconditions:** None.
- **Steps to reproduce:**
  1. Send a registration request bypass to `/api/auth/signup` with missing username or email (e.g. by modifying API payload directly).
- **Expected Result:** The database throws a validation error because username and email are required constraints.
- **Actual Result:** Schema accepts empty/missing values since the validator property is misspelled as `reqired` and is ignored by Mongoose.
- **Possible Root Cause:** Typo `reqired: true` in `server/model/user.model.ts` on lines 12 and 17.
- **Suggested Fix:** Rename to `required: true`.

---

### [Bug 05] Stored XSS via JavaScript URIs in Attempt Links
- **Severity:** High
- **Page:** `/dashboard` (Recent list) & `/history`
- **Preconditions:** User enters a malicious link on attempt creation.
- **Steps to reproduce:**
  1. Open the "Create Attempt" modal.
  2. Input: `javascript:alert(document.cookie)` as the question link.
  3. Save the attempt.
  4. Navigate to the history table and click the "Link" button of the newly created item.
- **Expected Result:** The URL protocol is validated, or the link is disabled, or clicking it opens a blank/new tab safely.
- **Actual Result:** The browser executes the JavaScript payload in the origin context of the application.
- **Possible Root Cause:** URLs are saved without protocol scheme validation and rendered as raw `href` elements in React Router.
- **Suggested Fix:** Validate link schemas on the backend (e.g. must start with `http://` or `https://`).

---

### [Bug 06] Checklist Checkbox Cannot Be Unchecked in Creation Modal
- **Severity:** Medium
- **Page:** Create Attempt modal (Step 3)
- **Preconditions:** None.
- **Steps to reproduce:**
  1. Open attempt modal. Navigate to Step 3.
  2. Click the checkbox for "External Help was Taken?".
  3. Uncheck the checkbox.
- **Expected Result:** Checkbox is unchecked, and attempt data shows `hint: false`.
- **Actual Result:** Checkbox visually unchecks, but attempt data state remains `hint: true`. Submitting the form logs the attempt with `hint: true`.
- **Possible Root Cause:** In `CreateAttempt.tsx` (Line 87), the state updater evaluates `value == "on"` to set state. A checkbox element's target value remains `"on"` regardless of check status.
- **Suggested Fix:**
  ```typescript
  const handleCheckBox = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setAttemptData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };
  ```

---

### [Bug 07] Modulo 60 Operation Discards Minutes in Stopwatch Calculations
- **Severity:** High
- **Page:** Create Attempt (Stopwatch step)
- **Preconditions:** Stopwatch runs past 60 seconds.
- **Steps to reproduce:**
  1. Start stopwatch in attempt form. Let it run for 1 minute 15 seconds.
  2. Click stop, complete steps, and submit attempt.
  3. View Dashboard stats.
- **Expected Result:** Average time and recent attempts log 75 seconds total (1m 15s).
- **Actual Result:** Form records `15 seconds`. 60 seconds (1 minute) are discarded.
- **Possible Root Cause:** `Stopwatch.tsx` line 59 reads `Math.floor((time / 1000) % 60)`, which extracts only the seconds digit of the clock rather than total duration.
- **Suggested Fix:** Replace with `Math.floor(time / 1000)`.

---

### [Bug 08] Stopwatch Running State is Lost on Stepper Advance
- **Severity:** Medium
- **Page:** Create Attempt (Stopwatch step)
- **Preconditions:** Stopwatch is running.
- **Steps to reproduce:**
  1. Start stopwatch and let it run.
  2. Click "Next" inside the stepper *without* clicking "Stop" first.
  3. Complete form and submit.
- **Expected Result:** The current elapsed time of the running stopwatch is saved.
- **Actual Result:** Time is saved as `0 seconds`.
- **Possible Root Cause:** Time values are only pushed to parent state inside `handleStartPause`.
- **Suggested Fix:** Trigger `handleGetTime` or equivalent save function on component cleanup or state change.

---

### [Bug 09] Flash of "No Questions Found" Empty State on History Page Visit
- **Severity:** Medium
- **Page:** `/history`
- **Preconditions:** Logged in, questions exist in database.
- **Steps to reproduce:**
  1. Click "History" in the Navbar.
- **Expected Result:** A loading indicator is shown while the database fetching takes place.
- **Actual Result:** The empty state illustration and text "No Questions Found" flash for a brief moment before the list loads.
- **Possible Root Cause:** `questions` is initialized as null. The component checks `{!question || question.length === 0}` which evaluates to true prior to API response.
- **Suggested Fix:**
  ```typescript
  if (data === null) return <Loading />;
  ```

---

### [Bug 10] Infinite Loader on Stats Load Failures (Dead End UX)
- **Severity:** Medium
- **Page:** `/dashboard`
- **Preconditions:** Server error/offline status.
- **Steps to reproduce:**
  1. Visit dashboard with server database unavailable.
- **Expected Result:** An error alert or retry button appears.
- **Actual Result:** Screen shows fullscreen Logo Loading screen indefinitely.
- **Possible Root Cause:** No error boundary or failure-state checking is defined in `Dashboard.tsx`.
- **Suggested Fix:** Set an `error` state in the catch block of `fetchData` and render a fallback component.

---

### [Bug 11] Stale Attempt History Displays in Modal
- **Severity:** Medium
- **Page:** `/history`
- **Preconditions:** Multiple questions recorded.
- **Steps to reproduce:**
  1. Click "See attempts" for Question A. Close modal.
  2. Click "See attempts" for Question B.
- **Expected Result:** Modal opens with a loader or clear slate, then loads Question B's list.
- **Actual Result:** Modal opens and immediately displays Question A's history while fetching Question B's data, leading to a sudden shift.
- **Possible Root Cause:** The `attempt` state array is not cleared upon opening/closing the modal.
- **Suggested Fix:** Call `setAttempt(null)` when initiating `handleClick`.

---

### [Bug 12] Unoptimized Favicon File Size (626 KB logo.png)
- **Severity:** Medium
- **Page:** All Pages (Favicon download)
- **Steps to reproduce:**
  1. Open Chrome network inspector. Reload site.
  2. Inspect `/logo.png`.
- **Expected Result:** Small, optimized icon asset (under 5KB).
- **Actual Result:** Favicon is `626 KB`, impacting initial page loads.
- **Possible Root Cause:** High-res layout asset referenced as favicon in `index.html`.
- **Suggested Fix:** Replace with a compressed, low-res `.ico` or small `.png` file.

---

### [Bug 13] Spelling Typo in `authMiddleware` Exception Response
- **Severity:** Low
- **Page:** API Authentication Middleware
- **Steps to reproduce:**
  1. Make a request to a protected API path with an invalid token.
- **Expected Result:** `{"msg": "Invalid or expired token"}`
- **Actual Result:** `{"msg": "Invalid or expired toke"}`
- **Possible Root Cause:** Typo in `server/middleware/checkAuth.middleware.ts` line 23.
- **Suggested Fix:** Correct the spelling.

---

### [Bug 14] rateLimit Middleware is Commented Out
- **Severity:** Medium
- **Page:** All Server API Routes
- **Preconditions:** None.
- **Steps to reproduce:**
  1. Perform rapid spam requests against login or signup endpoints.
- **Expected Result:** Request limits are reached, yielding HTTP 429 Too Many Requests.
- **Actual Result:** Server processes all requests indefinitely, exposing itself to DoS vectors.
- **Possible Root Cause:** In `server/index.ts` (Line 21), `// app.use(limiter)` is commented out.
- **Suggested Fix:** Uncomment route limit middleware line.

---

### [Bug 15] CORS Origin Hardcoded to Localhost
- **Severity:** High
- **Page:** Server Index Configuration
- **Steps to reproduce:**
  1. Deploy app on production domain.
- **Expected Result:** Server handles domain requests.
- **Actual Result:** Domain requests are blocked by CORS.
- **Possible Root Cause:** Origin in `index.ts` is hardcoded as `http://localhost:5173`.
- **Suggested Fix:** Pull origin dynamically from environment variables.

---

### [Bug 16] Missing Password Length and Email validation on Backend Controller
- **Severity:** Medium
- **Page:** `/api/auth/signup`
- **Steps to reproduce:**
  1. Send registration payload with password length of 1 character or invalid email formats.
- **Expected Result:** Server validates structure and returns HTTP 400 Bad Request.
- **Actual Result:** User registered successfully.
- **Possible Root Cause:** No server-side format checks are performed in the signup method.
- **Suggested Fix:** Utilize validator schemas (e.g. Zod) in backend signup controller.

---

### [Bug 17] Clickable Stepper Indicators Permit Step-Bypassing
- **Severity:** Medium
- **Page:** Create Attempt Modal
- **Steps to reproduce:**
  1. Click "+" modal.
  2. Click Step 3 circle indicator without filling in any fields in Step 1.
- **Expected Result:** Step indicator clicks are locked until current step validations are met.
- **Actual Result:** User moves directly to Step 3.
- **Possible Root Cause:** `disableStepIndicators` attribute defaults to `false` in `Stepper.jsx` and is omitted in the component instance.
- **Suggested Fix:** Set `disableStepIndicators={true}` in `CreateAttempt.tsx`.

---

### [Bug 18] Relative Route Redirects for External Links
- **Severity:** Medium
- **Page:** Dashboard & History lists
- **Steps to reproduce:**
  1. Create attempt with URL link `"google.com"`.
  2. Click "Link" button.
- **Expected Result:** Opens external site page.
- **Actual Result:** Navigates to local router address `http://localhost:5173/google.com`.
- **Possible Root Cause:** Link uses react-router `<Link>` which assumes local routing for un-prefixed URLs.
- **Suggested Fix:** Replace external redirection buttons with standard `<a>` tags and add `https://` prefix to links missing a protocol.

---

### [Bug 19] Missing Accessible HTML Labels & ARIA properties
- **Severity:** Medium
- **Page:** Login, Signup, Create Attempt Modal
- **Preconditions:** Accessibility reader scan.
- **Actual Result:** Form elements lack programmatically linked HTML labels, and interactive icons like "+" button lack screen reader text values.
- **Possible Root Cause:** Omission of input `id` attributes matching label `htmlFor` targets, and absence of `aria-label` properties on icon-only actions.
- **Suggested Fix:** Ensure all form controls have corresponding IDs and explicitly add `aria-label` labels to action-icons.

---

## 5. Improvement Suggestions

1. **Implement Bundle Code-Splitting:** The `1.56 MB` JavaScript production bundle must be split into logical chunks using dynamic imports (`React.lazy` or router-based lazy loading) to prevent slow paint times and high layout shifts.
2. **Stopwatch Sync inside Local Storage:** Store the running stopwatch timestamp value inside local storage. This ensures the current elapsed practice time is not lost if the user accidentally refreshes their page midway through solving.
3. **Database Schema Trimming:** Enable Mongoose `trim: true` attributes on user schema fields to prevent usernames or passwords consisting solely of blank white spaces.
4. **Input Constraints Validation:** Implement a numerical minimum of `1` for question numbers on both frontend and backend configurations to ensure clean, accurate practice logs.
5. **Interactive Page Transition Loading Skeletons:** Implement loading skeletons inside `/history` and `/dashboard` lists to create a premium feel instead of locking layouts behind heavy spinners.

---

## 6. Deployment Readiness Score

| Category | Rating (0–100) | Weight | Weighted Score |
|----------|----------------|--------|----------------|
| Security | 20 / 100 | 25% | 5.0 |
| Functional Stability | 30 / 100 | 25% | 7.5 |
| Accessibility & Semantic HTML | 40 / 100 | 15% | 6.0 |
| UI/UX Consistency | 50 / 100 | 15% | 7.5 |
| Performance & Bundle Optimization | 45 / 100 | 10% | 4.5 |
| Test Coverage & Error Resiliency | 10 / 100 | 10% | 1.0 |
| **Overall Score** | | **100%** | **31.5 / 100** |

### Summary Recommendation:
**Status: RED (Blocker)**  
With an overall readiness score of **31.5 / 100**, the application is **strictly unfit** for deployment. The token authentication bypass (Bug #1), IDOR access vulnerability (Bug #2), database constraints spelling flaw (Bug #4), and double response server crash issues (Bug #3) represent severe production blockades. Immediate development iterations are required to resolve the identified bugs.
