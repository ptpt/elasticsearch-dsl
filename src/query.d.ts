import * as GeoJSON from 'geojson';

type ValueType = string | number | boolean;

interface PropertyType {
    [field: string]: ValueType;
}

type SingleOrArray<T> = T | T[];

interface ValueWithBoost<T> {
    value: T;
    boost?: number;
}

type SingleValueOrBoost<T> = T | ValueWithBoost<T>;

interface MatchAll {
    match_all: {
        boost?: number;
    }
}

interface MatchNone {
    match_none: {}
}

interface Term<T=PropertyType> {
    term: {
        [field in keyof T]?: SingleValueOrBoost<T[field]>;
    };
}

interface Terms<T=PropertyType> {
    terms: {
        [field in keyof T]?: T[field][];
    };
}

interface Range<T=PropertyType> {
    range: {
        [field in keyof T]?: {
            gte?: T[field];
            gt?: T[field];
            lte?: T[field];
            lt?: T[field];
            boost?: number;
        }
    }
}

interface Exists<F=string> {
    exists: {
        field: F;
    };
}

interface Prefix<T=PropertyType> {
    prefix: {
        [field in keyof T]?: SingleValueOrBoost<T[field]>;
    }
}

interface WildCard<T=PropertyType> {
    wildcard: {
        [field in keyof T]?: SingleValueOrBoost<T[field]>;
    }
}

interface Regexp<T=PropertyType> {
    regexp: {
        [field in keyof T]?: T[field] | {
            value: T[field];
            boost?: number;
            flags?: string;
            max_determinized_states?: number;
        }
    }
}

interface Fuzzy<T=PropertyType> {
    fuzzy: {
        [field in keyof T]?: T[field] | {
            value: T[field];
            boost?: number;
            fuzziness?: number;
            prefix_length?: number;
            max_expansions?: number;
        }
    }
}

interface Type {
    type: {
        value: string
    }
}

interface Ids {
    ids: {
        type: string;
        values: ValueType[];
    }
}

type Relation = 'INTERSECTS'
    | 'DISJOINT'
    | 'WITHIN'
    | 'CONTAINS'
    | 'intersects'
    | 'disjoint'
    | 'within'
    | 'contains';

interface GeoShapeEnvelope {
    type: 'envelope' | 'Envelope',
    coordinates: [[number, number], [number, number]],
}

interface GeoShapeInline<T extends string=string> {
    geo_shape: {
        [field in T]?: {
            shape: GeoJSON.GeometryObject | GeoShapeEnvelope;
            relation?: Relation;
        }
    }
}

interface GeoShapeIndexed<F extends string=string> {
    geo_shape: {
        [field in F]?: {
            indexed_shape: {
                index: string;
                type: string;
                id: ValueType;
                path: string;
                relation?: Relation;
            }
        }
    }
}

type GeoShape<F extends string=string> = GeoShapeInline<F> | GeoShapeIndexed<F>;

interface LonLat {
    lon: number;
    lat: number;
}

interface BBoxLonLat {
    top_left: LonLat;
    bottom_right: LonLat;
}

interface BBoxArray {
    top_left: [number, number];
    bottom_right: [number, number];
}

interface BBoxString {
    top_left: string;
    bottom_right: string;
}

interface BBoxVertices {
    top: number;
    left: number;
    bottom: number;
    right: number;
}

interface BBoxWKT {
    wkt: string;
}

type BBox = BBoxLonLat | BBoxArray | BBoxString | BBoxVertices | BBoxWKT;

interface GeoBoundingBox<F extends string=string> {
    // can not use & here
    geo_bounding_box: {
        [field in F]: BBox;
    } | {
        type?: 'indexed' | 'memory';
    };
}

interface GeoDistance<F extends string=string> {
    // can not use & here
    geo_distance: {
        [field in F]: LonLat | [number, number] | string;
    } | {
        distance: string | number;
        distance_type?: 'arc' | 'plane';
    };
}

interface Match<T=PropertyType> {
    match: {
        [field in keyof T]: string | {
            query: string;
            operator?: string;
            zero_terms_query?: string;
            cutoff_frequency?: number;
            auto_generate_synonyms_phrase_query?: boolean;
        };
    }
}

interface QueryString<F=string> {
    query_string: {
        query: string;
        default_field?: F;
        // FIXME: more params
    }
}

export type SimpleQuery<T=PropertyType> = Regexp<T>
    | Term<T>
    | Terms<T>
    | Range<T>
    | Exists<keyof T>
    | Prefix<T>
    | WildCard<T>
    | Regexp<T>
    | Fuzzy<T>
    | Type
    | Ids
    | GeoShape<Extract<keyof T, string>>
    | GeoDistance<Extract<keyof T, string>>
    | GeoBoundingBox<Extract<keyof T, string>>
    | Match<T>
    | QueryString<keyof T>;

export interface Bool<T=PropertyType> {
    bool: {
        filter?: SingleOrArray<Query<T>>;
        must?: SingleOrArray<Query<T>>;
        must_not?: SingleOrArray<Query<T>>;
        should?: SingleOrArray<Query<T>>;
        minimum_should_match?: number | string;
        boost?: number;
    }
}

export interface ConstantScore<T=PropertyType> {
    constant_score: {
        filter: Query<T>;
        boost?: number;
    }
}

export interface Nested<T=PropertyType> {
    nested: {
        path: string;
        query: Query<T>;
        score_mode?: 'sum' | 'min' | 'max' | 'none';
        inner_hits?: {
            from?: number;
            size?: number;
            name?: string;
            // FIXME
            sort?: any;
            _source?: any;
            docvalue_fields?: any;
        };
    }
}

export type CompoundQuery<T=PropertyType> = Bool<T>
    | Nested<T>
    | ConstantScore<T>;

export type Query<T=PropertyType> = MatchAll
    | MatchNone
    | SimpleQuery<T>
    | CompoundQuery<T>;
