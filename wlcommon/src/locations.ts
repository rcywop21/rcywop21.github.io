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
    WOODS: 'Woods',
    STATUE: 'Statue',
    LIBRARY: 'Library',
    KELP: 'Kelp',
    BUBBLE: 'Bubble',
    ANCHOVY: 'Anchovy',
    BARNACLE: 'Barnacle',
    CATFISH: 'Catfish',
    SALMON: 'Salmon',
    TUNA: 'Tuna',
    UMBRAL: 'Umbral',
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
        .needsMap(false)
        .make(),
    new LocationBuilder(locationIds.ALCOVE, 'Hidden Alcove')
        .description('A mysterious chamber within the Statue of Triton.')
        .hidden()
        .make(),
    new LocationBuilder(locationIds.SHRINE, 'Shrine of the Innocent')
        .description(
            'A quiet shrine tucked away inside the Kelp Plains. Few know about its existence.'
        )
        .hidden()
        .make(),
    new LocationBuilder(locationIds.WOODS, 'Whispering Woods')
        .description('A quiet forest. Unicorns are said to live here.')
        .surface()
        .hidden()
        .make(),
    new LocationBuilder(locationIds.STATUE, 'Statue of Triton')
        .description('A monument to Triton, famed hero of the Undersea.')
        .oxygenStream()
        .make(),
    new LocationBuilder(locationIds.LIBRARY, 'Marine Library')
        .description(
            "The Undersea's largest collection of books. If you have a Library Pass, you can read the books in the Restricted Section."
        )
        .make(),
    new LocationBuilder(locationIds.KELP, 'Kelp Plains')
        .description(
            'The plains is full of seaweed, and stretches for miles and miles.'
        )
        .make(),
    new LocationBuilder(locationIds.BUBBLE, 'Bubble Factory')
        .description(
            'One of the largest source of Oxygen in the Undersea. However, you will need a Bubble Pass to be able to get Oxygen here.'
        )
        .oxygenStream()
        .make(),
    new LocationBuilder(locationIds.ANCHOVY, 'Anchovy Avenue')
        .description(
            'A residential district. It is located close to the Marine Library and many of the staff live here.'
        )
        .make(),
    new LocationBuilder(locationIds.BARNACLE, 'Barnacle Residences')
        .description(
            'A residential district. Some of the more eccentric personalities in the Undersea live here.'
        )
        .make(),
    new LocationBuilder(locationIds.CATFISH, 'Catfish Crescent')
        .description(
            'A residential district. An Oxygen Stream is located here.'
        )
        .oxygenStream()
        .make(),
    new LocationBuilder(locationIds.SALMON, 'Salmon Street')
        .description(
            'A residential district. An Oxygen Stream is located here.'
        )
        .oxygenStream()
        .make(),
    new LocationBuilder(locationIds.TUNA, 'Tuna Turn')
        .description(
            'A residential district. An Oxygen Stream is located here.'
        )
        .oxygenStream()
        .make(),
    new LocationBuilder(locationIds.UMBRAL, 'Umbral Ruins')
        .description(
            'A rundown area. There used to be a residential district here, until the local Oxygen Stream just vanished one day.'
        )
        .make(),
];

export const locationsMapping: Record<string, Location> = {};
locations.forEach((location) => (locationsMapping[location.id] = location));
