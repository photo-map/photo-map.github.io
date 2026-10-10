# TODO

- [v] Support loading photos from shared Google Drive folder.
- [v] Add loading tips when the data is loading.
- [v] Show photos in public folder on the map.
- [v] Remove the public folders in the list.
- [v] Show public folders name in the list.
- [v] Export the config or app data.
- [v] Import the config or app data.
- [v] Change website icon.
- [v] Show/hide photos on the map when switching the checkbox.
- [ ] Show an in-app notice when some photos have no GPS coordinates (currently they are skipped silently; deferred from the TS migration — see docs/plans/0001-typescript-migration.md).
- [ ] Fix PubSub subscriber leaks on unmount: `Map/AMap/index.tsx` never unsubscribes the FIT_MARKERS token, and `Map/index.tsx` never unsubscribes the SHOW/HIDE tokens (found during the TS migration, see the "阶段 4 实测" section of docs/plans/0001-typescript-migration.md).
