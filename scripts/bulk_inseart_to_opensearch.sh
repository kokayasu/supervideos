#!/usr/bin/env sh

# OpenSearch endpoint
# OPENSEARCH_ENDPOINT="http://localhost:9200"
OPENSEARCH_ENDPOINT="https://search-videopurple-uwhp3imf4bgstzu3h4rpxxb2oi.us-west-2.es.amazonaws.com"

# Index name
INDEX_NAME="videos"

# Input file containing JSON objects, one per line
# INPUT_FILE="videos_bulk_2.json"

# Counter for document IDs
# DOC_ID=1

# Loop through each line in the file
# while IFS= read -r line; do
#     # Send the JSON object as data to OpenSearch using PUT
#     curl -X PUT "$OPENSEARCH_ENDPOINT/$INDEX_NAME/_doc/$DOC_ID" -H "Content-Type: application/json"  -u videopurple:alk3G6i6! -d "$line"
#     echo ""
#
#     # Increment the document ID for the next iteration
#     ((DOC_ID++))
# done < "$INPUT_FILE"

ls -1 ./ | xargs -I{} curl -H "Content-Type: application/x-ndjson" -X PUT "$OPENSEARCH_ENDPOINT/$INDEX_NAME/_bulk" -u videopurple:alk3G6i6! --data-binary "@{}"
