# SegmentTinybirdCloudflareWorker

A worker to reduce the execution time of the function runs for sending segment events to Tinybird.

Used in production at [Tangia](www.tangia.co).

It does this by making a copy of the body, and shipping the request to tinybird in the background. Segment gives you very little function execution hours so by doing this we are delegating the function execution time to bascially just what it takes for the worker to copy the body. In testing this shows to be around 0.8ms for the worker CPU time.
