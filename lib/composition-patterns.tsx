import React from 'react';
import { composeComponents, ComponentToCompose } from '@/lib/component-composition';

/**
 * Creates a form field component from a label, input, and message component
 * 
 * @example
 * ```tsx
 * const FormField = createFormField({
 *   label: Label,
 *   input: Input,
 *   message: FormMessage,
 * });
 * ```
 */
export function createFormField({
  label,
  input,
  message,
  name = 'FormField',
}: {
  label: React.ComponentType<any>;
  input: React.ComponentType<any>;
  message?: React.ComponentType<any>;
  name?: string;
}) {
  const components: ComponentToCompose[] = [
    { component: label },
    { component: input },
  ];
  
  if (message) {
    components.push({
      component: message,
      condition: (props) => !!props.error || !!props.message,
    });
  }
  
  return composeComponents(
    {
      name,
      type: 'vertical',
      gap: 'xs',
      align: 'start',
    },
    components
  );
}

/**
 * Creates a card component with header, content, and footer
 * 
 * @example
 * ```tsx
 * const ProductCard = createCard({
 *   header: ProductHeader,
 *   content: ProductContent,
 *   footer: ProductFooter,
 * });
 * ```
 */
export function createCard({
  header,
  content,
  footer,
  name = 'Card',
}: {
  header?: React.ComponentType<any>;
  content: React.ComponentType<any>;
  footer?: React.ComponentType<any>;
  name?: string;
}) {
  const components: ComponentToCompose[] = [];
  
  if (header) {
    components.push({ component: header });
  }
  
  components.push({ component: content });
  
  if (footer) {
    components.push({ component: footer });
  }
  
  return composeComponents(
    {
      name,
      type: 'vertical',
      gap: 'md',
      className: 'rounded-lg border bg-card p-4 shadow-sm',
    },
    components
  );
}

/**
 * Creates a button group component
 * 
 * @example
 * ```tsx
 * const ButtonGroup = createButtonGroup({
 *   buttons: [
 *     { component: Button, props: { variant: 'default' } },
 *     { component: Button, props: { variant: 'outline' } },
 *   ],
 * });
 * ```
 */
export function createButtonGroup({
  buttons,
  orientation = 'horizontal',
  name = 'ButtonGroup',
}: {
  buttons: ComponentToCompose[];
  orientation?: 'horizontal' | 'vertical';
  name?: string;
}) {
  return composeComponents(
    {
      name,
      type: orientation,
      gap: 'sm',
      align: 'center',
      justify: 'start',
      className: 'inline-flex',
    },
    buttons
  );
}

/**
 * Creates a layout component with header, sidebar, content, and footer
 * 
 * @example
 * ```tsx
 * const Layout = createLayout({
 *   header: Header,
 *   sidebar: Sidebar,
 *   content: Content,
 *   footer: Footer,
 * });
 * ```
 */
export function createLayout({
  header,
  sidebar,
  content,
  footer,
  name = 'Layout',
}: {
  header?: React.ComponentType<any>;
  sidebar?: React.ComponentType<any>;
  content: React.ComponentType<any>;
  footer?: React.ComponentType<any>;
  name?: string;
}) {
  // Create the main content area with sidebar and content
  const mainComponents: ComponentToCompose[] = [];
  
  if (sidebar) {
    mainComponents.push({ component: sidebar });
  }
  
  mainComponents.push({ component: content });
  
  const Main = composeComponents(
    {
      name: `${name}Main`,
      type: 'horizontal',
      gap: 'md',
      align: 'stretch',
      className: 'flex-1',
    },
    mainComponents
  );
  
  // Create the layout with header, main, and footer
  const layoutComponents: ComponentToCompose[] = [];
  
  if (header) {
    layoutComponents.push({ component: header });
  }
  
  layoutComponents.push({ component: Main });
  
  if (footer) {
    layoutComponents.push({ component: footer });
  }
  
  return composeComponents(
    {
      name,
      type: 'vertical',
      gap: 'md',
      align: 'stretch',
      className: 'min-h-screen',
    },
    layoutComponents
  );
}

