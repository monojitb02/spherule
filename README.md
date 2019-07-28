# spherule

Condition
```
{
    "$perform": ["task"],
    "$when": "<equation>",
    "$then": ["<condition>"],
    "$othewise": ["<condition>"]
}
```

Equation
```
{
    "$and": ["<equation>"],
    "$or": ["<equation>"],
    "$not": "<equation>",
    "<fieldName1>": "value"
    "<fieldName2>": ["value"]
    "<fieldName3>": {
        "($eq|$ne|$gt|$lt|$ge|$le|$bt|$nb|$in|$ni|$ia|$ea)": ["value"]
    }
    "<fieldName4>": {
        "($eq|$ne|$gt|$lt|$ge|$le|$bt|$nb|$in|$ni|$ia|$ea)": ["value"]
    }
}
```