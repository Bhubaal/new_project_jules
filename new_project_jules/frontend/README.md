# Enterprise Analytics Dashboard - React + Vite + MUI

This project is a sophisticated analytics dashboard built with React, Vite, TypeScript, and Material-UI (MUI). It features a modular design with custom theming, reusable components, and data visualization.

## Project Structure Overview

-   **`src/`**: Contains all the application source code.
    -   **`components/` (Implicit through file organization)**: Reusable UI components like `MetricCard.tsx`, `ChartSection.tsx`, `FilterToolbar.tsx`, `DataTable.tsx`.
    -   **`Dashboard.tsx`**: The main component assembling the dashboard layout and various sections.
    -   **`DashboardLayout.tsx`**: Provides the main application frame (header, sidebar).
    -   **`theme.ts`**: Defines custom light/dark themes, brand colors (currently placeholders), typography, and spacing. Includes a hook (`useColorMode`) to toggle themes and persist user preference.
    -   **`App.tsx`**: Root application component, integrates `DashboardLayout`.
    -   **`main.tsx`**: Entry point of the application, sets up theme providers.
-   **`public/`**: Static assets.
-   **`index.html`**: Main HTML page.
-   **`vite.config.ts`**: Vite configuration.
-   **`tsconfig.json`**: TypeScript configuration.

## Getting Started

### Prerequisites

-   Node.js (v18.x or later recommended)
-   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd <project-directory>
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    # yarn install
    ```

### Running the Development Server

To start the Vite development server with Hot Module Replacement (HMR):

```bash
npm run dev
# or
# yarn dev
```

The application will typically be available at `http://localhost:5173`.

### Building for Production

To create an optimized production build:

```bash
npm run build
# or
# yarn build
```

The production-ready files will be generated in the `dist/` directory.

## Key Features

### 1. Theming (Light/Dark Mode)

-   **Custom Themes**: Defined in `src/theme.ts` with placeholder brand colors. You can customize these to match your brand identity.
-   **Toggle Theme**: A theme toggle button is available in the application header (part of `DashboardLayout.tsx`).
-   **Persistence**: User's theme preference (light/dark) is saved in `localStorage` and applied on subsequent visits.

### 2. Dashboard Components

-   **`MetricCard.tsx`**: Displays key metrics with a title, value, optional icon, and color coding. Includes skeleton loading states.
-   **`ChartSection.tsx`**: Integrates Recharts for data visualization. Currently includes:
    -   Bar Chart (Monthly Usage)
    -   Line Chart (Leave Trend)
    -   Pie Chart (Leave Types Distribution)
    -   Features tooltips, legends, and a drill-down drawer that opens on chart interaction (e.g., clicking a bar or pie slice).
-   **`FilterToolbar.tsx`**: Provides filtering capabilities:
    -   Date Range Picker
    -   Multi-select User Filter (with mock user data)
    -   Debounced Search Field
    -   (Stubbed for React Query integration for actual data filtering)
-   **`DataTable.tsx`**: An MUI `DataGrid` component displaying tabular data with mock records. Features pagination, sorting, and selection.

### 3. Layout and Navigation

-   **`DashboardLayout.tsx`**: A responsive layout with a persistent header and a collapsible sidebar drawer.
-   **Lazy Loading**: `ChartSection` and `DataTable` are lazy-loaded using `React.Suspense` to improve initial page load performance.

### 4. Data Handling (Mock Data)

Currently, the dashboard uses hard-coded mock data in several components:
-   `Dashboard.tsx` (for metric card summaries)
-   `ChartSection.tsx` (for chart data)
-   `DataTable.tsx` (for the data grid)
-   `FilterToolbar.tsx` (for user selection in the filter)

**To Swap Mock Data for Real API Endpoints:**

1.  **Identify Data Sources**: Determine where your actual data will come from (e.g., REST APIs, GraphQL).
2.  **API Integration Service/Hooks**:
    -   Consider creating utility functions or custom hooks (e.g., using `fetch`, `axios`, or a data fetching library like React Query/SWR) to encapsulate API calls.
    -   Example: `src/services/api.ts` or `src/hooks/useLeaveData.ts`.
3.  **Update Components**:
    -   **`Dashboard.tsx` / `MetricCard.tsx`**: Fetch summary data and pass it to `MetricCard` props. Update the `useEffect` in `Dashboard.tsx` or implement data fetching hooks.
    -   **`ChartSection.tsx`**: Fetch data required for the charts. Replace `monthlyLeaveData` and `leaveTypeData` with fetched data. You might need to transform API responses into the format Recharts expects.
    -   **`DataTable.tsx`**: Fetch data for the `DataGrid`. The `rows` prop should be populated with data from your API.
    -   **`FilterToolbar.tsx`**:
        -   For the user filter, fetch a list of users to populate the multi-select.
        -   The `onFiltersChange` callback (or a similar mechanism if using React Query) should trigger API calls with the selected filter parameters (date range, users, search term). The fetched data should then update the relevant sections of the dashboard (charts, table).
4.  **State Management for Fetched Data**:
    -   Use `useState` and `useEffect` for simple cases.
    -   For more complex scenarios, especially with caching, refetching, and server state synchronization, **React Query** (or SWR) is highly recommended. The plan includes installing `react-query`, so this would be the next logical step for real data integration.
    -   Example with React Query (conceptual):
        ```typescript jsx
        // In ChartSection.tsx
        // import { useQuery } from 'react-query';
        // const { data: chartData, isLoading, error } = useQuery(['leaveStats', filters], fetchLeaveStatsFunction);
        // // ... use chartData in your charts
        ```
5.  **Loading and Error States**:
    -   Utilize the `loading` props in components like `MetricCard`.
    -   For data fetching, implement proper loading indicators (skeletons, spinners) and error handling (displaying error messages). React Query provides `isLoading`, `isError`, `error` states.

### 5. Accessibility & Optimization

-   **Accessibility**: Core MUI components are used, which have good built-in accessibility. Basic ARIA roles and keyboard navigation are supported.
-   **Optimization**:
    -   Code-splitting for `ChartSection` and `DataTable` via `React.lazy` and `Suspense`.
    -   Vite provides optimized builds with tree-shaking.

## Original Vite README Content

(The following is the original README content from the Vite React-TS template for reference.)

---

# React + TypeScript + Vite (Original)

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration (Original)

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
