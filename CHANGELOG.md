# Changelog

From version 0.7.0, we are now keeping track of changes in the CHANGELOG.md file.

## [0.7.0] – 2025-12-23

### ⚠️ Breaking changes

- Luxon is now bundled as an internal dependency.
  Consumers no longer need to install or import Luxon manually.
- Date handling is now UTC-based internally.

### Bug fixes

- When setting amountOfPastEvents to -1 (all past events), the returned order would be different than for when setting it to return a specific amount of past events. The order is now always:
  Future events (Future Date first)
  Past events (Most recent first)

### Minor changes

- amountOfPastEvents now defaults to -1 when no value is provided.
- Improved release flow using softprops/action-gh-release@v2.5.0.
- Improved automated tests.
