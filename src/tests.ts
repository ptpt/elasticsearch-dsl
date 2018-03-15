import { Query } from './builder';
import * as DSL from './index';

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
        const q0: DSL.Terms = {
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

        const q3: DSL.Bool = {
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

describe('test query builder', () => {
    it('should make match_all', () => {
        expect(Query.matchAll()).toEqual({
            'match_all': {}
        });

        expect(Query.matchAll(2)).toEqual({
            'match_all': {
                'boost': 2,
            }
        });
    });

    it('should make match_none', () => {
        expect(Query.matchNone()).toEqual({
            'match_none': {}
        });
    });

    it('should make constant_score', () => {
        expect({ ...Query.addConstantScore() }).toEqual({
            'constant_score': {
                'filter': {
                    'match_all': {}
                }
            }
        });
        expect({ ...Query.addConstantScore(12) }).toEqual({
            'constant_score': {
                'filter': {
                    'match_all': {}
                },
                'boost': 12,
            }
        });
        expect({ ...Query.addConstantScore().addConstantScore(12) }).toEqual({
            'constant_score': {
                'filter': {
                    'constant_score': {
                        'filter': { 'match_all': {} },
                    }
                },
                'boost': 12,
            }
        });
    });

    it('should make nested', () => {
        expect({ ...Query.addNested('Roma') }).toEqual({
            'nested': {
                'path': 'Roma',
                'query': {
                    'match_all': {}
                }
            }
        });
        expect({ ...Query.addNested('Roma', 'sum') }).toEqual({
            'nested': {
                'path': 'Roma',
                'query': {
                    'match_all': {}
                },
                'score_mode': 'sum',
            }
        });
        expect({ ...Query.addNested('Roma').addNested('Italy', 'min') }).toEqual({
            'nested': {
                'path': 'Italy',
                'query': {
                    'nested': {
                        'path': 'Roma',
                        'query': { 'match_all': {} },
                    }
                },
                'score_mode': 'min',
            }
        });
    });

    it('should make bool queries', () => {
        const query = Query
            .addFilter({ 'term': { 'filter': 1 } })
            .addFilter([{ 'term': { 'filter': 2 } }, Query.addFilter({ 'term': { 'filter': 3 } })])
            .addMust({ 'term': { 'must': 1 } })
            .addMust([{ 'term': { 'must': 2 } }, Query.addMust({ 'term': { 'must': 3 } })])
            .addMustNot({ 'term': { 'must_not': 1 } })
            .addMustNot([{ 'term': { 'must_not': 2 } }, Query.addMustNot({ 'term': { 'must_not': 3 } })])
            .addShould({ 'term': { 'should': 1 } })
            .addShould([{ 'term': { 'should': 2 } }, Query.addShould({ 'term': { 'should': 3 } })]);

        expect({ ...query }).toEqual({
            "bool": {
                "filter": [
                    {
                        "term": {
                            "filter": 1
                        }
                    },
                    {
                        "term": {
                            "filter": 2
                        }
                    },
                    {
                        "bool": {
                            "filter": [
                                {
                                    "term": {
                                        "filter": 3
                                    }
                                }
                            ]
                        }
                    }
                ],
                "must": [
                    {
                        "term": {
                            "must": 1
                        }
                    },
                    {
                        "term": {
                            "must": 2
                        }
                    },
                    {
                        "bool": {
                            "must": [
                                {
                                    "term": {
                                        "must": 3
                                    }
                                }
                            ]
                        }
                    }
                ],
                "must_not": [
                    {
                        "term": {
                            "must_not": 1
                        }
                    },
                    {
                        "term": {
                            "must_not": 2
                        }
                    },
                    {
                        "bool": {
                            "must_not": [
                                {
                                    "term": {
                                        "must_not": 3
                                    }
                                }
                            ]
                        }
                    }
                ],
                "should": [
                    {
                        "term": {
                            "should": 1
                        }
                    },
                    {
                        "term": {
                            "should": 2
                        }
                    },
                    {
                        "bool": {
                            "should": [
                                {
                                    "term": {
                                        "should": 3
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        });
    });

    it('should make complex query', () => {
        const query = Query
            .addConstantScore()
            .addNested('world')
            .addConstantScore(1000)
            .addFilter({ term: { 1: 'aa' } })
            .addMust(Query.matchAll())
            .addShould(Query.matchNone())
            .addFilter({
                geo_shape: {
                    l: {
                        shape: { type: 'Point', coordinates: [1, 2] }
                    }
                }
            })
            .addShould(Query.addFilter([Query.matchAll(), Query.matchNone()]))
            .addMust(Query.matchAll())
            .addConstantScore()
            .addNested('hello');

        // console.log(JSON.stringify(query, null, 2));
    });
});
