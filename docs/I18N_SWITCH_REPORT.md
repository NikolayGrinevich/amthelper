# I18N Switch: EN → RO

## Completed
- Removed English locale from `i18n.config.ts`.
- Replaced it with Romanian (`ro`).
- Updated `app/types/index.ts` to accept `ro` in template language.
- Added `messages/ro/common.json`.
- Updated `README.md` to list Romanian instead of English.
- Verified: no remaining `/en/` or `English` references in i18n/config/docs by grep scan.
- Git commit: `Replace EN with RO locale`