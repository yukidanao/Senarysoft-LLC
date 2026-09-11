# Senarysoft LLC — User Management (Edit Users)

A front-end assessment implementing a **User Management — Edit Users** page: a searchable, filterable, sortable, paginated user table with add / edit / deactivate workflows. Built with plain HTML, CSS, and JavaScript (no build tools) on top of Bootstrap 5 and Font Awesome via CDN.

## How to run

No build step or package install is required.

**Option A — Open directly:**
Open `index.html` in any modern browser (double-click it or drag into a browser window).

**Option B — Local server (recommended to avoid any file-path edge cases):**

```bash
# Python 3
python -m http.server 8080

# or Node.js
npx serve .
```

Then visit `http://localhost:8080`.

> Note: the page is fully client-side. All user data is mock data defined in `app.js`; nothing persists after a refresh.

## Project structure

```
.
├── index.html   # Page markup (structure only)
├── styles.css   # All custom styling
└── app.js       # All behaviour, state, and mock data
```

## Approach

- **Separation of concerns:** HTML, CSS, and JavaScript are split into `index.html`, `styles.css`, and `app.js` for maintainability.
- **State-driven rendering:** a single `state` object holds the active search term, search field, filters (status / region / division / group), sort key/direction, and current page. Every interaction updates `state` and re-renders the table, pagination, and sort icons via the `render()` pipeline.
- **Client-side filtering & sorting:** `getFiltered()` applies the current filters and search, then sorts by the active column. Pagination slices the filtered result (10 rows per page).
- **In-memory CRUD:** Add and Edit operate on the mock `users` array in memory, then re-render. Deactivation toggles a user's status to `Inactive`.
- **Responsive UX:** the layout adapts for desktops, laptops, tablets, and phones (see UI/UX changes).

## Assumptions

- This is a **front-end only** assessment — there is no backend/API. Data is hard-coded mock data; changes are lost on refresh.
- "Username/Email" is treated as a single field (`email`).
- User `id` values are treated as unique string keys (e.g. `"0513"`).
- No authentication or role-based permissions are implemented; the navbar "M. Greevos" user chip, module links, and search button are decorative placeholders.
- Deactivating a user clears its `enabled` date and sets status to `Inactive`.
- The Add User and Edit User forms do not include a User Type field; User Type is not editable and renders as empty (`—`) in the table for all mocked users.

## UI/UX Changes

1. **Navbar search icon** — Replaced the button with a smaller, modern search icon inside a circular container.
2. **Background** — Removed the light blue background that visually detached the main body from the navbar; the page now looks more modern and cohesive.
3. **Side menu** — Reduced the size of the icons and text for better size harmony.
4. **Filter options** — Redesigned to fit in a single row in their own container, with the dropdowns equally wide so they span the full width of the table.
5. **Table** — Adopted a more modern table style, added color coding to the Group column, and applied proper colors to the action buttons.
6. **Add User button** — Switched to a plain light green, removing the emerald-style look so it matches the color and style of the Filters button.
7. **Sorting** — Added click-to-sort on every table column.
8. **Floating tool** — On smaller devices, a floating action button opens options for adding a user, applying filters, and clearing filters.