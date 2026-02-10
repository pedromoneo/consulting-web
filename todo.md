# Disruptor Project - Future Roadmap & TODOs

## 🚀 High Priority: Backend & Infrastructure
- [ ] **Firebase App Hosting Setup**: Complete the migration to Firebase App Hosting (Option B) to support full-stack Next.js features like API routes.
- [ ] **AI Chat Integration**: Restore the chatbot functionality by connecting the frontend `useChat` hook to the Anthropic-powered API route once App Hosting is live.
- [ ] **Firebase Authentication**: Implement real user authentication (Google & Email OTP) using Firebase Auth to replace the current "Skip for now" mockup.
- [ ] **Blaze Plan Upgrade**: Ensure the Firebase project is on the Blaze plan to allow outbound API calls to Anthropic for the chatbot.

## 📝 Profile & Data Management
- [ ] **Profile Data Persistence**: Connect the Client and Expert forms in `ProfilePage.tsx` to a database (e.g., Firestore) to save user submissions.
- [ ] **Auth State Sync**: Automatically populate profile fields when a user is logged in.
- [ ] **Admin Notifications**: Set up a system (e.g., Cloud Functions + Email/Slack) to notify the talent team when a new Expert profile is submitted.
- [ ] **Form Validation**: Add robust client-side and server-side validation for all profile forms (email format, phone number, required fields).

## ✨ UX & Design Enhancements
- [ ] **Conditional Navigation**: Hide the "Profile" nav item until a user is logged in or has "skipped" login.
- [ ] **Dynamic Sidebar**: Update "Sign In" to "My Account" or "Profile" after a successful login.
- [ ] **Loading States**: Add skeleton loaders or better transitions when navigating between sections.
- [ ] **Success Feedback**: Enhance the submission success messages with more detailed info on next steps.

## 🛠️ Maintenance & Optimization
- [ ] **SEO Cleanup**: Update meta tags and titles for all sections to optimize for search engines.
- [ ] **Image Optimization**: Replace generic placeholders or generated assets with final, high-quality project images.
- [ ] **Clean Git History**: Finalize the repository setup on GitHub and establish a clean deployment workflow.
