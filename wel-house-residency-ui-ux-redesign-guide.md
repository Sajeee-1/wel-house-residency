# Wel House Residency --- UI/UX Redesign Guide

Version: 1.0 Purpose: Implementation brief for an AI coding agent
Product: Wel House Residency apartment management application Primary
market: Sri Lanka Primary users: Residents of mixed ages, including
older adults and people with limited digital confidence

------------------------------------------------------------------------

## 1. Project objective

Redesign the existing Wel House Residency application to make it feel
modern, welcoming, trustworthy and exceptionally easy to use.

This is a user-experience and presentation-layer improvement. The
existing business rules, billing calculations, data models, database
schema, API contracts, authentication and integrations must continue to
work unless a change is explicitly approved.

The application serves two different audiences:

1.  Residents: people who need to understand their apartment charges,
    water consumption, payment status and notices.
2.  Management/administrators: people who manage residents, apartments,
    readings, bills, payments, expenses and reports.

Do not expose administrative complexity to residents. Keep resident and
management experiences clearly separated, while using one consistent
visual design system.

### Main success criteria

A resident, including an older or non-technical user, should be able
to: - Find the current amount due quickly. - Understand what each charge
is for. - Check water meter readings and consumption. - See whether a
bill has been paid or is pending. - Find previous payments and
statements. - Navigate the application without needing someone to
explain it.

The interface should work particularly well on common Android phones,
while remaining polished on tablets and desktop screens.

------------------------------------------------------------------------

## 2. Mandatory instructions for the coding agent

Before making changes:

1.  Inspect the existing repository, framework, routing, components,
    styling approach and responsive breakpoints.
2.  Open and review the existing application pages and identify all
    current features.
3.  Identify which pages are resident-facing and which are
    management-facing.
4.  Map existing components, data sources, API calls, forms, validation,
    calculations and permissions.
5.  Preserve current functionality and business logic.
6.  Do not replace real data with mock data in the working application.
7.  Do not invent new API endpoints, fields, calculations, payment
    workflows or permissions.
8.  Do not remove features simply because they are not represented in
    this design brief.
9.  Reuse the existing technology stack and dependencies where
    practical. Avoid adding large UI libraries without a clear need.
10. Build reusable components and design tokens instead of styling each
    page independently.
11. Make changes incrementally and verify the application after each
    phase.
12. If a requirement conflicts with existing behaviour or the available
    data, inspect the code and report the conflict rather than guessing.
13. Do not change backend contracts or database structures as part of a
    visual redesign unless explicitly requested.
14. Keep the application usable with keyboard navigation and assistive
    technologies.
15. Do not implement decorative controls that do not perform a real
    action.

### Required initial output from the agent

Before implementation, provide a concise audit containing: - Current
routes/pages. - Resident and management page classification. - Existing
design and component patterns. - Existing responsive behaviour. -
Current technical constraints. - A proposed implementation sequence. -
Any risks to existing functionality.

Then implement the redesign. Do not stop after producing recommendations
unless the user explicitly asks for planning only.

------------------------------------------------------------------------

## 3. Design direction

### Design concept

Use a "Modern Residential + Minimal Fintech" visual direction.

The experience should combine: - The clarity and trustworthiness of a
good banking application. - The welcoming, familiar feel of a
residential community portal. - The simplicity of an application
designed for people with different levels of digital confidence.

### Desired personality

-   Clean and uncluttered.
-   Warm, welcoming and trustworthy.
-   Modern, but not overly fashionable.
-   Calm and predictable.
-   Easy to scan.
-   Clear about money and payment status.
-   Consistent across every page.

### Avoid

-   Excessive gradients.
-   Glassmorphism.
-   Heavy shadows.
-   Too many accent colours.
-   Tiny text or low-contrast labels.
-   Dense dashboards with many competing widgets.
-   Decorative animations that slow down or distract.
-   Unfamiliar icons without labels.
-   Wide tables that force horizontal scrolling on phones.
-   Abbreviations or technical terminology residents may not understand.

Use motion sparingly. Prefer short, subtle transitions for menus,
dialogs and feedback. Respect reduced-motion preferences.

------------------------------------------------------------------------

## 4. Colour system

Use forest green as the brand colour, supported by warm white and
neutral surfaces.

### Brand and neutral tokens

  Token             Hex       Usage
  ----------------- --------- -------------------------------------------------
  Primary           #245C45   Primary buttons, active navigation, key actions
  Primary hover     #194833   Hover/pressed state
  Secondary green   #327653   Secondary emphasis
  Soft green        #E7EFE9   Selected surfaces, icon backgrounds
  Main background   #F7F7F2   Application page background
  Surface           #FFFFFF   Cards, dialogs, forms
  Border            #E5E9E5   Card and input borders
  Primary text      #26352D   Headings and important content
  Secondary text    #66736B   Supporting text and descriptions

