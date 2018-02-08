# elasticsearch-dsl
Write type-safe Elasticsearch queries for TypeScript


## Examples

Secure queries with `DSL.Query`:

```typescript
import * as DSL from 'elasticsearch-dsl';

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

```

## Development

Set up:
```
$ npm install typescript
$ npm install
```

Build and watch:
```
$ tsc -w
```

Run tests:
```
$ jasmine dist/tests.js
```
