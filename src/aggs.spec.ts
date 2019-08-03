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
});
