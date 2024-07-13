# g-calendar-fetcher

This JavaScript library helps you to easily fetch, parse, and display events from Google Calendar using the iCalendar (.ics) format available from a given Google Calendar URL.

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Dependencies](#dependencies)
- [Installation](#installation)
- [Usage](#usage)
- [Troubleshooting](#troubleshooting)
- [Contributions](#contributions)
- [Acknowledgements](#acknowledgements)
- [License](#license)

## Description

g-calendar-fetcher provides a streamlined and intuitive interface for fetching iCalendar data from a Google Calendar URL. It parses the fetched data, transforming it into JavaScript objects for easy manipulation. The library is tailored for Google Calendar data but should work with other iCalendar files as well.

While using the Google Calendar API is typically preferable, there are situations where this may not be feasible, such as when there is no access to the server logic, or inability to securely hide your API key. In these cases, g-calendar-fetcher offers a viable alternative for integrating Google Calendar functionality into your JavaScript applications.

## Features

- Fetching Google Calendar data in iCalendar (.ics) format from a given URL
- Parsing iCalendar data into JavaScript objects
- Providing a mechanism for custom display of Google Calendar events
- Can separate past and upcoming events and display only a few or none of the past events.
- Events are always sorted by start date, oldest event has index 0.

## Dependencies

### Bundled Dependencies

- [ical.js](https://github.com/mozilla-comm/ical.js): Required for parsing the iCalendar data into JavaScript objects.

### Peer Dependencies

- [luxon](https://github.com/moment/luxon): Required for comparing dates and times.

## Installation

You can use the library by including it in your project using a script tag or using a module bundler like Webpack.

New - It's now also available on npm.

### Script tag

```html
<script src="path/to/g-calendar-parser.js"></script>
```

### Module Bundler

````js
import GCalendarParser from "/path/to/g-calendar-parser.js";

### npm

```bash
npm install g-calendar-fetcher
````

## Usage

Once you have included the library and it's dependencies in your project, you can start fetching and parsing calendar events using the provided class.

The Google calendar you want to use has to be public and the URL has to be the ical one. It can be found in the settings in Google Calendar.

Create a new instance of GCalendarParser with the desired options, and then use its methods to fetch and display the calendar events.

The `fetchEvents` method is an asynchronous function and returns a Promise. This means that it doesn't block the execution of your code, allowing other operations to execute while the calendar events are being fetched and parsed.

The Promise resolves to an array of parsed calendar events once the operation is successful. If there is an error during the fetch or parse process, the Promise is rejected and the error can be caught and handled.

### Example

```js
// Create a new instance of GCalendarParser
const parser = new GCalendarParser({
  url: "https://your-google-calendar-ical-url.com",
  amountOfPastEvents: 5, // Specify the number of past events to retrieve (-1 for all events)
});

// Fetch and parse the calendar events
parser
  .fetchEvents()
  .then((events) => {
    // Use the parsed events
    console.log(events);
    // Further processing or rendering
    // ...
  })
  .catch((error) => {
    console.error("Error fetching or parsing calendar events:", error);
    // Handle the error appropriately
    // ...
  });
```

OR

```js
async function fetchAndDisplayEvents() {
  try {
    // Create a new instance of GCalendarParser
    const parser = new GCalendarParser({
      url: "https://your-google-calendar-ical-url.com",
      amountOfPastEvents: 5, // Specify the number of past events to retrieve (-1 for all events)
    });

    // Fetch and parse the calendar events
    const events = await parser.fetchEvents();

    // Use the parsed events
    console.log(events);
    // Further processing or rendering
    // ...
  } catch (error) {
    console.error("Error fetching or parsing calendar events:", error);
    // Handle the error appropriately
    // ...
  }
}

// Call the function
fetchAndDisplayEvents();
```

### Options

The GCalendarParser constructor accepts an options object with the following properties:

- `url` (required): The URL of the Google Calendar iCal feed.
- `amountOfPastEvents` (required): The number of past events to retrieve. Use -1 to retrieve all events.

### Returned Events

The fetchEvents method returns a promise that resolves to an array of parsed calendar events. Each event object has the following properties:

- `startDate`: The start date of the event (in the Luxon DateTime format).
- `endDate`: The end date of the event (in the Luxon DateTime format).
- `summary`: The summary or title of the event.
- `description`: The description of the event.
- `location`: The location of the event.
- `duration`: The duration of the event.
- `isPast`: If the event has passed the current local time.
- `ics`: The raw ics text data for the event.

### Formatting Times

Note that the times in the events are unpadded so 01:05 will be displayed as 1:5. To fix this, you can use the toFormat() method in Luxon. For example, toFormat('HH:mm') will display the time as 01:05.

```js
const time = event.startDate.toFormat("HH:mm"); // Outputs '01:05'
```

### Error Handling

The library provides basic error handling for failed network requests or parsing errors. If an error occurs during the fetch or parsing process, an error will be thrown. It's recommended to implement custom error handling based on your specific requirements.

## Troubleshooting

### CORS

To successfully fetch calendar events, ensure that the iCal feed URL allows cross-origin requests or configure CORS headers on the server. CORS errors may occur if the iCal feed URL restricts access. You can use a CORS proxy like [cors-anywhere](https://github.com/Rob--W/cors-anywhere) as a workaround if necessary. This is usually required with Google Calendar.

## Contributions

Contributions, bug reports, and feature requests are welcome! Feel free to submit issues or pull requests on the GitHub repository.

## Creator

Simon Jern ([https://simonjern.com](https://simonjern.com))

## Acknowledgements

This project utilizes the [ical.js](https://github.com/mozilla-comm/ical.js) library to parse iCalendar data. ical.js is distributed under the [Mozilla Public License 2.0](https://mozilla.org/MPL/2.0/).

This project utilizes the [luxon](https://github.com/moment/luxon) library to compare date and time. luxon is distributed under the [MIT License](https://github.com/moment/luxon/blob/master/LICENSE.md).

## License

This project is licensed under the [MIT License](LICENSE.md).
