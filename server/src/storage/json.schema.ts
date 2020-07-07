const jsonSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    definitions: {
        IDataObject: {
            properties: {
                value: {
                    type: "number",
                },
                valueCount: {
                    type: "number",
                },
            },
            type: "object",
        },
        IHour: {
            properties: {
                firstHalf: {
                    $ref: "#/definitions/IDataObject",
                },
                secondHalf: {
                    $ref: "#/definitions/IDataObject",
                },
            },
            type: "object",
        },
        "Record<day,THour>": {
            description: "Construct a type with a set of properties K of type T",
            properties: {
                Friday: {
                    items: {
                        $ref: "#/definitions/IHour",
                    },
                    type: "array",
                },
                Monday: {
                    items: {
                        $ref: "#/definitions/IHour",
                    },
                    type: "array",
                },
                Saturday: {
                    items: {
                        $ref: "#/definitions/IHour",
                    },
                    type: "array",
                },
                Sunday: {
                    items: {
                        $ref: "#/definitions/IHour",
                    },
                    type: "array",
                },
                Thursday: {
                    items: {
                        $ref: "#/definitions/IHour",
                    },
                    type: "array",
                },
                Tuesday: {
                    items: {
                        $ref: "#/definitions/IHour",
                    },
                    type: "array",
                },
                Wednesday: {
                    items: {
                        $ref: "#/definitions/IHour",
                    },
                    type: "array",
                },
            },
            type: "object",
        },
    },
    properties: {
        current: {
            $ref: "#/definitions/ICurrent",
        },
        year: {
            additionalProperties: false,
            description: "Construct a type with a set of properties K of type T",
            patternProperties: {
                "^[0-9]+$": {
                    items: {
                        properties: {
                            data: {
                                $ref: "#/definitions/Record<day,THour>",
                            },
                            maxPersonCount: {
                                type: "number",
                            },
                        },
                        type: ["object", "null"],
                    },
                    type: ["array", "null"],
                },
            },
            type: ["object", "null"],
        },
    },
    type: "object",
};

export default jsonSchema;
