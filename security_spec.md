# Security Specification (Payload-First TDD)

This specification defines the strict data validation policies, access rules, and data integrity safeguards designed for the Smart Study Hub application.

## 1. Data Invariants
- **Identity Integrity**: Users can only read and write their own student Profile (`/users/{userId}`) and local progress state (`/users/{userId}/progress/records`). They cannot spoof someone else's UID or modify another's data.
- **Role Verification**: Admin components (creating customized study notes, MCQs, videos) are secured. Standard users can read notes, quizzes, and videos, but cannot write them.
- **System Authenticity**: Timestamp validations for creation (e.g. `createdAt`) are locked to `request.time` to prevent retrospective forgery. All input boundaries (string sizes and ranges) must be strictly enforced.
- **Leaderboard Consistency**: Public high score listings in `/leaderboard/{userId}` must reflect valid user accounts, and users cannot modify pages they do not own.

---

## 2. The "Dirty Dozen" Payloads (Aesthetic Penetration Specs)

### Rogue Payload 1: Student Profile Spoofing
- **Target Path**: `/users/legit-student-1`
- **Identity**: Requesting Auth `uid = "hacker-student-4"`
- **Vulnerability Targeted**: Exploiting missing self-ownership check where a user attempts to modify or create a profile for another ID.
- **Expected Action**: Rejected (PERMISSION_DENIED)

### Rogue Payload 2: Self-Appointed Language Injecting
- **Target Path**: `/users/legit-student-1`
- **Identity**: Requesting Auth `uid = "legit-student-1"`
- **Rogue Payload**: `{ preferredLanguage: "Mandarin" }`
- **Vulnerability Targeted**: Injecting an un-enumerated enum value into `preferredLanguage`. Only `"English"` or `"Nepali"` are valid.
- **Expected Action**: Rejected (PERMISSION_DENIED)

### Rogue Payload 3: Excess Size Denial-of-Wallet ProfilePic
- **Target Path**: `/users/legit-student-1`
- **Identity**: Requesting Auth `uid = "legit-student-1"`
- **Rogue Payload**: `{ profilePic: "http://example.com/" + ("A" * 100000) }`
- **Vulnerability Targeted**: Attempting custom field size bloating to exhaust Firestore resources/quota. All text inputs must enforce size limits.
- **Expected Action**: Rejected (PERMISSION_DENIED)

### Rogue Payload 4: Arbitrary Custom Note Insertion
- **Target Path**: `/custom_notes/rogue-note-1`
- **Identity**: Requesting Auth `uid = "student-user-8"`
- **Rogue Payload**: `{ id: "rn-1", title: "Free Marks", category: "Science", content: "Pass easily", readingTimeMinutes: 1 }`
- **Vulnerability Targeted**: Standard study platform users attempting to generate or overwrite curriculum notes without being verified system editors.
- **Expected Action**: Rejected (PERMISSION_DENIED)

### Rogue Payload 5: Invalid Category Note Forgery
- **Target Path**: `/custom_notes/rogue-note-2`
- **Identity**: Requesting Auth `uid = "system-admin-uid"` (Admin authenticated)
- **Rogue Payload**: `{ id: "rn-2", title: "Rogue Study", category: "AdvancedPhysicsSlop", content: "Off-curriculum", readingTimeMinutes: 5 }`
- **Vulnerability Targeted**: Admin inserting non-standard subjects or categories in notes.
- **Expected Action**: Rejected (PERMISSION_DENIED)

### Rogue Payload 6: Negative Points Inflation
- **Target Path**: `/users/legit-student-1/progress/records`
- **Identity**: Requesting Auth `uid = "legit-student-1"`
- **Rogue Payload**: `{ score: -5000, studyTimeMinutes: -10 }`
- **Vulnerability Targeted**: Tampering with scoring statistics to corrupt metric databases with negative parameters.
- **Expected Action**: Rejected (PERMISSION_DENIED)

### Rogue Payload 7: Leaderboard Override (Identity Takeover)
- **Target Path**: `/leaderboard/victim-uid`
- **Identity**: Requesting Auth `uid = "attacker-uid"`
- **Rogue Payload**: `{ uid: "victim-uid", name: "I Was Hacked", score: 9999, quizzesCompleted: 100 }`
- **Vulnerability Targeted**: Overwriting another candidate's score on the global leaderboard registry.
- **Expected Action**: Rejected (PERMISSION_DENIED)

### Rogue Payload 8: Future Timestamp Forgery
- **Target Path**: `/student_activities/activity-1`
- **Identity**: Requesting Auth `uid = "legit-student-1"`
- **Rogue Payload**: `{ id: "act-1", userId: "legit-student-1", type: "quiz", title: "Took test", timestamp: "09:41 AM", createdAt: "2099-01-01T00:00:00Z" }`
- **Vulnerability Targeted**: Client bypassing sever-time invariants with user-controlled date strings.
- **Expected Action**: Rejected (PERMISSION_DENIED)

### Rogue Payload 9: Rogue Admin Actions Bypass
- **Target Path**: `/custom_quizzes/rogue-quiz-1`
- **Identity**: Requesting Auth `uid = "hacker-user-3"`
- **Rogue Payload**: `{ question: "Is this permitted?", options: ["Yes", "No"], correctIndex: 0 }`
- **Vulnerability Targeted**: Constructing mock quiz questions without administrator authorization.
- **Expected Action**: Rejected (PERMISSION_DENIED)

### Rogue Payload 10: Anonymous Writing to Public Records
- **Target Path**: `/leaderboard/anon-user`
- **Identity**: Anonymous Auth (not verified via standard login)
- **Rogue Payload**: `{ uid: "anon-user", score: 300, name: "Ghost" }`
- **Vulnerability Targeted**: Unauthorized, unverified accounts flooding Leaderboard files.
- **Expected Action**: Rejected (PERMISSION_DENIED)

### Rogue Payload 11: Shadow Parameter injection in updates
- **Target Path**: `/users/legit-student-1`
- **Identity**: Requesting Auth `uid = "legit-student-1"`
- **Rogue Payload**: `{ name: "Ramesh Shrestha", isAdminRole: true }`
- **Vulnerability Targeted**: Using dynamic updates to self-promote profiles into admin credentials (ghost parameters).
- **Expected Action**: Rejected (PERMISSION_DENIED)

### Rogue Payload 12: Quiz Options Length Underflow
- **Target Path**: `/custom_quizzes/quiz-9`
- **Identity**: Requesting Auth (Adminauthenticated)
- **Rogue Payload**: `{ id: "quiz-9", category: "Math", question: "1+1?", options: ["2"], correctIndex: 0 }`
- **Vulnerability Targeted**: Inserting an invalid quiz array format containing only 1 answer instead of the standard 4-options set.
- **Expected Action**: Rejected (PERMISSION_DENIED)

---

## 3. Test Runner Concept (Verifying Denied Attempts)

In a genuine test runner environment, the security rules would be evaluated using the `@firebase/rules-unit-testing` framework. Each test case maps directly to one of the "Dirty Dozen" payloads above, asserting that `firebase.assertFails()` completes successfully for each rouge write attempt.
