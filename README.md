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

## UI/UX changes

- **File separation:** moved all inline `<style>` and `<script>` blocks into `styles.css` and `app.js`.
- **Navbar:** module links are now evenly spread across the bar, the active "Home" pill is wider, the profile icon was replaced with a notification bell showing a "1" badge.
- **Search & filters toolbar:** restructured into two rows — (1) Search + "Search by field" + Add User, (2) Filters + Clear Filters — so nothing feels cramped on laptops.
- **Filters panel:** uses a CSS grid so it matches the table width exactly (previously Bootstrap row/col negative margins made it wider).
- **Desktop:** sidebar is fixed and always visible.
- **Tablets (<992px):** sidebar becomes an off-canvas drawer opened by the hamburger button, behind a backdrop.
- **Phones (<576px):**
  - Search + field select go full width.
  - Add User, Filters, and Clear Filters move into a floating action button (FAB) at the bottom-right corner.
  - Filter options open in a modal instead of the inline panel.
  - Edit/Add modal form fields stack into a single column; table action icons enlarge for touch.
- **Bug fix:** fixed pagination where the active page number blended into its background (missing `color:#fff` on the active state).
- **Bug fix:** fixed the "Home" link being clipped on laptop widths (centered flexbox overflow clipping).