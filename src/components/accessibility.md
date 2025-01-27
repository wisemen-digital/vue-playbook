#### [Components](/components.md)

# Accessibility

Writing semantic code helps readability, maintainability and improving the accessibility.

| Element         | Description and correct usage                |
| --------------- | -------------------------------------------- |
| div             | Use divs for layout purposes.                |
| span            | Use spans for inline text.                   |
| section         | Use sections for big pieces of code.         |
| article         | Use articles for a single item in a section. |
| h1, h2, h3, ... | Use headings for titles.                     |
| p               | Use paragraphs for text and paragraphs.      |
| a               | Use anchors for links.                       |
| button          | Use buttons for buttons.                     |
| input           | Use inputs for inputs.                       |
| label           | Use labels for labels.                       |
| form            | Use forms for forms.                         |
| table           | Use tables for tables.                       |
| ul, ol          | Use lists for lists.                         |
| li              | Use list items for list items.               |
| img             | Use images for images.                       |
| iframe          | Use iframes for iframes.                     |
| svg             | Use svg for svg.                             |

## Accessibility

Accessibility ensures that your application is usable by everyone, regardless of their abilities, disabilities, or the devices they use. Implementing accessibility features helps users with disabilities navigate and interact with your application. It also enhances the experience for users across different screen sizes, devices, and contexts, ultimately making your app more inclusive and user-friendly.


example:

```vue
<script lang="ts" setup>
function learnMore():void {
  alert('Accessibility is important for everyone!');
}
</script>

<template>
<main>
  <header>
    <h1>Accessibility</h1>
  </header>
  <section>
    <p>
      Accessibility is important for everyone. It helps people with disabilities use your application.
      It also helps people with different screen sizes and devices use your application.
    </p>
    <button @click="learnMore" aria-label="Learn more about accessibility">
      Learn More
    </button>
  </section>
</main>
</template>
```

### Keyboard navigation

Ensure your application is fully accessible using the keyboard. Keyboard accessibility is essential for users who rely on keyboard-only navigation, including those with motor disabilities or individuals who prefer not to use a mouse. Enabling seamless keyboard navigation improves the overall usability and inclusivity of your application.

#### Why Keyboard Navigation Matters:
- **Motor Disabilities**: Some users may have limited dexterity or mobility, making it difficult to use a mouse. Keyboard navigation provides an accessible alternative.
- **User Preference**: Many users prefer keyboard navigation for efficiency, as it allows faster interaction with web content.
- **Legal and Ethical Considerations**: Accessibility is not just a best practice; it's required by law in many countries.

#### Best Practices for Keyboard Navigation:
- **Ensure Logical Tab Order**: When users press the Tab key, ensure they can move through interactive elements in a logical and intuitive order (e.g., form fields, buttons, links). Avoid unexpected jumps in the navigation flow. 
  - Use the tabindex attribute if needed to control the order. Avoid negative tabindex values unless you have a specific need to remove an element from the focus order.
 
  ```vue
  <input type="text" name="email" tabindex="1" />
  <input type="password" name="password" tabindex="2">
  ```

- **Make All Interactive Elements Focusable**: Ensure that all buttons, links, form fields, and other interactive elements are focusable using the Tab key. If you use custom controls (e.g., a custom button), make sure they are accessible via the keyboard.
 ```vue
  <button>Click me</button>
  <a href="https://example.com">Go to Example</a>  
  ```

- Provide Clear Focus Indicators: When an element is focused (e.g., after pressing Tab), ensure that the user can clearly see the focus indicator (such as a border or background color). This helps users track where they are on the page.
  ```vue
  <style scoped>
    :focus {
        outline: 3px solid #ffbf47;
    }
  </style>
  ```

- **Avoid Keyboard Traps**: Ensure users can navigate through all content and interactive elements using the keyboard, without getting "stuck" on a particular element (e.g., in modal dialogs). Always provide a way to escape or exit from any modal or pop-up using the keyboard (such as pressing the Esc key).
- **Enable Keyboard Shortcuts**: If your application includes keyboard shortcuts, ensure they are clearly documented and allow users to customize them if needed.
- **Test with Only Keyboard**: Use the Tab, Shift+Tab, Enter, Space, and Esc keys to navigate through your application. Ensure all focusable elements are reachable and that the user can complete key tasks (e.g., submitting forms or clicking buttons) using the keyboard.

