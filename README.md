# Apartment Water Bill

Splits the monthly water board bill across the apartment's houses by meter reading. Any units not covered by house meters are common usage, split equally between all houses.

- **View link** (anyone): `https://<your-site>.pages.dev`. This is read-only.
- **Edit link** (editors only): `https://<your-site>.pages.dev/#key=<their-key>`
- Every save keeps a copy of the previous data along with who made the change, so anything can be restored from the **Versions** list.

```
public/index.html       the page
functions/api/data.js   the API (reads are public; saving needs an edit key)
seed-data.json          your existing months (load once, see step 5)
```

## Host it on Cloudflare (free, about 10 minutes)

**1. Put the code on GitHub**
Create a new repository (private is fine) and upload these files, keeping the folder structure.

**2. Create the site**
Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** tab → **Connect to Git** → choose the repo.
- Framework preset: **None**
- Build command: *(leave empty)*
- Build output directory: **public**

Click **Save and Deploy**. You'll get a link like `water-bill.pages.dev`.

**3. Create the storage**
Dashboard → **Storage & Databases** → **KV** → **Create** → name it `water-bill`.

Then link it to the site: your Pages project → **Settings** → **Bindings** → **Add** → **KV namespace**
- Variable name: **DATA**
- KV namespace: **water-bill**

**4. Add the edit keys**
Pages project → **Settings** → **Variables and Secrets** → **Add**
- Type: **Secret**
- Name: **EDIT_KEYS**
- Value: one entry per editor, as `Name:key`, separated by commas. For example:
  ```
  Sajeevan:k7Qm2xRp9vLs4Tz8, Kumar:Hw3nB8cYq6Jd1Fe5
  ```
  Each key must be at least 12 characters, with no commas or spaces. To make one, use a password generator or run `openssl rand -hex 8`.

Then go to **Deployments** → latest deployment → **⋯** → **Retry deployment**, so the storage and keys take effect.

**5. Load your existing months**
Go to **Storage & Databases** → **KV** → `water-bill` → **KV Pairs** and add one entry:
- Key: `data`
- Value: paste the whole contents of `seed-data.json`

**6. Share the links**
- Everyone: `https://water-bill.pages.dev`
- Each editor: `https://water-bill.pages.dev/#key=<their key>`, for example `…/#key=k7Qm2xRp9vLs4Tz8`

> Menu names in the Cloudflare dashboard change occasionally. If a label is different, look for **KV**, **Bindings** and **Variables and Secrets** inside your Pages project settings.

## Monthly use (editors)

Open your edit link and tap **+ Start next month**. Last month's readings fill in as "Previous". Enter the bill and current readings, then tap **Save month**. Use **Copy summary** to paste the split into WhatsApp.

## Rotate or remove a key

Change `EDIT_KEYS` in **Variables and Secrets**, then **Retry deployment**. The old link stops working, so send the editor their new link. Removing someone's `Name:key` entry removes their access.

## Undo a mistake

Open an edit link and scroll to **Versions**. Each entry shows what the data looked like before a change, who made the change and when. Tap **Restore** on the one you want. The restore is itself saved as a new version, so it can be undone too.

## Change the house list

Edit `HOUSES` near the top of the script in `public/index.html`, then push. Months you've already saved keep their own house list.

## Free-tier limits

Cloudflare KV's free plan allows about 1,000 writes and 100,000 reads per day. This app does a couple of writes per save, so it stays far below that. After a save, other people may take up to about a minute to see the change.
