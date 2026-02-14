# Walkthrough - WOS Calc Refactoring & Features

## Refactoring Overview (Previous Step)
Refactored `index.html` to improve code structure and maintainability.
- **Code Deduplication**: Unified output generation logic into `generateOutputText`.
- **Constants**: Consolidated magic strings and numbers into `CONSTANTS`.
- **Validation**: Verified `calcFromTarget` and `calcFromDelay` work exactly as before.

## Feature: Leader Management (Delete & Sort)
Values the user's request to manage leaders individually.

### Changes
1.  **SortableJS Integration**:
    - Added `SortableJS` CDN to enable drag-and-drop reordering.
    - Added "≡" drag handle to each leader row.
    - Rows can now be reordered, and the order is saved to LocalStorage.

2.  **Delete Functionality**:
    - Added "×" delete button to each leader row.
    - Implementing `deleteLeader` function to remove specific rows.
    - **Minimum Row Maintenance**: Ensures there are always at least 5 rows by appending empty rows when one is deleted.

### Verification & Bug Fix
During verification, a bug was found where deleting a row after sorting would remove the wrong row (due to index mismatch).
- **Fix**: Updated `deleteLeader` to find the row index dynamically using the DOM element (`btn.closest('.leader-row')`) instead of relying on the index passed at render time.
- **Verification**: Confirmed that deleting a sorted row works correctly using a fresh test file (`index_debug.html`) to bypass browser caching issues.

### Screenshots
| Feature | Screenshot |
| :--- | :--- |
| **Initial State** | ![Initial State](file:///Users/takahironochiseabirdinc./.gemini/antigravity/brain/60738c73-d700-4238-b66e-638d31bb68ea/initial_state_1771033808368.png) |
| **Reordering** | ![Reordering](file:///Users/takahironochiseabirdinc./.gemini/antigravity/brain/60738c73-d700-4238-b66e-638d31bb68ea/.system_generated/click_feedback/click_feedback_1771034155561.png) |

### Video
![Verification Video](file:///Users/takahironochiseabirdinc./.gemini/antigravity/brain/60738c73-d700-4238-b66e-638d31bb68ea/debug_leader_deletion_3_1771034131289.webp)
