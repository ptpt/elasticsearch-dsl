import * as DSL from './query';

// type for tests
interface Properties {
    hello: string;
    world: number;
}

export function extendable<A, B>(_true: A extends B ? true : false) {}

describe('test types', () => {
    it('match_all', () => {
        extendable<{'match_all': {}}, DSL.MatchAll>(true);
        extendable<{'match_all': {}}, DSL.MatchAll>(true);
        extendable<{'match_all': {'boost': 1}}, DSL.MatchAll>(true);
        extendable<{'match_all': {'boost': 'hello'}}, DSL.MatchAll>(false);
        extendable<{'match_all': {'hello': 1}}, DSL.MatchAll>(false);
    });

    it('match_none', () => {
        extendable<{'match_none': {}}, DSL.MatchNone>(true);
        // FIXME: why!
        // extendable<{'match_none': {'hello': 1}}, DSL.MatchNone>(false);
    });

    it('term', () => {
        extendable<{'term': {'world': 'world'}}, DSL.Term>(true);
        extendable<{'term': {'hello': 'world'}}, DSL.Term<Properties>>(true);
        extendable<{'term': {'hello': 1}}, DSL.Term<Properties>>(false);
        extendable<{'term': {'haha': 'world'}}, DSL.Term<Properties>>(false);
    });

    it('terms', () => {
        extendable<{'terms': {'world': [1, 2, 3]}}, DSL.Terms>(true);
        extendable<{'terms': {'world': ['hello']}}, DSL.Terms<Properties>>(false);
    });

    it('range', () => {
        extendable<{'range': {'hello': {'gte': 1, 'lte': 2, 'boost': 12}}}, DSL.Range>(true);
        extendable<{'range': {'world': {'gte': 1, 'lte': 2, 'boost': 12}}}, DSL.Range<Properties>>(true);
    });

    it('geo_distance', () => {
        extendable<{
            'geo_distance': {
                'pin.location': {
                    'lon': 1,
                    'lat': 2,
                },
                'distance': '12km',
                'distance_type': 'arc',
            },
        }, DSL.GeoDistance>(true);

        extendable<{
            'geo_distance': {
                'pin.location': [-70, 40],
                'distance': '12km',
                'distance_type': 'plane',
            },
        }, DSL.GeoDistance>(true);

        extendable<{
            'geo_distance': {
                'pin.location': "40,-70",
                'distance': '12km',
            },
        }, DSL.GeoDistance>(true);

        extendable<{
            'geo_distance': {
                'pin.location': "drm3btev3e86",
                'distance': '12km',
            },
        }, DSL.GeoDistance>(true);

        // FIXME: here
        // extendable<{
        //     'geo_distance': {
        //         'pin.location': "drm3btev3e86",
        //         'distance': '12km',
        //     }
        // }, DSL.GeoDistance<keyof Properties>>(false);
    });

    it('geo_bounding_box', () => {
        extendable<{
            "geo_bounding_box": {
                "pin.location": {
                    "top_left": {
                        "lat": 40.73,
                        "lon": -74.1,
                    },
                    "bottom_right": {
                        "lat": 40.01,
                        "lon": -71.12,
                    },
                },
            },
        }, DSL.GeoBoundingBox>(true);

        extendable<{
            "geo_bounding_box": {
                "pin.location": {
                    "top_left": {
                        "lat": 40.73,
                        "lon": -74.1,
                    },
                    "bottom_right": {
                        "lat": 40.01,
                        "lon": -71.12,
                    },
                },
            },
        }, DSL.GeoBoundingBox>(true);

        extendable<{
            "geo_bounding_box": {
                "pin.location": {
                    "top_left": [-74.1, 40.73],
                    "bottom_right": [-71.12, 40.01],
                },
            },
        }, DSL.GeoBoundingBox>(true);

        extendable<{
            "geo_bounding_box": {
                "pin.location": {
                    "top_left": "40.73, -74.1",
                    "bottom_right": "40.01, -71.12",
                },
            },
        }, DSL.GeoBoundingBox>(true);

        extendable<{
            "geo_bounding_box": {
                "pin.location": {
                    "wkt": "BBOX (-74.1, -71.12, 40.73, 40.01)",
                },
            },
        }, DSL.GeoBoundingBox>(true);

        extendable<{
            "geo_bounding_box": {
                "pin.location": {
                    "top_left": "dr5r9ydj2y73",
                    "bottom_right": "drj7teegpus6",
                },
            },
        }, DSL.GeoBoundingBox>(true);

        extendable<{
            "geo_bounding_box": {
                "pin.location": {
                    "top": 40.73,
                    "left": -74.1,
                    "bottom": 40.01,
                    "right": -71.12,
                },
            },
        }, DSL.GeoBoundingBox>(true);

        extendable<{
            "geo_bounding_box": {
                "pin.location": {
                    "top_left": {
                        "lat": 40.73,
                        "lon": -74.1,
                    },
                    "bottom_right": {
                        "lat": 40.10,
                        "lon": -71.12,
                    },
                },
                "type": "indexed",
            },
        }, DSL.GeoBoundingBox>(true);
    });

    it('bool', () => {
        const q0: DSL.Terms<Properties> = {
            'terms': {
                world: [1, 2, 3],
            },
        };

        const q1: DSL.Query<Properties> = {
            bool: {
                must: q0,
                must_not: [q0, {'term': {'hello': 'world'}}],
            },
        };

        const q2: DSL.GeoShape<keyof Properties> = {
            'geo_shape': {
                'hello': {
                    'shape': { 'type': 'Point', 'coordinates': [1, 2] },
                    'relation': 'within',
                },
            },
        };

        const q3: DSL.Bool<Properties> = {
            'bool': {
                'must': {
                    'term': {
                        'hello': 'hello',
                    },
                },
                'filter': q0,
                'should': [q0, q1, q2],
                'must_not': [
                    { 'terms': { 'world': [1, 2, 3] } },
                ],
            },
        };
    });
});
