import GCalendarFetcher from "./g-calendar-fetcher.js";
import ICAL from "ical.js";
import luxon from "luxon";
import { FetchError, ParseError, CreationError } from "./g-calendar-fetcher.js";

describe("GCalendarFetcher", () => {
  test("Throw FetchError when fetching events from an invalid URL", async () => {
    const options = {
      url: "https://example.com/invalid-url.ics",
      amountOfPastEvents: 5,
    };
    const parser = new GCalendarFetcher(options);
    await expect(parser.fetchEvents()).rejects.toBeInstanceOf(FetchError);
  });

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

  test("Throw ParseError when parsing malformed ICS data", () => {
    // Malformed ICS data for testing
    const icsData = "Invalid ICS data";
    const parser = new GCalendarFetcher({
      url: "https://example.com/calendar.ics",
      amountOfPastEvents: 5,
    });

    // Expect parseIcsData method to throw ParseError when parsing malformed ICS data
    expect(() => parser.parseIcsData(icsData)).toThrow(ParseError);
  });

  test("Throw CreationError when creating event from invalid vevent", () => {
    // Invalid VEVENT data for testing
    const vevent = new ICAL.Component("VEVENT");
    vevent.addPropertyWithValue("SUMMARY", "Test Event");

    // Clear the required properties for this invalid test case
    vevent.removeProperty("DTSTART");
    vevent.removeProperty("DTEND");

    const parser = new GCalendarFetcher({
      url: "https://example.com/calendar.ics",
      amountOfPastEvents: 5,
    });

    // Expect createEvent method to throw CreationError when creating event from invalid vevent data
    expect(() => parser.createEvent(vevent)).toThrow(CreationError);
  });
});
