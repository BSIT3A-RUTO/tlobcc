<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/618d2ba7-7fae-48d6-8089-b17822061c92

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Admin portal setup
1. Go to `/admin/login`.
2. Create an admin user in Firebase Console (Authentication) or call `createAdminUser` in `services/authService.ts` from a temporary script.
3. In Firestore, add a document under `users/{uid}` with `isAdmin: true`.
4. Use `/admin` to manage sermons, events, ministries, and site metadata.

> If no content exists yet, use the admin dashboard to add entries and save.

