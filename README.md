# Google Calendar Event Fetcher

A simple JavaScript library designed to simplify the process of fetching, parsing, and displaying events from Google Calendar using iCalendar (.ics) files.

## Overview

Google Calendar Event Fetcher provides a streamlined and intuitive interface for fetching iCalendar data from a Google Calendar URL. It parses the fetched data, transforming it into JavaScript objects for easy manipulation. The library is tailored for Google Calendar data but should work with other iCalendar files as well.

While using the Google Calendar API is typically preferable, there are situations where this may not be feasible, such as when there is no access to the server logic, or inability to securely hide your API key. In these cases, Google Calendar Event Fetcher offers a viable alternative for integrating Google Calendar functionality into your JavaScript applications.

## Features

- Fetching Google Calendar data in iCalendar (.ics) format from a given URL
- Parsing iCalendar data into JavaScript objects
- Providing a mechanism for custom display of Google Calendar events
- Handling errors gracefully and providing clear debugging information

## Dependencies

- [ical.js](https://github.com/mozilla-comm/ical.js): Required for parsing the iCalendar data into JavaScript objects.
- [luxon](https://github.com/moment/luxon): Required for comparing dates and times.

Note: Depending on the environment, you might run into CORS (Cross-Origin Resource Sharing) errors when fetching the iCalendar data. If you do encounter these issues, you can utilize [CORS Anywhere](https://github.com/Rob--W/cors-anywhere), a Node.js proxy which adds CORS headers to the proxied request.

## Acknowledgements

This project utilizes the [ical.js](https://github.com/mozilla-comm/ical.js) library to parse iCalendar data. ical.js is distributed under the [Mozilla Public License 2.0](https://mozilla.org/MPL/2.0/).

This project utilizes the [luxon](https://github.com/moment/luxon) library to compare date and time. luxon is distributed under the [MIT License](https://github.com/moment/luxon/blob/master/LICENSE.md).
