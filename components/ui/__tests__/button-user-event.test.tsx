import React from 'react';
import { render, screen, setupUserEvent } from '@/lib/test-utils-extended';
import { Button } from '@/components/ui/button';

describe('Button Component with UserEvent', () => {
  it('handles click events with UserEvent', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByText('Click me');
    const user = setupUserEvent();

    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('handles keyboard events with UserEvent', async () => {
    const handleKeyDown = jest.fn();
    render(
      <Button onKeyDown={e => {
        handleKeyDown(e);
        if (e.key === 'Enter') {
          e.currentTarget.click();
        }
      }}>
        Press Enter
      </Button>
    );

    const button = screen.getByText('Press Enter');
    button.focus();

    const user = setupUserEvent();

    await user.keyboard('{enter}');

    expect(handleKeyDown).toHaveBeenCalledTimes(1);
  });

  it('handles disabled state correctly with UserEvent', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} disabled>Disabled Button</Button>);

    const button = screen.getByText('Disabled Button');
    const user = setupUserEvent();

    await user.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('handles loading state correctly with UserEvent', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} isLoading>Loading Button</Button>);

    const button = screen.getByText('Loading Button');
    const user = setupUserEvent();

    await user.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('handles double-click events with UserEvent', async () => {
    const handleDoubleClick = jest.fn();
    render(<Button onDoubleClick={handleDoubleClick}>Double-click me</Button>);

    const button = screen.getByText('Double-click me');
    const user = setupUserEvent();

    await user.dblClick(button);

    expect(handleDoubleClick).toHaveBeenCalledTimes(1);
  });
});
