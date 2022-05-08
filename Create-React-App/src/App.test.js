import * as React from 'react';
import {render, fireEvent} from '@testing-library/react';
import CreateAccount from './Components/createaccount';

test('CreateAccount', () => {
  const {getByRole,getByPlaceholderText} = render(<CreateAccount/>);
  getByPlaceholderText('Enter name');
  getByPlaceholderText('Enter email');
  getByPlaceholderText('Enter password');
  getByRole('button');
});

test("user with invalid email and password", () => {
  const {getByRole,getByText,getByDisplayValue,getByPlaceholderText} = render(<CreateAccount/>);
  const name = getByPlaceholderText('Enter name');
  fireEvent.change(name, {target:{value:'John Doe'}});
  getByDisplayValue('John Doe');
  const email = getByPlaceholderText('Enter email');
  fireEvent.change(email, {target:{value:'JohnDoe@email'}});
  getByDisplayValue('JohnDoe@email');
  const pwd = getByPlaceholderText('Enter password');
  fireEvent.change(pwd, {target:{value:'1234567'}});
  getByDisplayValue('1234567');
  const button = getByRole('button');
  fireEvent.click(button);
  getByText('password must be at least 8 characters');
  getByText('email is not valid');
});