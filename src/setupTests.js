import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Testing Library only cleans up on its own when test globals are on. They're off here.
afterEach(() => {
  cleanup();
});
