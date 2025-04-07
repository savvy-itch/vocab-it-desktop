import { screen, render, fireEvent, cleanup } from '@testing-library/react';
import ProfileAddVocabSection from './ProfileAddVocabSection';

test.afterEach(cleanup);

jest.mock("next/font/local", () => function() {
  return {
        style: {
          fontFamily: 'arialRounded'
      }
    }
  }
);
jest.mock('nanoid', () => {
  return { nanoid: () => '1234'};
});

const mockCheckSingleEdit = jest.fn();
mockCheckSingleEdit.mockReturnValue(true);

describe('new vocab added to the list', () => {
  test('enter add vocab mode', async () => {
    render(<ProfileAddVocabSection checkSingleEdit={mockCheckSingleEdit} />);
    const addBtn = screen.getByRole('button', {name: /Add Vocabulary/i});

    fireEvent.click(addBtn);

    const addVocabInput = await screen.findByTestId('vocab-input');
    expect(addVocabInput).toBeInTheDocument();
  });

  test('new vocab added', async () => {
    render(<ProfileAddVocabSection checkSingleEdit={mockCheckSingleEdit} />);
    const addVocabInput = await screen.findByTestId('vocab-input');
    const createBtn = screen.getByRole('button', {name: 'create'});

    fireEvent.change(addVocabInput, { target: { value: 'jestvocab'}});
    expect(addVocabInput.value).toBe('jestvocab');

    fireEvent.click(createBtn);
    const vocabElement = await screen.findByText('jestvocab');
    expect(vocabElement).toBeInTheDocument();
  });
});

test('vocab title changed', async () => {
  render(<ProfileAddVocabSection checkSingleEdit={mockCheckSingleEdit} />);
  const vocabElement = await screen.findByText('jestvocab');
  expect(vocabElement).toBeInTheDocument();

  const editBtn = screen.getByRole('button', {name: 'edit'});

  fireEvent.click(editBtn);
  const editInput = screen.getByDisplayValue('jestvocab');
  expect(editInput).toBeInTheDocument();
  
  fireEvent.change(editInput, { target: { value: 'edited title'}});
  expect(editInput.value).toBe('edited title');

  const saveBtn = screen.getByLabelText('save');
  fireEvent.click(saveBtn);
  const editedTitle = screen.getByText('edited title');
  expect(editedTitle).toBeInTheDocument();
});

test('vocab should be deleted', () => {
  render(<ProfileAddVocabSection checkSingleEdit={mockCheckSingleEdit} />);
  const deleteBtn = screen.getByLabelText('delete');

  fireEvent.click(deleteBtn);
  const dialogElement = screen.getByText('Are you sure you want to delete this vocabulary?');
  expect(dialogElement).toBeInTheDocument();

  const confirmBtn = screen.getByRole('button', {name: 'OK'});
  fireEvent.click(confirmBtn);
  expect(dialogElement).not.toBeInTheDocument();
  expect(screen.getByText('No vocabularies')).toBeInTheDocument();
})