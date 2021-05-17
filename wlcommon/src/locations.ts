export type LocationId = string;

export interface Location {
    id: LocationId;
    name: string;
    description: string;
    oxygenStream: boolean;
    hidden: boolean;
    undersea: boolean;
    needsMap: boolean;
}

class LocationBuilder {
    id: string;
    name: string;
    private _description: string;
    private _hasOxygenStream: boolean;
    private _hidden: boolean;
    private _undersea: boolean;
    private _needsMap: boolean;

    constructor(name: string);
    constructor(id: string, name: string);
    constructor(x: string, y?: string) {
        this.id = x;
        this.name = y ?? x;
        this._description = '';
        this._hasOxygenStream = false;
        this._hidden = false;
        this._undersea = true;
        this._needsMap = true;
    }

    description(x: string) {
        this._description = x;
        return this;
    }

    oxygenStream(x = true) {
        this._hasOxygenStream = x;
        return this;
    }

    hidden(x = true) {
        this._hidden = x;
        return this;
    }

    surface() {
        this._undersea = false;
        return this;
    }

    needsMap(need = true) {
        this._needsMap = need;
        return this;
    }

    make(): Location {
        return {
            id: this.id,
            name: this.name,
            oxygenStream: this._hasOxygenStream,
            description: this._description,
            hidden: this._hidden,
            undersea: this._undersea,
            needsMap: this._needsMap,
        };
    }
}

export const locationIds = {
    SHORES: 'Shores',
    SHALLOWS: 'Shallows',
    CORALS: 'Corals',
    STORE: 'Store',
    ALCOVE: 'Alcove',
    SHRINE: 'Shrine',
    WOODS: 'Woods'
};

const locations: Location[] = [
    new LocationBuilder(locationIds.SHORES, 'Sleepy Shores')
        .description(
            'The closest point on land to the Undersea. You can return here by Resurfacing.'
        )
        .surface()
        .needsMap(false)
        .make(),
    new LocationBuilder(locationIds.SHALLOWS)
        .description(
            'The shallowest part of the Undersea, most will pass through the Shallows on their way to the Undersea.'
        )
        .needsMap(false)
        .make(),
    new LocationBuilder(locationIds.CORALS, 'Memorial Corals')
        .description(
            'A location of historical importance. There are various exhibits about Undersea civilization in the reef.'
        )
        .needsMap(false)
        .oxygenStream()
        .make(),
    new LocationBuilder(locationIds.STORE, 'General Store')
        .description(
            'A shop where everyone in the Undersea comes to get their supplies. Payment is made in Oxygen.'
        )
        .make(),
    new LocationBuilder(locationIds.STORE, 'General Store')
        .description(
            'A shop where everyone in the Undersea comes to get their supplies. Payment is made in Oxygen.'
        )
        .needsMap(false)
        .make(),
    new LocationBuilder(locationIds.ALCOVE, 'Hidden Alcove')
        .description(
            'A mysterious chamber within the Statue of Triton.'
        )
        .hidden()
        .make(),
    new LocationBuilder(locationIds.SHRINE, 'Shrine of the Innocent')
        .description(
            'A quiet shrine tucked away inside the Kelp Plains. Few know about its existence.'
        )
        .hidden()
        .make(),
    new LocationBuilder(locationIds.WOODS, 'Whispering Woods')
        .description(
            'A quiet forest. Unicorns are said to live here.'
        )
        .surface()
        .hidden()
        .make(),
];

export const locationsMapping: Record<string, Location> = {};
locations.forEach((location) => (locationsMapping[location.id] = location));
