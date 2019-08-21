import * as DSL from './query';

interface Avg {
    avg: {
        field: string;
        missing?: number;
    };
}

interface Sum {
    sum: {
        field: string;
        missing?: number;
    };
}

interface Min {
    min: {
        field: string;
        missing?: number;
    }
}

interface Max {
    max: {
        field: string;
        missing?: number;
    }
}

interface TopHits {
    top_hits: {
        // How the top matching hits should be sorted. By default the hits are sorted by the score of the main query
        sort?: any[];
        // The maximum number of top matching hits to return per bucket. By default the top three matching hits are returned
        size?: number;
        // The offset from the first result you want to fetch
        from?: number;
        // FIXME
        _source?: any;
    }
}

type MetricAgg = Avg | Sum | Min | Max | TopHits;

interface DateHistogram {
    date_histogram: {
        // 7.x
        field: string;
        calendar_interval: string;
        fixed_interval?: string;
        format?: string;
        time_zone?: string;
        offset?: string;
        keyed?: boolean;
        missing?: string;
    } | {
        // 6.x
        field: string;
        interval: string;
        fixed_interval?: string;
        format?: string;
        time_zone?: string;
        offset?: string;
        keyed?: boolean;
        missing?: string;
    };
}

interface Range {
    from?: string;
    to?: string;
    key?: string;
}

interface DateRange {
    date_range: {
        field: string;
        ranges: Range[];
        // not sure if format is optional
        format?: string;
        missing?: string;
        time_zone?: string;
        keyed?: boolean;
    }
}

interface Filter {
    filter: DSL.Query;
}

interface Filters {
    filters: {
        filters: {
            [name: string]: DSL.Query;
        } | DSL.Query[];
        other_bucket_key?: string;
    }
}

interface Order {
    [field: string]: 'desc' | 'asc';
}

interface Terms {
    terms: {
        field: string;
        size?: number;
        order?: Order | Order[];
        min_doc_count?: number;
        // FIXME: not complete
        include?: string | string[];
        exclude?: string | string[];
    }
}

interface Nested {
    nested: {
        path: string;
    }
}

interface ReverseNested {
    reverse_nested: {
        path?: string;
    }
}

interface GeohashGrid {
    geohash_grid: {
        field: string;
        // The string length of the geohashes used to define cells/buckets in the results. Defaults to 5
        // Values outside of [1,12] will be rejected.
        // Alternatively, the precision level can be approximated from a distance measure like "1km", "10m".
        precision?: number | string;
        // The maximum number of geohash buckets to return
        size?: number;
        // To allow for more accurate counting of the top cells returned in the final result the aggregation
        shard_size?: number;
    }
}

interface Sampler {
    sampler: {
        // The shard_size parameter limits how many top-scoring documents are collected in the sample processed on each shard.
        // The default value is 100.
        shard_size?: number;
    }
}

type BucketAgg = DateHistogram | DateRange | Filter | Filters | Terms | Nested | ReverseNested | GeohashGrid | Sampler;

type Agg = (MetricAgg | BucketAgg) & {aggs?: NamedAgg};

type NamedAgg = {[name: string]: Agg};