#### Tools and Testing:

- **Keyboard-Only Testing**: Try navigating your application using only the keyboard. Pay close attention to the order of focus, visual indicators, and the ability to complete tasks.
- **Automated Accessibility Testing**: Tools like `axe` and `WAVE` can check for keyboard accessibility issues in your application.

By ensuring that your application supports keyboard navigation, you create a more accessible and user-friendly experience for all users, regardless of their input preferences or physical abilities.

---

### Screen readers

Ensure that your application is fully accessible to users who rely on screen readers.
Screen readers convert digital content into speech or braille, allowing users with visual impairments to interact with your application.
Making your application screen reader-friendly ensures a more inclusive experience for everyone.

#### Why Screen Reader Accessibility Matters:
- **Access to Content**: Screen readers allow people with visual impairments to understand and navigate web content.
- **Enhanced User Experience**: Well-implemented accessibility ensures that users can interact with your application effectively, regardless of their disability.
- **Legal and Ethical Responsibility**: Many countries have laws mandating digital accessibility, making it both a legal and moral obligation.

#### Best Practices for Screen Reader Accessibility:
- **Use Semantic HTML**: Ensure you're using proper HTML tags (like `<button>`, `<a>`, `<form>`, etc.) as they are recognized by screen readers and provide the correct context for users.
- Add `ARIA` (Accessible Rich Internet Applications) Attributes: ARIA roles, properties, and states can provide extra context for dynamic content or complex UI elements. For example, use aria-live for content updates or aria-label to give additional context to elements like icons or buttons.

```vue
<button aria-label="Close">X</button>
```
- **Provide Text Alternatives**: Use alt attributes for images and other non-text content. This helps screen readers provide a description of images, icons, and other visual elements.

```vue
<img src="logo.png" alt="Company logo">  
```

#### Tools and Testing:
- **Screen Reader Simulators**: Tools like `VoiceOver` (macOS) or `NVDA` (Windows) simulate screen reader behavior.
- **Automated Accessibility Tools**: Use tools like `axe` or `WAVE` to check for accessibility issues, including screen reader compatibility.

By making your application accessible with screen readers, you provide equal access to your content for users with visual impairments and contribute to a more inclusive web experience.

---

### Focus

Ensure that your application maintains a clear and visible focus indicator, especially for users who navigate using the keyboard.
A visible focus is crucial for users with disabilities, as it helps them understand where they are within the application, making navigation easier and more efficient.

### Why Focus Visibility Matters:
- **Accessibility**: Users with visual impairments or motor disabilities often rely on the keyboard to navigate, and a visible focus helps them track their movements across the page.
- **Keyboard Navigation**: Without a clear focus, users who prefer keyboard navigation (e.g., using the Tab key) may become disoriented or struggle to find interactive elements.
- **Improves User Experience**: Ensuring a clear focus indicator helps all users, including those with temporary impairments or using alternative input devices.

### Best Practices for Focus Visibility:
- Custom Focus Styles: If you customize focus styles, ensure the focus remains clearly visible, with sufficient contrast against the background. Use properties like outline or box-shadow to highlight the focused element.
Example:
```vue

<style scoped>
:focus {
    outline: 3px solid #ffbf47;
}
</style>
```
- Use the :focus CSS Pseudo-Class: Use the :focus pseudo-class to define styles for elements that have keyboard focus, such as buttons, links, and form fields.
- Avoid Removing the Default Focus Style: Don’t remove default focus indicators (like the blue outline around links) without providing an accessible custom alternative.
- Test with Keyboard Navigation: Use the Tab key to navigate through your site to ensure that all interactive elements are accessible and clearly focused.

### Tools and Testing:
- Keyboard Navigation Testing: Regularly test keyboard navigation by using only the Tab and Shift+Tab keys to ensure a smooth experience.
- Browser Developer Tools: Use browser developer tools to simulate focus states and confirm that the focus is clearly visible across all elements.

By providing a clear focus, you create a more accessible, user-friendly experience for people who rely on keyboards or other assistive technologies.

---

### Color contrast

Ensure your application maintains adequate color contrast to improve readability and accessibility for all users, including those with visual impairments or color blindness. Proper color contrast makes text and visual elements more distinguishable from their background, creating a more inclusive experience.

