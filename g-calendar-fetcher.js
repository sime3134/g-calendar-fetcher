class GCalendarParser {
    constructor(options) {
        this.url = options.url;
        this.amountOfPastEvents = options.amountOfPastEvents;
    }

    async fetchEvents() {
        try {
            const response = await fetch(this.url);

            if (!response.ok) {
                throw new Error('Failed to fetch calendar events. Please check the URL or CORS errors.')
            }

            const icsData = await response.text();
            return this.parseIcsData(icsData);
        }catch(e) {
            console.error(e);
        }
    }

    parseIcsData(icsData) {
        const jcalData = ICAL.parse(icsData);
        const comp = new ICAL.Component(jcalData);
        const vevents = comp.getAllSubcomponents('vevent');
        const DateTime = luxon.DateTime;

        const events = vevents.map(vevent => { return this.createEvent(vevent, DateTime) });
        if(this.amountOfPastEvents === -1) {
            return events.sort((a, b) => a.startDate - b.startDate);
        }

        const pastEvents = events.filter(event => event.endDate < DateTime.now()).sort((a, b) => b.endDate - a.endDate).slice(0, this.amountOfPastEvents);
        const futureEvents = events.filter(event => event.endDate >= DateTime.now());

        return [...pastEvents, ...futureEvents].sort((a, b) => a.startDate - b.startDate);
    }

    createEvent(vevent, DateTime) {
        try {
            let event = new ICAL.Event(vevent);
            event = {
                startDate: DateTime.fromJSDate(event.startDate.toJSDate()),
                endDate: DateTime.fromJSDate(event.endDate.toJSDate()),
                summary: event.summary,
                description: event.description,
                location: event.location,
                duration: event.duration,
            };
            return event;
        }catch(e) {
            console.error('Error parsing event', e);
            return null;
        }
    }
}

export default GCalendarParser;