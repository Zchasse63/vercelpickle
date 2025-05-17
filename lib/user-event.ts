import { fireEvent } from '@testing-library/react';

/**
 * A custom implementation of user-event to provide more realistic user interactions
 * This is a simplified version of @testing-library/user-event
 */
export class UserEvent {
  /**
   * Setup a new UserEvent instance
   */
  static setup(options: { delay?: number } = {}) {
    return new UserEvent(options);
  }

  private delay: number;

  constructor(options: { delay?: number } = {}) {
    this.delay = options.delay || 0;
  }

  /**
   * Simulate a user clicking on an element
   */
  async click(element: Element | null) {
    if (!element) {
      throw new Error('Cannot click on null element');
    }

    // Focus the element first (like a real user interaction)
    fireEvent.focus(element);
    
    // Then click it
    fireEvent.mouseOver(element);
    fireEvent.mouseMove(element);
    fireEvent.mouseDown(element);
    fireEvent.mouseUp(element);
    fireEvent.click(element);
    
    // Wait for the specified delay
    if (this.delay > 0) {
      await new Promise(resolve => setTimeout(resolve, this.delay));
    }
    
    return undefined;
  }

  /**
   * Simulate a user double-clicking on an element
   */
  async dblClick(element: Element | null) {
    if (!element) {
      throw new Error('Cannot double-click on null element');
    }

    // Focus the element first
    fireEvent.focus(element);
    
    // Then double-click it
    fireEvent.mouseOver(element);
    fireEvent.mouseMove(element);
    fireEvent.mouseDown(element);
    fireEvent.mouseUp(element);
    fireEvent.click(element);
    fireEvent.mouseDown(element);
    fireEvent.mouseUp(element);
    fireEvent.click(element);
    fireEvent.dblClick(element);
    
    // Wait for the specified delay
    if (this.delay > 0) {
      await new Promise(resolve => setTimeout(resolve, this.delay));
    }
    
    return undefined;
  }

  /**
   * Simulate a user typing text
   */
  async type(element: Element | null, text: string, options: { delay?: number } = {}) {
    if (!element) {
      throw new Error('Cannot type in null element');
    }

    const isContentEditable = element.hasAttribute('contenteditable') && 
      element.getAttribute('contenteditable') !== 'false';
    
    // Focus the element first
    fireEvent.focus(element);
    
    // Clear the input if it's an input or textarea
    if ((element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') && !isContentEditable) {
      fireEvent.change(element, { target: { value: '' } });
    }
    
    // Type each character with a delay
    const typeDelay = options.delay || this.delay;
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      
      // Simulate keydown, keypress, and keyup events
      fireEvent.keyDown(element, { key: char, code: `Key${char.toUpperCase()}` });
      fireEvent.keyPress(element, { key: char, code: `Key${char.toUpperCase()}` });
      
      // Update the input value
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        const currentValue = (element as HTMLInputElement).value || '';
        const newValue = currentValue + char;
        fireEvent.change(element, { target: { value: newValue } });
      } else if (isContentEditable) {
        // For contenteditable elements
        const currentText = element.textContent || '';
        element.textContent = currentText + char;
      }
      
      fireEvent.keyUp(element, { key: char, code: `Key${char.toUpperCase()}` });
      
      // Wait for the specified delay between keystrokes
      if (typeDelay > 0) {
        await new Promise(resolve => setTimeout(resolve, typeDelay));
      }
    }
    
    // Trigger input and change events
    fireEvent.input(element);
    fireEvent.change(element);
    
    return undefined;
  }

  /**
   * Simulate a user clearing an input field
   */
  async clear(element: Element | null) {
    if (!element) {
      throw new Error('Cannot clear null element');
    }

    // Focus the element first
    fireEvent.focus(element);
    
    // Clear the input
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
      fireEvent.change(element, { target: { value: '' } });
    } else if (element.hasAttribute('contenteditable') && 
               element.getAttribute('contenteditable') !== 'false') {
      element.textContent = '';
    }
    
    // Trigger input and change events
    fireEvent.input(element);
    fireEvent.change(element);
    
    // Wait for the specified delay
    if (this.delay > 0) {
      await new Promise(resolve => setTimeout(resolve, this.delay));
    }
    
    return undefined;
  }

  /**
   * Simulate keyboard navigation
   */
  async keyboard(input: string) {
    const specialKeys: Record<string, string> = {
      '{enter}': 'Enter',
      '{esc}': 'Escape',
      '{escape}': 'Escape',
      '{backspace}': 'Backspace',
      '{del}': 'Delete',
      '{delete}': 'Delete',
      '{tab}': 'Tab',
      '{arrowleft}': 'ArrowLeft',
      '{arrowright}': 'ArrowRight',
      '{arrowup}': 'ArrowUp',
      '{arrowdown}': 'ArrowDown',
      '{space}': ' ',
    };
    
    // Process the input string
    let i = 0;
    while (i < input.length) {
      // Check for special keys
      let found = false;
      for (const [pattern, key] of Object.entries(specialKeys)) {
        if (input.substring(i).startsWith(pattern)) {
          // Simulate the special key press
          fireEvent.keyDown(document.activeElement || document.body, { key });
          fireEvent.keyUp(document.activeElement || document.body, { key });
          
          i += pattern.length;
          found = true;
          break;
        }
      }
      
      if (!found) {
        // Regular character
        const char = input[i];
        fireEvent.keyDown(document.activeElement || document.body, { key: char });
        fireEvent.keyPress(document.activeElement || document.body, { key: char });
        fireEvent.keyUp(document.activeElement || document.body, { key: char });
        
        // If there's an active input element, update its value
        if (document.activeElement && 
            (document.activeElement.tagName === 'INPUT' || 
             document.activeElement.tagName === 'TEXTAREA')) {
          const inputElement = document.activeElement as HTMLInputElement;
          const currentValue = inputElement.value || '';
          const newValue = currentValue + char;
          fireEvent.change(inputElement, { target: { value: newValue } });
        }
        
        i++;
      }
      
      // Wait for the specified delay
      if (this.delay > 0) {
        await new Promise(resolve => setTimeout(resolve, this.delay));
      }
    }
    
    return undefined;
  }

  /**
   * Simulate a user tabbing through the document
   */
  async tab({ shift = false } = {}) {
    fireEvent.keyDown(document.activeElement || document.body, { key: 'Tab', shiftKey: shift });
    fireEvent.keyUp(document.activeElement || document.body, { key: 'Tab', shiftKey: shift });
    
    // Wait for the specified delay
    if (this.delay > 0) {
      await new Promise(resolve => setTimeout(resolve, this.delay));
    }
    
    return undefined;
  }
}

// Default export for convenience
export default UserEvent;
