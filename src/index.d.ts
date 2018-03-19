import * as GeoJSON from 'geojson';

type ValueType = string | number | boolean;
type PropertyType = {[field: string]: ValueType};

interface ValueWithBoost<T> {
    value: T;
    boost?: number;
}

type SingleValueOrBoost<T> = T | ValueWithBoost<T>;

interface MatchAll {
    match_all: {}
    boost?: number;
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

interface Exists {
    exists: {
        field: string;
    };
}

interface Prefix<T=PropertyType> {
    prefix: {
        [field in keyof T]?: SingleValueOrBoost<T[field]>;
    }
}

interface WildChar<T=PropertyType> {
    wildchar: {
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

interface GeoShapeInline<T extends string=string> {
    geo_shape: {
        [field in T]?: {
            shape: GeoJSON.GeometryObject;
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

type GeoShape<F extends string> = GeoShapeInline<F> | GeoShapeIndexed<F>;

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

interface GeoBoundingBoxOptions {
    type?: 'indexed' | 'memory';
}

interface GeoBoundingBox<F extends string=string> {
    geo_bounding_box: {
        [field in F]: BBox | GeoBoundingBoxOptions[keyof GeoBoundingBoxOptions];
    } & GeoBoundingBoxOptions;
}

interface GeoDistanceOptions {
    distance: string | number;
    distance_type?: 'arc' | 'plane';
}

interface GeoDistance<F extends string=string> {
    geo_distance: {
        [field in F]: LonLat | [number, number] | string | GeoDistanceOptions[keyof GeoDistanceOptions];
    } & GeoDistanceOptions;
}

export type SimpleQuery<T=PropertyType> = Regexp<T>
    | Term<T>
    | Terms<T>
    | Range<T>
    | Exists
    | Prefix<T>
    | WildChar<T>
    | Regexp<T>
    | Fuzzy<T>
    | Type
    | Ids
    | GeoShape<keyof T>
    | GeoDistance<keyof T>
    | GeoBoundingBox<keyof T>;

interface Bool<T=PropertyType> {
    bool: {
        filter?: Query<T> | Query<T>[];
        must?: Query<T> | Query<T>[];
        must_not?: Query<T> | Query<T>[];
        should?: Query<T> | Query<T>[];
    }
}

interface ConstantScore<T=PropertyType> {
    constant_score: {
        filter: Query<T>;
        boost?: number;
    }
}

interface Nested<T=PropertyType> {
    nested: {
        path: string;
        query: Query<T>;
        score_mode?: 'sum' | 'min' | 'max' | 'none';
    }
}

export type CompoundQuery<T=PropertyType> = Bool<T>
    | Nested<T>
    | ConstantScore<T>;

export type Query<T=PropertyType> = MatchAll
    | MatchNone
    | SimpleQuery<T>
    | CompoundQuery<T>;
