import { Query } from './builder';
import * as DSL from './index';

describe('test', () => {
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

    it('should have correct types', () => {
        interface Properties {
            hello: string;
            world: number;
        }

        const q0: DSL.Term<Properties> = {
            'term': {
                'hello': 'world',
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
