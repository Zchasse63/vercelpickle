import React from 'react';
import { fireEvent } from '@/lib/test-utils';
import { createComponentTests, TestConfig } from '@/lib/test-factory';

/**
 * Creates a test suite for a button component
 */
export function createButtonTests<T extends React.ComponentType<any>>(
  component: T,
  options: Partial<TestConfig<T>> = {}
) {
  return createComponentTests({
    component,
    name: options.name || 'Button',
    type: 'interactive',
    testVariants: true,
    variantProp: 'variant' as keyof React.ComponentProps<T>,
    variants: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    variantClassNames: {
      default: ['bg-primary', 'text-primary-foreground'],
      destructive: ['bg-destructive', 'text-destructive-foreground'],
      outline: ['border', 'border-input'],
      secondary: ['bg-secondary', 'text-secondary-foreground'],
      ghost: ['hover:bg-accent', 'hover:text-accent-foreground'],
      link: ['text-primary', 'underline-offset-4'],
    },
    testSizes: true,
    sizeProp: 'size' as keyof React.ComponentProps<T>,
    sizes: ['default', 'sm', 'lg', 'icon'],
    sizeClassNames: {
      default: ['h-10', 'px-4', 'py-2'],
      sm: ['h-9', 'px-3'],
      lg: ['h-11', 'px-8'],
      icon: ['h-10', 'w-10'],
    },
    testEvents: true,
    events: [
      {
        name: 'click',
        handlerProp: 'onClick' as keyof React.ComponentProps<T>,
        action: (element) => fireEvent.click(element),
      },
    ],
    testStates: true,
    states: [
      {
        name: 'disabled',
        props: { disabled: true } as Partial<React.ComponentProps<T>>,
        expectedClassNames: ['opacity-50', 'cursor-not-allowed'],
        expectedAttributes: { 'disabled': '' },
      },
      {
        name: 'loading',
        props: { isLoading: true } as Partial<React.ComponentProps<T>>,
        expectedClassNames: ['cursor-wait'],
        expectedAttributes: { 'aria-busy': 'true' },
      },
    ],
    ...options,
  });
}

/**
 * Creates a test suite for a form input component
 */
export function createInputTests<T extends React.ComponentType<any>>(
  component: T,
  options: Partial<TestConfig<T>> = {}
) {
  return createComponentTests({
    component,
    name: options.name || 'Input',
    type: 'form',
    testForm: true,
    inputValue: 'Test input',
    expectedValue: 'Test input',
    testEvents: true,
    events: [
      {
        name: 'change',
        handlerProp: 'onChange' as keyof React.ComponentProps<T>,
        action: (element) => fireEvent.change(element, { target: { value: 'Test input' } }),
      },
      {
        name: 'focus',
        handlerProp: 'onFocus' as keyof React.ComponentProps<T>,
        action: (element) => fireEvent.focus(element),
      },
      {
        name: 'blur',
        handlerProp: 'onBlur' as keyof React.ComponentProps<T>,
        action: (element) => fireEvent.blur(element),
      },
    ],
    testStates: true,
    states: [
      {
        name: 'disabled',
        props: { disabled: true } as Partial<React.ComponentProps<T>>,
        expectedClassNames: ['opacity-50', 'cursor-not-allowed'],
        expectedAttributes: { 'disabled': '' },
      },
      {
        name: 'readonly',
        props: { readOnly: true } as Partial<React.ComponentProps<T>>,
        expectedClassNames: ['cursor-default'],
        expectedAttributes: { 'readonly': '' },
      },
    ],
    ...options,
  });
}

/**
 * Creates a test suite for a card component
 */
