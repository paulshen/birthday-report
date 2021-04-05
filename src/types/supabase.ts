/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  "/": {
    get: {
      responses: {
        /** OK */
        200: unknown;
      };
    };
  };
  "/birthdays": {
    get: {
      parameters: {
        query: {
          user_id?: parameters["rowFilter.birthdays.user_id"];
          id?: parameters["rowFilter.birthdays.id"];
          name?: parameters["rowFilter.birthdays.name"];
          month?: parameters["rowFilter.birthdays.month"];
          date?: parameters["rowFilter.birthdays.date"];
          year?: parameters["rowFilter.birthdays.year"];
          created_at?: parameters["rowFilter.birthdays.created_at"];
          /** Filtering Columns */
          select?: parameters["select"];
          /** Ordering */
          order?: parameters["order"];
          /** Limiting and Pagination */
          offset?: parameters["offset"];
          /** Limiting and Pagination */
          limit?: parameters["limit"];
        };
        header: {
          /** Limiting and Pagination */
          Range?: parameters["range"];
          /** Limiting and Pagination */
          "Range-Unit"?: parameters["rangeUnit"];
          /** Preference */
          Prefer?: parameters["preferCount"];
        };
      };
      responses: {
        /** OK */
        200: {
          schema: definitions["birthdays"][];
        };
        /** Partial Content */
        206: unknown;
      };
    };
    post: {
      parameters: {
        body: {
          /** birthdays */
          birthdays?: definitions["birthdays"];
        };
        query: {
          /** Filtering Columns */
          select?: parameters["select"];
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"];
        };
      };
      responses: {
        /** Created */
        201: unknown;
      };
    };
    delete: {
      parameters: {
        query: {
          user_id?: parameters["rowFilter.birthdays.user_id"];
          id?: parameters["rowFilter.birthdays.id"];
          name?: parameters["rowFilter.birthdays.name"];
          month?: parameters["rowFilter.birthdays.month"];
          date?: parameters["rowFilter.birthdays.date"];
          year?: parameters["rowFilter.birthdays.year"];
          created_at?: parameters["rowFilter.birthdays.created_at"];
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"];
        };
      };
      responses: {
        /** No Content */
        204: never;
      };
    };
    patch: {
      parameters: {
        query: {
          user_id?: parameters["rowFilter.birthdays.user_id"];
          id?: parameters["rowFilter.birthdays.id"];
          name?: parameters["rowFilter.birthdays.name"];
          month?: parameters["rowFilter.birthdays.month"];
          date?: parameters["rowFilter.birthdays.date"];
          year?: parameters["rowFilter.birthdays.year"];
          created_at?: parameters["rowFilter.birthdays.created_at"];
        };
        body: {
          /** birthdays */
          birthdays?: definitions["birthdays"];
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"];
        };
      };
      responses: {
        /** No Content */
        204: never;
      };
    };
  };
}

export interface definitions {
  birthdays: {
    user_id: string;
    id: number;
    name: string;
    month: number;
    date: number;
    year?: number;
    created_at?: string;
  };
}

export interface parameters {
  /** Preference */
  preferParams: "params=single-object";
  /** Preference */
  preferReturn: "return=representation" | "return=minimal" | "return=none";
  /** Preference */
  preferCount: "count=none";
  /** Filtering Columns */
  select: string;
  /** On Conflict */
  on_conflict: string;
  /** Ordering */
  order: string;
  /** Limiting and Pagination */
  range: string;
  /** Limiting and Pagination */
  rangeUnit: string;
  /** Limiting and Pagination */
  offset: string;
  /** Limiting and Pagination */
  limit: string;
  /** birthdays */
  "body.birthdays": definitions["birthdays"];
  "rowFilter.birthdays.user_id": string;
  "rowFilter.birthdays.id": string;
  "rowFilter.birthdays.name": string;
  "rowFilter.birthdays.month": string;
  "rowFilter.birthdays.date": string;
  "rowFilter.birthdays.year": string;
  "rowFilter.birthdays.created_at": string;
}

export interface operations {}