Key Considerations:
- Follow WCAG Guidelines: Adhere to the Web Content Accessibility Guidelines (WCAG), which recommend a minimum contrast ratio of:
    - 4.5:1 for normal text (under 18px or bold text under 14px).
    - 3:1 for large text (18px or larger, or bold text 14px or larger).
- Use Contrast Checking Tools: Tools like `WebAIM's` Contrast Checker or browser plugins can help you validate contrast ratios.
- Test with Various Color Modes: Ensure sufficient contrast in both light and dark modes.
- Avoid Relying Solely on Color: Use additional visual cues (e.g., underlines, icons) to convey meaning instead of depending on color alone.

By prioritizing color contrast, you create a more accessible and user-friendly application for everyone.

---

### ARIA (Accessible Rich Internet Applications)

Ensure your application incorporates ARIA attributes to enhance accessibility for users with disabilities. ARIA attributes provide additional context and information to assistive technologies, such as screen readers, allowing users to navigate and interact with your application more effectively.

Here are key practices for implementing ARIA:

- Use ARIA roles to define the purpose of elements (e.g., `role="button`" or `role="dialog"`).
- Add ARIA states and properties to communicate changes dynamically (e.g., `aria-expanded`, `aria-hidden`).
- Avoid unnecessary ARIA where native HTML elements already provide sufficient accessibility.
- Test with assistive technologies to ensure ARIA attributes are functioning as intended.

By applying ARIA attributes thoughtfully, you create an inclusive experience for users with diverse needs.

---

### Semantic HTML

Ensure your application uses semantic HTML to improve accessibility, usability, and search engine optimization (SEO). Semantic HTML involves using HTML tags according to their intended purpose, which provides structure and meaning to the content for both users and assistive technologies like screen readers.

#### Why Semantic HTML Matters:
- **Improves Accessibility**: Assistive technologies rely on the semantics of HTML elements to convey information to users with disabilities.
- **Enhances Keyboard Navigation**: Semantic elements, like `<button>` and `<a>`, ensure better focus management and keyboard operability.
- **Boosts SEO**: Search engines use semantic HTML to better understand your content's structure.

#### Examples of Semantic HTML:
- Use `<header>`, `<main>`, `<section>`, and `<footer>` for layout and structure.
- Use `<nav>` for navigation menus.
- Use `<article>` for self-contained content, such as blog posts or news stories.
- Use `<button>` for actions instead of `<div>` or `<span>`.
- Use `<form>` with appropriate `<label>` and `<input>` elements for user input.

#### Best Practices:
- Avoid Non-Semantic Tags: Replace `<div>` and `<span>` with semantic elements whenever possible.
- Use ARIA Sparingly: Native HTML elements often come with built-in accessibility features that are more robust than ARIA roles.
- Test with Assistive Technologies: Validate the structure and functionality of your HTML using screen readers and keyboard navigation.

By adhering to semantic HTML, you create a more inclusive and intuitive application for all users.

---

### Headings

Ensure your application includes properly structured headings to organize content and improve accessibility.
Headings provide a clear and logical structure, making it easier for all users, including those with disabilities or those relying on assistive technologies like screen readers, to navigate your application.

#### Why Headings Are Important:
- **Accessibility**: Screen readers use headings to help users quickly navigate through content.
- **Keyboard Navigation**: Users who rely on keyboards can skip between sections using headings.
- **Improved Usability**: Well-structured headings make content easier to scan and understand for all users.

#### Best Practices for Using Headings:
- Use HTML Heading Tags (`<h1>` to `<h6>`) Correctly:
    - `<h1>` should be the main title of the page (used once per page).
    - Use `<h2>` to `<h6>` for subheadings to create a logical hierarchy.
- Avoid Skipping Levels: Maintain a sequential structure (e.g., `<h2>` followed by `<h3>`). Avoid jumping directly from `<h2>` to `<h4>`.
- Use Descriptive Headings: Ensure headings clearly describe the section’s content to improve context for users.
- Do Not Style Non-Semantic Elements as Headings: Use actual `<h>` tags instead of styling `<div>` or `<span>` to look like headings.

### Tools and Testing:
- **Accessibility Testing Tools**: Use tools like `WAVE` or the browser’s developer tools to check heading structure.
- **Screen Reader Testing**: Test your headings with a screen reader to ensure they provide logical navigation and context.

By implementing proper heading structures, you create a more accessible and user-friendly experience for all users.