import * as DSL from './query';

// type for tests
interface Properties {
    hello: string;
    world: number;
}

describe('test types', () => {
    it('match_all', () => {
        const q0: DSL.MatchAll = {
            'match_all': {}
        };
        const q1: DSL.MatchAll = {
            'match_all': {
                'boost': 1
            }
        };
    });

    it('match_none', () => {
        const q0: DSL.MatchNone = {
            'match_none': {}
        };
    });

    it('term', () => {
        const q1: DSL.Term = {
            'term': {
                'world': 'world',
            }
        };

        const q0: DSL.Term<Properties> = {
            'term': {
                'hello': 'world',
            }
        };
    });

    it('terms', () => {
        const q0: DSL.Terms = {
            'terms': {
                world: [1,2,3],
            }
        };
        const q1: DSL.Terms<Properties> = {
            'terms': {
                world: [1,2,3]
            }
        };
    });

    it('range', () => {
        const q0: DSL.Range = {
            'range': {
                'hello': {
                    gte: 1,
                    lte: 2,
                    boost: 12,
                }
            }
        };
    });

    it('geo_distance', () => {
        const q0: DSL.GeoDistance = {
            'geo_distance': {
                'pin.location': {
                    'lon': 1,
                    'lat': 2,
                },
                'distance': '12km',
                'distance_type': 'arc',
            }
        };

        const q1: DSL.GeoDistance = {
            'geo_distance': {
                'pin.location': [-70, 40],
                'distance': '12km',
                'distance_type': 'plane',
            }
        };

        const q2: DSL.GeoDistance = {
            'geo_distance': {
                'pin.location': "40,-70",
                'distance': '12km',
            }
        };

        const q3: DSL.GeoDistance = {
            'geo_distance': {
                'pin.location': "drm3btev3e86",
                'distance': '12km',
            }
        };
    });

    it('geo_bounding_box', () => {
        const q0: DSL.GeoBoundingBox = {
            "geo_bounding_box" : {
                "pin.location" : {
                    "top_left" : {
                        "lat" : 40.73,
                        "lon" : -74.1
                    },
                    "bottom_right" : {
                        "lat" : 40.01,
                        "lon" : -71.12
                    }
                }
            }
        };

        const q1: DSL.GeoBoundingBox = {
            "geo_bounding_box" : {
                "pin.location" : {
                    "top_left" : {
                        "lat" : 40.73,
                        "lon" : -74.1
                    },
                    "bottom_right" : {
                        "lat" : 40.01,
                        "lon" : -71.12
                    }
                }
            }
        };

        const q3: DSL.GeoBoundingBox = {
            "geo_bounding_box" : {
                "pin.location" : {
                    "top_left" : [-74.1, 40.73],
                    "bottom_right" : [-71.12, 40.01]
                }
            }
        };

        const q4: DSL.GeoBoundingBox = {
            "geo_bounding_box" : {
                "pin.location" : {
                    "top_left" : "40.73, -74.1",
                    "bottom_right" : "40.01, -71.12"
                }
            }
        };

        const q5: DSL.GeoBoundingBox = {
            "geo_bounding_box" : {
                "pin.location" : {
                    "wkt" : "BBOX (-74.1, -71.12, 40.73, 40.01)"
                }
            }
        };

        const q6: DSL.GeoBoundingBox = {
            "geo_bounding_box" : {
                "pin.location" : {
                    "top_left" : "dr5r9ydj2y73",
                    "bottom_right" : "drj7teegpus6"
                }
            }
        };

        const q7: DSL.GeoBoundingBox = {
            "geo_bounding_box" : {
                "pin.location" : {
                    "top" : 40.73,
                    "left" : -74.1,
                    "bottom" : 40.01,
                    "right" : -71.12
                }
            }
        };

        const q8: DSL.GeoBoundingBox = {
            "geo_bounding_box" : {
                "pin.location" : {
                    "top_left" : {
                        "lat" : 40.73,
                        "lon" : -74.1
                    },
                    "bottom_right" : {
                        "lat" : 40.10,
                        "lon" : -71.12
                    }
                },
                "type" : "indexed",
            }
        };
    });

    it('bool', () => {
        const q0: DSL.Terms<Properties> = {
            'terms': {
                world: [1,2,3],
            }
        };

        const q1: DSL.Query<Properties> = {
            bool: {
                must: q0,
                must_not: [q0, {'term': {'hello': 'world'}}],
            },
        }

        const q2: DSL.GeoShape<keyof Properties> = {
            'geo_shape': {
                'hello': {
                    'shape': { 'type': 'Point' },
                    'relation': 'within'
                },
            }
        };

        const q3: DSL.Bool<Properties> = {
            'bool': {
                'must': {
                    'term': {
                        'hello': 'hello',
                    },
                },
                'should': [q2, q2],
                'must_not': [
                    { 'terms': { 'world': [1, 2, 3] } },
                ]
            },
        };
    })
});