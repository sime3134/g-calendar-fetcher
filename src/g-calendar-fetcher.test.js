// Import the necessary dependencies and the GCalendarParser class
import GCalendarFetcher from "./g-calendar-fetcher.js";

// Test case 1: Fetching events from a valid URL
test("Fetch events from a valid URL", async () => {
  const options = {
    url: "https://example.com/calendar.ics",
    amountOfPastEvents: 5,
  };
  const parser = new GCalendarFetcher(options);
  const events = await parser.fetchEvents();
  expect(events.length).toBeGreaterThan(0);
});

// Test case 2: Fetching events from an invalid URL
test("Throw FetchError when fetching events from an invalid URL", async () => {
  const options = {
    url: "https://example.com/invalid-url.ics",
    amountOfPastEvents: 5,
  };
  const parser = new GCalendarFetcher(options);
  await expect(parser.fetchEvents()).rejects.toThrow("FetchError");
});

// Test case 3: Parsing valid ICS data
test("Parse valid ICS data", () => {
  const icsData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Example Corp.//CalDAV Client//EN
BEGIN:VEVENT
UID:1234567890
DTSTAMP:20220101T000000Z
DTSTART:20220102T090000Z
DTEND:20220102T100000Z
SUMMARY:Test Event
DESCRIPTION:This is a test event
LOCATION:Test Location
END:VEVENT
END:VCALENDAR`;
  const parser = new GCalendarFetcher({
    url: "https://example.com/calendar.ics",
    amountOfPastEvents: 5,
  });
  const events = parser.parseIcsData(icsData);
  expect(events.length).toBe(1);
  expect(events[0].summary).toBe("Test Event");
});

// Test case 4: Parsing malformed ICS data
test("Throw ParseError when parsing malformed ICS data", () => {
  const icsData = "Invalid ICS data";
  const parser = new GCalendarFetcher({
    url: "https://example.com/calendar.ics",
    amountOfPastEvents: 5,
  });
  expect(() => parser.parseIcsData(icsData)).toThrow("ParseError");
});

// Test case 5: Creating event from valid vevent
test("Create event from valid vevent", () => {
  const vevent = new ICAL.Component("VEVENT");
  vevent.addPropertyWithValue("SUMMARY", "Test Event");
  vevent.addPropertyWithValue("DTSTART", "20220102T090000Z");
  vevent.addPropertyWithValue("DTEND", "20220102T100000Z");
  const parser = new GCalendarFetcher({
    url: "https://example.com/calendar.ics",
    amountOfPastEvents: 5,
  });
  const DateTime = luxon.DateTime;
  const event = parser.createEvent(vevent, DateTime);
  expect(event.summary).toBe("Test Event");
});

// Test case 6: Creating event from invalid vevent
test("Throw CreationError when creating event from invalid vevent", () => {
  const vevent = "Invalid vevent";
  const parser = new GCalendarFetcher({
    url: "https://example.com/calendar.ics",
    amountOfPastEvents: 5,
  });
  const DateTime = luxon.DateTime;
  expect(() => parser.createEvent(vevent, DateTime)).toThrow("CreationError");
});