export function createCardTests<T extends React.ComponentType<any>>(
  component: T,
  options: Partial<TestConfig<T>> = {}
) {
  return createComponentTests({
    component,
    name: options.name || 'Card',
    type: 'layout',
    testCompound: true,
    subcomponents: [
      {
        name: 'Header',
        children: 'Header Content',
        expectedClassNames: ['p-6'],
      },
      {
        name: 'Title',
        children: 'Card Title',
        expectedClassNames: ['text-2xl', 'font-semibold'],
      },
      {
        name: 'Description',
        children: 'Card Description',
        expectedClassNames: ['text-sm', 'text-muted-foreground'],
      },
      {
        name: 'Content',
        children: 'Card Content',
        expectedClassNames: ['p-6', 'pt-0'],
      },
      {
        name: 'Footer',
        children: 'Card Footer',
        expectedClassNames: ['p-6', 'pt-0'],
      },
    ],
    ...options,
  });
}

/**
 * Creates a test suite for a select component
 */
export function createSelectTests<T extends React.ComponentType<any>>(
  component: T,
  options: Partial<TestConfig<T>> = {}
) {
  return createComponentTests({
    component,
    name: options.name || 'Select',
    type: 'form',
    testEvents: true,
    events: [
      {
        name: 'change',
        handlerProp: 'onChange' as keyof React.ComponentProps<T>,
        action: (element) => fireEvent.change(element, { target: { value: 'option1' } }),
      },
    ],
    testStates: true,
    states: [
      {
        name: 'disabled',
        props: { disabled: true } as Partial<React.ComponentProps<T>>,
        expectedClassNames: ['opacity-50', 'cursor-not-allowed'],
        expectedAttributes: { 'disabled': '' },
      },
    ],
    ...options,
  });
}

/**
 * Creates a test suite for a checkbox component
 */
export function createCheckboxTests<T extends React.ComponentType<any>>(
  component: T,
  options: Partial<TestConfig<T>> = {}
) {
  return createComponentTests({
    component,
    name: options.name || 'Checkbox',
    type: 'form',
    testEvents: true,
    events: [
      {
        name: 'change',
        handlerProp: 'onChange' as keyof React.ComponentProps<T>,
        action: (element) => fireEvent.click(element),
      },
    ],
    testStates: true,
    states: [
      {
        name: 'checked',
        props: { checked: true } as Partial<React.ComponentProps<T>>,
        expectedClassNames: [],
        expectedAttributes: { 'data-state': 'checked' },
      },
      {
        name: 'disabled',
        props: { disabled: true } as Partial<React.ComponentProps<T>>,
        expectedClassNames: ['opacity-50', 'cursor-not-allowed'],
        expectedAttributes: { 'disabled': '' },
      },
    ],
    ...options,
  });
}

/**
 * Creates a test suite for a dialog component
 */
export function createDialogTests<T extends React.ComponentType<any>>(
  component: T,
  options: Partial<TestConfig<T>> = {}
) {
  return createComponentTests({
    component,
    name: options.name || 'Dialog',
    type: 'feedback',
    testCompound: true,
    subcomponents: [
      {
        name: 'Trigger',
        children: 'Open Dialog',
      },
      {
        name: 'Content',
        children: 'Dialog Content',
        expectedClassNames: ['bg-background'],
      },
      {
        name: 'Header',
        children: 'Dialog Header',
      },
      {
        name: 'Title',
        children: 'Dialog Title',
        expectedClassNames: ['text-lg', 'font-semibold'],
      },
      {
        name: 'Description',
        children: 'Dialog Description',
        expectedClassNames: ['text-sm', 'text-muted-foreground'],
      },
      {
        name: 'Footer',
        children: 'Dialog Footer',
        expectedClassNames: ['flex'],
      },
    ],
    ...options,
  });
}

/**
 * Creates a test suite for a tabs component
 */
export function createTabsTests<T extends React.ComponentType<any>>(
  component: T,
  options: Partial<TestConfig<T>> = {}
) {
  return createComponentTests({
    component,
    name: options.name || 'Tabs',
    type: 'navigation',
    testCompound: true,
    subcomponents: [
      {
        name: 'List',
        children: 'Tabs List',
        expectedClassNames: ['flex'],
      },
      {
        name: 'Trigger',
        children: 'Tab Trigger',
        expectedClassNames: ['inline-flex', 'items-center'],
      },
      {
        name: 'Content',
        children: 'Tab Content',
        expectedClassNames: ['mt-2'],
      },
    ],
    ...options,
  });
}