/**
 * Creates a modal component with header, content, and footer
 * 
 * @example
 * ```tsx
 * const Modal = createModal({
 *   header: ModalHeader,
 *   content: ModalContent,
 *   footer: ModalFooter,
 * });
 * ```
 */
export function createModal({
  header,
  content,
  footer,
  name = 'Modal',
}: {
  header?: React.ComponentType<any>;
  content: React.ComponentType<any>;
  footer?: React.ComponentType<any>;
  name?: string;
}) {
  const components: ComponentToCompose[] = [];
  
  if (header) {
    components.push({ component: header });
  }
  
  components.push({ component: content });
  
  if (footer) {
    components.push({ component: footer });
  }
  
  return composeComponents(
    {
      name,
      type: 'vertical',
      gap: 'md',
      align: 'stretch',
      className: 'rounded-lg bg-background p-6 shadow-lg',
    },
    components
  );
}

/**
 * Creates a list item component with icon, content, and action
 * 
 * @example
 * ```tsx
 * const ListItem = createListItem({
 *   icon: ItemIcon,
 *   content: ItemContent,
 *   action: ItemAction,
 * });
 * ```
 */
export function createListItem({
  icon,
  content,
  action,
  name = 'ListItem',
}: {
  icon?: React.ComponentType<any>;
  content: React.ComponentType<any>;
  action?: React.ComponentType<any>;
  name?: string;
}) {
  const components: ComponentToCompose[] = [];
  
  if (icon) {
    components.push({ component: icon });
  }
  
  components.push({ component: content });
  
  if (action) {
    components.push({ component: action });
  }
  
  return composeComponents(
    {
      name,
      type: 'horizontal',
      gap: 'md',
      align: 'center',
      justify: 'between',
      className: 'w-full py-2',
    },
    components
  );
}

/**
 * Creates a tab panel component
 * 
 * @example
 * ```tsx
 * const TabPanel = createTabPanel({
 *   tabs: [
 *     { label: 'Tab 1', content: Tab1Content },
 *     { label: 'Tab 2', content: Tab2Content },
 *   ],
 * });
 * ```
 */
export function createTabPanel({
  tabs,
  name = 'TabPanel',
}: {
  tabs: Array<{
    label: string;
    content: React.ComponentType<any>;
    key?: string;
  }>;
  name?: string;
}) {
  // Create a tab list component
  const TabList = composeComponents(
    {
      name: `${name}List`,
      type: 'horizontal',
      gap: 'sm',
      align: 'center',
      className: 'border-b',
    },
    tabs.map(({ label, key }) => ({
      component: (props: any) => (
        <button
          className="px-4 py-2 border-b-2 border-transparent hover:border-primary"
          onClick={() => props.onTabChange && props.onTabChange(key || label)}
          data-active={props.activeTab === (key || label) ? 'true' : 'false'}
          data-testid={`${name.toLowerCase()}-tab-${label.toLowerCase().replace(/\s+/g, '-')}`}
        >
          {label}
        </button>
      ),
      key: key || label,
    }))
  );
  
  // Create a tab content component
  const TabContent = composeComponents(
    {
      name: `${name}Content`,
      type: 'custom',
      render: (props: any) => {
        const activeTab = props.activeTab || (tabs[0] && (tabs[0].key || tabs[0].label));
        const activeTabContent = tabs.find(tab => (tab.key || tab.label) === activeTab);
        
        if (!activeTabContent) {
          return null;
        }
        
        const Content = activeTabContent.content;
        return <Content {...props} />;
      },
    },
    []
  );
  
  // Create the tab panel component
  return composeComponents(
    {
      name,
      type: 'vertical',
      gap: 'md',
      align: 'stretch',
    },
    [
      { component: TabList },
      { component: TabContent },
    ]
  );
}
