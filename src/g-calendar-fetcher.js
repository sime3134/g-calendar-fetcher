import ICAL from "ical.js";

class FetchError extends Error {
  constructor(message) {
    super(message);
    this.name = "FetchError";
  }
}

class ParseError extends Error {
  constructor(message) {
    super(message);
    this.name = "ParseError";
  }
}

class CreationError extends Error {
  constructor(message) {
    super(message);
    this.name = "CreationError";
  }
}

class GCalendarFetcher {
  constructor(options) {
    this.url = options.url;
    this.amountOfPastEvents = options.amountOfPastEvents;
  }

  async fetchEvents() {
    const response = await fetch(this.url);

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
      const DateTime = luxon.DateTime;

      const events = vevents.map((vevent) => {
        return this.createEvent(vevent, DateTime);
      });
      if (this.amountOfPastEvents === -1) {
        return events.sort((a, b) => a.startDate - b.startDate);
      }

      const pastEvents = events
        .filter((event) => event.endDate < DateTime.now())
        .sort((a, b) => b.endDate - a.endDate)
        .slice(0, this.amountOfPastEvents);
      const futureEvents = events.filter(
        (event) => event.endDate >= DateTime.now()
      );

      return [...futureEvents, ...pastEvents].sort(
        (a, b) => a.startDate - b.startDate
      );
    } catch (e) {
      throw new ParseError(
        "Error parsing ICS data. The data might be malformed or corrupted. Error: " +
          e
      );
    }
  }

  createEvent(vevent, DateTime) {
    try {
      let event = new ICAL.Event(vevent);
      let endDate = DateTime.fromJSDate(event.endDate.toJSDate());
      event = {
        startDate: DateTime.fromJSDate(event.startDate.toJSDate()),
        endDate: endDate,
        summary: event.summary,
        description: event.description,
        location: event.location,
        duration: event.duration,
        isPast: endDate < DateTime.now(),
        ics: vevent.toString(),
      };
      return event;
    } catch (e) {
      throw new CreationError("Error creating event. Error: " + e);
    }
  }
}

export default GCalendarFetcher;
