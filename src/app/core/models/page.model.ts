export interface Page<T> {
    /**
     * Page size
     */
    size: number;

    /**
     * Total row count
     */
    totalElements: number;

    /**
     * Total page count
     */
    totalPages: number;

    /**
     * Current page number
     */
    number: number;

    /**
     * Data rows
     */
    content: Array<T>;
}
