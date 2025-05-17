import React from 'react';
import { render, screen, fireEvent } from '@/lib/test-utils';

describe('DOM Environment Enhancements', () => {
  it('supports ResizeObserver', () => {
    // Verify that ResizeObserver is defined
    expect(window.ResizeObserver).toBeDefined();

    // Create a test element
    const { container } = render(<div data-testid="resize-target">Resize Target</div>);
    const target = screen.getByTestId('resize-target');

    // Create a ResizeObserver with a mock callback
    const mockCallback = jest.fn();
    const resizeObserver = new ResizeObserver(mockCallback);

    // Verify that the observe method exists
    expect(resizeObserver.observe).toBeDefined();
    expect(resizeObserver.unobserve).toBeDefined();
    expect(resizeObserver.disconnect).toBeDefined();

    // We can't directly test the callback since it's mocked
    // But we can verify the observer was created successfully
    expect(typeof resizeObserver).toBe('object');
  });

  it('supports IntersectionObserver', () => {
    // Create an IntersectionObserver
    const intersectionCallback = jest.fn();
    const intersectionObserver = new IntersectionObserver(intersectionCallback);

    // Create a test element
    const { container } = render(<div data-testid="intersection-target">Intersection Target</div>);
    const target = screen.getByTestId('intersection-target');

    // Observe the element
    intersectionObserver.observe(target);

    // Trigger an intersection event
    const entries = [{
      target,
      isIntersecting: true,
      intersectionRatio: 1,
      boundingClientRect: {},
      intersectionRect: {},
      rootBounds: null,
      time: Date.now()
    }];
    (intersectionObserver as any)._triggerIntersection(entries);

    // Check that the callback was called
    expect(intersectionObserver.observe).toHaveBeenCalled();
    expect(intersectionCallback).toHaveBeenCalled();
  });

  it('supports window.matchMedia', () => {
    // Create a media query
    const mediaQuery = window.matchMedia('(min-width: 768px)');

    // Add a listener
    const listener = jest.fn();
    mediaQuery.addEventListener('change', listener);

    // Simulate a media query change
    (mediaQuery as any)._simulateChange(true);

    // Check that the listener was called
    expect(listener).toHaveBeenCalled();
    expect(mediaQuery.matches).toBe(true);
  });

  it('supports MutationObserver', () => {
    // Create a MutationObserver
    const mutationCallback = jest.fn();
    const mutationObserver = new MutationObserver(mutationCallback);

    // Create a test element
    const { container } = render(<div data-testid="mutation-target">Mutation Target</div>);
    const target = screen.getByTestId('mutation-target');

    // Observe the element
    mutationObserver.observe(target, { childList: true, subtree: true });

    // Trigger a mutation event
    const mutations = [{
      type: 'childList',
      target,
      addedNodes: [],
      removedNodes: [],
      previousSibling: null,
      nextSibling: null,
      attributeName: null,
      attributeNamespace: null,
      oldValue: null
    }];
    (mutationObserver as any)._simulateMutations(mutations);

    // Check that the callback was called
    expect(mutationObserver.observe).toBeDefined();
    expect(mutationCallback).toHaveBeenCalled();
  });

  it('supports window.getComputedStyle', () => {
    // Create a test element
    const { container } = render(<div data-testid="style-target">Style Target</div>);
    const target = screen.getByTestId('style-target');

    // Get computed style
    const computedStyle = window.getComputedStyle(target);

    // Check that the style properties are available
    expect(computedStyle.getPropertyValue('display')).toBe('block');
    expect(computedStyle.getPropertyValue('visibility')).toBe('visible');
    expect(computedStyle.display).toBe('block');
    expect(computedStyle.visibility).toBe('visible');
  });

  it('supports Element.prototype.closest', () => {
    // Create a test element
    const { container } = render(
      <div data-testid="parent" className="parent">
        <div data-testid="child" className="child">Child</div>
      </div>
    );

    const child = screen.getByTestId('child');
    const parent = child.closest('.parent');

    // Check that the closest method works
    expect(parent).not.toBeNull();
    expect(parent).toHaveAttribute('data-testid', 'parent');
  });
});