### Status colours

  Status        Foreground   Background   Usage
  ------------- ------------ ------------ ------------------------------
  Success       #267443      #E8F3EA      Paid, completed, successful
  Warning       #986000      #FFF3DC      Pending, due soon, attention
  Error         #B42318      #FCEAEA      Failed, overdue, error
  Information   #245C8A      #EAF2FA      Informational notices

Status must never be communicated through colour alone. Always include a
text label, and use an icon where helpful.

### Colour usage rules

-   Use green selectively for primary actions, active states and
    meaningful highlights.
-   Keep most page backgrounds neutral.
-   Use white for cards and important content surfaces.
-   Use dark text for readability.
-   Do not use pale green text on white for important information.
-   Check actual text/background combinations for WCAG contrast.
-   Do not use red for ordinary unpaid or pending states unless the
    state is genuinely an error or overdue.
-   Keep the same status colour meanings throughout the application.

------------------------------------------------------------------------

## 5. Typography

### Recommended font

Use Noto Sans as the primary font family. Ensure the application
supports English, Tamil and Sinhala correctly.

Recommended font stack:

`"Noto Sans", "Noto Sans Tamil", "Noto Sans Sinhala", sans-serif`

Load the necessary font files and weights for all scripts actually used
by the application. Verify glyph coverage; do not assume one font file
contains every script.

### Type scale

  Element                Desktop     Mobile Weight
  ------------------- ---------- ---------- ----------
  Main page heading         28px       24px 600
  Section heading           22px       20px 600
  Card heading              18px       18px 600
  Body text                 16px       16px 400
  Supporting text           14px       14px 400
  Small label           13--14px   13--14px 500
  Financial amount      28--32px   24--28px 600--700
  Button text               16px       16px 600

### Typography rules

-   Do not use text smaller than 14px for important interface content.
-   Use 16px as the default body size.
-   Use 20px or larger for key financial figures where practical.
-   Avoid very light font weights.
-   Use comfortable line-height: approximately 1.45--1.6 for body text.
-   Do not truncate important amounts, dates, apartment numbers or
    status labels.
-   Allow Tamil and Sinhala content to wrap naturally.
-   Ensure buttons and navigation labels do not clip when translated.
-   Use tabular numerals for aligned monetary amounts and numeric tables
    if supported.

------------------------------------------------------------------------

## 6. Layout, spacing and responsive behaviour

Use a consistent 8px spacing scale, with 4px available for fine
adjustments.

  Token        Value
  ---------- -------
  space-1        4px
  space-2        8px
  space-3       12px
  space-4       16px
  space-6       24px
  space-8       32px
  space-10      40px
  space-12      48px

### General layout

-   Desktop sidebar: approximately 240px wide.
-   Desktop main content padding: 32px.
-   Main content maximum width: approximately 1440px.
-   Mobile page padding: 16px.
-   Tablet page padding: 20--24px.
-   Section spacing: 24--32px.
-   Card spacing: 12--16px.
-   Avoid excessively wide text paragraphs and forms.

Use the existing application's breakpoint conventions if they are
already consistent. Otherwise, use responsive breakpoints around: -
Small mobile: up to 480px. - Mobile/tablet: 481--768px. -
Tablet/desktop: 769--1024px. - Large desktop: above 1024px.

These are starting points, not rigid requirements. Test real layouts at
320px, 360px, 390px, 768px, 1024px and 1440px widths.

### Mobile-first requirements

Do not simply shrink the desktop dashboard.

On mobile: - Use a compact header with the apartment identity and
profile/menu access. - Use a single column for primary financial
information. - Use two columns only for compact shortcut cards when
labels fit comfortably. - Use full-width primary actions where
appropriate. - Use a bottom navigation bar for the most important
resident destinations. - Keep all important content within the viewport
width. - Do not require horizontal scrolling for normal page content. -
Make tables transform into readable stacked rows/cards or use another
accessible responsive pattern. - Keep dialogs and forms usable on small
screens. - Ensure sticky headers or navigation do not cover focused
fields or content.

------------------------------------------------------------------------

## 7. Component design specifications

Use a consistent component system. Prefer a small number of variants
over many one-off designs.

### 7.1 Cards

Three main card types should cover most use cases.

#### A. Summary card

Use for maintenance fees, water charges, outstanding balances, total
expenses and similar summaries.

