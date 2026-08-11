import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Testing Library's automatic cleanup relies on test globals; we keep
// globals off, so unmount rendered trees between tests explicitly.
afterEach(cleanup);
