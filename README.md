# spherule

An simple rule and task engine for any type of collection.

Note:
As of now only data collection is supported but later it is planned to have URI endpoint data and DB data point

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
