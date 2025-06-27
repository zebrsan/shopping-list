import { test } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from './page';

test('Page', () => {
  render(<Home />);
  screen.getByText('買い物リスト');
});
