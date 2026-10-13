# dzenq-landing

The DzenQ site at https://dzenq.com (GitHub Pages): `index.html` (English), `uk/` (Ukrainian), legal pages, `oobi/` (app link hand-off), `.well-known/assetlinks.json`.

- `assets/site.css` — the landing's look: the app's "paper & ink" tokens (`composeApp/.../ui/theme/Theme.kt`), the «Слива» logo colours, the stamp and the wax seal. Light by default; dark with the moon button.
- `assets/legal.css` — the same look over the legal pages.
- Words on the page follow `dzenq/docs/ui-words.md` (Подяка / Марка / Доступ; Thanks / Stamp / Access).

## Service links

The page is a «cinema»: one sentence per screen, scroll-snapped; every DzenQ service is linked from the last screen and the list under it. The links point at the **test** environment for now:

| Service | Address |
|---|---|
| Web app | `https://dzenq-491220.web.app/` |
| Windows / macOS / Linux | `https://github.com/WheelReinvent/dzenq-landing/releases/latest/download/DzenQ-Windows.msi` (`DzenQ-macOS.dmg`, `DzenQ-Linux.deb`), published by the DzenQ repo's «Desktop release» workflow |
| Android (Google Play internal testing; testers only) | `https://play.google.com/apps/internaltest/4701659485857373109` — switch to `https://play.google.com/store/apps/details?id=com.wheelreinvent.dzenq` with open testing |
| Doors demo | `https://dzenq-doors-594587322361.europe-west1.run.app/` |
| Sign in with DzenQ demo | `…/demo/login`, discovery `…/.well-known/openid-configuration`, JWKS `…/oauth/jwks` |
| App privacy / terms / delete account | `https://europe-west1-dzenq-491220.cloudfunctions.net/legal/{privacy,terms,delete}` |

When prod and DzenQ's own domain exist (`dzenq/config/env/prod.env` → `PUBLIC_URL`), replace them in both `index.html` and `uk/index.html` (search for `run.app` and `cloudfunctions.net`).
