import { cleanup, render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import Footer from './Footer';

test.afterEach(cleanup);

test('footer is on the page', () => {
  render(<Footer />);
  const footerElement = screen.getByTestId('footer');
  expect(footerElement).toBeInTheDocument;
})