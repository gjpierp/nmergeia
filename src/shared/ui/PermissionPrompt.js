// src/shared/ui/PermissionPrompt.js
/**
 * Simple helper to show a user‑friendly message before requesting
 * File System Access permissions. It uses the native `window.confirm`
 * dialog to keep the implementation lightweight and works both in
 * browsers and in Electron (where `window.confirm` is still available).
 *
 * The function resolves when the user acknowledges the message –
 * regardless of whether they click "OK" or "Cancel" – allowing the
 * calling code to continue and request the actual permission from the
 * browser/Electron API, which also presents its own dialog if needed.
 */
export async function requestUserPermission(message) {
  // `window.confirm` returns true when the user clicks OK.
  // We resolve the promise in either case; the calling code will
  // still ask for the permission via the native API, which also
  // presents its own dialog if needed.
  // eslint-disable-next-line no-alert
  const _ = window.confirm(message);
  return _;
}
