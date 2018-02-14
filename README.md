# serverless-detectron-api

> Note: this should probably be renamed to `fs-api` or similar

A serverless fronting API, designed to write input and output files
to a file share, that detectron will use.

Environment variables:

+ `CONN_STR` - azure storage connection string
+ `CONN_SHARE` - azure storage file share name
+ `IN_DIR` - input directory name
+ `OUT_DIR` output directory name

Designed to be deployed with `sls deploy` using [serverless](https://serverless.com).

## License

MIT