export type LocationId = string;

export interface Location {
    id: LocationId;
    name: string;
    description: string;
    oxygenStream: boolean;
    hidden: boolean;
    undersea: boolean;
}

class LocationBuilder {
    id: string;
    name: string;
    private _description: string;
    private _hasOxygenStream: boolean;
    private _hidden: boolean;
    private _undersea: boolean;

    constructor(name: string);
    constructor(id: string, name: string);
    constructor(x: string, y?: string) {
        this.id = x;
        this.name = y ?? x;
        this._description = '';
        this._hasOxygenStream = false;
        this._hidden = false;
        this._undersea = true;
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

    make(): Location {
        return {
            id: this.id,
            name: this.name,
            oxygenStream: this._hasOxygenStream,
            description: this._description,
            hidden: this._hidden,
            undersea: this._undersea
        }
    }
}

const locations: Location[] = [
    new LocationBuilder('Shores', 'Sleepy Shores')
        .description("The closest point on land to the Undersea. You can return here by Resurfacing.")
        .surface().make(),
    new LocationBuilder('Shallows')
        .description('The shallowest part of the Undersea, most will pass through the Shallows on their way to the Undersea.')
        .make(),
    new LocationBuilder('Corals', 'Memorial Corals')
        .description('A location of historical importance. There are various exhibits about Undersea civilization in the reef.')
        .oxygenStream().make(),
    new LocationBuilder('Store', 'General Store')
        .description('A shop where everyone in the Undersea comes to get their supplies. Payment is made in Oxygen.')
        .make()
]

const locationsMapping: Record<string, Location> = {};
locations.forEach((location) => locationsMapping[location.id] = location);

export default locationsMapping;
