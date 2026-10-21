import { categories } from "./catalog";
import { type Locale } from "./config";
const key = "nr:quote-draft";
export const draftLifetime = 30 * 60 * 1000;
let expiry: ReturnType<typeof setTimeout> | undefined;
function expireAfter(delay: number) {
  if (expiry) clearTimeout(expiry);
  expiry = setTimeout(clearDraft, Math.max(0, delay));
  if (typeof expiry === "object") expiry.unref?.();
}
export function readDraft(locale: Locale) {
  try {
    const value = JSON.parse(sessionStorage.getItem(key) || "null");
    if (!value || Date.now() - value.at > draftLifetime) {
      sessionStorage.removeItem(key);
      return null;
    }
    expireAfter(draftLifetime - (Date.now() - value.at));
    const fields = value.fields as Record<string, string>;
    const equipment = categories
      .find((c) => c.id === fields.category)
      ?.equipment.find(
        (e) => e.name.en === fields.equipment || e.name.fr === fields.equipment,
      );
    if (equipment) fields.equipment = equipment.name[locale];
    return { ...value, fields };
  } catch {
    return null;
  }
}
export function saveDraft(
  form: HTMLFormElement,
  requestId: string,
  payload: string,
  sourcePath: string,
) {
  try {
    expireAfter(draftLifetime);
    const fields = Object.fromEntries(new FormData(form));
    fields.products = new FormData(form).getAll("products").join(",");
    delete fields.privacy;
    delete fields.website;
    sessionStorage.setItem(
      key,
      JSON.stringify({
        at: Date.now(),
        fields,
        requestId,
        payload,
        sourcePath,
      }),
    );
  } catch {}
}
export function clearDraft() {
  if (expiry) clearTimeout(expiry);
  try {
    sessionStorage.removeItem(key);
  } catch {}
}
export function privateAttribution() {
  try {
    const data = JSON.parse(sessionStorage.getItem("nr:attribution") || "null");
    return data && Date.now() - data.at < draftLifetime ? data.values : {};
  } catch {
    return {};
  }
}