Specifications: - White background. - 1px border using #E5E9E5. -
14--16px corner radius. - 16px padding on mobile; 20px on desktop. -
Subtle or no shadow. - Meaningful icon, optional status badge, clear
label and prominent value. - Keep the amount visually stronger than the
supporting label. - Do not place unrelated metrics inside one card.

Example content: - Maintenance fee - LKR 5,000 - November 2026 - Paid

#### B. Information card

Use for meter readings, apartment details, bill breakdowns and payment
information.

Specifications: - Clear title. - Related values grouped together. -
Labels visually distinct from values. - Use dividers for separation. -
Highlight one important result, not every value. - Avoid deeply nested
cards.

Example water information: - Previous reading: 1,250 - Current reading:
1,280 - Consumption: 30 units

All values above are illustrative only. Use actual application data.

#### C. Action card

Use for shortcuts to bills, water usage, payments, statements and other
destinations.

Specifications: - Entire card is clickable when it represents
navigation. - Use a recognisable icon inside a soft-green icon
container. - Show a clear title and short description. - Optional "Open"
label or directional icon. - Provide hover, focus, pressed and disabled
states. - Ensure the card has an accessible name and keyboard
interaction.

### 7.2 Buttons

Primary button: - Forest green background. - White text. - 48--52px
minimum height. - 10px radius. - 16px semibold text.

Secondary button: - White or neutral background. - Green or dark text. -
Clear border. - Same height and radius as primary.

Destructive button: - Reserved for destructive actions. - Use error
styling. - Require confirmation for irreversible actions.

Button rules: - Use clear action labels such as "View bill", "Save
changes" and "Confirm payment". - Avoid vague labels such as "Proceed"
where a more specific label is possible. - Show loading and disabled
states. - Prevent accidental repeated submissions. - Do not make buttons
too small on mobile.

### 7.3 Form inputs

-   Minimum height: 48--52px.
-   Clear visible labels above inputs.
-   Do not rely only on placeholder text.
-   Use a 1px neutral border.
-   Provide clear focus state.
-   Show validation errors beside the relevant field.
-   Explain how to correct an error.
-   Use appropriate input types and mobile keyboards.
-   Ensure labels and error messages are accessible.
-   Do not clear user-entered data unnecessarily after validation
    errors.

### 7.4 Status badges

Use compact, readable badges for Paid, Pending, Overdue, Completed,
Failed and similar statuses.

-   Always include the status text.
-   Use a consistent colour mapping.
-   Use a light background and readable foreground.
-   Avoid tiny pill labels.
-   Do not rely on colour alone.

### 7.5 Icons

-   Use one consistent icon library already present in the project, if
    possible.
-   Use recognisable icons.
-   Typical size: 20--24px.
-   Provide text labels for primary navigation and important actions.
-   Do not use icons as the only way to communicate an unfamiliar
    action.
-   Avoid mixing filled and outline icon styles inconsistently.

### 7.6 Tables and lists

For management desktop views: - Use clear column headings. - Keep row
height comfortable. - Align monetary values consistently. - Use readable
date and currency formats. - Provide empty, loading and error states. -
Make sorting and filtering controls understandable.

For mobile: - Do not force residents to pan across wide tables. -
Convert records into stacked list items or cards. - Keep the most
important information visible first. - Put secondary details below or
behind an explicit "View details" action. - Keep row actions easy to
tap.

------------------------------------------------------------------------

## 8. Resident experience and navigation

The resident experience should be simple and task-focused.

Suggested main navigation:

1.  Home
2.  My Bills
3.  Payments
4.  Water Usage
5.  More

The "More" area can contain statements, notices, support and
profile/settings, depending on existing features.

### Resident dashboard information hierarchy

Recommended order:

1.  Greeting and apartment/resident context.
2.  Current outstanding balance or payment summary.
3.  Current month's charges.
4.  Clear payment status and next action.
5.  Quick access to bills, water usage, payments and statements.
6.  Recent activity or important notices.
7.  Contact/help option.

Do not show every available metric on the home screen. Prioritise the
tasks residents perform most often.

### Resident language

Use plain, familiar language.

Prefer: - "Amount due" - "Paid" - "Payment pending" - "Water usage" -
"Previous reading" - "Current reading" - "View bill" - "Payment history"

Avoid technical or accounting terms unless they are necessary. If a term
is necessary, explain it in plain language.

### Resident support

If the application already has a support/contact route, make it easy to
find. A WhatsApp contact option may be useful for residents in Sri
Lanka, but only implement it using a real, approved contact number and
existing support process. Never invent contact details.

------------------------------------------------------------------------

## 9. Management experience

Management users need more information and operational controls than
residents.

