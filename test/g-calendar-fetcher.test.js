import GCalendarFetcher from "../src/g-calendar-fetcher.js";
import ICAL from "ical.js";
import { DateTime } from "luxon";
import {
  FetchError,
  ParseError,
  CreationError,
} from "../src/g-calendar-fetcher.js";
import fs from "fs/promises";
import path from "path";

const FIXED_NOW = DateTime.fromISO("2023-01-01T00:00:00Z");
const boundaryIcs = path.join(__dirname, "fixtures", "boundary.ics");
const mixedEventsIcs = path.join(__dirname, "fixtures", "mixed-events.ics");

describe("GCalendarFetcher", () => {
  beforeEach(() => {
    jest.spyOn(DateTime, "now").mockReturnValue(FIXED_NOW);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("Throw FetchError when fetching events from an invalid URL", async () => {
    fetch.mockRejectedValueOnce(new Error("Network error"));

    const parser = new GCalendarFetcher({
      url: "invalid",
      amountOfPastEvents: 5,
    });

    await expect(parser.fetchEvents()).rejects.toBeInstanceOf(FetchError);
  });

  test("amountOfPastEvents set to -1 returns all events in correct order", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => await fs.readFile(mixedEventsIcs, "utf-8"),
    });

    const parser = new GCalendarFetcher({
      url: "/test/fixtures/mixed-events.ics",
      amountOfPastEvents: -1,
    });

    const events = await parser.fetchEvents();
    expect(events.length).toBe(4);
    expect(events[0].summary).toBe("Future Event 1");
    expect(events[1].summary).toBe("Future Event 2");
    expect(events[2].summary).toBe("Past Event 2");
    expect(events[3].summary).toBe("Past Event 1");
  });

  test("amountOfPastEvents set to 1 returns only most recent past event in correct order", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => await fs.readFile(mixedEventsIcs, "utf-8"),
    });

    const parser = new GCalendarFetcher({
      url: "/test/fixtures/mixed-events.ics",
      amountOfPastEvents: 1,
    });

    const events = await parser.fetchEvents();
    expect(events.length).toBe(3);
    expect(events[0].summary).toBe("Future Event 1");
    expect(events[1].summary).toBe("Future Event 2");
    expect(events[2].summary).toBe("Past Event 2");
  });

  test("Event startDate and endDate are normalized to UTC", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => await fs.readFile(mixedEventsIcs, "utf-8"),
    });

    const parser = new GCalendarFetcher({
      url: "/test/fixtures/mixed-events.ics",
      amountOfPastEvents: -1,
    });

    const events = await parser.fetchEvents();

    events.forEach((event) => {
      expect(event.startDate.isValid).toBe(true);
      expect(event.endDate.isValid).toBe(true);
      expect(event.startDate.zoneName).toBe("UTC");
      expect(event.endDate.zoneName).toBe("UTC");
    });
  });

  test("Event ending exactly at now is treated as future", async () => {
    jest
      .spyOn(DateTime, "now")
      .mockReturnValue(DateTime.fromISO("2023-01-01T10:00:00Z"));

    fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => await fs.readFile(boundaryIcs, "utf-8"),
    });

    const parser = new GCalendarFetcher({
      url: "/test/fixtures/boundary.ics",
      amountOfPastEvents: -1,
    });

    const events = await parser.fetchEvents();

    expect(events[0].isPast).toBe(false);
  });

  test("Event ended one minute ago is treated as past", async () => {
    jest
      .spyOn(DateTime, "now")
      .mockReturnValue(DateTime.fromISO("2023-01-01T10:01:00Z"));

    fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => await fs.readFile(boundaryIcs, "utf-8"),
    });

    const parser = new GCalendarFetcher({
      url: "/test/fixtures/boundary.ics",
      amountOfPastEvents: -1,
    });

    const events = await parser.fetchEvents();

    expect(events[0].isPast).toBe(true);
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
