import * as els from 'elasticsearch';
import * as GeoJSON from 'geojson';

import { Query } from './builder';
import * as DSL from './query';

describe('test', () => {
    it('should work with elasticsearch', (done) => {
        const client = new els.Client({});

        interface Tweet {
            text: string;
            l: {lon: number, lat: number};
            l_shape: GeoJSON.Point;
        }

        const query = (query: DSL.Query) => {
            const params: els.SearchParams = {
                'body': {
                    'query': query,
                },
                'index': 'tweets',
                'type': 'tweet',
            };

            client.search(params)
                .then(
                    (resp: els.SearchResponse<any>) => {
                        for (const hit of resp.hits.hits) {
                            console.log(JSON.stringify(hit));
                        }
                        done();
                    },
                    (error: Error) => {
                        done.fail(error);
                    }
                );
        };

        query(
            Query
                .addConstantScore()
                .addConstantScore()
                .addShould(
                    {'terms': {text: [1, '2']}}
                )
                .addMust(
                    {'terms': {text: [1, '2']}}
                )
                .addConstantScore(10)
                .addConstantScore(10),
        );

    });
});
