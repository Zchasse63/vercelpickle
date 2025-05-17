import React from 'react';
import { render, screen } from '@/lib/test-utils';
import UserEvent from '@/lib/user-event';

describe('UserEvent', () => {
  it('simulates clicking on an element', async () => {
    const handleClick = jest.fn();
    render(<button onClick={handleClick}>Click me</button>);

    const button = screen.getByText('Click me');
    const user = UserEvent.setup();

    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('simulates typing in an input field', async () => {
    const handleChange = jest.fn();
    render(
      <input
        type="text"
        onChange={handleChange}
        placeholder="Type here"
        data-testid="input-field"
      />
    );

    const input = screen.getByTestId('input-field');
    const user = UserEvent.setup();

    await user.type(input, 'Hello, world!');

    expect(input).toHaveValue('Hello, world!');
    expect(handleChange).toHaveBeenCalled();
  });

  it('simulates clearing an input field', async () => {
    render(
      <input
        type="text"
        defaultValue="Initial text"
        data-testid="input-field"
      />
    );

    const input = screen.getByTestId('input-field');
    const user = UserEvent.setup();

    expect(input).toHaveValue('Initial text');

    await user.clear(input);

    expect(input).toHaveValue('');
  });

  it('simulates keyboard navigation', async () => {
    const handleKeyDown = jest.fn();
    render(
      <div onKeyDown={handleKeyDown} tabIndex={0} data-testid="container">
        <input data-testid="input-1" />
        <input data-testid="input-2" />
      </div>
    );

    const container = screen.getByTestId('container');
    container.focus();

    const user = UserEvent.setup();

    await user.keyboard('{tab}');
    await user.keyboard('{enter}');

    expect(handleKeyDown).toHaveBeenCalledTimes(2);
  });

  it('simulates keyboard events', async () => {
    const handleKeyDown = jest.fn();
    render(
      <div>
        <input data-testid="input-1" onKeyDown={handleKeyDown} />
        <button data-testid="button" onKeyDown={handleKeyDown}>Click me</button>
      </div>
    );

    const input1 = screen.getByTestId('input-1');
    input1.focus();

    const user = UserEvent.setup();

    await user.keyboard('{enter}');
    expect(handleKeyDown).toHaveBeenCalledTimes(1);

    const button = screen.getByTestId('button');
    button.focus();

    await user.keyboard('{space}');
    expect(handleKeyDown).toHaveBeenCalledTimes(2);
  });

  it('simulates double-clicking on an element', async () => {
    const handleDoubleClick = jest.fn();
    render(<button onDoubleClick={handleDoubleClick}>Double-click me</button>);

    const button = screen.getByText('Double-click me');
    const user = UserEvent.setup();

    await user.dblClick(button);

    expect(handleDoubleClick).toHaveBeenCalledTimes(1);
  });

  it('handles delay between user actions', async () => {
    jest.useFakeTimers();

    const handleClick = jest.fn();
    render(<button onClick={handleClick}>Click me</button>);

    const button = screen.getByText('Click me');
    const user = UserEvent.setup({ delay: 100 });

    const clickPromise = user.click(button);

    // Fast-forward time
    jest.advanceTimersByTime(100);

    await clickPromise;

    expect(handleClick).toHaveBeenCalledTimes(1);

    jest.useRealTimers();
  });
});
