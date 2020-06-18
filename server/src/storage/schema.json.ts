const jsonSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "additionalProperties": false,
    "definitions": {
        "IDataObject": {
            "properties": {
                "value": {
                    "type": "number"
                },
                "valueCount": {
                    "type": "number"
                }
            },
            "type": "object"
        },
        "IHour": {
            "properties": {
                "firstHalf": {
                    "$ref": "#/definitions/IDataObject"
                },
                "secondHalf": {
                    "$ref": "#/definitions/IDataObject"
                }
            },
            "type": "object"
        },
        "Record<day,Hour>": {
            "description": "Construct a type with a set of properties K of type T",
            "properties": {
                "Friday": {
                    "items": {
                        "$ref": "#/definitions/IHour"
                    },
                    "type": "array"
                },
                "Monday": {
                    "items": {
                        "$ref": "#/definitions/IHour"
                    },
                    "type": "array"
                },
                "Saturday": {
                    "items": {
                        "$ref": "#/definitions/IHour"
                    },
                    "type": "array"
                },
                "Sunday": {
                    "items": {
                        "$ref": "#/definitions/IHour"
                    },
                    "type": "array"
                },
                "Thursday": {
                    "items": {
                        "$ref": "#/definitions/IHour"
                    },
                    "type": "array"
                },
                "Tuesday": {
                    "items": {
                        "$ref": "#/definitions/IHour"
                    },
                    "type": "array"
                },
                "Wednesday": {
                    "items": {
                        "$ref": "#/definitions/IHour"
                    },
                    "type": "array"
                }
            },
            "type": "object"
        }
    },
    "patternProperties": {
        // Year
        "^[0-9]+$": {
            "items": {
                "properties": {
                    "data": {
                        "$ref": "#/definitions/Record<day,Hour>"
                    },
                    "maxPersonCount": {
                        "type": "number"
                    }
                },
                "type": ["object", "null"]
            },
            "type": ["array", "null"]
        }
    },
    "type": ["object", "null"]
};
export default jsonSchema;

