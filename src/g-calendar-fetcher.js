import ICAL from "ical.js";
import { DateTime } from "luxon";

export class FetchError extends Error {
  constructor(message) {
    super(message);
    this.name = "FetchError";
  }
}

export class ParseError extends Error {
  constructor(message) {
    super(message);
    this.name = "ParseError";
  }
}

export class CreationError extends Error {
  constructor(message) {
    super(message);
    this.name = "CreationError";
  }
}

export default class GCalendarFetcher {
  constructor(options) {
    this.url = options.url;
    this.amountOfPastEvents = options.amountOfPastEvents ?? -1;
    this.dateTime = DateTime;
  }

  async fetchEvents() {
    let response;
    try {
      response = await fetch(this.url);
    } catch (e) {
      throw new FetchError("Failed to fetch calendar events. Error: " + e);
    }

    if (!response.ok) {
      throw new FetchError(
        "Failed to fetch calendar events. Status: ${response.status}. Please check the URL or CORS errors."
      );
    }

    const icsData = await response.text();
    return this.parseIcsData(icsData);
  }

  parseIcsData(icsData) {
    try {
      const jcalData = ICAL.parse(icsData);
      const comp = new ICAL.Component(jcalData);
      const vevents = comp.getAllSubcomponents("vevent");

      const events = vevents.map((vevent) => {
        return this.createEvent(vevent);
      });
      const now = this.dateTime.now().toUTC();

      let pastEvents = events
        .filter((event) => event.endDate < now)
        .sort((a, b) => b.endDate - a.endDate);

      const futureEvents = events
        .filter((event) => event.endDate >= now)
        .sort((a, b) => a.startDate - b.startDate);

      if (this.amountOfPastEvents !== -1) {
        pastEvents = pastEvents.slice(0, this.amountOfPastEvents);
      }

      return [...futureEvents, ...pastEvents];
    } catch (e) {
      throw new ParseError(
        "Error parsing ICS data. The data might be malformed or corrupted. Error: " +
          e
      );
    }
  }

  createEvent(vevent) {
    try {
      const icalEvent = new ICAL.Event(vevent);

      const startDate = this.dateTime.fromJSDate(
        icalEvent.startDate.toJSDate(),
        { zone: "utc" }
      );

      const endDate = this.dateTime.fromJSDate(icalEvent.endDate.toJSDate(), {
        zone: "utc",
      });

      return {
        startDate,
        endDate,
        summary: icalEvent.summary,
        description: icalEvent.description,
        location: icalEvent.location,
        duration: icalEvent.duration,
        isPast: endDate < this.dateTime.now().toUTC(),
        ics: vevent.toString(),
      };
    } catch (e) {
      throw new CreationError("Error creating event. Error: " + e);
    }
  }
}
