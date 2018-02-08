import * as DSL from './index';

const isObject = (obj): boolean => {
    return obj && typeof obj === 'object'
};

const setDefault = <T>(obj, path: any[], defaultValue?: T): T => {
    let parent = obj;
    const lastIdx: number = path.length - 1;

    for (let i: number = 0; i < lastIdx; i++) {
        const key = path[i];
        if (!isObject(parent[key])) {
            parent[key] = {};
        }
        parent = parent[key];
    }

    const lastKey = path[lastIdx];
    if (parent[lastKey] === undefined) {
        parent[lastKey] = defaultValue;
    }
    return parent[lastKey];
};

const getDefault = <T>(obj, path: any[], defaultValue?: T): T => {
    let parent = obj;

    for (let i: number = 0; i < path.length; i++) {
        const key = path[i];
        if (!isObject(parent[key])) {
            return defaultValue;
        }
        parent = parent[key];
    }

    return parent === undefined ? defaultValue : parent;
}

const clearObject = <T>(obj: T, keep?: string[]): T => {
    if (keep === undefined) {
        keep = [];
    }
    for (const key of Object.keys(obj)) {
        if (keep.indexOf(key) < 0) {
            delete obj[key];
        }
    }
    return obj;
}

const discardFalsy = <T extends Object>(obj: T): T => {
    const keep = Object.keys(obj).filter((key) => obj[key] !== undefined);
    const newObj = {...(obj as Object)} as T;
    return clearObject(newObj, keep);
}

const prependAndReplaceObject = <T extends Object, P extends Object>(obj: T, prepend: (obj: T) => P): P => {
    const oldObj = { ...(obj as Object) } as T;
    clearObject(obj);
    return Object.assign(obj, prepend(oldObj));
}

type QueryOrArray = DSL.Query | Query | Array<DSL.Query | Query>;

// query: nested query
// query: constant_score query
// query: bool query

// query: match_all
// query: match_none
// query: simple
export class Query extends Object {
    private constructor() {
        super();
        prependAndReplaceObject<this, DSL.MatchAll>(this, (_) => {
            return Query.matchAll();
        });
    }

    static matchAll(boost?: number): DSL.MatchAll {
        return {
            'match_all': {
                ...discardFalsy({'boost': boost}),
            }
        };
    }

    static matchNone(): DSL.MatchNone {
        return {
            'match_none': {},
        };
    }

    private findQueryRoot(): DSL.Query {
        let query: DSL.Query = this as any;

        while (true) {
            let childQuery;

            childQuery = getDefault(query, ['constant_score', 'filter']);
            if (isObject(childQuery)) {
                query = childQuery;
                continue;
            }

            childQuery = getDefault(query, ['nested', 'query']);
            if (isObject(childQuery)) {
                query = childQuery;
                continue;
            }

            break;
        };

        return query;
    }

    static addConstantScore(boost?: number): Query & DSL.ConstantScore {
        return (new Query()).addConstantScore(boost);
    }

    public addConstantScore(boost?: number): this & DSL.ConstantScore {
        const wrap = (query: DSL.Query): DSL.ConstantScore => {
            return {
                'constant_score': {
                    'filter': query,
                    ...discardFalsy({'boost': boost}),
                }
            };
        };
        const thisIsQuery: DSL.Query = this as any;
        return prependAndReplaceObject<DSL.Query, DSL.ConstantScore>(thisIsQuery, wrap) as this & DSL.ConstantScore;
    }

    static addNested(path: string, score_mode?: DSL.Nested['nested']['score_mode']): Query & DSL.Nested {
        return (new Query()).addNested(path, score_mode);
    }

    public addNested(path: string, score_mode?: DSL.Nested['nested']['score_mode']): this & DSL.Nested {
        const wrap = (query: DSL.Query): DSL.Nested => {
            return {
                'nested': {
                    'path': path,
                    'query': query,
                    ...discardFalsy({'score_mode': score_mode}),
                }
            };
        };

        const thisIsQuery: DSL.Query = this as any;
        return prependAndReplaceObject<DSL.Query, DSL.Nested>(thisIsQuery, wrap) as this & DSL.Nested;
    }

    private addBool(query: QueryOrArray, branch: keyof DSL.Bool['bool']): this & DSL.Query {
        if (!Array.isArray(query)) {
            query = [query];
        }
        const root = this.findQueryRoot();
        clearObject(root, ['bool']);
        const array = setDefault(root, ['bool', branch], []);
        for (const q of query) {
            array.push({...q});
        }
        return this as this & DSL.Query;
    }

    static addShould(query: QueryOrArray): Query & DSL.Query {
        return (new Query()).addShould(query);
    }

    public addShould(query: QueryOrArray): this & DSL.Query {
        return this.addBool(query, 'should');
    }

    static addMust(query: QueryOrArray): Query & DSL.Query {
        return (new Query()).addMust(query);
    }

    public addMust(query: QueryOrArray): this & DSL.Query {
        return this.addBool(query, 'must');
    }

    static addMustNot(query: QueryOrArray): Query & DSL.Query {
        return (new Query()).addMustNot(query);
    }

    public addMustNot(query: QueryOrArray): this & DSL.Query {
        return this.addBool(query, 'must_not');
    }

    static addFilter(query: QueryOrArray): Query & DSL.Query {
        return (new Query()).addFilter(query);
    }

    public addFilter(query: QueryOrArray): this & DSL.Query {
        return this.addBool(query, 'filter');
    }
}