Keep the management interface efficient without making it visually
dense.

Suggested navigation, adjusted to match existing routes and features:

-   Dashboard
-   Residents / Apartments
-   Monthly Billing
-   Water Meter Readings
-   Payments & Collections
-   Expenses
-   Financial Reports
-   Settings

### Management dashboard

Prioritise: - Total collections. - Outstanding balances. - Current
month's billing progress. - Recent payments. - Pending operational
tasks. - Relevant expense summaries.

Do not invent metrics or derive new financial calculations as part of
the redesign. Reuse existing calculations and data.

### Management data entry

-   Make forms easy to scan.
-   Group fields by purpose.
-   Use clear labels and helpful descriptions.
-   Make apartment/resident selection unambiguous.
-   Confirm important or irreversible actions.
-   Provide a clear success or failure response after saving.
-   Preserve existing validation and permission rules.

------------------------------------------------------------------------

## 10. Financial information and Sri Lankan context

The application should display financial information consistently and
transparently.

### Currency

Use LKR consistently. Follow the existing application's formatting
convention where one exists. A readable format may be:

-   LKR 5,000.00
-   LKR 1,250.00

Avoid mixing formats such as Rs., LKR and currency symbols
inconsistently.

### Dates

Use a consistent, unambiguous date format. For example: - 12 Nov 2026 -
November 2026

Avoid ambiguous numeric dates such as 11/12/2026 where the day/month
order may be misunderstood.

### Billing clarity

When showing a total: - Show the total amount clearly. - Show the
individual charge breakdown. - Identify the billing period. - Show
payment status. - Show due date if the system has one. - Explain
previous balances separately if the existing billing model supports
them.

Do not change billing rules, water tariff calculations, rounding or
payment allocation logic during the visual redesign.

------------------------------------------------------------------------

## 11. Accessibility requirements

Accessibility is a core requirement because residents have different
ages, abilities, devices and levels of technical confidence.

Target WCAG 2.2 AA where practical.

Requirements: - Normal text contrast ratio at least 4.5:1. - Large text
contrast ratio at least 3:1. - Visible keyboard focus. - Logical
keyboard navigation. - Proper labels for form controls. - Accessible
names for buttons and interactive icons. - Status not communicated by
colour alone. - Touch targets at least 44 x 44 CSS pixels where
practical. - Text remains usable at 200% zoom. - Layout reflows at
narrow viewport widths without ordinary horizontal scrolling. - Avoid
time-limited interactions unless essential. - Provide clear validation
and error feedback. - Respect reduced-motion preferences. - Ensure modal
dialogs manage focus correctly. - Ensure content is understandable
without relying on visual position alone.

Test the actual English, Tamil and Sinhala interfaces. Script rendering,
line height and wrapping may differ.

------------------------------------------------------------------------

## 12. Internationalisation and multilingual readiness

The design should be ready for English, Tamil and Sinhala, even if all
languages are not enabled in the first release.

Requirements: - Use the application's existing internationalisation
approach if available. - Do not hardcode user-facing strings throughout
components if the project already has a translation system. - Allow text
expansion; translated labels may be longer. - Do not set fixed heights
on text containers where they could clip translated content. - Use fonts
with the necessary glyph coverage. - Test navigation, buttons, cards,
tables, forms and dialogs in all supported scripts. - Ensure numbers,
currency and dates remain clear.

Do not automatically translate legal, financial or billing terminology
without review.

------------------------------------------------------------------------

## 13. Interaction states and feedback

Every interactive component should have appropriate states.

For buttons: - Default - Hover - Focus - Pressed - Disabled - Loading

For forms: - Default - Focus - Filled - Invalid - Disabled - Successful
submission

For data-driven pages: - Loading - Loaded - Empty - Error - Permission
denied, where applicable

Use clear feedback: - "Changes saved." - "Payment record updated." -
"Please check the highlighted fields." - "We couldn't load this
information. Please try again."

Only display success messages after the actual operation succeeds. Do
not simulate successful payments or data updates.

------------------------------------------------------------------------

## 14. Performance and implementation quality

-   Keep the existing framework and architecture.
-   Reuse components and avoid duplicated styling.
-   Avoid unnecessary dependencies.
-   Optimise images and icons.
-   Avoid large animations and layout shifts.
-   Ensure forms and navigation remain responsive on lower-powered
    mobile devices.
-   Preserve authentication, authorisation and existing security
    controls.
-   Do not expose administrative information to residents.
-   Do not log or expose sensitive resident or financial information
    unnecessarily.
-   Keep responsive behaviour consistent across routes.

------------------------------------------------------------------------

## 15. Suggested implementation phases

