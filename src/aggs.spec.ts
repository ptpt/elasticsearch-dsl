import * as Agg from './aggs';

describe('test agg types', () => {
    it('test sum', () => {
        const a: Agg.Sum = {
            'sum': {
                'field': 'hello',
            },
        };

        const b: Agg.Sum = {
            'sum': {
                'field': 'hello',
                'missing': 10,
            },
        };

        const c: Agg.NamedAgg = {
            'hello': {
                'sum': {
                    'field': 'hello',
                },
                'aggs': {
                    'world': {
                        'sum': {
                            'field': 'as',
                        },
                    },
                },
            },
        };
    });

    it('test min/max', () => {
        const a: Agg.Min = {
            'min': {
                'field': 'hello',
                'missing': 0,
            },
        };

        const b: Agg.Max = {
            'max': {
                'field': 'hello',
                'missing': 0,
            },
        };
    });

    it('test top hits', () => {
        const a: Agg.TopHits = {
            'top_hits': {
                'size': 1,
                'sort': [
                    {
                        'events.timestamp': {
                            'order': 'desc',
                        }
                    }
                ],
                '_source': ['xx'],
            }
        }
    });
});
