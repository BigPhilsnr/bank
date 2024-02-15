#!/bin/bash

# wait-for-it.sh
# Wait for a service to be available before starting another service.

set -e

host="$1"
port="$2"
shift 2
cmd="$@"

# sleep 30

until nc -z -v -w30 "$host" "$port"; do
  echo "Waiting for $host:$port..."
  sleep 2
done

echo "$host:$port is available, starting command: $cmd"
exec $cmd