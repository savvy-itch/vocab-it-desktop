import { screen, render, fireEvent, cleanup } from '@testing-library/react';
import ProfileUsernameSection from './ProfileUsernameSection';

test.afterEach(cleanup);

jest.mock("next/font/local", () => function() {
  return {
        style: {
          fontFamily: 'arialRounded'
      }
    }
  }
);

const mockCheckSingleEdit = jest.fn();
mockCheckSingleEdit.mockReturnValue(true);

describe('username successfully updates', () => {
  // username exists
  test('on username edit button click, the input form appears', async () => {
    render(<ProfileUsernameSection checkSingleEdit={mockCheckSingleEdit} />)
    const editBtn = screen.getByLabelText('edit');
  
    // on username edit button, the input form appears;
    fireEvent.click(editBtn);
  
    const inputElement = await screen.findByTestId('username-input');
    expect(inputElement).toBeInTheDocument();
  })
  
  test('username input is editable', async () => {
    render(<ProfileUsernameSection checkSingleEdit={mockCheckSingleEdit} />)
    const inputElement = await screen.findByTestId('username-input');
  
    fireEvent.change(inputElement, { target: { value: 'jestuser'}});
  
    expect(inputElement.value).toBe('jestuser');
  
    const saveBtn = screen.getByLabelText('submit');
  
    // on username edit button, the input form appears;
    fireEvent.click(saveBtn);

    const usernamePara = await screen.findByText('jestuser');
    expect(usernamePara).toBeInTheDocument();
  })
})