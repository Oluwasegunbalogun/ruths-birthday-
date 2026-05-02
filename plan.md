# Visibility Enhancement Plan

1.  **Enhance Home Page Text Visibility:**
    *   Target `src/pages/LandingPage.tsx`.
    *   Locate the paragraph: "Every memory is a piece of magic. Let us make Ruth's day unforgettable."
    *   Update styling to make it more prominent:
        *   Increase font weight from `font-light` to `font-bold`.
        *   Increase font size from `text-xl md:text-2xl` to `text-2xl md:text-4xl`.
        *   Remove opacity (`/80`) to ensure full color contrast.
        *   Add `drop-shadow-lg` for better separation from the background.
        *   Increase `max-w-lg` to `max-w-2xl` to accommodate larger text.

2.  **Verify UI Consistency:**
    *   Ensure the changes align with the "text-pop" style used elsewhere in the application.
    *   Ensure the text remains readable against the background image.
