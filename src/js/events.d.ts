interface EventsOptions {
    handleName: string[],
    events: object
}

declare class Events {
    constructor (options: EventsOptions)
    on(eventName: string, callback: Function): void
    emit(eventName: string, args: string): void
    remove(eventName: string, callback: Function): void
}

export default Events
