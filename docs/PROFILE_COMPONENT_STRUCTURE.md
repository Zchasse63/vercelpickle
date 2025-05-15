# Profile Component Structure

## Overview

The Profile Component Structure provides a modular and composable approach to building profile-related UI components. It follows best practices for component composition, state management, and UI consistency.

## Key Features

- **Modular Components**: Each component has a single responsibility and can be composed with other components.
- **Consistent UI**: All profile components follow the same design patterns and UI conventions.
- **Separation of Concerns**: View and edit modes are separated, with clear transitions between them.
- **Accessibility**: All components include proper ARIA attributes and keyboard navigation.
- **Testability**: All components include data-testid attributes for testing.

## Component Hierarchy

```
components/profile/
├── index.ts                # Exports all profile components
├── profile-avatar.tsx      # Avatar component with optional change button
├── profile-card.tsx        # Card component for profile sections
├── profile-field.tsx       # Field component for displaying profile information
├── profile-layout.tsx      # Layout component for profile pages
├── profile-section.tsx     # Section component for organizing profile content
└── profile-tabs.tsx        # Tabs component for profile navigation
```

## Components

### ProfileAvatar

A component for displaying a user's avatar with an optional change button.

```tsx
<ProfileAvatar
  src="/path/to/avatar.jpg"
  alt="User Name"
  initials="JD"
  size="lg"
  onChangeAvatar={() => {}}
  testId="user-avatar"
/>
```

### ProfileCard

A reusable card component for profile sections with standardized header, content, and footer.

```tsx
<ProfileCard
  title="Profile Information"
  description="View and edit your profile information."
  isEditing={isEditing}
  onEdit={() => setIsEditing(true)}
  onCancel={() => setIsEditing(false)}
  onSave={handleSave}
  isLoading={isLoading}
  testId="profile-card"
>
  {/* Card content */}
</ProfileCard>
```

### ProfileField

A component for displaying a field label and value in a profile view.

```tsx
<ProfileField
  label="Email"
  value="john.doe@example.com"
  testId="email-field"
/>

<ProfileLinkField
  label="Website"
  value="example.com"
  href="https://example.com"
  testId="website-field"
/>
```

### ProfileLayout

A component for creating consistent profile page layouts with optional sidebar and header.

```tsx
<ProfileLayout
  header={<h1>Profile</h1>}
  sidebar={<ProfileNavigation />}
  testId="profile-layout"
>
  {/* Main content */}
</ProfileLayout>
```

### ProfileSection

A component for organizing profile content into sections with optional titles and separators.

```tsx
<ProfileSection
  title="Personal Information"
  description="Your personal details."
  withSeparator
  testId="personal-info-section"
>
  {/* Section content */}
</ProfileSection>
```

### ProfileTabs

A component for creating tabbed navigation in profile pages.

```tsx
<ProfileTabs
  tabs={[
    {
      id: "profile",
      label: "Profile",
      content: <ProfileContent />,
      testId: "profile-tab"
    },
    {
      id: "security",
      label: "Security",
      content: <SecurityContent />,
      testId: "security-tab"
    }
  ]}
  defaultTab="profile"
  testId="profile-tabs"
/>
```

## Implementation Examples

### Profile View

```tsx
<ProfileCard
  title="Profile Information"
  description="Your personal and business information."
  onEdit={handleEdit}
  testId="profile-card"
>
  <div className="flex flex-col md:flex-row gap-6">
    <ProfileAvatar
      initials="JD"
      testId="profile-avatar"
    />
    
    <div className="flex-1 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <ProfileField
          label="First Name"
          value="John"
          testId="first-name-field"
        />
        <ProfileField
          label="Last Name"
          value="Doe"
          testId="last-name-field"
        />
      </div>
      
      <ProfileField
        label="Email"
        value="john.doe@example.com"
        testId="email-field"
      />
    </div>
  </div>

  <ProfileSection
    title="Company Information"
    withSeparator
    testId="company-section"
  >
    <ProfileField
      label="Company Name"
      value="Acme Inc."
      testId="company-name-field"
    />
    
    <ProfileLinkField
      label="Company Website"
      value="acme.example.com"
      href="https://acme.example.com"
      testId="company-website-field"
    />
  </ProfileSection>
</ProfileCard>
```

### Profile Edit

```tsx
<Form
  form={form}
  onSubmit={form.handleSubmit}
  status={formStatus}
  successMessage="Profile updated successfully!"
  errorMessage="Failed to update profile. Please try again."
  testId="profile-form"
>
  <div className="flex flex-col md:flex-row gap-6">
    <ProfileAvatar
      initials={getInitials()}
      onChangeAvatar={handleChangeAvatar}
      testId="profile-avatar"
    />
    
    <div className="flex-1 space-y-4">
      <FormRow>
        <FormInput
          name="firstName"
          label="First Name"
          required
          disabled={formStatus === 'submitting'}
          testId="first-name-input"
        />
        <FormInput
          name="lastName"
          label="Last Name"
          required
          disabled={formStatus === 'submitting'}
          testId="last-name-input"
        />
      </FormRow>
      
      <FormInput
        name="email"
        label="Email"
        type="email"
        required
        disabled={formStatus === 'submitting'}
        testId="email-input"
      />
    </div>
  </div>

  <ProfileSection
    title="Company Information"
    withSeparator
    testId="company-section"
  >
    <FormInput
      name="companyName"
      label="Company Name"
      required
      disabled={formStatus === 'submitting'}
      testId="company-name-input"
    />
    
    <FormInput
      name="companyWebsite"
      label="Company Website"
      disabled={formStatus === 'submitting'}
      testId="company-website-input"
    />
  </ProfileSection>

  <div className="flex justify-end gap-2 mt-6">
    <Button
      type="button"
      variant="outline"
      onClick={handleCancel}
      disabled={formStatus === 'submitting'}
      testId="cancel-button"
    >
      Cancel
    </Button>
    <Button
      type="submit"
      disabled={formStatus === 'submitting'}
      testId="save-button"
    >
      {formStatus === 'submitting' ? 'Saving...' : 'Save Changes'}
    </Button>
  </div>
</Form>
```

## Best Practices

1. **Use Composition**: Compose smaller components to build more complex UIs.
2. **Separate View and Edit Modes**: Keep view and edit modes separate for clarity.
3. **Use Consistent Patterns**: Follow the same patterns across all profile components.
4. **Add TestIDs**: Always add testId props to components for testing.
5. **Handle Loading States**: Always include loading states for better UX.
6. **Add Proper ARIA Attributes**: Ensure all components are accessible.
