#!/bin/bash
source "$1"

# http://stackoverflow.com/a/2916159/509043
while IFS= read line ; do
    while [[ "$line" =~ (\$\{[a-zA-Z_][a-zA-Z_0-9]*\}) ]] ; do
        LHS=${BASH_REMATCH[1]}
        RHS="$(eval echo "\"$LHS\"")"
        whitespace=$((${#RHS} - ${#LHS}))
        whitespace="$(printf ' %.0s' $(seq 1 $whitespace))"
        LHS="$LHS$whitespace"
        line=${line//$LHS/$RHS}
    done
    echo "$line"
done
