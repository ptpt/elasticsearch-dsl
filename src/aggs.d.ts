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

type BucketAgg = DateHistogram | DateRange | Filter | Filters | Terms | Nested;

type Agg = (MetricAgg | BucketAgg) & {aggs?: NamedAgg};

type NamedAgg = {[name: string]: Agg};