### Phase 1 --- Audit and design foundation

-   Inspect all routes and existing UI.
-   Identify resident and management areas.
-   Define design tokens.
-   Establish font loading and multilingual support.
-   Build shared buttons, cards, inputs, badges, navigation and layout
    components.
-   Confirm the design system works at mobile and desktop widths.

Acceptance criteria: - Shared tokens are used consistently. - Common
components have responsive states. - Existing routes and functionality
remain intact.

### Phase 2 --- Resident dashboard

-   Redesign the resident home page.
-   Prioritise amount due and payment status.
-   Simplify monthly charge summaries.
-   Add clear quick-access navigation.
-   Implement mobile navigation.
-   Verify all displayed values come from real application data.

Acceptance criteria: - A resident can identify the amount due and
billing period quickly. - Important actions are easy to find. - No
horizontal scrolling at 320px viewport width. - Existing calculations
and data remain unchanged.

### Phase 3 --- Resident modules

Apply the design system to: - Bills. - Water usage and meter readings. -
Payment history. - Statements. - Notices and support, where present.

Acceptance criteria: - Consistent layout and interaction patterns. -
Clear financial breakdowns. - Readable mobile records. - Loading, empty
and error states are implemented.

### Phase 4 --- Management interface

-   Improve management navigation.
-   Redesign dashboards and summary cards.
-   Improve forms, tables and record lists.
-   Preserve administrative permissions and workflows.

Acceptance criteria: - Management tasks remain possible. - Data entry
and validation continue to work. - Desktop and mobile layouts remain
usable.

### Phase 5 --- Accessibility, testing and refinement

-   Test narrow mobile screens.
-   Test keyboard navigation.
-   Test text zoom.
-   Check colour contrast.
-   Test all supported languages.
-   Test long labels and large amounts.
-   Verify all existing user journeys.
-   Fix clipping, overflow, alignment and touch-target problems.

Acceptance criteria: - No critical existing workflow is broken. - No
important content is clipped. - Important actions have accessible labels
and focus states. - Financial statuses are understandable without colour
alone.

------------------------------------------------------------------------

## 16. Quality assurance checklist

Use this checklist before considering the redesign complete.

### Visual consistency

-   [ ] One consistent colour palette.
-   [ ] Consistent typography and font weights.
-   [ ] Consistent card radius, borders and spacing.
-   [ ] Consistent buttons, inputs and badges.
-   [ ] No unnecessary gradients or heavy shadows.
-   [ ] Clear visual hierarchy on every page.

### Mobile

-   [ ] Tested at 320px width.
-   [ ] Tested at 360px and 390px widths.
-   [ ] No unintended horizontal page scrolling.
-   [ ] No clipped text or financial values.
-   [ ] Navigation is easy to use.
-   [ ] Buttons and controls are easy to tap.
-   [ ] Tables have a usable mobile alternative.
-   [ ] Forms work with mobile keyboards.

### Accessibility

-   [ ] Text contrast checked.
-   [ ] Focus states visible.
-   [ ] Keyboard navigation works.
-   [ ] Form labels are accessible.
-   [ ] Status uses text as well as colour.
-   [ ] 200% zoom checked.
-   [ ] Reduced-motion preference respected.
-   [ ] Tamil and Sinhala text checked where supported.

### Functional regression

-   [ ] Authentication still works.
-   [ ] Resident and management permissions still work.
-   [ ] Existing routes still work.
-   [ ] Existing API calls remain intact.
-   [ ] Billing calculations are unchanged.
-   [ ] Water calculations are unchanged.
-   [ ] Payment records and history are unchanged.
-   [ ] Forms still save and validate correctly.
-   [ ] Confirmation and error states work.
-   [ ] No mock data has replaced production data.

------------------------------------------------------------------------

## 17. Final instructions and expected deliverables

The implementation should produce:

1.  A consistent application-wide design system.
2.  Reusable responsive UI components.
3.  A redesigned resident experience.
4.  A redesigned management experience.
5.  Mobile-friendly layouts for all important pages.
6.  Accessible typography and colour usage.
7.  Consistent loading, empty, error and success states.
8.  A summary of changed files and components.
9.  A summary of any routes or workflows that could not be updated.
10. A regression-testing report confirming that existing business logic
    and functionality were preserved.

### Final product principle

Design for the least technically confident resident, not the most
technical administrator.

A successful Wel House Residency application should feel simple enough
for an older resident to understand their bill, check their water usage
and find their payment history independently.

Prioritise clarity, accessibility, trust and consistency over visual
effects or dashboard complexity.

**Preserve the functionality. Improve the experience. Make every screen
easy to understand.**
