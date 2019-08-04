# spherule

Condition
```
{
    "$task": ["task"],
    "$when": {Query},
    "$then": [{Condition}],
    "$othewise": [{Condition}]
}
```

Query
```
{
    "$and": [{Query}],
    "$or": [{Query}],
    "$not": {Query},
    "<fieldName1>": "value"
    "<fieldName2>": ["value"]
    "<fieldName3>": {
        "($eq|$ne|$gt|$lt|$ge|$le|$bt|$nb|$in|$ni|$ia|$ea)": "value"
    }
    "<fieldName4>": {
        "($eq|$ne|$gt|$lt|$ge|$le|$bt|$nb|$in|$ni|$ia|$ea)": ["value"]
    }
}
```