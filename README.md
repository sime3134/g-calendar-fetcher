# Google Calendar Event Fetcher

A simple JavaScript library designed to simplify the process of fetching, parsing, and displaying events from Google Calendar using iCalendar (.ics) files.

## Overview

Google Calendar Event Fetcher provides a streamlined and intuitive interface for fetching iCalendar data from a Google Calendar URL. It parses the fetched data, transforming it into JavaScript objects for easy manipulation. The library is tailored for Google Calendar data but should work with other iCalendar files as well.

While using the Google Calendar API is typically preferable, there are situations where this may not be feasible, such as when there is no access to the server logic, or inability to securely hide your API key. In these cases, Google Calendar Event Fetcher offers a viable alternative for integrating Google Calendar functionality into your JavaScript applications.

## Features

- Fetching Google Calendar data in iCalendar (.ics) format from a given URL
- Parsing iCalendar data into JavaScript objects
- Providing a mechanism for custom display of Google Calendar events

## Dependencies

- [ical.js](https://github.com/mozilla-comm/ical.js): Required for parsing the iCalendar data into JavaScript objects.
- [luxon](https://github.com/moment/luxon): Required for comparing dates and times.

Note: Depending on the environment, you might run into CORS (Cross-Origin Resource Sharing) errors when fetching the iCalendar data. If you do encounter these issues, you can utilize [CORS Anywhere](https://github.com/Rob--W/cors-anywhere), a Node.js proxy which adds CORS headers to the proxied request.

## Acknowledgements

This project utilizes the [ical.js](https://github.com/mozilla-comm/ical.js) library to parse iCalendar data. ical.js is distributed under the [Mozilla Public License 2.0](https://mozilla.org/MPL/2.0/).

This project utilizes the [luxon](https://github.com/moment/luxon) library to compare date and time. luxon is distributed under the [MIT License](https://github.com/moment/luxon/blob/master/LICENSE.md).

## Usage guide

Once you have included the library and it's dependencies in your project, you can start fetching and parsing calendar events using the provided class.

### Installation

You can use the library by including it in your project using a script tag or using a module bundler like Webpack.

#### Script tag

```js
<script src="path/to/g-calendar-parser.js"></script>
```

#### Module Bundler

```js
import GCalendarParser from '/path/to/g-calendar-parser.js';
```

### Usage

Create a new instance of GCalendarParser with the desired options, and then use its methods to fetch and display the calendar events.

```js
// Create a new instance of GCalendarParser
const parser = new GCalendarParser({
  url: 'https://your-google-calendar-ical-url.com',
  amountOfPastEvents: 5, // Specify the number of past events to retrieve (-1 for all events)
});

// Fetch and parse the calendar events
parser.fetchEvents()
  .then(events => {
    // Use the parsed events
    console.log(events);
    // Further processing or rendering
    // ...
  })
  .catch(error => {
    console.error('Error fetching or parsing calendar events:', error);
    // Handle the error appropriately
    // ...
  });
```

#### Options

The GCalendarParser constructor accepts an options object with the following properties:

url (required): The URL of the Google Calendar iCal feed.
amountOfPastEvents: The number of past events to retrieve. Use -1 to retrieve all events. 

#### Returned Events

The fetchEvents method returns a promise that resolves to an array of parsed calendar events. Each event object has the following properties:

startDate: The start date of the event (in the Luxon DateTime format).
endDate: The end date of the event (in the Luxon DateTime format).
summary: The summary or title of the event.
description: The description of the event.
location: The location of the event.
duration: The duration of the event.

### Error Handling

The library provides basic error handling for failed network requests or parsing errors. If an error occurs during the fetch or parsing process, the error will be logged to the console. It's recommended to implement custom error handling based on your specific requirements.

### Note on CORS

To successfully fetch calendar events, ensure that the iCal feed URL allows cross-origin requests or configure CORS headers on the server. CORS errors may occur if the iCal feed URL restricts access. You can use a CORS proxy like cors-anywhere as a workaround if necessary.

## Contributions

Contributions, bug reports, and feature requests are welcome! Feel free to submit issues or pull requests on the GitHub repository.

## License

This project is licensed under the MIT License.
